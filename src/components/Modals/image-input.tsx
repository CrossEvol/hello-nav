import React, { useState } from 'react'
import UploadZone from './upload-zone'

const ImageInput = ({ value: imageUrl, setValue: setImageUrl }: PropsWithState<string>) => {
  const [error, setError] = useState<string | null>(null)
  const [imageBase64Data, setImageBase64Data] = useState('')

  const isValidImageUrl = async (url: string): Promise<boolean> => {
    try {
      const response = await fetch(url, { method: 'HEAD' })
      const contentType = response.headers.get('Content-Type')
      const contentLength = response.headers.get('Content-Length')

      if (!contentType?.startsWith('image/')) {
        return false
      }

      if (contentLength && Number(contentLength) > 500_000) {
        console.error('Image data is larger than 500,000 bytes.')
        return false
      }

      return true
    } catch (error) {
      console.error(error)
      return false
    }
  }

  const handleImageDownload = async (url: string) => {
    try {
      const response = await fetch(url)
      const blob = await response.blob()
      const reader = new FileReader()

      reader.onloadend = () => {
        const base64String = reader.result as string
        setImageBase64Data(base64String)
        // console.log('Base64:', base64String)
      }

      reader.readAsDataURL(blob)
    } catch (error) {
      console.error(error)
      setError('Failed to download the image')
    }
  }

  const handleInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setImageUrl(value)

    const validImage = await isValidImageUrl(value)

    if (validImage) {
      setError(null)
      handleImageDownload(value)
    } else {
      setError('Invalid image URL')
    }
  }

  return (
    <div className="">
      <input
        type="text"
        id="preview-url"
        value={imageUrl}
        onChange={handleInputChange}
        placeholder="Enter image URL"
        className="w-full rounded border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      {error && <p className="text-red-500">{error}</p>}
      <UploadZone
        imageData={imageBase64Data}
        setImageData={(str: string) => {
          setImageBase64Data(str)
          if (str.length === 0) {
            setImageUrl('')
          }
          setImageUrl(str)
        }}
      />
    </div>
  )
}

export default ImageInput
