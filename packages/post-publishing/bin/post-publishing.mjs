#!/usr/bin/env node
import { spawn } from 'node:child_process'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { parseArgs } from 'node:util'
import { buildSite } from '../src/build-site.mjs'

const rootDir = process.cwd()
const { positionals, values } = parseArgs({
  allowPositionals: true,
  options: { port: { type: 'string', default: '8788' } },
})
const [command] = positionals

function readSiteConfig() {
  const { site } = JSON.parse(readFileSync(join(rootDir, 'package.json'), 'utf-8'))
  if (!site?.url || !site?.name || !site?.author) {
    throw new Error(`${rootDir}/package.json: missing "site.url", "site.name" and/or "site.author"`)
  }
  return site
}

function build() {
  const site = readSiteConfig()
  buildSite({ rootDir, siteUrl: site.url, siteName: site.name, author: site.author })
}

function dev() {
  const watchPaths = ['index.html', 'style.css', 'writing-md', 'public', join(import.meta.dirname, '..', 'src')]
  const watchArgs = watchPaths.map((path) => `--watch-path=${path}`)
  const children = [
    spawn(process.execPath, [...watchArgs, import.meta.filename, 'build'], { stdio: 'inherit' }),
    spawn('npx', ['wrangler', 'pages', 'dev', 'dist', '--live-reload', '--port', values.port], { stdio: 'inherit' }),
  ]
  process.on('SIGINT', () => children.forEach((child) => child.kill('SIGINT')))
}

const commands = { build, dev }

if (!commands[command]) {
  console.error('Usage: post-publishing <build|dev> [--port <port>]')
  process.exit(1)
}

commands[command]()
