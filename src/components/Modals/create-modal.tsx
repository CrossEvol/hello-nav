import { useRef } from 'react'
import Modal from 'react-modal'
import TabsWrapper from './tabs-wrapper'

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

const CreateModal = ({ open, setOpen }: PropsWithOpen) => {
  const subtitleRef = useRef<HTMLHeadingElement>(null)

  const afterOpenModal = () => {
    if (subtitleRef.current) {
      // subtitleRef.current.style.color = '#f00'
    }
  }

  const closeModal = (e: React.MouseEvent | React.KeyboardEvent) => {
    e.stopPropagation()
    setOpen(false)
  }

  const Header = (
    <h2 ref={subtitleRef} className="mb-4 w-20 text-center text-2xl font-bold text-slate-600">
      Create
    </h2>
  )

  const CloseButton = (
    <button
      onClick={closeModal}
      className="rounded bg-red-500 px-4 py-2 text-white transition-colors duration-300 hover:bg-red-600"
    >
      Close
    </button>
  )

  return (
    <div>
      <Modal
        isOpen={open}
        onAfterOpen={afterOpenModal}
        onRequestClose={closeModal}
        style={customStyles}
        contentLabel="Example Modal"
      >
        <div className="min-w-96 space-y-4">
          {Header}
          <TabsWrapper
            primaryTitle="category"
            secondaryTitle="navigation"
            primaryNode={
              <form className="space-y-4 p-4">
                <input
                  type="text"
                  placeholder="Enter something...1"
                  className="w-full rounded border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <div className="m-2 flex flex-row justify-end space-x-2">
                  <button
                    type="button"
                    className="rounded bg-blue-500 px-4 py-2 text-white transition-colors duration-300 hover:bg-blue-600"
                  >
                    Submit
                  </button>
                  <div className=""></div>
                  {CloseButton}
                </div>
              </form>
            }
            secondaryNode={
              <form className="space-y-4 p-4">
                <input
                  type="text"
                  placeholder="Enter something...2"
                  className="w-full rounded border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <div className="m-2 flex flex-row justify-end space-x-2">
                  <button
                    type="button"
                    className="rounded bg-blue-500 px-4 py-2 text-white transition-colors duration-300 hover:bg-blue-600"
                  >
                    Submit
                  </button>
                  <div className=""></div>
                  {CloseButton}
                </div>
              </form>
            }
          />
        </div>
      </Modal>
    </div>
  )
}

export default CreateModal
