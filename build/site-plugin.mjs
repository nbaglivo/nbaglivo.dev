import { execSync } from 'node:child_process'
import { rmSync, readdirSync } from 'node:fs'
import { join } from 'node:path'
import { copyStaticFiles } from './copy-static.mjs'
import { renderWritingPages } from './render-writing-pages.mjs'

export function staticSitePlugin({ rootDir, outDir }) {
  return {
    name: 'static-site',
    apply: 'build',
    buildStart() {
      // None of these are imported by the noop entry, so `vite build --watch`
      // wouldn't otherwise know to rebuild when they change.
      this.addWatchFile(join(rootDir, 'index.html'))
      this.addWatchFile(join(rootDir, 'style.css'))

      const writingMdDir = join(rootDir, 'writing-md')
      for (const file of readdirSync(writingMdDir)) {
        if (file.endsWith('.md')) this.addWatchFile(join(writingMdDir, file))
      }

      const watchDir = (dir) => {
        for (const entry of readdirSync(dir, { withFileTypes: true })) {
          const full = join(dir, entry.name)
          if (entry.isDirectory()) watchDir(full)
          else this.addWatchFile(full)
        }
      }
      watchDir(join(rootDir, 'public'))
    },
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
