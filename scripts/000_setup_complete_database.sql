-- Complete database setup for Aviation Management System
-- Run this script in Supabase SQL Editor to create all tables and data

-- 1. Create airplanes table (if not exists)
create table if not exists public.airplanes (
  id uuid primary key default gen_random_uuid(),
  registration text not null unique,
  model text not null,
  airline text not null,
  capacity integer not null,
  year integer not null,
  status text not null check (status in ('Activo', 'En mantenimiento', 'Fuera de servicio')),
  country text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. Create flights table
create table if not exists public.flights (
  id uuid primary key default gen_random_uuid(),
  flight_number text not null,
  airplane_id uuid references public.airplanes(id) on delete set null,
  origin text not null,
  destination text not null,
  departure_time timestamp with time zone not null,
  arrival_time timestamp with time zone not null,
  status text not null check (status in ('Programado', 'En vuelo', 'Completado', 'Cancelado', 'Retrasado')),
  passengers integer not null default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 3. Create pilots table
create table if not exists public.pilots (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  license_number text not null unique,
  nationality text not null,
  flight_hours integer not null default 0,
  certifications text[] default '{}',
  status text not null check (status in ('Activo', 'Inactivo', 'En entrenamiento')),
  hire_date date not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 4. Create maintenance table
create table if not exists public.maintenance (
  id uuid primary key default gen_random_uuid(),
  airplane_id uuid references public.airplanes(id) on delete set null,
  maintenance_type text not null check (maintenance_type in ('Preventivo', 'Correctivo', 'Inspección', 'Overhaul')),
  description text not null,
  technician text not null,
  start_date date not null,
  end_date date,
  cost decimal(10,2),
  status text not null check (status in ('Programado', 'En progreso', 'Completado', 'Cancelado')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 5. Create routes table
create table if not exists public.routes (
  id uuid primary key default gen_random_uuid(),
  route_code text not null unique,
  origin text not null,
  destination text not null,
  distance_km integer not null,
  estimated_duration integer not null, -- in minutes
  frequency text not null,
  active boolean not null default true,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 6. Create airports table
create table if not exists public.airports (
  id uuid primary key default gen_random_uuid(),
  iata_code text not null unique,
  name text not null,
  city text not null,
  country text not null,
  timezone text not null,
  runways integer not null,
  elevation_ft integer,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS on all tables
alter table public.airplanes enable row level security;
alter table public.flights enable row level security;
alter table public.pilots enable row level security;
alter table public.maintenance enable row level security;
alter table public.routes enable row level security;
alter table public.airports enable row level security;

-- Create indexes for better performance
create index if not exists idx_flights_airplane_id on public.flights(airplane_id);
create index if not exists idx_flights_departure_time on public.flights(departure_time);
create index if not exists idx_flights_status on public.flights(status);
create index if not exists idx_maintenance_airplane_id on public.maintenance(airplane_id);
create index if not exists idx_maintenance_start_date on public.maintenance(start_date);
create index if not exists idx_pilots_license on public.pilots(license_number);
create index if not exists idx_routes_code on public.routes(route_code);
create index if not exists idx_airports_iata on public.airports(iata_code);

-- Drop existing policies if they exist
drop policy if exists "Allow public to view airplanes" on public.airplanes;
drop policy if exists "Allow public to insert airplanes" on public.airplanes;
drop policy if exists "Allow public to update airplanes" on public.airplanes;
drop policy if exists "Allow public to delete airplanes" on public.airplanes;
drop policy if exists "Allow authenticated users to view airplanes" on public.airplanes;
drop policy if exists "Allow authenticated users to insert airplanes" on public.airplanes;
drop policy if exists "Allow authenticated users to update airplanes" on public.airplanes;
drop policy if exists "Allow authenticated users to delete airplanes" on public.airplanes;

-- Create RLS policies for all tables
-- Airplanes policies
create policy "Allow authenticated users to view airplanes"
  on public.airplanes for select
  to authenticated
  using (true);

create policy "Allow authenticated users to insert airplanes"
  on public.airplanes for insert
  to authenticated
  with check (true);

create policy "Allow authenticated users to update airplanes"
  on public.airplanes for update
  to authenticated
  using (true);

create policy "Allow authenticated users to delete airplanes"
  on public.airplanes for delete
  to authenticated
  using (true);

-- Flights policies
create policy "Allow authenticated users to view flights"
  on public.flights for select
  to authenticated
  using (true);

create policy "Allow authenticated users to insert flights"
  on public.flights for insert
  to authenticated
  with check (true);

create policy "Allow authenticated users to update flights"
  on public.flights for update
  to authenticated
  using (true);

create policy "Allow authenticated users to delete flights"
  on public.flights for delete
  to authenticated
  using (true);

-- Pilots policies
create policy "Allow authenticated users to view pilots"
  on public.pilots for select
  to authenticated
  using (true);

create policy "Allow authenticated users to insert pilots"
  on public.pilots for insert
  to authenticated
  with check (true);

create policy "Allow authenticated users to update pilots"
  on public.pilots for update
  to authenticated
  using (true);

create policy "Allow authenticated users to delete pilots"
  on public.pilots for delete
  to authenticated
  using (true);

-- Maintenance policies
create policy "Allow authenticated users to view maintenance"
  on public.maintenance for select
  to authenticated
  using (true);

create policy "Allow authenticated users to insert maintenance"
  on public.maintenance for insert
  to authenticated
  with check (true);

create policy "Allow authenticated users to update maintenance"
  on public.maintenance for update
  to authenticated
  using (true);

create policy "Allow authenticated users to delete maintenance"
  on public.maintenance for delete
  to authenticated
  using (true);

-- Routes policies
create policy "Allow authenticated users to view routes"
  on public.routes for select
  to authenticated
  using (true);

create policy "Allow authenticated users to insert routes"
  on public.routes for insert
  to authenticated
  with check (true);

create policy "Allow authenticated users to update routes"
  on public.routes for update
  to authenticated
  using (true);

create policy "Allow authenticated users to delete routes"
  on public.routes for delete
  to authenticated
  using (true);

-- Airports policies
create policy "Allow authenticated users to view airports"
  on public.airports for select
  to authenticated
  using (true);

create policy "Allow authenticated users to insert airports"
  on public.airports for insert
  to authenticated
  with check (true);

create policy "Allow authenticated users to update airports"
  on public.airports for update
  to authenticated
  using (true);

create policy "Allow authenticated users to delete airports"
  on public.airports for delete
  to authenticated
  using (true);

-- Insert sample data
-- Sample airplanes (if not exist)
insert into public.airplanes (registration, model, airline, capacity, year, status, country)
values
  ('CC-BBA', 'Boeing 787-9', 'LATAM Airlines', 313, 2015, 'Activo', 'Chile'),
  ('PT-MUA', 'Airbus A320neo', 'LATAM Brasil', 174, 2019, 'Activo', 'Brasil'),
  ('N534LA', 'Boeing 767-300ER', 'LATAM Cargo', 0, 2008, 'En mantenimiento', 'Estados Unidos')
on conflict (registration) do nothing;

-- Sample flights
insert into public.flights (flight_number, airplane_id, origin, destination, departure_time, arrival_time, status, passengers)
select 
  'LA123',
  (select id from public.airplanes where registration = 'CC-BBA' limit 1),
  'SCL',
  'LIM',
  '2024-01-15 08:00:00+00'::timestamp with time zone,
  '2024-01-15 10:30:00+00'::timestamp with time zone,
  'Programado',
  150
where exists (select 1 from public.airplanes where registration = 'CC-BBA')
on conflict do nothing;

insert into public.flights (flight_number, airplane_id, origin, destination, departure_time, arrival_time, status, passengers)
select 
  'LA456',
  (select id from public.airplanes where registration = 'PT-MUA' limit 1),
  'GRU',
  'SCL',
  '2024-01-15 14:00:00+00'::timestamp with time zone,
  '2024-01-15 18:30:00+00'::timestamp with time zone,
  'En vuelo',
  120
where exists (select 1 from public.airplanes where registration = 'PT-MUA')
on conflict do nothing;

-- Sample pilots
insert into public.pilots (name, license_number, nationality, flight_hours, certifications, status, hire_date)
values
  ('Carlos Mendoza', 'ATP-123456', 'Chilena', 3500, ARRAY['Boeing 787', 'Airbus A320', 'IFR'], 'Activo', '2018-03-15'),
  ('Ana Silva', 'ATP-789012', 'Brasileña', 2800, ARRAY['Boeing 737', 'Airbus A320'], 'Activo', '2019-07-20'),
  ('Miguel Torres', 'ATP-345678', 'Peruana', 4200, ARRAY['Boeing 777', 'Boeing 787', 'IFR', 'Multi-Engine'], 'Activo', '2016-11-10')
on conflict (license_number) do nothing;

-- Sample maintenance records
insert into public.maintenance (airplane_id, maintenance_type, description, technician, start_date, end_date, cost, status)
select 
  (select id from public.airplanes where registration = 'CC-BBA' limit 1),
  'Preventivo',
  'Mantenimiento programado A-Check',
  'Roberto García',
  '2024-01-10',
  '2024-01-12',
  15000.00,
  'Completado'
where exists (select 1 from public.airplanes where registration = 'CC-BBA')
on conflict do nothing;

insert into public.maintenance (airplane_id, maintenance_type, description, technician, start_date, end_date, cost, status)
select 
  (select id from public.airplanes where registration = 'N534LA' limit 1),
  'Correctivo',
  'Reparación de motor derecho',
  'Luis Fernández',
  '2024-01-08',
  null,
  45000.00,
  'En progreso'
where exists (select 1 from public.airplanes where registration = 'N534LA')
on conflict do nothing;

-- Sample routes
insert into public.routes (route_code, origin, destination, distance_km, estimated_duration, frequency, active)
values
  ('SCL-LIM', 'SCL - Santiago', 'LIM - Lima', 2500, 180, 'Diario', true),
  ('GRU-SCL', 'GRU - São Paulo', 'SCL - Santiago', 3000, 210, 'Lunes a Viernes', true),
  ('SCL-BOG', 'SCL - Santiago', 'BOG - Bogotá', 4000, 300, 'Martes, Jueves, Sábado', true),
  ('LIM-MEX', 'LIM - Lima', 'MEX - Ciudad de México', 3500, 270, 'Fines de semana', true)
on conflict (route_code) do nothing;

-- Sample airports
insert into public.airports (iata_code, name, city, country, timezone, runways, elevation_ft)
values
  ('SCL', 'Aeropuerto Internacional Arturo Merino Benítez', 'Santiago', 'Chile', 'America/Santiago', 2, 1555),
  ('LIM', 'Aeropuerto Internacional Jorge Chávez', 'Lima', 'Perú', 'America/Lima', 2, 113),
  ('GRU', 'Aeropuerto Internacional de São Paulo/Guarulhos', 'São Paulo', 'Brasil', 'America/Sao_Paulo', 3, 2459),
  ('BOG', 'Aeropuerto Internacional El Dorado', 'Bogotá', 'Colombia', 'America/Bogota', 2, 8361),
  ('MEX', 'Aeropuerto Internacional de la Ciudad de México', 'Ciudad de México', 'México', 'America/Mexico_City', 2, 7316)
on conflict (iata_code) do nothing;
