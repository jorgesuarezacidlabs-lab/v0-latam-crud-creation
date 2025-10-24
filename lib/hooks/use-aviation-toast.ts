import { toast } from "@/lib/hooks/use-toast"
import { CheckCircle, XCircle, AlertCircle, Info, Plane, Wrench, User, MapPin, Route } from "lucide-react"

export function useAviationToast() {
  const showSuccess = (message: string, description?: string) => {
    toast({
      variant: "success",
      title: (
        <div className="flex items-center gap-2">
          <CheckCircle className="h-4 w-4" />
          {message}
        </div>
      ),
      description,
    })
  }

  const showError = (message: string, description?: string) => {
    toast({
      variant: "destructive",
      title: (
        <div className="flex items-center gap-2">
          <XCircle className="h-4 w-4" />
          {message}
        </div>
      ),
      description,
    })
  }

  const showWarning = (message: string, description?: string) => {
    toast({
      variant: "warning",
      title: (
        <div className="flex items-center gap-2">
          <AlertCircle className="h-4 w-4" />
          {message}
        </div>
      ),
      description,
    })
  }

  const showInfo = (message: string, description?: string) => {
    toast({
      variant: "info",
      title: (
        <div className="flex items-center gap-2">
          <Info className="h-4 w-4" />
          {message}
        </div>
      ),
      description,
    })
  }

  // Específicos para aviación
  const showAirplaneSuccess = (action: "created" | "updated" | "deleted", airplaneName?: string) => {
    const messages = {
      created: "Aeronave registrada exitosamente",
      updated: "Aeronave actualizada exitosamente", 
      deleted: "Aeronave eliminada exitosamente"
    }
    
    toast({
      variant: "success",
      title: (
        <div className="flex items-center gap-2">
          <Plane className="h-4 w-4" />
          {messages[action]}
        </div>
      ),
      description: airplaneName ? `${airplaneName} ha sido ${action === "created" ? "registrada" : action === "updated" ? "actualizada" : "eliminada"}` : undefined,
    })
  }

  const showAirportSuccess = (action: "created" | "updated" | "deleted", airportName?: string) => {
    const messages = {
      created: "Aeropuerto registrado exitosamente",
      updated: "Aeropuerto actualizado exitosamente",
      deleted: "Aeropuerto eliminado exitosamente"
    }
    
    toast({
      variant: "success",
      title: (
        <div className="flex items-center gap-2">
          <MapPin className="h-4 w-4" />
          {messages[action]}
        </div>
      ),
      description: airportName ? `${airportName} ha sido ${action === "created" ? "registrado" : action === "updated" ? "actualizado" : "eliminado"}` : undefined,
    })
  }

  const showPilotSuccess = (action: "created" | "updated" | "deleted", pilotName?: string) => {
    const messages = {
      created: "Piloto registrado exitosamente",
      updated: "Piloto actualizado exitosamente",
      deleted: "Piloto eliminado exitosamente"
    }
    
    toast({
      variant: "success",
      title: (
        <div className="flex items-center gap-2">
          <User className="h-4 w-4" />
          {messages[action]}
        </div>
      ),
      description: pilotName ? `${pilotName} ha sido ${action === "created" ? "registrado" : action === "updated" ? "actualizado" : "eliminado"}` : undefined,
    })
  }

  const showRouteSuccess = (action: "created" | "updated" | "deleted", routeCode?: string) => {
    const messages = {
      created: "Ruta registrada exitosamente",
      updated: "Ruta actualizada exitosamente",
      deleted: "Ruta eliminada exitosamente"
    }
    
    toast({
      variant: "success",
      title: (
        <div className="flex items-center gap-2">
          <Route className="h-4 w-4" />
          {messages[action]}
        </div>
      ),
      description: routeCode ? `Ruta ${routeCode} ha sido ${action === "created" ? "registrada" : action === "updated" ? "actualizada" : "eliminada"}` : undefined,
    })
  }

  const showMaintenanceSuccess = (action: "created" | "updated" | "deleted", airplaneName?: string) => {
    const messages = {
      created: "Registro de mantenimiento creado exitosamente",
      updated: "Registro de mantenimiento actualizado exitosamente",
      deleted: "Registro de mantenimiento eliminado exitosamente"
    }
    
    toast({
      variant: "success",
      title: (
        <div className="flex items-center gap-2">
          <Wrench className="h-4 w-4" />
          {messages[action]}
        </div>
      ),
      description: airplaneName ? `Mantenimiento para ${airplaneName} ha sido ${action === "created" ? "registrado" : action === "updated" ? "actualizado" : "eliminado"}` : undefined,
    })
  }

  const showFlightSuccess = (action: "created" | "updated" | "deleted", flightNumber?: string) => {
    const messages = {
      created: "Vuelo registrado exitosamente",
      updated: "Vuelo actualizado exitosamente",
      deleted: "Vuelo eliminado exitosamente"
    }
    
    toast({
      variant: "success",
      title: (
        <div className="flex items-center gap-2">
          <Plane className="h-4 w-4" />
          {messages[action]}
        </div>
      ),
      description: flightNumber ? `Vuelo ${flightNumber} ha sido ${action === "created" ? "registrado" : action === "updated" ? "actualizado" : "eliminado"}` : undefined,
    })
  }

  return {
    showSuccess,
    showError,
    showWarning,
    showInfo,
    showAirplaneSuccess,
    showAirportSuccess,
    showPilotSuccess,
    showRouteSuccess,
    showMaintenanceSuccess,
    showFlightSuccess,
  }
}
