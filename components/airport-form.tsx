"use client"

import type React from "react"
import { useEffect, useState } from "react"
import type { Airport, AirportFormData } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { createAirport, updateAirport } from "@/app/actions"

type AirportFormProps = {
  airport: Airport | null
  isOpen: boolean
  onCancel: () => void
  onSuccess: () => void
}

export function AirportForm({ airport, isOpen, onCancel, onSuccess }: AirportFormProps) {
  const [formData, setFormData] = useState({
    iata_code: "",
    name: "",
    city: "",
    country: "",
    timezone: "",
    runways: "",
    elevation_ft: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (airport) {
      setFormData({
        iata_code: airport.iata_code,
        name: airport.name,
        city: airport.city,
        country: airport.country,
        timezone: airport.timezone,
        runways: airport.runways.toString(),
        elevation_ft: airport.elevation_ft?.toString() || "",
      })
    } else {
      setFormData({
        iata_code: "",
        name: "",
        city: "",
        country: "",
        timezone: "",
        runways: "",
        elevation_ft: "",
      })
    }
  }, [airport, isOpen])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const airportData: AirportFormData = {
        iata_code: formData.iata_code,
        name: formData.name,
        city: formData.city,
        country: formData.country,
        timezone: formData.timezone,
        runways: Number.parseInt(formData.runways),
        elevation_ft: formData.elevation_ft ? Number.parseInt(formData.elevation_ft) : null,
      }

      if (airport) {
        await updateAirport(airport.id, airportData)
      } else {
        await createAirport(airportData)
      }

      onSuccess()
    } catch (error) {
      console.error("[v0] Error submitting form:", error)
      alert("Error al guardar el aeropuerto")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onCancel()}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{airport ? "Editar Aeropuerto" : "Agregar Aeropuerto"}</DialogTitle>
          <DialogDescription>
            {airport ? "Actualiza la información del aeropuerto" : "Completa los datos del nuevo aeropuerto"}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="iata_code">Código IATA</Label>
              <Input
                id="iata_code"
                placeholder="SCL"
                value={formData.iata_code}
                onChange={(e) => setFormData({ ...formData, iata_code: e.target.value.toUpperCase() })}
                required
                maxLength={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="runways">Número de Pistas</Label>
              <Input
                id="runways"
                type="number"
                placeholder="2"
                value={formData.runways}
                onChange={(e) => setFormData({ ...formData, runways: e.target.value })}
                required
                min="1"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="name">Nombre del Aeropuerto</Label>
            <Input
              id="name"
              placeholder="Aeropuerto Internacional Arturo Merino Benítez"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="city">Ciudad</Label>
              <Input
                id="city"
                placeholder="Santiago"
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="country">País</Label>
              <Input
                id="country"
                placeholder="Chile"
                value={formData.country}
                onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="timezone">Zona Horaria</Label>
              <Input
                id="timezone"
                placeholder="America/Santiago"
                value={formData.timezone}
                onChange={(e) => setFormData({ ...formData, timezone: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="elevation_ft">Elevación (pies)</Label>
              <Input
                id="elevation_ft"
                type="number"
                placeholder="1555"
                value={formData.elevation_ft}
                onChange={(e) => setFormData({ ...formData, elevation_ft: e.target.value })}
                min="0"
              />
            </div>
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Guardando..." : airport ? "Actualizar" : "Crear"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}