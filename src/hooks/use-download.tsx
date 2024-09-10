export const useDownload = () => {
  const downloadJson = (jsonData: Record<string, unknown>) => {
    const fileName = 'hello-nav.json' // Name of the file
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

  return { downloadJson }
}
