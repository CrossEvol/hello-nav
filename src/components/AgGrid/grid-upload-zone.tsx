import React, { useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { MdDriveFolderUpload } from 'react-icons/md'

export type UploadFileResponse = {
  filename: string
  img_url: string
}

type UploadResponseCallback = (resp?: Partial<UploadFileResponse>) => void

const GridUploadZone = ({
  imageData,
  setImageData,
  onSuccess,
  onFailure,
}: {
  imageData: string
  setImageData: (value: string) => void
  onSuccess?: UploadResponseCallback
  onFailure?: (error: unknown) => void
}) => {
  const [imgSrc, setImgSrc] = useState('')
  const [file, setFile] = useState<(File & { preview: string }) | null>(null)

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
      setImgSrc(file.preview)
    } else {
      setImgSrc('')
    }

    return () => {}
  }, [file])

  React.useEffect(() => {
    setImgSrc(imageData)
    return () => {}
  }, [imageData])

  return (
    <section>
      <div className="flex w-56 justify-between py-2">
        <div {...getRootProps({ className: 'dropzone' })}>
          <input {...getInputProps()} />
          <input
            type="text"
            id="preview-url"
            onClick={e => {
              e.preventDefault()
              e.stopPropagation()
            }}
            // value={imageUrl}
            // onChange={handleInputChange}
            placeholder="Enter image URL"
            className="w-full rounded border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="button"
            className="focus:shadow-outline rounded bg-blue-500 p-2 font-bold text-white hover:bg-blue-700 focus:outline-none"
          >
            <div className="flex min-w-20 flex-row items-center justify-center space-x-2">
              <MdDriveFolderUpload size={'16'} />
              <div className="font-thin">Upload</div>
            </div>
          </button>
        </div>
      </div>
      {imgSrc.length > 0 ? (
        <div className="relative">
          <img
            src={imgSrc}
            className="block h-auto w-[36rem] border-2 border-dotted p-1"
            onLoad={() => {
              if (file) {
                // Revoke the object URL to free memory
                URL.revokeObjectURL(file.preview)

                // Create a FileReader to convert the file to base64
                const reader = new FileReader()

                // When the reader is done loading the file
                reader.onloadend = () => {
                  // The result is a base64 encoded string
                  const base64String = reader.result as string

                  setImageData(base64String)

                  // Log the base64 string to the console
                  // console.log(base64String)
                }

                // Read the file as a Data URL (which includes the base64 encoding)
                reader.readAsDataURL(file)
              }
            }}
            alt="Uploaded preview"
          />
          {/* Buzz icon for clearing */}
          <button
            onClick={() => {
              setFile(null)
              setImageData('')
            }}
            type="button"
            className="absolute -right-2 -top-2 size-5 rounded-2xl bg-red-500 text-white hover:bg-red-600"
            aria-label="Clear image"
          >
            ✖
          </button>
        </div>
      ) : null}
    </section>
  )
}

export default GridUploadZone
