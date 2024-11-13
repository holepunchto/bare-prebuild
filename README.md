# bare-prebuild

Tool for recursively prebuilding installed native addons from source.

```
npm i [-g] bare-prebuild
```

## Usage

```js
const prebuild = require('bare-prebuild')

await prebuild('/path/to/module')
```

```console
bare-prebuild
```

## API

#### `await prebuild([base][, options])`

Options include:

```js
{
  platform: os.platform(),
  arch: os.arch(),
  simulator: false,
  sanitize,
  debug,
  define,
  verbose: false,
  stdio
}
```

## CLI

#### `bare-prebuild [flags]`

Flags include:

```console
--platform|-p <name>
--arch|-a <name>
--simulator
--debug|-d
--sanitize <name>
--define|-D <var>[:<type>]=<value>
--verbose
--help|-h
```

## License

Apache-2.0
