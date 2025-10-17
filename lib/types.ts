export interface Airplane {
  id: string
  registration: string
  model: string
  airline: string
  capacity: number
  year: number
  status: "Activo" | "En mantenimiento" | "Fuera de servicio"
  country: string
  created_at: string
}

export type AirplaneFormData = Omit<Airplane, "id" | "created_at">

export interface Flight {
  id: string
  flight_number: string
  airplane_id: string | null
  origin: string
  destination: string
  departure_time: string
  arrival_time: string
  status: "Programado" | "En vuelo" | "Completado" | "Cancelado" | "Retrasado"
  passengers: number
  created_at: string
}

export type FlightFormData = Omit<Flight, "id" | "created_at">

export interface Pilot {
  id: string
  name: string
  license_number: string
  nationality: string
  flight_hours: number
  certifications: string[]
  status: "Activo" | "Inactivo" | "En entrenamiento"
  hire_date: string
  created_at: string
}

export type PilotFormData = Omit<Pilot, "id" | "created_at">

export interface Maintenance {
  id: string
  airplane_id: string | null
  maintenance_type: "Preventivo" | "Correctivo" | "Inspección" | "Overhaul"
  description: string
  technician: string
  start_date: string
  end_date: string | null
  cost: number | null
  status: "Programado" | "En progreso" | "Completado" | "Cancelado"
  created_at: string
}

export type MaintenanceFormData = Omit<Maintenance, "id" | "created_at">

export interface Route {
  id: string
  route_code: string
  origin: string
  destination: string
  distance_km: number
  estimated_duration: number
  frequency: string
  active: boolean
  created_at: string
}

export type RouteFormData = Omit<Route, "id" | "created_at">

export interface Airport {
  id: string
  iata_code: string
  name: string
  city: string
  country: string
  timezone: string
  runways: number
  elevation_ft: number | null
  created_at: string
}

export type AirportFormData = Omit<Airport, "id" | "created_at">
