$(document).ready(function () {
  var socket = io.connect('http://localhost')
  socket.on('update', function (data) {
    $('#source').html(data['source'].replace(/\n/gi, '<br/>'))
    eval(data['transformed'])
    $('#trace').html(renderTrace())
  })
})


var traces = {}

function getType (obj) {
  return Object.prototype.toString.call(obj).slice(8, -1)
}

function trace (name, value, line) {
  if (!Object.has(traces, line)) {
    traces[line] = []
  }

  // Note: JSON.stringify makes the value human-readable
  traces[line].push({
    'name' : name,
    'value' : JSON.stringify(value),
    'line' : line
  })
}

function traceCall (name, obj, method, line) {
  if (!Object.has(traces, line)) {
    traces[line] = []
  }
  if (getType(obj) === 'Array') {
    traces[line].push({
      'name' : name,
      'value' : JSON.stringify(obj),
      'line' : line
    })
  }
}

function renderTrace () {

  // Convert all keys to ints
  var lines = Object.keys(traces).map(function (i) {
    return parseInt(i)
  }).sortBy()

  var html = ""
  var prevLine = 0
  for (var i = 0; i < lines.length; i++) {
    var line = lines[i]
    var traceList = traces[line]

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