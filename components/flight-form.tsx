"use client"

import type React from "react"
import { useEffect, useState } from "react"
import type { Flight, FlightFormData } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { createFlight, updateFlight } from "@/app/actions"
import { useAviationToast } from "@/lib/hooks/use-aviation-toast"

type FlightFormProps = {
  flight: Flight | null
  isOpen: boolean
  onCancel: () => void
  onSuccess: () => void
}

export function FlightForm({ flight, isOpen, onCancel, onSuccess }: FlightFormProps) {
  const { showFlightSuccess, showError } = useAviationToast()
  const [formData, setFormData] = useState({
    flight_number: "",
    airplane_id: "",
    origin: "",
    destination: "",
    departure_time: "",
    arrival_time: "",
    status: "Programado" as FlightFormData["status"],
    passengers: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (flight) {
      setFormData({
        flight_number: flight.flight_number,
        airplane_id: flight.airplane_id || "",
        origin: flight.origin,
        destination: flight.destination,
        departure_time: flight.departure_time,
        arrival_time: flight.arrival_time,
        status: flight.status,
        passengers: flight.passengers.toString(),
      })
    } else {
      setFormData({
        flight_number: "",
        airplane_id: "",
        origin: "",
        destination: "",
        departure_time: "",
        arrival_time: "",
        status: "Programado",
        passengers: "",
      })
    }
  }, [flight, isOpen])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const flightData: FlightFormData = {
        flight_number: formData.flight_number,
        airplane_id: formData.airplane_id || null,
        origin: formData.origin,
        destination: formData.destination,
        departure_time: formData.departure_time,
        arrival_time: formData.arrival_time,
        status: formData.status,
        passengers: Number.parseInt(formData.passengers),
      }

      if (flight) {
        await updateFlight(flight.id, flightData)
        showFlightSuccess("updated", flight.flight_number)
      } else {
        await createFlight(flightData)
        showFlightSuccess("created", formData.flight_number)
      }

      onSuccess()
    } catch (error) {
      showError("Error al guardar el vuelo", "Verifica que todos los datos sean correctos")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onCancel()}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{flight ? "Editar Vuelo" : "Agregar Vuelo"}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="flight_number">Número de Vuelo</Label>
            <Input
              id="flight_number"
              placeholder="LA800"
              value={formData.flight_number}
              onChange={(e) => setFormData({ ...formData, flight_number: e.target.value })}
              required
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="origin">Origen</Label>
              <Input
                id="origin"
                placeholder="SCL"
                value={formData.origin}
                onChange={(e) => setFormData({ ...formData, origin: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="destination">Destino</Label>
              <Input
                id="destination"
                placeholder="LIM"
                value={formData.destination}
                onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="departure_time">Salida</Label>
              <Input
                id="departure_time"
                type="datetime-local"
                value={formData.departure_time}
                onChange={(e) => setFormData({ ...formData, departure_time: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="arrival_time">Llegada</Label>
              <Input
                id="arrival_time"
                type="datetime-local"
                value={formData.arrival_time}
                onChange={(e) => setFormData({ ...formData, arrival_time: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="passengers">Pasajeros</Label>
              <Input
                id="passengers"
                type="number"
                placeholder="150"
                value={formData.passengers}
                onChange={(e) => setFormData({ ...formData, passengers: e.target.value })}
                required
                min="0"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Estado</Label>
              <Select
                value={formData.status}
                onValueChange={(value: FlightFormData["status"]) => setFormData({ ...formData, status: value })}
              >
                <SelectTrigger id="status">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Programado">Programado</SelectItem>
                  <SelectItem value="En vuelo">En vuelo</SelectItem>
                  <SelectItem value="Completado">Completado</SelectItem>
                  <SelectItem value="Cancelado">Cancelado</SelectItem>
                  <SelectItem value="Retrasado">Retrasado</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Guardando..." : flight ? "Actualizar" : "Crear"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
