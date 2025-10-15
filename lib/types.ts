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
