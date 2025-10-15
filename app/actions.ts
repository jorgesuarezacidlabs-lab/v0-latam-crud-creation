"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"
import type { AirplaneFormData } from "@/lib/types"

export async function getAirplanes() {
  try {
    const supabase = await createClient()

    console.log("[v0] Fetching airplanes from Supabase...")

    const { data, error } = await supabase.from("airplanes").select("*").order("created_at", { ascending: false })

    if (error) {
      console.error("[v0] Supabase error:", error)
      throw error
    }

    console.log("[v0] Successfully fetched", data?.length || 0, "airplanes")
    return data || []
  } catch (error) {
    console.error("[v0] Error in getAirplanes:", error)
    throw new Error("Error al cargar los aviones")
  }
}

export async function createAirplane(formData: AirplaneFormData) {
  try {
    const supabase = await createClient()

    console.log("[v0] Creating airplane:", formData)

    const { data, error } = await supabase.from("airplanes").insert(formData).select().single()

    if (error) {
      console.error("[v0] Supabase error:", error)
      throw error
    }

    console.log("[v0] Successfully created airplane:", data)
    revalidatePath("/")
    return data
  } catch (error) {
    console.error("[v0] Error in createAirplane:", error)
    throw new Error("Error al crear el avión")
  }
}

export async function updateAirplane(id: string, formData: AirplaneFormData) {
  try {
    const supabase = await createClient()

    console.log("[v0] Updating airplane:", id, formData)

    const { data, error } = await supabase.from("airplanes").update(formData).eq("id", id).select().single()

    if (error) {
      console.error("[v0] Supabase error:", error)
      throw error
    }

    console.log("[v0] Successfully updated airplane:", data)
    revalidatePath("/")
    return data
  } catch (error) {
    console.error("[v0] Error in updateAirplane:", error)
    throw new Error("Error al actualizar el avión")
  }
}

export async function deleteAirplane(id: string) {
  try {
    const supabase = await createClient()

    console.log("[v0] Deleting airplane:", id)

    const { error } = await supabase.from("airplanes").delete().eq("id", id)

    if (error) {
      console.error("[v0] Supabase error:", error)
      throw error
    }

    console.log("[v0] Successfully deleted airplane")
    revalidatePath("/")
  } catch (error) {
    console.error("[v0] Error in deleteAirplane:", error)
    throw new Error("Error al eliminar el avión")
  }
}
