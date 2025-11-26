const path = require('path')
const fs = require('fs')
const os = require('os')

exports.exists = async function exists(name) {
  return new Promise((resolve) => {
    fs.access(name, (err) => {
      resolve(err === null)
    })
  })
}

exports.rm = async function rm(name) {
  return new Promise((resolve, reject) => {
    fs.rm(name, { force: true, recursive: true }, (err) => {
      err ? reject(err) : resolve()
    })
  })
}

exports.cp = async function cp(src, dest) {
  return new Promise((resolve, reject) => {
    fs.cp(src, dest, { force: true, recursive: true, filter }, (err) => {
      err ? reject(err) : resolve()
    })
  })

  function filter(src, dest) {
    switch (path.basename(src)) {
      case 'node_modules':
      case 'build':
      case 'prebuilds':
        return false
    }

    return true
  }
}

exports.openDir = async function openDir(name) {
  return new Promise((resolve, reject) => {
    fs.opendir(name, (err, dir) => {
      err ? reject(err) : resolve(dir)
    })
  })
}

exports.tempDir = async function tempDir() {
  const name = Math.random().toString(16).slice(2)

  return new Promise((resolve, reject) => {
    fs.realpath(os.tmpdir(), (err, dir) => {
      if (err) return reject(err)

      dir = path.join(dir, `bare-prebuild-${name}`)

      fs.mkdir(dir, { recursive: true }, (err) => {
        err ? reject(err) : resolve(dir)
      })
    })
  })
}
