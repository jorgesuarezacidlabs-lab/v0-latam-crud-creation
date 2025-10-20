-- Setup RLS policies for all tables

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
