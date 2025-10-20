-- Create all tables for the aviation management system

-- 1. Flights table
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

-- 2. Pilots table
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

-- 3. Maintenance table
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

-- 4. Routes table
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

-- 5. Airports table
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
