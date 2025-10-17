"use client"

import type { Flight } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Pencil, Trash2, Plus, Plane } from "lucide-react"
import { useState } from "react"
import { FlightForm } from "./flight-form"
import { deleteFlight } from "@/app/actions"
import { useRouter } from "next/navigation"

type FlightListProps = {
  flights: Flight[]
}

const statusColors = {
  Programado: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
  "En vuelo": "bg-green-500/10 text-green-600 dark:text-green-400",
  Completado: "bg-accent text-accent-foreground",
  Cancelado: "bg-red-500/10 text-red-600 dark:text-red-400",
  Retrasado: "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400",
}

export function FlightList({ flights }: FlightListProps) {
  const [editingFlight, setEditingFlight] = useState<Flight | null>(null)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const router = useRouter()

  const handleDelete = async (id: string) => {
    if (confirm("¿Estás seguro de que deseas eliminar este vuelo?")) {
      try {
        await deleteFlight(id)
        router.refresh()
      } catch (error) {
        console.error("[v0] Error deleting flight:", error)
        alert("Error al eliminar el vuelo")
      }
    }
  }

  const handleEdit = (flight: Flight) => {
    setEditingFlight(flight)
    setIsFormOpen(true)
  }

  const handleCancel = () => {
    setEditingFlight(null)
    setIsFormOpen(false)
  }

  const handleSuccess = () => {
    setEditingFlight(null)
    setIsFormOpen(false)
    router.refresh()
  }

  const formatDateTime = (dateTime: string) => {
    return new Date(dateTime).toLocaleString("es-ES", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {flights.length} {flights.length === 1 ? "vuelo" : "vuelos"} registrados
        </p>
        <Button onClick={() => setIsFormOpen(true)} className="gap-2">
          <Plus className="h-4 w-4" />
          Agregar Vuelo
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {flights.map((flight) => (
          <Card key={flight.id} className="p-6">
            <div className="space-y-4">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <h3 className="font-mono text-lg font-semibold text-foreground">{flight.flight_number}</h3>
                  <p className="text-sm text-muted-foreground">
                    {flight.origin} → {flight.destination}
                  </p>
                </div>
                <Badge className={statusColors[flight.status]}>{flight.status}</Badge>
              </div>

              <div className="space-y-2 border-t border-border pt-4">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Salida</span>
                  <span className="font-medium text-foreground">{formatDateTime(flight.departure_time)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Llegada</span>
                  <span className="font-medium text-foreground">{formatDateTime(flight.arrival_time)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Pasajeros</span>
                  <span className="font-medium text-foreground">{flight.passengers}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Aeronave</span>
                  <span className="font-medium text-foreground">
                    {flight.airplane_id ? "Asignada" : "Sin asignar"}
                  </span>
                </div>
              </div>

              <div className="flex gap-2 border-t border-border pt-4">
                <Button variant="outline" size="sm" onClick={() => handleEdit(flight)} className="flex-1 gap-2">
                  <Pencil className="h-3.5 w-3.5" />
                  Editar
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDelete(flight.id)}
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

      {flights.length === 0 && (
        <Card className="p-12 text-center">
          <div className="flex flex-col items-center gap-4">
            <Plane className="h-12 w-12 text-muted-foreground" />
            <p className="text-muted-foreground">
              No hay vuelos registrados. Haz clic en "Agregar Vuelo" para comenzar.
            </p>
          </div>
        </Card>
      )}

      <FlightForm flight={editingFlight} isOpen={isFormOpen} onCancel={handleCancel} onSuccess={handleSuccess} />
    </div>
  )
}