import fs from 'fs'
import { writeFile } from 'node:fs'
import path, { dirname, join } from 'path'
import { fileURLToPath } from 'url'

const PATH_REG = /^.*\d{2}-(.*)\.ts$/

async function getModules(): Promise<CateItem[]> {
  const context: Record<string, AppItem[]> = await loadModules('module')

  return Object.keys(context).map((filePath: string) => ({
    title: filePath.replace(PATH_REG, (_, $1) => $1.replace('_', '/')),
    children: context[filePath].map(
      (item, index) =>
        ({
          ...item,
          // id: index + 1,
          // order: index + 1,
          // category: filePath.replace(PATH_REG, (_, $1) => $1.replace('_', '/')),
          icon: getIconUrl(item.icon),
        }) satisfies AppItem,
    ),
  }))
}

async function loadModules(dir: string): Promise<Record<string, AppItem[]>> {
  const modules: Record<string, AppItem[]> = {}

  console.log(`traverse the file system [${dir}]...`)
  const files = fs.readdirSync(dir)

  for (const file of files) {
    if (file.endsWith('.ts')) {
      console.log(`read the file ${file}`)
      const filePath = path.join('../', dir, file)
      // const module = await import(filePath.replaceAll('.ts', ''))
      const module = await import(
        filePath.replaceAll('.ts', '').replaceAll('\\', '/')
      )
      modules[filePath] = module.default // assuming the default export is an AppItem array
    }
  }

  return modules
}

function getIconUrl(filename: string): string {
  if (typeof window !== 'undefined') {
    return new URL(`../public/icons/${filename}`, import.meta.url).href
  } else {
    return `/icons/${filename}`
  }
}

const setUpModules = async () => await getModules()

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
