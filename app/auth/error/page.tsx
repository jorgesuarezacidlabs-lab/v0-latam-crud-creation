import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle, Plane } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default async function ErrorPage({ searchParams }: { searchParams: Promise<{ error: string }> }) {
  const params = await searchParams

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <div className="flex flex-col gap-6">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Plane className="h-8 w-8 text-primary" />
            <h1 className="text-2xl font-bold">LATAM Aviones</h1>
          </div>
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <AlertCircle className="h-6 w-6 text-destructive" />
                <CardTitle className="text-2xl">Error de Autenticación</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {params?.error ? (
                <p className="text-sm text-muted-foreground">Código de error: {params.error}</p>
              ) : (
                <p className="text-sm text-muted-foreground">Ocurrió un error inesperado.</p>
              )}
              <Button asChild className="w-full">
                <Link href="/auth/login">Volver a Iniciar Sesión</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
