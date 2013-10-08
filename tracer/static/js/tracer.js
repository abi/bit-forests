$(document).ready(function () {

  var tracer = window.tracer = new Tracer()

  var socket = io.connect('http://localhost')
  socket.on('update', function (data) {
    $('#source').html(data['source'].replace(/\n/gi, '<br/>'))
    eval(data['transformed'])
    $('#trace').html(tracer.render())
  })
})

function Tracer () {
  var self = this
  self.lineTraces = {}
  self.traces = []
}

Tracer.prototype.getType_ = function (obj) {
  return Object.prototype.toString.call(obj).slice(8, -1)
}

Tracer.prototype.storeTrace_ = function (trace) {
  var self = this

  // Store a chronological list of traces
  self.traces.push(trace)

  // Store all traces associated with a line
  var line = trace.line
  if (!Object.has(self.lineTraces, line)) {
    self.lineTraces[line] = []
  }

  self.lineTraces[line].push(trace)
}

Tracer.prototype.trace = function (name, value, line) {
  var self = this

  // NOTE: JSON.stringify makes the value human-readable
  var trace = {
    'name' : name,
    'value' : JSON.stringify(value),
    'line' : line
  }

  self.storeTrace_(trace)
}

Tracer.prototype.traceCall = function (name, obj, method, line) {
  var self = this

  if (self.getType_(obj) === 'Array') {
    var trace = {
      'name' : name,
      'value' : JSON.stringify(obj),
      'line' : line
    }
    self.storeTrace_(trace)
  }
}

Tracer.prototype.render = function () {
  var self = this

  // Convert all keys to ints
  var lines = Object.keys(self.lineTraces).map(function (i) {
    return parseInt(i)
  }).sortBy()

  var html = ""
  var prevLine = 0
  for (var i = 0; i < lines.length; i++) {
    var line = lines[i]
    var traceList = self.lineTraces[line]

    var linesSkipped = parseInt(line) - prevLine

    if(linesSkipped > 1){
      for (var k = 0; k < linesSkipped; k++) {
          html += "<br/>"
      }
    }

    for (var j = 0; j < traceList.length; j++) {
      var trace = traceList[j]
      html += trace['name'] + " = " + trace['value']
      if (j != traceList.length - 1) {
        html += " | "
      }
    }
    html += "<br/>"
    prevLine = parseInt(line)
  }

  return html
}