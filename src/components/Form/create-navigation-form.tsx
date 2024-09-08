import { Controller, type SubmitHandler, useForm } from 'react-hook-form'
import { useBearStore } from '../../store'
import ImageInput from '../Input/image-input'
import TagsInput from '../Input/tags-input'
import SingleSelect from '../Select/single-select'
import RCSwitchButton from '../Switch/swtich-button'

export type Navigation = {
  id: number
  name: string
  homepage: string
  repository?: string
  order?: number
  icon: string
  keywords?: string[]
  darkInvert?: true
  lessRadius?: true
  favorite?: boolean
  hidden?: boolean
  first?: boolean
  final?: boolean
  categoryID?: number
  favoriteOrder: number
}

const CreateNavigationForm = ({ onSubmitCallback }: { onSubmitCallback?: () => void }) => {
  const navigationOrderID = useBearStore(state => state.navigationOrderID)
  const categoryOptions = useBearStore(state => state.getCategoryOptions())
  const addNavigation = useBearStore(state => state.addNavigation)
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<Navigation>({
    defaultValues: {
      name: '',
      homepage: '',
      repository: '',
      order: navigationOrderID,
      icon: '',
      keywords: [],
      darkInvert: true,
      lessRadius: true,
      favorite: false,
      hidden: false,
      first: false,
      final: false,
      favoriteOrder: 0,
    },
  })

  const onSubmit: SubmitHandler<Navigation> = async data => {
    console.log(data)
    addNavigation(data)
    if (onSubmitCallback) {
      onSubmitCallback()
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="mx-auto max-w-lg space-y-4 p-4">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
          Name
        </label>
        <input
          id="name"
          type="text"
          {...register('name', { required: true })}
          className="w-full rounded border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {errors.name && <span className="text-red-500">Name is required</span>}
      </div>

      <div>
        <label htmlFor="homepage" className="block text-sm font-medium text-gray-700">
          Homepage
        </label>
        <input
          id="homepage"
          type="text"
          {...register('homepage', { required: true })}
          className="w-full rounded border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {errors.homepage && <span className="text-red-500">Homepage is required</span>}
      </div>

      <div>
        <label htmlFor="repository" className="block text-sm font-medium text-gray-700">
          Repository
        </label>
        <input
          id="repository"
          type="text"
          {...register('repository', { required: false })}
          className="w-full rounded border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div>
        <label htmlFor="order" className="block text-sm font-medium text-gray-700">
          Order
        </label>
        <input
          id="order"
          type="number"
          disabled
          {...register('order', { required: true })}
          className="w-full rounded border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div>
        <label htmlFor="order" className="block text-sm font-medium text-gray-700">
          Preview URL
        </label>
        <Controller
          name="icon"
          control={control}
          render={({ field }) => <ImageInput value={field.value} setValue={field.onChange} />}
        />
        {errors.icon && <span className="text-red-500">Icon is required</span>}
      </div>

      <div>
        <label htmlFor="categoryID" className="block text-sm font-medium text-gray-700">
          Category
        </label>
        <Controller
          name="categoryID"
          control={control}
          render={({ field }) => (
            <SingleSelect
              selectedOption={categoryOptions.find(item => item.value === field.value?.toString())!}
              setSelectedOption={option => field.onChange(Number(option.value))}
              options={categoryOptions}
            />
          )}
        />
      </div>
      <div>
        <label htmlFor="repository" className="block text-sm font-medium text-gray-700">
          Keywords
        </label>
        <Controller
          name="keywords"
          control={control}
          render={({ field }) => <TagsInput tags={field.value!} setTags={field.onChange} />}
        />
      </div>

      <div className="flex w-20 flex-col items-start space-y-1">
        <label htmlFor="darkInvert" className="inline-flex items-center">
          <Controller
            name="darkInvert"
            control={control}
            render={({ field }) => <RCSwitchButton checked={field.value} setChecked={field.onChange} />}
          />
          <span className="ml-2 text-sm text-gray-700">DarkInvert</span>
        </label>
        <label htmlFor="lessRadius" className="inline-flex items-center">
          <Controller
            name="lessRadius"
            control={control}
            render={({ field }) => <RCSwitchButton checked={field.value} setChecked={field.onChange} />}
          />
          <span className="ml-2 text-sm text-gray-700">LessRadius</span>
        </label>
        <label htmlFor="favorite" className="inline-flex items-center">
          <Controller
            name="favorite"
            control={control}
            render={({ field }) => <RCSwitchButton checked={field.value} setChecked={field.onChange} />}
          />
          <span className="ml-2 text-sm text-gray-700">Favorite</span>
        </label>
        <label htmlFor="hidden" className="inline-flex items-center">
          <Controller
            name="hidden"
            control={control}
            render={({ field }) => <RCSwitchButton checked={field.value} setChecked={field.onChange} />}
          />
          <span className="ml-2 text-sm text-gray-700">Hidden</span>
        </label>
        <label htmlFor="first" className="inline-flex items-center">
          <Controller
            name="first"
            control={control}
            render={({ field }) => <RCSwitchButton checked={field.value} setChecked={field.onChange} />}
          />
          <span className="ml-2 text-sm text-gray-700">First</span>
        </label>
        <label htmlFor="final" className="inline-flex items-center">
          <Controller
            name="final"
            control={control}
            render={({ field }) => <RCSwitchButton checked={field.value} setChecked={field.onChange} />}
          />
          <span className="ml-2 text-sm text-gray-700">Final</span>
        </label>
      </div>

      <div className="flex space-x-4">
        <button
          type="submit"
          className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700"
        >
          Submit
        </button>
      </div>
    </form>
  )
}

export default CreateNavigationForm
