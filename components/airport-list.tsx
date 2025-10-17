"use client"

import type { Airport } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Pencil, Trash2, Plus, Building2 } from "lucide-react"
import { useState } from "react"
import { AirportForm } from "./airport-form"
import { deleteAirport } from "@/app/actions"
import { useRouter } from "next/navigation"

type AirportListProps = {
  airports: Airport[]
}

export function AirportList({ airports }: AirportListProps) {
  const [editingAirport, setEditingAirport] = useState<Airport | null>(null)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const router = useRouter()

  const handleDelete = async (id: string) => {
    if (confirm("¿Estás seguro de que deseas eliminar este aeropuerto?")) {
      try {
        await deleteAirport(id)
        router.refresh()
      } catch (error) {
        console.error("[v0] Error deleting airport:", error)
        alert("Error al eliminar el aeropuerto")
      }
    }
  }

  const handleEdit = (airport: Airport) => {
    setEditingAirport(airport)
    setIsFormOpen(true)
  }

  const handleCancel = () => {
    setEditingAirport(null)
    setIsFormOpen(false)
  }

  const handleSuccess = () => {
    setEditingAirport(null)
    setIsFormOpen(false)
    router.refresh()
  }

  const formatElevation = (elevation: number | null) => {
    if (!elevation) return "No especificado"
    return `${elevation.toLocaleString()} ft`
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {airports.length} {airports.length === 1 ? "aeropuerto" : "aeropuertos"} registrados
        </p>
        <Button onClick={() => setIsFormOpen(true)} className="gap-2">
          <Plus className="h-4 w-4" />
          Agregar Aeropuerto
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {airports.map((airport) => (
          <Card key={airport.id} className="p-6">
            <div className="space-y-4">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <h3 className="font-mono text-lg font-semibold text-foreground">{airport.iata_code}</h3>
                  <p className="text-sm text-muted-foreground">{airport.name}</p>
                </div>
                <Badge variant="secondary">{airport.country}</Badge>
              </div>

              <div className="space-y-2 border-t border-border pt-4">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Ciudad</span>
                  <span className="font-medium text-foreground">{airport.city}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Pistas</span>
                  <span className="font-medium text-foreground">{airport.runways}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Elevación</span>
                  <span className="font-medium text-foreground">{formatElevation(airport.elevation_ft)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Zona Horaria</span>
                  <span className="font-medium text-foreground">{airport.timezone}</span>
                </div>
              </div>

              <div className="flex gap-2 border-t border-border pt-4">
                <Button variant="outline" size="sm" onClick={() => handleEdit(airport)} className="flex-1 gap-2">
                  <Pencil className="h-3.5 w-3.5" />
                  Editar
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDelete(airport.id)}
                  className="flex-1 gap-2 text-destructive hover:bg-destructive hover:text-destructive-foreground"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  Eliminar
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {airports.length === 0 && (
        <Card className="p-12 text-center">
          <div className="flex flex-col items-center gap-4">
            <Building2 className="h-12 w-12 text-muted-foreground" />
            <p className="text-muted-foreground">
              No hay aeropuertos registrados. Haz clic en "Agregar Aeropuerto" para comenzar.
            </p>
          </div>
        </Card>
      )}

      <AirportForm airport={editingAirport} isOpen={isFormOpen} onCancel={handleCancel} onSuccess={handleSuccess} />
    </div>
  )
}