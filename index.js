const path = require('path')
const make = require('bare-make')
const fs = require('./lib/fs')
const spawn = require('./lib/spawn')

module.exports = async function prebuild (base = '.', opts = {}) {
  if (typeof base === 'object' && base !== null) {
    opts = base
    base = '.'
  }

  base = path.resolve(base)

  if (await fs.exists(path.join(base, 'CMakeLists.txt'))) {
    const cwd = await fs.tempDir()

    await fs.cp(base, cwd)

    try {
      await spawn('npm', ['install'], { cwd })

      await make.generate({ ...opts, cwd })
      await make.build({ ...opts, cwd })
      await make.install({ ...opts, cwd, prefix: path.join(base, 'prebuilds') })
    } finally {
      await fs.rm(cwd)
    }
  }

  const modules = await fs.openDir(path.join(base, 'node_modules'))

  if (modules) {
    for await (const entry of modules) {
      await prebuild(path.join(entry.path, entry.name), opts)
    }
  }
}
