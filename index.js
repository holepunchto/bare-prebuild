const path = require('path')
const make = require('bare-make')
const fs = require('./lib/fs')
const run = require('./lib/run')

module.exports = async function prebuild(base = '.', opts = {}) {
  if (typeof base === 'object' && base !== null) {
    opts = base
    base = '.'
  }

  base = path.resolve(base)

  const pkg = JSON.parse(await fs.readFile(path.join(base, 'package.json')))

  if (typeof pkg !== 'object' || pkg === null) return

  if (pkg.addon) {
    const cwd = await fs.tempDir()

    await fs.cp(base, cwd)

    try {
      await run('npm', ['install'], { cwd })

      await make.generate({ ...opts, cwd })
      await make.build({ ...opts, cwd })
      await make.install({
        ...opts,
        cwd,
        prefix: path.join(base, 'prebuilds')
      })
    } finally {
      await fs.rm(cwd)
    }
  }

  const modules = await fs.openDir(path.join(base, 'node_modules'))

  if (modules) {
    for await (const entry of modules) {
      await prebuild(path.join(base, 'node_modules', entry.name), opts)
    }
  }
}
