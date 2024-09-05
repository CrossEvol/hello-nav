import React, { useState, useRef } from 'react'
import Modal from 'react-modal'

// Define your custom styles
const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
  },
}

// Ensure the modal is accessible
if (typeof window !== 'undefined') {
  Modal.setAppElement('#__next')
}

const ModalComponent = () => {
  const subtitleRef = useRef<HTMLHeadingElement>(null)
  const [modalIsOpen, setIsOpen] = useState(false)

  const openModal = () => {
    setIsOpen(true)
  }

  const afterOpenModal = () => {
    if (subtitleRef.current) {
      subtitleRef.current.style.color = '#f00'
    }
  }

  const closeModal = () => {
    setIsOpen(false)
  }

  return (
    <div>
      <button onClick={openModal}>Open Modal</button>
      <Modal
        isOpen={modalIsOpen}
        onAfterOpen={afterOpenModal}
        onRequestClose={closeModal}
        style={customStyles}
        contentLabel="Example Modal"
      >
        <h2 ref={subtitleRef} className="mb-4 text-center text-2xl font-semibold">
          Hello
        </h2>
        <button
          onClick={closeModal}
          className="mb-4 rounded bg-red-500 px-4 py-2 text-white transition-colors duration-300 hover:bg-red-600"
        >
          Close
        </button>
        <div className="mb-6 text-lg text-gray-700">I am a modal</div>
        <form className="space-y-4">
          <input
            type="text"
            placeholder="Enter something..."
            className="w-full rounded border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <div className="space-x-2">
            <button
              type="button"
              className="rounded bg-blue-500 px-4 py-2 text-white transition-colors duration-300 hover:bg-blue-600"
            >
              Tab Navigation
            </button>
            <button
              type="button"
              className="rounded bg-green-500 px-4 py-2 text-white transition-colors duration-300 hover:bg-green-600"
            >
              Stays
            </button>
            <button
              type="button"
              className="rounded bg-yellow-500 px-4 py-2 text-white transition-colors duration-300 hover:bg-yellow-600"
            >
              Inside
            </button>
            <button
              type="button"
              className="rounded bg-purple-500 px-4 py-2 text-white transition-colors duration-300 hover:bg-purple-600"
            >
              The Modal
            </button>
          </div>
        </form>
      </Modal>
    </div>
  )
}

export default ModalComponent
