import { useAviationToast } from "./use-aviation-toast"
import { useEffect, useState } from "react"

export function useLoadingToast() {
  const { showInfo, showSuccess, showError } = useAviationToast()
  const [loadingMessage, setLoadingMessage] = useState<string | null>(null)

  const showLoading = (message: string) => {
    setLoadingMessage(message)
    showInfo("Procesando...", message)
  }

  const showSuccessWithMessage = (message: string, description?: string) => {
    setLoadingMessage(null)
    showSuccess(message, description)
  }

  const showErrorWithMessage = (message: string, description?: string) => {
    setLoadingMessage(null)
    showError(message, description)
  }

  const showInfoMessage = (message: string, description?: string) => {
    setLoadingMessage(null)
    showInfo(message, description)
  }

  // Limpiar mensaje de carga después de un tiempo
  useEffect(() => {
    if (loadingMessage) {
      const timer = setTimeout(() => {
        setLoadingMessage(null)
      }, 5000) // 5 segundos

      return () => clearTimeout(timer)
    }
  }, [loadingMessage])

  return {
    showLoading,
    showSuccessWithMessage,
    showErrorWithMessage,
    showInfoMessage,
    isLoading: !!loadingMessage,
    loadingMessage,
  }
}
