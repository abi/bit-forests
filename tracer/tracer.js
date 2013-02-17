var UglifyJS = require("uglify-js");

// sample AST
var ast = UglifyJS.parse("a = 1 + 2");

// this is the transformer
var deep_clone = new UglifyJS.TreeTransformer(function(node, descend){
    node = node.clone();
    // the descend function expects two arguments:
    // the node to dive into, and the tree walker
    // `this` here is the tree walker (=== deep_clone).
    // by descending into the *cloned* node, we keep the original intact
    descend(node, this);
    return node;
}, function(node){
	console.log(node);	
});

// in ast2 we'll get a deep copy of ast
var ast2 = ast.transform(deep_clone);

// let's change AST now:
ast.body[0].body.left.name = "CHANGED"; // CHANGED = 1 + 2

console.log(ast.print_to_string({ beautify: true }));
console.log(ast2.print_to_string({ beautify: true }));