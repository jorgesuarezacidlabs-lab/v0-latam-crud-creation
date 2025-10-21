"use client"

import type { Airport } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Pencil, Trash2, Plus } from "lucide-react"
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
        alert("Error al eliminar el aeropuerto")
      }
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">{airports.length} aeropuertos registrados</p>
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
                  <h3 className="font-mono text-lg font-semibold">{airport.iata_code}</h3>
                  <p className="text-sm font-medium">{airport.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {airport.city}, {airport.country}
                  </p>
                </div>
              </div>

              <div className="space-y-2 border-t pt-4">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Zona horaria</span>
                  <span className="font-medium">{airport.timezone}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Pistas</span>
                  <span className="font-medium">{airport.runways}</span>
                </div>
                {airport.elevation_ft && (
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Elevación</span>
                    <span className="font-medium">{airport.elevation_ft.toLocaleString()} ft</span>
                  </div>
                )}
              </div>

              <div className="flex gap-2 border-t pt-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setEditingAirport(airport)
                    setIsFormOpen(true)
                  }}
                  className="flex-1 gap-2"
                >
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
          <p className="text-muted-foreground">No hay aeropuertos registrados.</p>
        </Card>
      )}

      <AirportForm
        airport={editingAirport}
        isOpen={isFormOpen}
        onCancel={() => {
          setEditingAirport(null)
          setIsFormOpen(false)
        }}
        onSuccess={() => {
          setEditingAirport(null)
          setIsFormOpen(false)
          router.refresh()
        }}
      />
    </div>
  )
}
