import { useAtom } from 'jotai'
import { OpenCreateModal } from '../../providers/jotai-provider'
import CreateModal from './create-modal'

const CreateModalRoot = () => {
  const [open, setOpen] = useAtom(OpenCreateModal)

  return <CreateModal open={open} setOpen={setOpen} />
}

export default CreateModalRoot
