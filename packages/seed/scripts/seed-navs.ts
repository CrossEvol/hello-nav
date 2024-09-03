import { writeFile } from 'fs'
import framework from '../module/01-framework'
import ui_design from '../module/02-ui_design'
import html_css from '../module/03-html_css'
import library from '../module/04-library'
import runtime_server from '../module/05-runtime_server'
import other from '../module/06-other'
import website from '../module/07-website'

import { dirname, join } from 'path'
import { fileURLToPath } from 'url'

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
      } else {
        console.log('seed navs finished.')
      }
    },
  )
}

main()
