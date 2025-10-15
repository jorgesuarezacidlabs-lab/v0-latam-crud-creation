-- Create airplanes table
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

-- Enable RLS
alter table public.airplanes enable row level security;

-- Create policies for public access (adjust based on your needs)
create policy "Allow public to view airplanes"
  on public.airplanes for select
  using (true);

create policy "Allow public to insert airplanes"
  on public.airplanes for insert
  with check (true);

create policy "Allow public to update airplanes"
  on public.airplanes for update
  using (true);

create policy "Allow public to delete airplanes"
  on public.airplanes for delete
  using (true);

-- Insert sample data
insert into public.airplanes (registration, model, airline, capacity, year, status, country)
values
  ('CC-BBA', 'Boeing 787-9', 'LATAM Airlines', 313, 2015, 'Activo', 'Chile'),
  ('PT-MUA', 'Airbus A320neo', 'LATAM Brasil', 174, 2019, 'Activo', 'Brasil'),
  ('N534LA', 'Boeing 767-300ER', 'LATAM Cargo', 0, 2008, 'En mantenimiento', 'Estados Unidos');
