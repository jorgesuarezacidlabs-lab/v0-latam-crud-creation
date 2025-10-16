"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"
import type { AirplaneFormData } from "@/lib/types"

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
