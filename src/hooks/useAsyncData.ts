import { useEffect, useLayoutEffect, useRef, useState } from 'react'

/**
 * Carga datos al montar o cuando cambian las dependencias.
 * setState solo ocurre en callbacks de la promesa (no de forma síncrona en el effect).
 */
export function useAsyncData<T>(
  fetcher: () => Promise<T>,
  deps: React.DependencyList,
  initialData?: T,
) {
  const [data, setData] = useState<T | undefined>(initialData)
  const [loading, setLoading] = useState(initialData === undefined)
  const fetcherRef = useRef(fetcher)

  useLayoutEffect(() => {
    fetcherRef.current = fetcher
  })

  const reload = async () => {
    setLoading(true)
    try {
      const result = await fetcherRef.current()
      setData(result)
      return result
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    let cancelled = false

    queueMicrotask(() => {
      if (!cancelled) setLoading(true)
    })

    void fetcherRef
      .current()
      .then((result) => {
        if (!cancelled) setData(result)
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => {
      cancelled = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)

  return {
    data,
    loading,
    reload,
    setData,
  }
}
