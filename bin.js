#!/usr/bin/env node
const process = require('process')
const { command, flag, arg, summary } = require('paparam')
const pkg = require('./package')
const prebuild = require('.')

const cmd = command(
  pkg.name,
  summary(pkg.description),
  arg('<base>'),
  flag('--version|-v', 'Print the current version'),
  flag('--platform|-p <name>', 'The operating system platform to build for'),
  flag('--arch|-a <name>', 'The operating system architecture to build for'),
  flag('--simulator', 'Build for a simulator'),
  flag('--environment|-e <name>', 'The environment to build for'),
  flag('--debug|-d', 'Configure a debug build'),
  flag('--sanitize <name>', 'Enable a sanitizer'),
  flag(
    '--define|-D <var>[:<type>]=<value>',
    'Create a build variable cache entry'
  ).multiple(),
  flag('--verbose', 'Enable verbose output'),
  async (cmd) => {
    const {
      version,
      platform,
      arch,
      simulator,
      environment,
      debug,
      sanitize,
      define,
      verbose
    } = cmd.flags
    const { base = '.' } = cmd.args

    if (version) return console.log(`v${pkg.version}`)

    try {
      await prebuild(base, {
        platform,
        arch,
        simulator,
        environment,
        debug,
        sanitize,
        define,
        verbose,
        stdio: 'inherit'
      })
    } catch {
      process.exitCode = 1
    }
  }
)

cmd.parse()
