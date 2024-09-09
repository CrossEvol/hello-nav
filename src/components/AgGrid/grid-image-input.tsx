import React, { useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { MdClear, MdDriveFolderUpload } from 'react-icons/md'

export type UploadFileResponse = {
  filename: string
  img_url: string
}

type UploadResponseCallback = (resp?: Partial<UploadFileResponse>) => void

const GridImageInput = ({
  setImageSrc,
  onSuccess,
  onFailure,
}: {
  imageSrc: string
  setImageSrc: (value: string) => void
  onSuccess?: UploadResponseCallback
  onFailure?: (error: unknown) => void
}) => {
  const [_error, setError] = useState<string | null>(null)
  const [urlText, setUrlText] = React.useState('')
  const [file, setFile] = React.useState<(File & { preview: string }) | null>(null)

  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      'image/jpeg': ['.jpeg', '.jpg'],
      'image/png': ['.png'],
      'image/gif': ['.gif'],
      'image/webp': ['.webp'],
      'image/bmp': ['.bmp'],
      'image/tiff': ['.tiff', '.tif'],
      'image/svg+xml': ['.svg'],
      'image/x-icon': ['.ico'],
      'image/heic': ['.heic'],
      'image/heif': ['.heif'],
    },
    maxSize: 500_000,
    onDropAccepted(files, event) {
      console.log(files)
    },
    onDrop: (acceptedFiles: File[]) => {
      setFile(
        acceptedFiles.map((file: File) =>
          Object.assign(file, {
            preview: URL.createObjectURL(file),
          }),
        )[0],
      )
    },
    onDropRejected(fileRejections, event) {
      console.error(JSON.stringify(fileRejections[0]?.errors))
    },
  })

  React.useEffect(() => {
    if (file) {
      // Revoke the object URL to free memory
      URL.revokeObjectURL(file.preview)

      // Create a FileReader to convert the file to base64
      const reader = new FileReader()

      // When the reader is done loading the file
      reader.onloadend = () => {
        // The result is a base64 encoded string
        const base64String = reader.result as string

        setImageSrc(base64String)
        setUrlText(file.preview)

        // Log the base64 string to the console
        // console.log(base64String)
      }

      // Read the file as a Data URL (which includes the base64 encoding)
      reader.readAsDataURL(file)
    }

    return () => {}
  }, [file, setImageSrc])

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
        setImageSrc(base64String)
      }

      reader.readAsDataURL(blob)
    } catch (error) {
      console.error(error)
      setError('Failed to download the image')
    }
  }

  const handleInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setUrlText(value)

    const validImage = await isValidImageUrl(value)

    if (validImage) {
      setError(null)
      handleImageDownload(value)
    } else {
      setError('Invalid image URL')
    }
  }

  return (
    <section>
      <div className="flex w-56 justify-between p-2">
        <div {...getRootProps({ className: 'dropzone space-x-0.5' })}>
          <input {...getInputProps()} />
          <input
            type="text"
            id="preview-url"
            onClick={e => {
              e.preventDefault()
              e.stopPropagation()
            }}
            value={urlText}
            onChange={handleInputChange}
            placeholder="Enter image URL"
            className="w-full rounded border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="button"
            className="focus:shadow-outline rounded bg-slate-50 p-2 font-bold text-slate-600 hover:bg-blue-500 hover:text-white focus:outline-none"
          >
            <div className="flex min-w-10 flex-row items-center justify-center">
              <MdDriveFolderUpload size={'16'} />
            </div>
          </button>
          <button
            type="button"
            onClick={e => {
              e.stopPropagation()
              setImageSrc('')
              setUrlText('')
              setFile(null)
            }}
            className="focus:shadow-outline rounded bg-slate-50 p-2 font-bold text-slate-600 hover:bg-red-400 hover:text-white focus:outline-none"
          >
            <div className="flex min-w-10 flex-row items-center justify-center">
              <MdClear size={'16'} />
            </div>
          </button>
        </div>
      </div>
    </section>
  )
}

export default GridImageInput
