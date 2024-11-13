const childProcess = require('child_process')

module.exports = function spawn (command, args, opts = {}) {
  const job = childProcess.spawn(command, args, opts)

  return new Promise((resolve, reject) => {
    job.on('close', (code) => {
      if (code === null || code !== 0) return reject(new Error(`Command '${command} ${args}.join(' ')' failed`))

      resolve()
    })
  })
}
