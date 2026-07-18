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

    // Fix existing table if recorded_at was created as INTEGER instead of BIGINT
    await db.execute(sql`
      ALTER TABLE service_jobs ALTER COLUMN recorded_at TYPE BIGINT
    `).catch(() => {}); // Ignore if already BIGINT

    // Add vehicle_number_plate column to existing tables
    await db.execute(sql`
      ALTER TABLE service_jobs ADD COLUMN IF NOT EXISTS vehicle_number_plate TEXT
    `).catch(() => {});

    // Add review column to existing tables
    await db.execute(sql`
      ALTER TABLE service_jobs ADD COLUMN IF NOT EXISTS review TEXT
    `).catch(() => {});

    // Add rating column to existing tables
    await db.execute(sql`
      ALTER TABLE service_jobs ADD COLUMN IF NOT EXISTS rating INTEGER
    `).catch(() => {});

    // Migrate legacy vehicle types for service_jobs
    await db.execute(sql`
      UPDATE service_jobs SET vehicle_type = 'Two Wheeler' WHERE vehicle_type LIKE 'Two Wheeler%';
      UPDATE service_jobs SET vehicle_type = 'Car' WHERE vehicle_type LIKE 'Car%';
      UPDATE service_jobs SET vehicle_type = 'Bus / Truck' WHERE vehicle_type = 'Bus' OR vehicle_type = 'Truck';
      UPDATE service_jobs SET vehicle_type = 'Van / Tractor / JCB / Generator' WHERE vehicle_type = 'Van / Tractor / JCB' OR vehicle_type = 'Generator';
    `).catch((e) => console.error("Migration error jobs:", e));

    // Migrate legacy vehicle types for customers
    await db.execute(sql`
      UPDATE customers SET primary_vehicle = 'Two Wheeler' WHERE primary_vehicle LIKE 'Two Wheeler%';
      UPDATE customers SET primary_vehicle = 'Car' WHERE primary_vehicle LIKE 'Car%';
      UPDATE customers SET primary_vehicle = 'Bus / Truck' WHERE primary_vehicle = 'Bus' OR primary_vehicle = 'Truck';
      UPDATE customers SET primary_vehicle = 'Van / Tractor / JCB / Generator' WHERE primary_vehicle = 'Van / Tractor / JCB' OR primary_vehicle = 'Generator';
    `).catch((e) => console.error("Migration error customers:", e));

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
  if (username === 'Cnu' && password === 'Cnu@1975') {
    return res.json({ success: true, role: 'admin' });
  } else if (username === 'user' && password === 'user123') {
    return res.json({ success: true, role: 'user' });
  }
  return res.status(401).json({ error: 'Invalid credentials' });
});

app.post('/api/jobs', async (req, res) => {
  try {
    const { customerName, customerPhone, customerLocation, vehicleType, vehicleMake, vehicleModel, vehicleNumberPlate, engineType, mileage, review, rating } = req.body;
    
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
      vehicleNumberPlate,
      engineType,
      mileage,
      revenue: revenue.toString(),
      recordedAt: Date.now(), // Store as integer timestamp directly to avoid timezone/Date conversion issues
      review,
      rating,
    }).returning();
    const result = newJobs[0];

    // Update customer total spend
    await db.update(customers).set({
      totalSpend: sql`${customers.totalSpend} + ${revenue}`
    }).where(eq(customers.id, customer.id));

    if (customer.phone) {
      const googleMapsUrl = 'https://www.google.com/maps/place/VUTTI+CARBO+CARE+KADAPA/@14.4593071,78.8696469,19z/data=!4m6!3m5!1s0x3bb37397b7a88453:0x4cbad3e07f8bd30d!8m2!3d14.4594923!4d78.8692379!16s%2Fg%2F11wtjd9bth';
      let message = `🚗 *Vutti Carbo Care Update:*\nHi ${customer.name}, the Engine Carbon Cleaning for your ${vehicleMake} ${vehicleModel} is complete!\nYour engine is now running smoother and cleaner! Thank you for choosing Vutti.\n\nWe'd really appreciate it if you could share your experience on Google Maps. Click here to post a review:\n${googleMapsUrl}`;
      
      if (review) {
        message += `\n\n(To save time, you can just copy and paste the feedback you shared with us today:)\n*"${review}"*`;
      }

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

    // Compute Today's jobs
    const todayJobs = jobs.filter(j => {
      const d = new Date(j.recordedAt);
      return d.getDate() === now.getDate() && d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
    });
    const totalJobsToday = todayJobs.length;

    // Compute This Year's jobs
    const thisYearJobs = jobs.filter(j => {
      const d = new Date(j.recordedAt);
      return d.getFullYear() === now.getFullYear();
    });
    const totalJobsThisYear = thisYearJobs.length;

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

    // Group jobs by year for the trends chart
    const trendsByYear: Record<string, { name: string, value: number }[]> = {};
    const years = [...new Set(jobs.map(j => new Date(j.recordedAt).getFullYear()))];
    if (!years.includes(now.getFullYear())) years.push(now.getFullYear());
    if (!years.includes(now.getFullYear() - 1)) years.push(now.getFullYear() - 1);

    years.forEach(year => {
      trendsByYear[year] = monthNames.map((month, idx) => {
        const count = jobs.filter(j => {
          const d = new Date(j.recordedAt);
          return d.getFullYear() === year && d.getMonth() === idx;
        }).length;
        return { name: month, value: count };
      });
    });

    res.json({
      totalJobsToday,
      totalJobsThisMonth,
      totalJobsLastMonth,
      totalJobsThisYear,
      categoryBreakdown,
      monthlyTrends,
      trendsByYear
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
        vehicleNumberPlate: serviceJobs.vehicleNumberPlate,
        engineType: serviceJobs.engineType,
        mileage: serviceJobs.mileage,
        revenue: serviceJobs.revenue,
        recordedAt: serviceJobs.recordedAt,
        review: serviceJobs.review,
        rating: serviceJobs.rating,
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
    const { recordedAt, customerName, customerPhone, customerLocation, vehicleMake, vehicleModel, vehicleNumberPlate, mileage, revenue, customerId, review, rating } = req.body;

    await db.update(serviceJobs).set({
      vehicleMake,
      vehicleModel,
      vehicleNumberPlate,
      mileage: parseInt(req.body.mileage),
      revenue: req.body.revenue.toString(),
      recordedAt: new Date(req.body.recordedAt).getTime(),
      review,
      rating
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

// Delete a service job
app.delete('/api/jobs/history/:id', async (req, res) => {
  try {
    const jobId = parseInt(req.params.id);
    await db.delete(serviceJobs).where(eq(serviceJobs.id, jobId));
    res.json({ success: true });
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ error: error.message || 'Failed to delete job' });
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
