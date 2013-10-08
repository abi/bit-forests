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
}

Tracer.prototype.getType_ = function (obj) {
  return Object.prototype.toString.call(obj).slice(8, -1)
}

Tracer.prototype.trace = function (name, value, line) {
  var self = this

  if (!Object.has(self.lineTraces, line)) {
    self.lineTraces[line] = []
  }

  // Note: JSON.stringify makes the value human-readable
  self.lineTraces[line].push({
    'name' : name,
    'value' : JSON.stringify(value),
    'line' : line
  })
}

Tracer.prototype.traceCall = function (name, obj, method, line) {
  var self = this

  if (!Object.has(self.lineTraces, line)) {
    self.lineTraces[line] = []
  }

  if (self.getType_(obj) === 'Array') {
    self.lineTraces[line].push({
      'name' : name,
      'value' : JSON.stringify(obj),
      'line' : line
    })
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