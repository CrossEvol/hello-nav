import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import 'zx/globals'
import { $ } from 'zx'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const extensionDir = resolve(__dirname, '../src/extension').replace(/\\/g, '/')
const distDir = resolve(__dirname, '../dist').replace(/\\/g, '/')
const outputDir = resolve(__dirname, '../extension').replace(/\\/g, '/')

await $`mkdir -p ${outputDir}`
await $`rm -rf ${outputDir}/*`

// Check if the zip file exists before removing it
await $`pwsh.exe -Command "if (Test-Path -Path './hello-nav-ext.zip') { Remove-Item -Path './hello-nav-ext.zip' -Force }"`

await $`cp -r ${distDir}/* ${outputDir}`
await $`cp -rf ${extensionDir}/* ${outputDir}`

// await $`zip -r hello-nav-ext.zip ./extension`
await $`pwsh.exe -Command Compress-Archive -Path ${outputDir}/ -DestinationPath ./hello-nav-ext.zip`

console.log('🧩 Extension generation success!')
