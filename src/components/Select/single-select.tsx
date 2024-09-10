import Select, { type SingleValue, type SingleValueProps, components } from 'react-select'
import { type ColourOption } from './select-data'

const SingleValue = ({ children, ...props }: SingleValueProps<ColourOption>) => (
  <>
    <components.SingleValue {...props}>{children}</components.SingleValue>
  </>
)

const emptyOption = { value: '0', label: '', color: '' }

const SingleSelect = ({
  selectedOption,
  setSelectedOption,
  options,
  isDisabled = false,
}: {
  selectedOption: ColourOption
  setSelectedOption: (option: ColourOption) => void
  options: ColourOption[]
  isDisabled?: boolean
}) => {
  const handleChange = (option: SingleValue<ColourOption>) => {
    if (option === null) {
      setSelectedOption(emptyOption)
      return
    }
    setSelectedOption(option)
  }

  return (
    <>
      <Select
        value={selectedOption}
        isMulti={false}
        isDisabled={isDisabled}
        onChange={handleChange}
        isClearable
        styles={{
          singleValue: base => ({
            ...base,
            padding: 5,
            borderRadius: 5,
            background: selectedOption?.color,
            color: 'white',
            display: 'flex',
          }),
        }}
        components={{ SingleValue }}
        isSearchable
        name="color"
        options={[...options]}
      />
    </>
  )
}

export default SingleSelect
