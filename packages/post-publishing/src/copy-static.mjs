import { cpSync } from 'node:fs'
import { join } from 'node:path'

export function copyStaticFiles(rootDir, outDir) {
  cpSync(join(rootDir, 'index.html'), join(outDir, 'index.html'))
  cpSync(join(rootDir, 'robots.txt'), join(outDir, 'robots.txt'))
  cpSync(join(rootDir, 'public'), join(outDir, 'public'), { recursive: true })
}
