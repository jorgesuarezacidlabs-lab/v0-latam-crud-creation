-- Create flights table
create table if not exists public.flights (
  id uuid primary key default gen_random_uuid(),
  flight_number text not null unique,
  airplane_id uuid references public.airplanes(id) on delete set null,
  origin text not null,
  destination text not null,
  departure_time timestamp with time zone not null,
  arrival_time timestamp with time zone not null,
  status text not null check (status in ('Programado', 'En vuelo', 'Completado', 'Cancelado', 'Retrasado')),
  passengers integer not null default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create pilots table
create table if not exists public.pilots (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  license_number text not null unique,
  nationality text not null,
  flight_hours integer not null default 0,
  certifications text[] not null default '{}',
  status text not null check (status in ('Activo', 'Inactivo', 'En entrenamiento')),
  hire_date date not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create maintenance table
create table if not exists public.maintenance (
  id uuid primary key default gen_random_uuid(),
  airplane_id uuid references public.airplanes(id) on delete cascade,
  maintenance_type text not null check (maintenance_type in ('Preventivo', 'Correctivo', 'Inspección', 'Overhaul')),
  description text not null,
  technician text not null,
  start_date date not null,
  end_date date,
  cost numeric(10, 2),
  status text not null check (status in ('Programado', 'En progreso', 'Completado', 'Cancelado')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create routes table
create table if not exists public.routes (
  id uuid primary key default gen_random_uuid(),
  route_code text not null unique,
  origin text not null,
  destination text not null,
  distance_km integer not null,
  estimated_duration integer not null, -- in minutes
  frequency text not null, -- Daily, Weekly, etc.
  active boolean not null default true,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create airports table
create table if not exists public.airports (
  id uuid primary key default gen_random_uuid(),
  iata_code text not null unique,
  name text not null,
  city text not null,
  country text not null,
  timezone text not null,
  runways integer not null default 1,
  elevation_ft integer,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS on all tables
alter table public.flights enable row level security;
alter table public.pilots enable row level security;
alter table public.maintenance enable row level security;
alter table public.routes enable row level security;
alter table public.airports enable row level security;

-- Create policies for flights
create policy "Allow authenticated users to view flights"
  on public.flights for select
  using (auth.role() = 'authenticated');

create policy "Allow authenticated users to insert flights"
  on public.flights for insert
  with check (auth.role() = 'authenticated');

create policy "Allow authenticated users to update flights"
  on public.flights for update
  using (auth.role() = 'authenticated');

create policy "Allow authenticated users to delete flights"
  on public.flights for delete
  using (auth.role() = 'authenticated');

-- Create policies for pilots
create policy "Allow authenticated users to view pilots"
  on public.pilots for select
  using (auth.role() = 'authenticated');

create policy "Allow authenticated users to insert pilots"
  on public.pilots for insert
  with check (auth.role() = 'authenticated');

create policy "Allow authenticated users to update pilots"
  on public.pilots for update
  using (auth.role() = 'authenticated');

create policy "Allow authenticated users to delete pilots"
  on public.pilots for delete
  using (auth.role() = 'authenticated');

-- Create policies for maintenance
create policy "Allow authenticated users to view maintenance"
  on public.maintenance for select
  using (auth.role() = 'authenticated');

create policy "Allow authenticated users to insert maintenance"
  on public.maintenance for insert
  with check (auth.role() = 'authenticated');

create policy "Allow authenticated users to update maintenance"
  on public.maintenance for update
  using (auth.role() = 'authenticated');

create policy "Allow authenticated users to delete maintenance"
  on public.maintenance for delete
  using (auth.role() = 'authenticated');

-- Create policies for routes
create policy "Allow authenticated users to view routes"
  on public.routes for select
  using (auth.role() = 'authenticated');

create policy "Allow authenticated users to insert routes"
  on public.routes for insert
  with check (auth.role() = 'authenticated');

create policy "Allow authenticated users to update routes"
  on public.routes for update
  using (auth.role() = 'authenticated');

create policy "Allow authenticated users to delete routes"
  on public.routes for delete
  using (auth.role() = 'authenticated');

-- Create policies for airports
create policy "Allow authenticated users to view airports"
  on public.airports for select
  using (auth.role() = 'authenticated');

create policy "Allow authenticated users to insert airports"
  on public.airports for insert
  with check (auth.role() = 'authenticated');

create policy "Allow authenticated users to update airports"
  on public.airports for update
  using (auth.role() = 'authenticated');

create policy "Allow authenticated users to delete airports"
  on public.airports for delete
  using (auth.role() = 'authenticated');

-- Insert sample data for flights
insert into public.flights (flight_number, origin, destination, departure_time, arrival_time, status, passengers)
values
  ('LA800', 'Santiago (SCL)', 'Lima (LIM)', now() + interval '2 hours', now() + interval '5 hours', 'Programado', 250),
  ('LA801', 'Buenos Aires (EZE)', 'São Paulo (GRU)', now() + interval '1 hour', now() + interval '3 hours', 'En vuelo', 180);

-- Insert sample data for pilots
insert into public.pilots (name, license_number, nationality, flight_hours, certifications, status, hire_date)
values
  ('Carlos Rodríguez', 'ATP-12345', 'Chile', 8500, ARRAY['Boeing 787', 'Airbus A320', 'Instructor'], 'Activo', '2010-03-15'),
  ('Ana Silva', 'ATP-67890', 'Brasil', 6200, ARRAY['Airbus A320', 'A321neo'], 'Activo', '2015-07-20');

-- Insert sample data for maintenance
insert into public.maintenance (maintenance_type, description, technician, start_date, status, cost)
values
  ('Preventivo', 'Inspección de 500 horas de vuelo', 'Juan Pérez', current_date, 'Programado', 15000.00),
  ('Correctivo', 'Reparación de tren de aterrizaje', 'María González', current_date - interval '5 days', 'Completado', 45000.00);

-- Insert sample data for routes
insert into public.routes (route_code, origin, destination, distance_km, estimated_duration, frequency, active)
values
  ('SCL-LIM', 'Santiago (SCL)', 'Lima (LIM)', 2453, 210, 'Diario', true),
  ('EZE-GRU', 'Buenos Aires (EZE)', 'São Paulo (GRU)', 1680, 150, 'Diario', true),
  ('BOG-MEX', 'Bogotá (BOG)', 'Ciudad de México (MEX)', 3400, 270, 'Semanal', true);

-- Insert sample data for airports
insert into public.airports (iata_code, name, city, country, timezone, runways, elevation_ft)
values
  ('SCL', 'Aeropuerto Internacional Arturo Merino Benítez', 'Santiago', 'Chile', 'America/Santiago', 2, 1555),
  ('LIM', 'Aeropuerto Internacional Jorge Chávez', 'Lima', 'Perú', 'America/Lima', 2, 113),
  ('EZE', 'Aeropuerto Internacional Ministro Pistarini', 'Buenos Aires', 'Argentina', 'America/Argentina/Buenos_Aires', 2, 66),
  ('GRU', 'Aeroporto Internacional de São Paulo', 'São Paulo', 'Brasil', 'America/Sao_Paulo', 3, 2461);
