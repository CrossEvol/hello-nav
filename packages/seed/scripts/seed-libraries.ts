import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import { setUpModules } from '../utils/modules-util'
import { writeFile } from 'node:fs'

// Convert import.meta.url to __dirname
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const main = async () => {
  const libraries = await setUpModules()

  writeFile(
    join(__dirname, '..', '..', '..', 'servers', 'libraries.json'),
    JSON.stringify({ navs: libraries }, null, ' '),
    { encoding: 'utf-8' },
    (err) => {
      if (err) {
        console.error(err)
      } else {
        console.log('=========================>')
        console.log('seed libraries finished.')
      }
    },
  )
}

main()
