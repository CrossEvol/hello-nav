import React from 'react'

const TagsInput = ({ tags, setTags }: { tags: string[]; setTags: (value: string[]) => void }) => {
  const [inputValue, setInputValue] = React.useState<string>('')

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && inputValue.trim()) {
      e.preventDefault()
      const newTags = [...tags, inputValue.trim()]
      setTags(newTags)
      setInputValue('')
    }
  }

  const removeTag = (index: number) => {
    const newTags = tags.filter((_, i) => i !== index)
    setTags(newTags)
  }

  return (
    <div className="flex flex-wrap items-center rounded-md border p-0.5">
      {tags.map((tag, index) => (
        <div key={index} className="my-2 mr-2 flex items-center rounded-full bg-gray-200 px-2 text-gray-700">
          <span>{tag}</span>
          <button type="button" onClick={() => removeTag(index)} className="ml-2 text-red-500 hover:text-red-700">
            &times;
          </button>
        </div>
      ))}
      <input
        type="text"
        value={inputValue}
        onChange={e => setInputValue(e.target.value)}
        onKeyDown={handleKeyDown}
        className="my-2 grow focus:outline-none"
        placeholder="Add a tag..."
      />
    </div>
  )
}

export default TagsInput
