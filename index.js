module.exports = disconnect

var Stream = require('stream').Stream
  , cleanup = find_cleanup()

function disconnect(source) {
  var candidates = source.listeners('close').slice()
    , found = false
    , as_string

  for(var i = 0, len = candidates.length; i < len; ++i) {
    as_string = candidates[i].toString()
    if(as_string === cleanup) {
      candidates[i]()
      found = true
    }
  }
  return found
}

function find_cleanup() {
  var lhs = new Stream
    , rhs = new Stream

  lhs.pipe(rhs)

  var cleanup = rhs.listeners('close')[0]
  
  cleanup()
  return cleanup.toString()
}
