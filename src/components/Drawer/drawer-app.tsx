import { type PropsWithChildren } from 'react'
import { Drawer } from 'vaul'

interface IProps extends PropsWithOpen, PropsWithChildren {
  header?: React.ReactNode
  footer: React.ReactNode
}

function DrawerApp({ open, setOpen, children, footer, header }: IProps) {
  return (
    <Drawer.Root shouldScaleBackground open={open} onOpenChange={setOpen}>
      <Drawer.Trigger asChild></Drawer.Trigger>
      <Drawer.Portal>
        <Drawer.Overlay className="fixed inset-0 bg-black/40" />
        <Drawer.Content className="fixed inset-x-0 bottom-0 mt-24 flex h-[96%] flex-col rounded-t-[10px] bg-zinc-100">
          <div className="flex-1 rounded-t-[10px] bg-white p-4">
            <div className="mx-auto mb-8 h-1.5 w-12 shrink-0 rounded-full bg-zinc-300" />
            <div className="mx-auto max-w-7xl">
              <Drawer.Title className="mb-4 font-medium">{header}</Drawer.Title>
              {children}
            </div>
          </div>
          <div className="mt-auto border-t border-zinc-200 bg-zinc-100 p-4">{footer}</div>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  )
}

export default DrawerApp
