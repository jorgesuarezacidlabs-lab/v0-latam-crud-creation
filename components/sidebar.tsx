"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Plane, Calendar, Users, Wrench, Route, Building2, LogOut } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { useAviationToast } from "@/lib/hooks/use-aviation-toast"

const navigation = [
  { name: "Aviones", href: "/", icon: Plane },
  { name: "Vuelos", href: "/flights", icon: Calendar },
  { name: "Pilotos", href: "/pilots", icon: Users },
  { name: "Mantenimiento", href: "/maintenance", icon: Wrench },
  { name: "Rutas", href: "/routes", icon: Route },
  { name: "Aeropuertos", href: "/airports", icon: Building2 },
]

interface SidebarProps {
  userEmail?: string
  onLogout: () => void
}

export function Sidebar({ userEmail, onLogout }: SidebarProps) {
  const pathname = usePathname()
  const { showInfo } = useAviationToast()

  const handleNavigation = (itemName: string) => {
    const messages = {
      "Aviones": "Gestionando la flota de aeronaves",
      "Vuelos": "Administrando vuelos y programación",
      "Pilotos": "Gestionando personal de vuelo",
      "Mantenimiento": "Supervisando registros de mantenimiento",
      "Rutas": "Administrando rutas de vuelo",
      "Aeropuertos": "Gestionando aeropuertos y destinos"
    }
    
    showInfo(`Navegando a ${itemName}`, messages[itemName as keyof typeof messages])
  }

  return (
    <div className="flex h-screen w-64 flex-col border-r border-border bg-card">
      {/* Header */}
      <div className="border-b border-border p-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
            <Plane className="h-5 w-5 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-foreground">LATAM</h1>
            <p className="text-xs text-muted-foreground">Sistema de Gestión</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 p-4">
        {navigation.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.name}
              href={item.href}
              onClick={() => handleNavigation(item.name)}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground",
              )}
            >
              <item.icon className="h-5 w-5" />
              {item.name}
            </Link>
          )
        })}
      </nav>

      {/* User section */}
      <div className="border-t border-border p-4">
        <div className="mb-3 rounded-lg bg-muted p-3">
          <p className="text-xs text-muted-foreground">Usuario</p>
          <p className="truncate text-sm font-medium text-foreground">{userEmail}</p>
        </div>
        <Button variant="outline" size="sm" className="w-full bg-transparent" onClick={onLogout}>
          <LogOut className="mr-2 h-4 w-4" />
          Cerrar Sesión
        </Button>
      </div>
    </div>
  )
}
