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

  let pkg
  try {
    pkg = require(path.join(base, 'package.json'))
  } catch {
    return
  }

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

  let modules
  try {
    modules = await fs.openDir(path.join(base, 'node_modules'))
  } catch {
    return
  }

  for await (const entry of modules) {
    await prebuild(path.join(base, 'node_modules', entry.name), opts)
  }
}
