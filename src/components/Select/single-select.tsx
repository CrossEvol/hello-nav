import Select, { components, type SingleValue, type SingleValueProps } from 'react-select'
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
}: {
  selectedOption: ColourOption
  setSelectedOption: (option: ColourOption) => void
  options: ColourOption[]
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
