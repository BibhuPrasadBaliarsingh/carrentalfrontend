import { createContext, useContext, useState } from 'react'

const LoaderContext = createContext(null)

export function LoaderProvider({ children }) {
  const [isPageLoading, setIsPageLoading] = useState(true)
  const [hasInitialLoaderRun, setHasInitialLoaderRun] = useState(false)

  return (
    <LoaderContext.Provider value={{ isPageLoading, setIsPageLoading, hasInitialLoaderRun, setHasInitialLoaderRun }}>
      {children}
    </LoaderContext.Provider>
  )
}

export function useLoader() {
  const context = useContext(LoaderContext)
  if (!context) {
    throw new Error('useLoader must be used within a LoaderProvider')
  }
  return context
}
