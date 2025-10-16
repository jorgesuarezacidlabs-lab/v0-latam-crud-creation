-- Drop existing public access policies
drop policy if exists "Allow public to view airplanes" on public.airplanes;
drop policy if exists "Allow public to insert airplanes" on public.airplanes;
drop policy if exists "Allow public to update airplanes" on public.airplanes;
drop policy if exists "Allow public to delete airplanes" on public.airplanes;

-- Create authenticated user policies
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
