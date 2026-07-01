import express from 'express';
import cors from 'cors';
import { db } from './db';
import { users, serviceJobs, customers } from './db/schema';
import { sendWhatsAppMessage } from './services/whatsapp';
import { eq } from 'drizzle-orm';

const app = express();
app.use(cors());
app.use(express.json());

// Initialize dummy user if not exists
async function initUser() {
  const existing = db.select().from(users).all();
  if (existing.length === 0) {
    db.insert(users).values({
      id: 'user-1',
      fullName: 'Vutti Admin',
      phoneNumber: '+1234567890', 
      tierLabel: 'Shop Manager'
    }).run();
  }
}
initUser();

app.post('/api/login', (req, res) => {
  const { username, password } = req.body;
  if (username === 'admin' && password === 'admin123') {
    return res.json({ success: true, role: 'admin' });
  } else if (username === 'user' && password === 'user123') {
    return res.json({ success: true, role: 'user' });
  }
  return res.status(401).json({ error: 'Invalid credentials' });
});

  app.post('/api/jobs', async (req, res) => {
  try {
    const { customerName, customerPhone, customerLocation, vehicleType, vehicleMake, vehicleModel, engineType, mileage } = req.body;
    
    // Check if customer exists by phone
    let customer = db.select().from(customers).where(eq(customers.phone, customerPhone)).get();
    
    if (!customer) {
      // Create new customer
      customer = db.insert(customers).values({
        name: customerName,
        phone: customerPhone,
        location: customerLocation,
        primaryVehicle: `${vehicleMake} ${vehicleModel}`,
        lastService: new Date().toISOString(),
        totalSpend: 0
      }).returning().get();
    } else {
      // Update existing customer's last service date and location if provided
      db.update(customers).set({
        lastService: new Date().toISOString(),
        location: customerLocation || customer.location
      }).where(eq(customers.id, customer.id)).run();
    }

    // Get revenue from request or default to 150
    const revenue = req.body.revenue || 150;

    const result = db.insert(serviceJobs).values({
      userId: 'user-1',
      customerId: customer.id,
      vehicleType,
      vehicleMake,
      vehicleModel,
      engineType,
      mileage,
      revenue,
      recordedAt: new Date(),
    }).returning().get();

    // Update customer total spend
    db.update(customers).set({
      totalSpend: (customer.totalSpend || 0) + revenue
    }).where(eq(customers.id, customer.id)).run();

    if (customer.phone) {
      const message = `🚗 Vutti Carbo Care Update:
Hi ${customer.name}, the Engine Carbon Cleaning for your ${vehicleMake} ${vehicleModel} is complete!
Your engine is now running smoother and cleaner! Thank you for choosing Vutti.`;

      await sendWhatsAppMessage(customer.phone, message);
    }

    res.json({ success: true, data: result });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to log service job' });
  }
});

app.get('/api/dashboard-stats', async (req, res) => {
  try {
    const jobs = db.select().from(serviceJobs).all();
    
    // Calculate total jobs for this month
    const now = new Date();
    const currentMonthJobs = jobs.filter(j => {
      const d = new Date(j.recordedAt);
      return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
    });
    const totalJobsThisMonth = currentMonthJobs.length;

    // Calculate service type breakdown
    const breakdownMap: Record<string, number> = {};
    currentMonthJobs.forEach(job => {
      breakdownMap[job.serviceType] = (breakdownMap[job.serviceType] || 0) + 1;
    });

    const categoryBreakdown = Object.entries(breakdownMap).map(([category, value]) => ({
      category,
      value // This is now count of jobs
    }));

    // Calculate monthly trends (last 12 months volume)
    const trendsMap: Record<string, number> = {};
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    
    for (let i = 11; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const label = `${monthNames[d.getMonth()]} '${d.getFullYear().toString().slice(2)}`;
      trendsMap[label] = 0;
    }

    jobs.forEach(job => {
      const d = new Date(job.recordedAt);
      const label = `${monthNames[d.getMonth()]} '${d.getFullYear().toString().slice(2)}`;
      if (trendsMap[label] !== undefined) {
        trendsMap[label] += 1;
      }
    });

    const monthlyTrends = Object.entries(trendsMap).map(([name, value]) => ({ name, value }));

    const lastMonthJobs = jobs.filter(j => {
      const d = new Date(j.recordedAt);
      const lastMonthDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      return d.getMonth() === lastMonthDate.getMonth() && d.getFullYear() === lastMonthDate.getFullYear();
    });
    const totalJobsLastMonth = lastMonthJobs.length;

    res.json({
      totalJobsThisMonth,
      totalJobsLastMonth,
      categoryBreakdown,
      monthlyTrends
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch dashboard stats' });
  }
});

app.get('/api/jobs/history', async (req, res) => {
  try {
    const jobs = db
      .select({
        id: serviceJobs.id,
        userId: serviceJobs.userId,
        customerId: serviceJobs.customerId,
        vehicleType: serviceJobs.vehicleType,
        vehicleMake: serviceJobs.vehicleMake,
        vehicleModel: serviceJobs.vehicleModel,
        engineType: serviceJobs.engineType,
        mileage: serviceJobs.mileage,
        revenue: serviceJobs.revenue,
        recordedAt: serviceJobs.recordedAt,
        customerName: customers.name,
        customerPhone: customers.phone,
        customerLocation: customers.location,
      })
      .from(serviceJobs)
      .leftJoin(customers, eq(serviceJobs.customerId, customers.id))
      .all();
      
    // Sort descending by date
    jobs.sort((a, b) => new Date(b.recordedAt).getTime() - new Date(a.recordedAt).getTime());
    res.json(jobs);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch job history' });
  }
});

app.put('/api/jobs/history/:id', async (req, res) => {
  try {
    const jobId = parseInt(req.params.id);
    const { 
      recordedAt, 
      customerName, 
      customerPhone, 
      customerLocation, 
      vehicleMake, 
      vehicleModel, 
      mileage, 
      revenue,
      customerId
    } = req.body;

    // Update the job
    db.update(serviceJobs).set({
      vehicleMake,
      vehicleModel,
      mileage: parseInt(mileage),
      revenue: parseFloat(revenue),
      recordedAt: new Date(recordedAt)
    }).where(eq(serviceJobs.id, jobId)).run();

    // Update the customer
    if (customerId) {
      db.update(customers).set({
        name: customerName,
        phone: customerPhone,
        location: customerLocation
      }).where(eq(customers.id, customerId)).run();
    }

    res.json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to update job' });
  }
});

// Customers CRUD
app.get('/api/customers', async (req, res) => {
  try {
    const allCustomers = db.select().from(customers).all();
    res.json(allCustomers);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch customers' });
  }
});

app.post('/api/customers', async (req, res) => {
  try {
    const { name, phone, primaryVehicle } = req.body;
    const newCustomer = db.insert(customers).values({
      name,
      phone,
      primaryVehicle,
      lastService: new Date().toISOString(),
      totalSpend: 0,
    }).returning().get();
    res.json(newCustomer);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create customer' });
  }
});

app.put('/api/customers/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const { name, phone, primaryVehicle } = req.body;
    const updated = db.update(customers).set({
      name,
      phone,
      primaryVehicle,
    }).where(eq(customers.id, id)).returning().get();
    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update customer' });
  }
});

app.delete('/api/customers/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    db.delete(customers).where(eq(customers.id, id)).run();
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete customer' });
  }
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Backend API running on http://localhost:${PORT}`);
});
