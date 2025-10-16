import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle2, Plane } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function SignUpSuccessPage() {
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
                <CheckCircle2 className="h-6 w-6 text-green-500" />
                <CardTitle className="text-2xl">¡Registro Exitoso!</CardTitle>
              </div>
              <CardDescription>Verifica tu email para continuar</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Te hemos enviado un email de confirmación. Por favor, revisa tu bandeja de entrada y haz clic en el
                enlace para activar tu cuenta.
              </p>
              <Button asChild className="w-full">
                <Link href="/auth/login">Ir a Iniciar Sesión</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
