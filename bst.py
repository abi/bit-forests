
from Queue import Queue

class Node():
  def __init__(self, value):
    self.value = value
    self.left = None
    self.right = None

class BST():
  def __init__(self):
    self.root = None

  def addArray(self, values):
    for value in values:
      self.add(value)

  def add(self, value):
    if not self.root
      self.root = Node(value)
    else
      self._add(self.root, Node(value))

  def _add(self, root, toAdd):
    if toAdd.value <= root.value:
      if not root.left:
        root.left = toAdd
      else
        self._add(root.left, toAdd)
    else:
      if not root.right:
        root.right = toAdd
      else
        self._add(root.right, toAdd)
    # Fill the recursive call

  def __str__(self):
    q = Queue()
    q.put(self.root)
    self.bfs(1, 1, q)
    self.repMap = {}

  def bfs(self, prevLevel, level, queue):
    node = queue.get()
    if node.left:
      queue.put(node.left)
    if node.right:
      queue.put(node.right)
    if level in repMap:
      repMap[level].append(node.value)
    else
      repMap[level] = [node.value]

    bfs()
  # TODO: Add a print method that does a basic breadth-first search


bst = BST()
bst.addArray([3, 4, 6, 1, 7, 8])