"use client"

import { useEffect } from "react"
import { useAviationToast } from "@/lib/hooks/use-aviation-toast"

export function WelcomeToast() {
  const { showInfo } = useAviationToast()

  useEffect(() => {
    // Mostrar mensaje de bienvenida solo una vez por sesión
    const hasShownWelcome = sessionStorage.getItem('hasShownWelcome')
    
    if (!hasShownWelcome) {
      setTimeout(() => {
        showInfo(
          "¡Bienvenido al Sistema de Gestión de Flota!",
          "Explora las diferentes secciones para administrar aeronaves, aeropuertos, pilotos, rutas, vuelos y mantenimiento."
        )
        sessionStorage.setItem('hasShownWelcome', 'true')
      }, 1000) // Delay de 1 segundo para que se vea después de cargar la página
    }
  }, [showInfo])

  return null
}
