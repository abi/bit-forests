var fs = require('fs')
var express = require('express')
var app = express()
var server = require('http').createServer(app)
var io = require('socket.io').listen(server)
var esprima = require('esprima')
var estraverse = require('estraverse')
var escodegen = require('escodegen')

server.listen(3001)

app.get('/', function (req, res){
    res.end(fs.readFileSync('tracer.html', 'utf8'))
})

// Source code transformations

function Tracer () {

}

Tracer.prototype.generateAST_ = function (src) {
  return esprima.parse(src).body[0]
}

Tracer.prototype.insertAfter_ = function (ast, node, contents) {
  ast.body.forEach(function (n, i) {
    if (n === node) {
      ast.body.splice(i + 1, 0, contents)
    }
  })
}

function esprimaTransform (src) {

  var ast = esprima.parse(src, {loc: true})
  console.log(JSON.stringify(ast, null, 1))

  estraverse.traverse(ast, {
    enter: function(node, parent) {},
    leave: function(node, parent) {

      // TODO:
      // Handle declartions within for loops
      // Handle function calls

      if (node.type === 'VariableDeclaration' && parent.type !== 'ForStatement') {
        node.declarations.forEach(function (decl) {

          // Generate a trace call
          var funcCall = esprima
              .parse("trace('" + decl.id.name + "', " + decl.id.name + ", " + decl.loc.start.line + ")")
              .body[0]

          // NOTE: In a variable declaration block that has multiple declaration statements
          // the order of the traces is reversed.
          // e.g.
          // var a = 5, b = 6
          // trace('b', ...)
          // trace('a', ...)
          parent.body.forEach(function (n, i) {
            if (n === node) {
              parent.body.splice(i + 1, 0, funcCall)
            }
          })

        })
      } else if (node.type === 'ExpressionStatement' &&
                 node.expression.type === 'AssignmentExpression' &&
                 ['=', '+=', '-=', '*='].indexOf(node.expression.operator) !== -1) {
        // THINK: Check the list of operators possible here is exhaustive
        // THINK: Ensure that node.expression.left.type === 'Identifier'
        //
        var identifier = node.expression.left

        // Generate a trace call
        var funcCall = esprima
            .parse("trace('" + identifier.name + "', " + identifier.name + ", " + identifier.loc.start.line + ")")
            .body[0]

        // Add trace to AST
        parent.body.forEach(function (n, i) {
          if (n === node) {
            parent.body.splice(i + 1, 0, funcCall)
          }
        })

      } else if (node.type === 'ExpressionStatement' &&
                 node.expression.type === 'UpdateExpression') {
        // THINK: Need to check operators?

        // Generate a trace call
        var identifier = node.expression.argument

        // TODO: Abstract out
        var funcCall = esprima
            .parse("trace('" + identifier.name + "', " + identifier.name + ", " + identifier.loc.start.line + ")")
            .body[0]

        // Add trace to AST
        parent.body.forEach(function (n, i) {
          if (n === node) {
            parent.body.splice(i + 1, 0, funcCall)
          }
        })
      } else if (node.type === 'ExpressionStatement' &&
                 node.expression.type === 'CallExpression') {
        // THINK: node.expression.callee.computed,
        // node.expression.callee.object.type
        // node.expression.callee.type === 'MemberExpression' (?)
        var callee = node.expression.callee.object
        var method = node.expression.callee.property

        var funcCall = esprima
            .parse("traceCall('" + callee.name + "', " +
                              callee.name + ", " +
                              "'" + method.name + "', " +
                              callee.loc.start.line + ")")
            .body[0]

        // Add trace to AST
        parent.body.forEach(function (n, i) {
          if (n === node) {
            parent.body.splice(i + 1, 0, funcCall)
          }
        })
      }

    }
  })

  var transformedSrc = escodegen.generate(ast)
  console.log(transformedSrc)
  return transformedSrc
}

// File watching

var FILE = 'source.js'

fs.watch(FILE, {}, function (event, filename) {
    // TODO: Fix filename issue
    msg = refresh(filename)
    for(var i = 0; i < sockets.length; i++){
        sockets[i].emit('update', msg)
    }
})

function refresh (filename) {
    var contents =  fs.readFileSync(FILE, 'utf8')
    var msg = {'source': contents, 'transformed': esprimaTransform(contents)}
    return msg
}

// Sockets

var sockets = []

io.sockets.on('connection', function (socket) {
  socket.emit('update', refresh(FILE))
  sockets.push(socket)
})

app.use(express.static(__dirname + '/static'))