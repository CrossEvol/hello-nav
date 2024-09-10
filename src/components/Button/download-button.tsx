import React from 'react'

const JsonDownloadButton: React.FC = () => {
  const jsonData = {
    name: 'Example',
    age: 30,
    location: 'Earth',
  }

  const downloadJson = () => {
    const fileName = 'data.json' // Name of the file
    const json = JSON.stringify(jsonData, null, 2) // Convert object to JSON string
    const blob = new Blob([json], { type: 'application/json' }) // Create a blob from the JSON string
    const url = URL.createObjectURL(blob) // Create a link to the blob

    const link = document.createElement('a')
    link.href = url
    link.download = fileName // Set the file name for the download
    link.click() // Trigger the download

    // Cleanup: remove the object URL after the download
    URL.revokeObjectURL(url)
  }

  return (
    <button onClick={downloadJson} className="rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700">
      Download JSON
    </button>
  )
}

export default JsonDownloadButton
