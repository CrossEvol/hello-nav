import { zodResolver } from '@hookform/resolvers/zod'
import React from 'react'
import { Controller, type SubmitHandler, useForm } from 'react-hook-form'
import { z } from 'zod'
import { useBearStore } from '../../store'
import ImageInput from '../Input/image-input'

export type Category = {
  title: string
  order: number
  icon: string
}

// Define Zod schema based on the Category type
const categorySchema = z.object({
  title: z.string().min(1, 'Title is required'),
  order: z.number(),
  icon: z.string(),
})

const CreateCategoryForm = ({
  closeAction,
  onSubmitCallback,
}: {
  closeAction: React.ReactNode
  onSubmitCallback?: () => void
}) => {
  const categoryID = useBearStore(state => state.categoryOrderID)
  const addCategory = useBearStore(state => state.addCategory)
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<Category>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      title: '',
      order: categoryID,
      icon: '',
    },
  })

  const onSubmit: SubmitHandler<Category> = async data => {
    console.log(data)
    addCategory(data)
    if (onSubmitCallback) {
      onSubmitCallback()
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="mx-auto max-w-lg p-4">
      <div className="mb-4">
        <label htmlFor="title" className="block text-sm font-medium text-gray-700">
          Title
        </label>
        <input
          {...register('title')}
          id="title"
          className={`w-full rounded border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            errors.title ? 'border-red-500' : ''
          }`}
        />
        {errors.title && <p className="text-sm text-red-500">{errors.title.message}</p>}
      </div>

      <div className="mb-4">
        <label htmlFor="order" className="block text-sm font-medium text-gray-700">
          Order
        </label>
        <input
          type="number"
          disabled
          {...register('order', { valueAsNumber: true })}
          id="order"
          className="w-full rounded border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="mb-4">
        <label htmlFor="order" className="block text-sm font-medium text-gray-700">
          Preview URL
        </label>
        <Controller
          name="icon"
          control={control}
          render={({ field }) => <ImageInput value={field.value} setValue={field.onChange} />}
        />
      </div>
      <div className="space-x-2">
        <button
          type="submit"
          className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          Submit
        </button>
        {closeAction}
      </div>
    </form>
  )
}

export default CreateCategoryForm
