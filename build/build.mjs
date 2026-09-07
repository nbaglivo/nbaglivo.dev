import { execSync } from 'node:child_process'
import { mkdirSync, rmSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { copyStaticFiles } from './copy-static.mjs'
import { renderWritingPages } from './render-writing-pages.mjs'

const rootDir = dirname(dirname(fileURLToPath(import.meta.url)))
const outDir = join(rootDir, 'dist')

rmSync(outDir, { recursive: true, force: true })
mkdirSync(outDir, { recursive: true })
execSync(`npx @tailwindcss/cli -i style.css -o ${join(outDir, 'style.css')} --minify`, {
  cwd: rootDir,
  stdio: 'inherit',
})
copyStaticFiles(rootDir, outDir)
renderWritingPages(join(rootDir, 'writing-md'), join(outDir, 'writing'))
