import { useCallback, useEffect, useState } from "react"

type AsyncState<T> = {
  data: T
  loading: boolean
  error: string | null
}

function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : "Une erreur est survenue. Réessayez."
}

export function useAsyncResource<T>(load: () => Promise<T>, initialData: T) {
  const [state, setState] = useState<AsyncState<T>>({
    data: initialData,
    loading: true,
    error: null,
  })

  const refresh = useCallback(async () => {
    setState((current) => ({ ...current, loading: true, error: null }))
    try {
      const data = await load()
      setState({ data, loading: false, error: null })
    } catch (error) {
      setState((current) => ({ ...current, loading: false, error: getErrorMessage(error) }))
    }
  }, [load])

  useEffect(() => {
    void refresh()
  }, [refresh])

  return { ...state, refresh }
}
