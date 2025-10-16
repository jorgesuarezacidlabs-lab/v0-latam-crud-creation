import { AirplaneList } from "@/components/airplane-list"
import { Plane, AlertCircle, LogOut } from "lucide-react"
import { getAirplanes } from "./actions"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Suspense } from "react"
import { Card } from "@/components/ui/card"
import { createClient } from "@/lib/supabase/server"
import { Button } from "@/components/ui/button"
import { redirect } from "next/navigation"

export const dynamic = "force-dynamic"

async function AirplanesContent() {
  try {
    const airplanes = await getAirplanes()
    return <AirplaneList airplanes={airplanes} />
  } catch (error) {
    console.error("[v0] Error loading airplanes:", error)
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error de conexión</AlertTitle>
        <AlertDescription>
          No se pudieron cargar las aeronaves. Por favor, verifica tu conexión a internet y recarga la página.
        </AlertDescription>
      </Alert>
    )
  }
}

function LoadingSkeleton() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="h-5 w-32 animate-pulse rounded bg-muted" />
        <div className="h-10 w-40 animate-pulse rounded bg-muted" />
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="p-6">
            <div className="space-y-4">
              <div className="h-6 w-24 animate-pulse rounded bg-muted" />
              <div className="h-4 w-32 animate-pulse rounded bg-muted" />
              <div className="space-y-2 border-t border-border pt-4">
                <div className="h-4 w-full animate-pulse rounded bg-muted" />
                <div className="h-4 w-full animate-pulse rounded bg-muted" />
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}

async function logout() {
  "use server"
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect("/auth/login")
}

export default async function Home() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <header className="mb-8">
          <div className="mb-4 flex items-center justify-end">
            <div className="flex items-center gap-4">
              <span className="text-sm text-muted-foreground">{user?.email}</span>
              <form action={logout}>
                <Button variant="outline" size="sm" type="submit">
                  <LogOut className="mr-2 h-4 w-4" />
                  Cerrar Sesión
                </Button>
              </form>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary">
              <Plane className="h-6 w-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-foreground">Gestión de Flota</h1>
              <p className="text-sm text-muted-foreground">Sistema de administración de aeronaves LATAM</p>
            </div>
          </div>
        </header>

        <Suspense fallback={<LoadingSkeleton />}>
          <AirplanesContent />
        </Suspense>
      </div>
    </main>
  )
}
