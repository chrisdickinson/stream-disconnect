var disconnect = require('./index')
  , through = require('through')
  , test = require('tape')

test('cleans up without closing either side', function(assert) {
  var lhs = through()
    , rhs = through()
    , disconnected = false

  lhs.pipe(rhs)

  assert.ok(lhs.readable && lhs.writable, 'lhs is r/w')
  assert.ok(rhs.readable && rhs.writable, 'rhs is r/w')

  rhs.on('data', function(data) {
    assert.ok(!disconnected, 'rhs should only get data before disconnect')
  })
  lhs.write(Math.random())
  disconnect(lhs)
  disconnected = true

  assert.ok(lhs.readable && lhs.writable, 'lhs is r/w')
  assert.ok(rhs.readable && rhs.writable, 'rhs is r/w')
  lhs.write(Math.random())

  assert.end()
})

test('cleans up multiple pipes', function(assert) {
  var lhs = through()
    , rhs = [through(), through(), through()]
    , disconnected = false

  for(var i = 0, len = rhs.length; i < len; ++i) {
    lhs.pipe(rhs[i])
  }

  assert.ok(lhs.readable && lhs.writable, 'lhs is r/w')

  for(var i = 0, len = rhs.length; i < len; ++i) {
    assert.ok(rhs[i].readable && rhs[i].writable, 'rhs['+i+'] is r/w')
    rhs[i].on('data', function(idx) {
      return function(data) {
        assert.ok(!disconnected, 'rhs['+idx+'] should only get data before disconnect') 
      }
    }(i))
  }

  lhs.write(Math.random())

  assert.equal(disconnect(lhs), true, 'disconnect on active source should return true')
  assert.equal(disconnect(lhs), false, 'disconnect on inactive source should return false')
  disconnected = true

  assert.ok(lhs.readable && lhs.writable, 'lhs is r/w')
  for(var i = 0, len = rhs.length; i < len; ++i) {
    assert.ok(rhs[i].readable && rhs[i].writable, 'rhs['+i+'] is r/w')
  }
  lhs.write(Math.random())

  disconnected = false
  for(var i = 0, len = rhs.length; i < len; ++i) {
    lhs.pipe(rhs[i])
  }
  lhs.write(Math.random())


  assert.end()
})

