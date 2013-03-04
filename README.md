# disconnect-stream

given a source stream, disconnect it from all of its
downstream listeners (without closing the source or dest
streams!)

```javascript
var through = require('through')
  , disconnect = require('disconnect-stream')
  , source = through()
  , dest = through()

source.pipe(dest)

dest.on('data', function() {
  console.log('got data')
})

source.write('data') // "got data"

disconnect(source) // returns `true` since there were dest pipes

source.write('data')

source.readable && source.writable // true
dest.readable && dest.writable // true

```

## api

#### disconnect(source stream) -> Boolean

non-destructively disconnect all downstream destinations of `source`.
returns `true` if any destinations were disconnected, or `false` if there
were no downstream listeners.

## license

MIT
