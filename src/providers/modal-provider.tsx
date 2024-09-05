import React, { type PropsWithChildren } from 'react'
import Modal from 'react-modal'
import { useRef } from 'react'

const ModalProvider = ({ children }: PropsWithChildren) => {
  const flag = useRef(true)
  React.useEffect(() => {
    if (flag.current.valueOf()) {
      // Ensure the modal is accessible
      if (typeof window !== 'undefined') {
        Modal.setAppElement('#root')
      }
    }

    return () => {
      flag.current = false
    }
  }, [])

  return <>{children}</>
}

export default ModalProvider
