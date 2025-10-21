"use client"

import type React from "react"
import { useEffect, useState } from "react"
import type { Route, RouteFormData } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Switch } from "@/components/ui/switch"
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
      alert("Error al guardar la ruta")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onCancel()}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{route ? "Editar Ruta" : "Agregar Ruta"}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
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

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="origin">Origen</Label>
              <Input
                id="origin"
                placeholder="Santiago (SCL)"
                value={formData.origin}
                onChange={(e) => setFormData({ ...formData, origin: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="destination">Destino</Label>
              <Input
                id="destination"
                placeholder="Lima (LIM)"
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
                placeholder="2400"
                value={formData.distance_km}
                onChange={(e) => setFormData({ ...formData, distance_km: e.target.value })}
                required
                min="1"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="estimated_duration">Duración (min)</Label>
              <Input
                id="estimated_duration"
                type="number"
                placeholder="180"
                value={formData.estimated_duration}
                onChange={(e) => setFormData({ ...formData, estimated_duration: e.target.value })}
                required
                min="1"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="frequency">Frecuencia</Label>
            <Input
              id="frequency"
              placeholder="Diaria"
              value={formData.frequency}
              onChange={(e) => setFormData({ ...formData, frequency: e.target.value })}
              required
            />
          </div>

          <div className="flex items-center justify-between rounded-lg border p-4">
            <div className="space-y-0.5">
              <Label htmlFor="active">Ruta Activa</Label>
              <p className="text-sm text-muted-foreground">La ruta está disponible para vuelos</p>
            </div>
            <Switch
              id="active"
              checked={formData.active}
              onCheckedChange={(checked) => setFormData({ ...formData, active: checked })}
            />
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
