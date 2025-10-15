"use client"

import type React from "react"
import { useEffect, useState } from "react"
import type { Airplane, AirplaneFormData } from "@/lib/types"
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { createAirplane, updateAirplane } from "@/app/actions"

type AirplaneFormProps = {
  airplane: Airplane | null
  isOpen: boolean
  onCancel: () => void
  onSuccess: () => void
}

export function AirplaneForm({ airplane, isOpen, onCancel, onSuccess }: AirplaneFormProps) {
  const [formData, setFormData] = useState({
    registration: "",
    model: "",
    airline: "",
    capacity: "",
    year: "",
    status: "Activo" as AirplaneFormData["status"],
    country: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (airplane) {
      setFormData({
        registration: airplane.registration,
        model: airplane.model,
        airline: airplane.airline,
        capacity: airplane.capacity.toString(),
        year: airplane.year.toString(),
        status: airplane.status,
        country: airplane.country,
      })
    } else {
      setFormData({
        registration: "",
        model: "",
        airline: "",
        capacity: "",
        year: "",
        status: "Activo",
        country: "",
      })
    }
  }, [airplane, isOpen])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const airplaneData: AirplaneFormData = {
        registration: formData.registration,
        model: formData.model,
        airline: formData.airline,
        capacity: Number.parseInt(formData.capacity),
        year: Number.parseInt(formData.year),
        status: formData.status,
        country: formData.country,
      }

      if (airplane) {
        await updateAirplane(airplane.id, airplaneData)
      } else {
        await createAirplane(airplaneData)
      }

      onSuccess()
    } catch (error) {
      console.error("[v0] Error submitting form:", error)
      alert("Error al guardar la aeronave")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onCancel()}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{airplane ? "Editar Aeronave" : "Agregar Aeronave"}</DialogTitle>
          <DialogDescription>
            {airplane ? "Actualiza la información de la aeronave" : "Completa los datos de la nueva aeronave"}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="registration">Matrícula</Label>
              <Input
                id="registration"
                placeholder="CC-BBA"
                value={formData.registration}
                onChange={(e) => setFormData({ ...formData, registration: e.target.value })}
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

          <div className="space-y-2">
            <Label htmlFor="model">Modelo</Label>
            <Input
              id="model"
              placeholder="Boeing 787-9"
              value={formData.model}
              onChange={(e) => setFormData({ ...formData, model: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="airline">Aerolínea</Label>
            <Input
              id="airline"
              placeholder="LATAM Airlines"
              value={formData.airline}
              onChange={(e) => setFormData({ ...formData, airline: e.target.value })}
              required
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="capacity">Capacidad (pax)</Label>
              <Input
                id="capacity"
                type="number"
                placeholder="313"
                value={formData.capacity}
                onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
                required
                min="1"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="year">Año</Label>
              <Input
                id="year"
                type="number"
                placeholder="2020"
                value={formData.year}
                onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                required
                min="1900"
                max={new Date().getFullYear() + 1}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">Estado</Label>
            <Select
              value={formData.status}
              onValueChange={(value: AirplaneFormData["status"]) => setFormData({ ...formData, status: value })}
            >
              <SelectTrigger id="status">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Activo">Activo</SelectItem>
                <SelectItem value="En mantenimiento">En mantenimiento</SelectItem>
                <SelectItem value="Fuera de servicio">Fuera de servicio</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Guardando..." : airplane ? "Actualizar" : "Crear"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
