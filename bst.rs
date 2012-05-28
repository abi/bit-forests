fn main(args: [str]){
    io::println("hello world, " + args[1]);
}

// http://en.wikipedia.org/wiki/Binary_search_tree

// Allocate a record on the heap
// Use pointers to manage relationships between structs (how do you do that in rust?)
// type node { left: , right: , value: , contents: }

// TODO: How to make this a treemap?

// Insert
// Arguments: root, value + contents
// If current node is empty, insert
// If it less than the current node,  recurse with left node and

// Lookup
// Arguments: value, root

// Print a tree
//

// Delete (tricky)
// Arguments: