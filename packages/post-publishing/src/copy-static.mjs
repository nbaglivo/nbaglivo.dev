import { cpSync, existsSync } from 'node:fs'
import { join } from 'node:path'

const OPTIONAL_ENTRIES = ['_headers', '_redirects', '.well-known']

export function copyStaticFiles(rootDir, outDir) {
  cpSync(join(rootDir, 'index.html'), join(outDir, 'index.html'))
  cpSync(join(rootDir, 'robots.txt'), join(outDir, 'robots.txt'))
  cpSync(join(rootDir, 'public'), join(outDir, 'public'), { recursive: true })
  for (const entry of OPTIONAL_ENTRIES) {
    if (existsSync(join(rootDir, entry))) {
      cpSync(join(rootDir, entry), join(outDir, entry), { recursive: true })
    }
  }
}
