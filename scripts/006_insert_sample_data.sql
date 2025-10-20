-- Insert sample data for all tables

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
where exists (select 1 from public.airplanes where registration = 'CC-BBA');

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
where exists (select 1 from public.airplanes where registration = 'PT-MUA');

-- Sample pilots
insert into public.pilots (name, license_number, nationality, flight_hours, certifications, status, hire_date)
values
  ('Carlos Mendoza', 'ATP-123456', 'Chilena', 3500, ARRAY['Boeing 787', 'Airbus A320', 'IFR'], 'Activo', '2018-03-15'),
  ('Ana Silva', 'ATP-789012', 'Brasileña', 2800, ARRAY['Boeing 737', 'Airbus A320'], 'Activo', '2019-07-20'),
  ('Miguel Torres', 'ATP-345678', 'Peruana', 4200, ARRAY['Boeing 777', 'Boeing 787', 'IFR', 'Multi-Engine'], 'Activo', '2016-11-10');

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
where exists (select 1 from public.airplanes where registration = 'CC-BBA');

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
where exists (select 1 from public.airplanes where registration = 'N534LA');

-- Sample routes
insert into public.routes (route_code, origin, destination, distance_km, estimated_duration, frequency, active)
values
  ('SCL-LIM', 'SCL - Santiago', 'LIM - Lima', 2500, 180, 'Diario', true),
  ('GRU-SCL', 'GRU - São Paulo', 'SCL - Santiago', 3000, 210, 'Lunes a Viernes', true),
  ('SCL-BOG', 'SCL - Santiago', 'BOG - Bogotá', 4000, 300, 'Martes, Jueves, Sábado', true),
  ('LIM-MEX', 'LIM - Lima', 'MEX - Ciudad de México', 3500, 270, 'Fines de semana', true);

-- Sample airports
insert into public.airports (iata_code, name, city, country, timezone, runways, elevation_ft)
values
  ('SCL', 'Aeropuerto Internacional Arturo Merino Benítez', 'Santiago', 'Chile', 'America/Santiago', 2, 1555),
  ('LIM', 'Aeropuerto Internacional Jorge Chávez', 'Lima', 'Perú', 'America/Lima', 2, 113),
  ('GRU', 'Aeropuerto Internacional de São Paulo/Guarulhos', 'São Paulo', 'Brasil', 'America/Sao_Paulo', 3, 2459),
  ('BOG', 'Aeropuerto Internacional El Dorado', 'Bogotá', 'Colombia', 'America/Bogota', 2, 8361),
  ('MEX', 'Aeropuerto Internacional de la Ciudad de México', 'Ciudad de México', 'México', 'America/Mexico_City', 2, 7316);
