import React, { useState } from 'react'

const ImageCompressInput: React.FC = () => {
  const [base64Image, setBase64Image] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleImageDownload = async (url: string) => {
    try {
      const response = await fetch(url)
      if (!response.ok) throw new Error('Image could not be fetched')
      const blob = await response.blob()

      const compressedBase64 = await compressAndConvertToBase64(blob)
      console.log(`size of compressedBase64 is :`, compressedBase64.length)
      setBase64Image(compressedBase64)
    } catch (err: any) {
      setError(err.message)
    }
  }

  const compressAndConvertToBase64 = (blob: Blob): Promise<string> => {
    return new Promise((resolve, reject) => {
      const img = new Image()
      const url = URL.createObjectURL(blob)

      img.onload = () => {
        const canvas = document.createElement('canvas')
        let width = img.width
        let height = img.height
        const ctx = canvas.getContext('2d')

        // Resize to fit within 10KB
        console.log(`blob size is ${blob.size}`)
        const resizeFactor = Math.sqrt(blob.size / 1000)
        console.log(`resizeFactor is ${resizeFactor}`)
        width = width / resizeFactor
        height = height / resizeFactor

        canvas.width = width
        canvas.height = height

        ctx?.drawImage(img, 0, 0, width, height)

        // Convert to base64 with compression
        canvas.toBlob(
          compressedBlob => {
            if (compressedBlob) {
              const reader = new FileReader()
              reader.onloadend = () => {
                resolve(reader.result as string)
              }
              reader.readAsDataURL(compressedBlob)
            } else {
              reject('Compression failed')
            }
          },
          'image/jpeg',
          1,
        ) // Adjust quality (0-1) as needed
      }

      img.onerror = () => reject('Image load failed')
      img.src = url
    })
  }

  return (
    <div className="flex flex-col items-center justify-center space-y-4 p-4">
      <input
        type="text"
        className="w-full rounded-lg border border-gray-300 p-2"
        placeholder="Paste image URL here"
        onBlur={e => handleImageDownload(e.target.value)}
      />

      {error && <p className="text-red-500">{error}</p>}

      {base64Image && <img src={base64Image} alt="Compressed" className="mt-4 h-auto w-48" />}
    </div>
  )
}

export default ImageCompressInput
