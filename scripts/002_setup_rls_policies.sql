-- Drop existing policies if they exist
drop policy if exists "Allow public to view airplanes" on public.airplanes;
drop policy if exists "Allow public to insert airplanes" on public.airplanes;
drop policy if exists "Allow public to update airplanes" on public.airplanes;
drop policy if exists "Allow public to delete airplanes" on public.airplanes;

-- Enable RLS on airplanes table
alter table public.airplanes enable row level security;

-- Create policies for public access
create policy "Allow public to view airplanes"
  on public.airplanes for select
  using (true);

create policy "Allow public to insert airplanes"
  on public.airplanes for insert
  with check (true);

create policy "Allow public to update airplanes"
  on public.airplanes for update
  using (true)
  with check (true);

create policy "Allow public to delete airplanes"
  on public.airplanes for delete
  using (true);
