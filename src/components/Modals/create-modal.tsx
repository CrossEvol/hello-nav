import { useRef } from 'react'
import Modal from 'react-modal'
import CreateCategoryForm from '../Form/create-category-form'
import CreateNavigationForm from '../Form/create-navigation-form'
import TabsWrapper from '../Tabs/tabs-wrapper'

// Define your custom styles
const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    paddingRight: '0',
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
        <div className="max-h-[26rem] min-w-96 space-y-4 overflow-y-scroll">
          {Header}
          <TabsWrapper
            primaryTitle="category"
            secondaryTitle="navigation"
            primaryNode={<CreateCategoryForm closeAction={CloseButton} />}
            secondaryNode={<CreateNavigationForm />}
          />
        </div>
      </Modal>
    </div>
  )
}

export default CreateModal
