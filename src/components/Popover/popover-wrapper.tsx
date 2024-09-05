import React, { useState } from 'react'
import Popover from 'react-popover'

interface PopoverComponentProps {
  triggerElement: React.ReactNode
  content: React.ReactNode
  position?: Popover.PopoverPlace
}

const PopoverWrapper: React.FC<PopoverComponentProps> = ({ triggerElement, content, position = 'above' }) => {
  const [isOpen, setIsOpen] = useState(false)

  const handleTogglePopover = () => {
    setIsOpen(!isOpen)
  }

  return (
    <Popover isOpen={isOpen} body={content} place={position} onOuterAction={() => setIsOpen(false)}>
      <div onClick={handleTogglePopover}>{triggerElement}</div>
    </Popover>
  )
}

export default PopoverWrapper
