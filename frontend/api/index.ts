import express from 'express';
import cors from 'cors';
import { db } from './db/index.js';
import { users, serviceJobs, customers } from './db/schema.js';
import { sendWhatsAppMessage } from './services/whatsapp.js';
import { eq, sql } from 'drizzle-orm';

const app = express();
app.use(cors());
app.use(express.json());

// Initialize dummy user if not exists
async function initUser() {
  try {
    // Create tables if they don't exist
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        full_name TEXT NOT NULL,
        phone_number TEXT,
        tier_label TEXT
      )
    `);
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS customers (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        phone TEXT NOT NULL,
        location TEXT,
        primary_vehicle TEXT NOT NULL,
        last_service TEXT,
        total_spend NUMERIC DEFAULT 0
      )
    `);
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS service_jobs (
        id SERIAL PRIMARY KEY,
        user_id TEXT REFERENCES users(id),
        customer_id INTEGER REFERENCES customers(id),
        vehicle_type TEXT NOT NULL DEFAULT 'Car',
        vehicle_make TEXT NOT NULL,
        vehicle_model TEXT NOT NULL,
        engine_type TEXT,
        mileage INTEGER NOT NULL,
        revenue NUMERIC,
        recorded_at BIGINT NOT NULL
      )
    `);

    const existing = await db.select().from(users);
    if (existing.length === 0) {
      await db.insert(users).values({
        id: 'user-1',
        fullName: 'Vutti Admin',
        phoneNumber: '+1234567890', 
        tierLabel: 'Shop Manager'
      });
    }
  } catch(e) {
    console.error("DB Initialization error", e);
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
    let customerList = await db.select().from(customers).where(eq(customers.phone, customerPhone));
    let customer = customerList[0];
    
    if (!customer) {
      // Create new customer
      const newCustomers = await db.insert(customers).values({
        name: customerName,
        phone: customerPhone,
        location: customerLocation,
        primaryVehicle: `${vehicleMake} ${vehicleModel}`,
        lastService: new Date().toISOString(),
        totalSpend: '0'
      }).returning();
      customer = newCustomers[0];
    } else {
      // Update existing customer's last service date and location if provided
      await db.update(customers).set({
        lastService: new Date().toISOString(),
        location: customerLocation || customer.location
      }).where(eq(customers.id, customer.id));
    }

    // Get revenue from request or default to 150
    const revenue = req.body.revenue || 150;

    const newJobs = await db.insert(serviceJobs).values({
      userId: 'user-1',
      customerId: customer.id,
      vehicleType,
      vehicleMake,
      vehicleModel,
      engineType,
      mileage,
      revenue: revenue.toString(),
      recordedAt: Date.now(), // Store as integer timestamp directly to avoid timezone/Date conversion issues
    }).returning();
    const result = newJobs[0];

    // Update customer total spend
    await db.update(customers).set({
      totalSpend: sql`${customers.totalSpend} + ${revenue}`
    }).where(eq(customers.id, customer.id));

    if (customer.phone) {
      const message = `🚗 Vutti Carbo Care Update:\nHi ${customer.name}, the Engine Carbon Cleaning for your ${vehicleMake} ${vehicleModel} is complete!\nYour engine is now running smoother and cleaner! Thank you for choosing Vutti.`;
      await sendWhatsAppMessage(customer.phone, message);
    }

    res.json({ success: true, data: result });
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ error: error.message || 'Failed to log service job' });
  }
});

app.get('/api/dashboard-stats', async (req, res) => {
  try {
    const jobs = await db.select().from(serviceJobs);
    
    const now = new Date();
    const currentMonthJobs = jobs.filter(j => {
      const d = new Date(j.recordedAt);
      return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
    });
    const totalJobsThisMonth = currentMonthJobs.length;

    const breakdownMap: Record<string, number> = {};
    currentMonthJobs.forEach(job => {
      breakdownMap[job.vehicleType || 'Car'] = (breakdownMap[job.vehicleType || 'Car'] || 0) + 1;
    });

    const categoryBreakdown = Object.entries(breakdownMap).map(([category, value]) => ({
      category,
      value 
    }));

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
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ error: error.message || 'Failed to fetch dashboard stats' });
  }
});

app.get('/api/jobs/history', async (req, res) => {
  try {
    const jobs = await db
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
      .leftJoin(customers, eq(serviceJobs.customerId, customers.id));
      
    jobs.sort((a, b) => new Date(b.recordedAt).getTime() - new Date(a.recordedAt).getTime());
    res.json(jobs);
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ error: error.message || 'Failed to fetch job history' });
  }
});

app.put('/api/jobs/history/:id', async (req, res) => {
  try {
    const jobId = parseInt(req.params.id);
    const { recordedAt, customerName, customerPhone, customerLocation, vehicleMake, vehicleModel, mileage, revenue, customerId } = req.body;

    await db.update(serviceJobs).set({
      vehicleMake,
      vehicleModel,
      mileage: parseInt(req.body.mileage),
      revenue: req.body.revenue.toString(),
      recordedAt: new Date(req.body.recordedAt).getTime()
    }).where(eq(serviceJobs.id, jobId));

    if (customerId) {
      await db.update(customers).set({
        name: customerName,
        phone: customerPhone,
        location: customerLocation
      }).where(eq(customers.id, customerId));
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
    const allCustomers = await db.select().from(customers);
    res.json(allCustomers);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch customers' });
  }
});

app.post('/api/customers', async (req, res) => {
  try {
    const { name, phone, primaryVehicle } = req.body;
    const newCustomers = await db.insert(customers).values({
      name, phone, primaryVehicle, lastService: new Date().toISOString(), totalSpend: '0',
    }).returning();
    res.json(newCustomers[0]);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create customer' });
  }
});

app.put('/api/customers/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const { name, phone, primaryVehicle } = req.body;
    const updated = await db.update(customers).set({
      name, phone, primaryVehicle,
    }).where(eq(customers.id, id)).returning();
    res.json(updated[0]);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update customer' });
  }
});

app.delete('/api/customers/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    await db.delete(customers).where(eq(customers.id, id));
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete customer' });
  }
});

export default app;
