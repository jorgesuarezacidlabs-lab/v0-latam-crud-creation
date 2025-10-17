"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"
import type {
  AirplaneFormData,
  FlightFormData,
  PilotFormData,
  MaintenanceFormData,
  RouteFormData,
  AirportFormData,
} from "@/lib/types"

async function retryOperation<T>(operation: () => Promise<T>, maxRetries = 3): Promise<T> {
  let lastError: Error | null = null

  for (let i = 0; i < maxRetries; i++) {
    try {
      return await operation()
    } catch (error) {
      lastError = error as Error
      console.log(`[v0] Retry ${i + 1}/${maxRetries} after error:`, error)
      if (i < maxRetries - 1) {
        await new Promise((resolve) => setTimeout(resolve, 1000 * (i + 1)))
      }
    }
  }

  throw lastError
}

export async function getAirplanes() {
  return retryOperation(async () => {
    const supabase = await createClient()

    const { data, error } = await supabase.from("airplanes").select("*").order("created_at", { ascending: false })

    if (error) {
      console.error("[v0] Supabase error:", error)
      throw new Error(`Error al cargar los aviones: ${error.message}`)
    }

    return data || []
  })
}

export async function createAirplane(formData: AirplaneFormData) {
  return retryOperation(async () => {
    const supabase = await createClient()

    const { data, error } = await supabase.from("airplanes").insert(formData).select().single()

    if (error) {
      console.error("[v0] Supabase error:", error)
      throw new Error(`Error al crear el avión: ${error.message}`)
    }

    revalidatePath("/")
    return data
  })
}

export async function updateAirplane(id: string, formData: AirplaneFormData) {
  return retryOperation(async () => {
    const supabase = await createClient()

    const { data, error } = await supabase.from("airplanes").update(formData).eq("id", id).select().single()

    if (error) {
      console.error("[v0] Supabase error:", error)
      throw new Error(`Error al actualizar el avión: ${error.message}`)
    }

    revalidatePath("/")
    return data
  })
}

export async function deleteAirplane(id: string) {
  return retryOperation(async () => {
    const supabase = await createClient()

    const { error } = await supabase.from("airplanes").delete().eq("id", id)

    if (error) {
      console.error("[v0] Supabase error:", error)
      throw new Error(`Error al eliminar el avión: ${error.message}`)
    }

    revalidatePath("/")
  })
}

export async function getFlights() {
  return retryOperation(async () => {
    const supabase = await createClient()
    const { data, error } = await supabase.from("flights").select("*").order("departure_time", { ascending: false })
    if (error) throw new Error(`Error al cargar los vuelos: ${error.message}`)
    return data || []
  })
}

export async function createFlight(formData: FlightFormData) {
  return retryOperation(async () => {
    const supabase = await createClient()
    const { data, error } = await supabase.from("flights").insert(formData).select().single()
    if (error) throw new Error(`Error al crear el vuelo: ${error.message}`)
    revalidatePath("/flights")
    return data
  })
}

export async function updateFlight(id: string, formData: FlightFormData) {
  return retryOperation(async () => {
    const supabase = await createClient()
    const { data, error } = await supabase.from("flights").update(formData).eq("id", id).select().single()
    if (error) throw new Error(`Error al actualizar el vuelo: ${error.message}`)
    revalidatePath("/flights")
    return data
  })
}

export async function deleteFlight(id: string) {
  return retryOperation(async () => {
    const supabase = await createClient()
    const { error } = await supabase.from("flights").delete().eq("id", id)
    if (error) throw new Error(`Error al eliminar el vuelo: ${error.message}`)
    revalidatePath("/flights")
  })
}

export async function getPilots() {
  return retryOperation(async () => {
    const supabase = await createClient()
    const { data, error } = await supabase.from("pilots").select("*").order("name", { ascending: true })
    if (error) throw new Error(`Error al cargar los pilotos: ${error.message}`)
    return data || []
  })
}

export async function createPilot(formData: PilotFormData) {
  return retryOperation(async () => {
    const supabase = await createClient()
    const { data, error } = await supabase.from("pilots").insert(formData).select().single()
    if (error) throw new Error(`Error al crear el piloto: ${error.message}`)
    revalidatePath("/pilots")
    return data
  })
}

