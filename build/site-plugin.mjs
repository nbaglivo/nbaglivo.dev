import { execSync } from 'node:child_process'
import { rmSync } from 'node:fs'
import { join } from 'node:path'
import { copyStaticFiles } from './copy-static.mjs'
import { renderWritingPages } from './render-writing-pages.mjs'

export function staticSitePlugin({ rootDir, outDir }) {
  return {
    name: 'static-site',
    apply: 'build',
    closeBundle() {
      rmSync(join(outDir, 'assets'), { recursive: true, force: true })
      execSync(`npx @tailwindcss/cli -i style.css -o ${join(outDir, 'style.css')} --minify`, {
        cwd: rootDir,
        stdio: 'inherit',
      })
      copyStaticFiles(rootDir, outDir)
      renderWritingPages(join(rootDir, 'writing-md'), join(outDir, 'writing'))
    },
  }
}
