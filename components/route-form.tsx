"use client"

import type React from "react"
import { useEffect, useState } from "react"
import type { Route, RouteFormData } from "@/lib/types"
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
import { createRoute, updateRoute } from "@/app/actions"

type RouteFormProps = {
  route: Route | null
  isOpen: boolean
  onCancel: () => void
  onSuccess: () => void
}

export function RouteForm({ route, isOpen, onCancel, onSuccess }: RouteFormProps) {
  const [formData, setFormData] = useState({
    route_code: "",
    origin: "",
    destination: "",
    distance_km: "",
    estimated_duration: "",
    frequency: "",
    active: true,
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (route) {
      setFormData({
        route_code: route.route_code,
        origin: route.origin,
        destination: route.destination,
        distance_km: route.distance_km.toString(),
        estimated_duration: route.estimated_duration.toString(),
        frequency: route.frequency,
        active: route.active,
      })
    } else {
      setFormData({
        route_code: "",
        origin: "",
        destination: "",
        distance_km: "",
        estimated_duration: "",
        frequency: "",
        active: true,
      })
    }
  }, [route, isOpen])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const routeData: RouteFormData = {
        route_code: formData.route_code,
        origin: formData.origin,
        destination: formData.destination,
        distance_km: Number.parseInt(formData.distance_km),
        estimated_duration: Number.parseInt(formData.estimated_duration),
        frequency: formData.frequency,
        active: formData.active,
      }

      if (route) {
        await updateRoute(route.id, routeData)
      } else {
        await createRoute(routeData)
      }

      onSuccess()
    } catch (error) {
      console.error("[v0] Error submitting form:", error)
      alert("Error al guardar la ruta")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onCancel()}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{route ? "Editar Ruta" : "Agregar Ruta"}</DialogTitle>
          <DialogDescription>
            {route ? "Actualiza la información de la ruta" : "Completa los datos de la nueva ruta"}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="route_code">Código de Ruta</Label>
              <Input
                id="route_code"
                placeholder="SCL-LIM"
                value={formData.route_code}
                onChange={(e) => setFormData({ ...formData, route_code: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="frequency">Frecuencia</Label>
              <Select
                value={formData.frequency}
                onValueChange={(value) => setFormData({ ...formData, frequency: value })}
              >
                <SelectTrigger id="frequency">
                  <SelectValue placeholder="Seleccionar frecuencia" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Diario">Diario</SelectItem>
                  <SelectItem value="Lunes a Viernes">Lunes a Viernes</SelectItem>
                  <SelectItem value="Fines de semana">Fines de semana</SelectItem>
                  <SelectItem value="Lunes, Miércoles, Viernes">Lunes, Miércoles, Viernes</SelectItem>
                  <SelectItem value="Martes, Jueves, Sábado">Martes, Jueves, Sábado</SelectItem>
                  <SelectItem value="Estacional">Estacional</SelectItem>
                  <SelectItem value="Charter">Charter</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="origin">Origen</Label>
              <Input
                id="origin"
                placeholder="SCL - Santiago"
                value={formData.origin}
                onChange={(e) => setFormData({ ...formData, origin: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="destination">Destino</Label>
              <Input
                id="destination"
                placeholder="LIM - Lima"
                value={formData.destination}
                onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="distance_km">Distancia (km)</Label>
              <Input
                id="distance_km"
                type="number"
                placeholder="2500"
                value={formData.distance_km}
                onChange={(e) => setFormData({ ...formData, distance_km: e.target.value })}
                required
                min="0"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="estimated_duration">Duración Estimada (min)</Label>
              <Input
                id="estimated_duration"
                type="number"
                placeholder="180"
                value={formData.estimated_duration}
                onChange={(e) => setFormData({ ...formData, estimated_duration: e.target.value })}
                required
                min="0"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="active">Estado de la Ruta</Label>
            <Select
              value={formData.active ? "true" : "false"}
              onValueChange={(value) => setFormData({ ...formData, active: value === "true" })}
            >
              <SelectTrigger id="active">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="true">Activa</SelectItem>
                <SelectItem value="false">Inactiva</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Guardando..." : route ? "Actualizar" : "Crear"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}