import { sqliteTable, text, integer, real } from 'drizzle-orm/sqlite-core';

export const users = sqliteTable('users', {
  id: text('id').primaryKey(),
  fullName: text('full_name').notNull(),
  phoneNumber: text('phone_number'),
  tierLabel: text('tier_label'),
});

export const customers = sqliteTable('customers', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull(),
  phone: text('phone').notNull(),
  location: text('location'),
  primaryVehicle: text('primary_vehicle').notNull(),
  lastService: text('last_service'),
  totalSpend: real('total_spend').default(0),
});

export const serviceJobs = sqliteTable('service_jobs', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  userId: text('user_id').references(() => users.id),
  customerId: integer('customer_id').references(() => customers.id),
  vehicleType: text('vehicle_type').notNull().default('Car'),
  vehicleMake: text('vehicle_make').notNull(),
  vehicleModel: text('vehicle_model').notNull(),
  engineType: text('engine_type'),
  mileage: integer('mileage').notNull(),
  revenue: real('revenue'), // Optional: track business revenue
  recordedAt: integer('recorded_at', { mode: 'timestamp' }).notNull(),
});
