import { writeFile } from 'fs'
import framework from '../src/module/01-framework'
import ui_design from '../src/module/02-ui_design'
import html_css from '../src/module/03-html_css'
import library from '../src/module/04-library'
import runtime_server from '../src/module/05-runtime_server'
import other from '../src/module/06-other'
import website from '../src/module/07-website'

import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

// Convert import.meta.url to __dirname
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const navs = {
  framework,
  ui_design,
  html_css,
  library,
  runtime_server,
  other,
  website,
}

const main = () => {
  writeFile(
    join(__dirname, '..', '..', '..', 'servers', 'navs.json'),
    JSON.stringify(navs, null, ' '),
    { encoding: 'utf-8' },
    (err) => {
      if (err) {
        console.error(err)
        return
      }
      console.log('finished.')
    },
  )
}

main()