export async function updatePilot(id: string, formData: PilotFormData) {
  return retryOperation(async () => {
    const supabase = await createClient()
    const { data, error } = await supabase.from("pilots").update(formData).eq("id", id).select().single()
    if (error) throw new Error(`Error al actualizar el piloto: ${error.message}`)
    revalidatePath("/pilots")
    return data
  })
}

export async function deletePilot(id: string) {
  return retryOperation(async () => {
    const supabase = await createClient()
    const { error } = await supabase.from("pilots").delete().eq("id", id)
    if (error) throw new Error(`Error al eliminar el piloto: ${error.message}`)
    revalidatePath("/pilots")
  })
}

export async function getMaintenanceRecords() {
  return retryOperation(async () => {
    const supabase = await createClient()
    const { data, error } = await supabase.from("maintenance").select("*").order("start_date", { ascending: false })
    if (error) throw new Error(`Error al cargar los registros: ${error.message}`)
    return data || []
  })
}

export async function createMaintenance(formData: MaintenanceFormData) {
  return retryOperation(async () => {
    const supabase = await createClient()
    const { data, error } = await supabase.from("maintenance").insert(formData).select().single()
    if (error) throw new Error(`Error al crear el registro: ${error.message}`)
    revalidatePath("/maintenance")
    return data
  })
}

export async function updateMaintenance(id: string, formData: MaintenanceFormData) {
  return retryOperation(async () => {
    const supabase = await createClient()
    const { data, error } = await supabase.from("maintenance").update(formData).eq("id", id).select().single()
    if (error) throw new Error(`Error al actualizar el registro: ${error.message}`)
    revalidatePath("/maintenance")
    return data
  })
}

export async function deleteMaintenance(id: string) {
  return retryOperation(async () => {
    const supabase = await createClient()
    const { error } = await supabase.from("maintenance").delete().eq("id", id)
    if (error) throw new Error(`Error al eliminar el registro: ${error.message}`)
    revalidatePath("/maintenance")
  })
}

export async function getRoutes() {
  return retryOperation(async () => {
    const supabase = await createClient()
    const { data, error } = await supabase.from("routes").select("*").order("route_code", { ascending: true })
    if (error) throw new Error(`Error al cargar las rutas: ${error.message}`)
    return data || []
  })
}

export async function createRoute(formData: RouteFormData) {
  return retryOperation(async () => {
    const supabase = await createClient()
    const { data, error } = await supabase.from("routes").insert(formData).select().single()
    if (error) throw new Error(`Error al crear la ruta: ${error.message}`)
    revalidatePath("/routes")
    return data
  })
}

export async function updateRoute(id: string, formData: RouteFormData) {
  return retryOperation(async () => {
    const supabase = await createClient()
    const { data, error } = await supabase.from("routes").update(formData).eq("id", id).select().single()
    if (error) throw new Error(`Error al actualizar la ruta: ${error.message}`)
    revalidatePath("/routes")
    return data
  })
}

export async function deleteRoute(id: string) {
  return retryOperation(async () => {
    const supabase = await createClient()
    const { error } = await supabase.from("routes").delete().eq("id", id)
    if (error) throw new Error(`Error al eliminar la ruta: ${error.message}`)
    revalidatePath("/routes")
  })
}

export async function getAirports() {
  return retryOperation(async () => {
    const supabase = await createClient()
    const { data, error } = await supabase.from("airports").select("*").order("iata_code", { ascending: true })
    if (error) throw new Error(`Error al cargar los aeropuertos: ${error.message}`)
    return data || []
  })
}

export async function createAirport(formData: AirportFormData) {
  return retryOperation(async () => {
    const supabase = await createClient()
    const { data, error } = await supabase.from("airports").insert(formData).select().single()
    if (error) throw new Error(`Error al crear el aeropuerto: ${error.message}`)
    revalidatePath("/airports")
    return data
  })
}

export async function updateAirport(id: string, formData: AirportFormData) {
  return retryOperation(async () => {
    const supabase = await createClient()
    const { data, error } = await supabase.from("airports").update(formData).eq("id", id).select().single()
    if (error) throw new Error(`Error al actualizar el aeropuerto: ${error.message}`)
    revalidatePath("/airports")
    return data
  })
}

export async function deleteAirport(id: string) {
  return retryOperation(async () => {
    const supabase = await createClient()
    const { error } = await supabase.from("airports").delete().eq("id", id)
    if (error) throw new Error(`Error al eliminar el aeropuerto: ${error.message}`)
    revalidatePath("/airports")
  })
}
