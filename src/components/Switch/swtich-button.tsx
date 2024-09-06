import Switch from 'rc-switch'
import './switch-button.less'

const RCSwitchButton = ({
  checkedChildren = '√',
  unCheckedChildren = 'x',
  checked,
  setChecked,
}: {
  checked?: boolean
  setChecked: (checked: boolean) => void
  checkedChildren?: React.ReactNode
  unCheckedChildren?: React.ReactNode
}) => {
  return (
    <div style={{ margin: 0 }}>
      <Switch
        checked={checked}
        onChange={setChecked}
        checkedChildren={checkedChildren}
        unCheckedChildren={unCheckedChildren}
      />
    </div>
  )
}

export default RCSwitchButton
