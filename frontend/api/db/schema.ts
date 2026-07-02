import { pgTable, serial, text, integer, numeric, bigint } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: text('id').primaryKey(), // We use text because the app sets it to 'user-1'
  fullName: text('full_name').notNull(),
  phoneNumber: text('phone_number'),
  tierLabel: text('tier_label'),
});

export const customers = pgTable('customers', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  phone: text('phone').notNull(),
  location: text('location'),
  primaryVehicle: text('primary_vehicle').notNull(),
  lastService: text('last_service'),
  totalSpend: numeric('total_spend').default('0'), // postgres numeric uses string default
});

export const serviceJobs = pgTable('service_jobs', {
  id: serial('id').primaryKey(),
  userId: text('user_id').references(() => users.id),
  customerId: integer('customer_id').references(() => customers.id),
  vehicleType: text('vehicle_type').notNull().default('Car'),
  vehicleMake: text('vehicle_make').notNull(),
  vehicleModel: text('vehicle_model').notNull(),
  engineType: text('engine_type'),
  mileage: integer('mileage').notNull(),
  revenue: numeric('revenue'),
  recordedAt: bigint('recorded_at', { mode: 'number' }).notNull(), // postgres integer is 32-bit (overflows for Date.now()), need bigint
});
