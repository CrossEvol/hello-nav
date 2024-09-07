import React, { type PropsWithChildren } from 'react'
import { useBearStore } from '../store'

const DatabaseProvider = ({ children }: PropsWithChildren) => {
  const initialized = useBearStore(state => state.initialized)
  const initializeDatabase = useBearStore(state => state.initializeDatabase)

  React.useEffect(() => {
    if (!initialized) {
      initializeDatabase()
    }

    return () => {}
  }, [initializeDatabase, initialized])

  return <>{children}</>
}

export default DatabaseProvider
