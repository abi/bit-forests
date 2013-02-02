
###############
## Section 1 ##
###############

# Digits are 0-indexed starting from the left
def getDigit(number, digit):
  return int(str(number)[digit])

def getNumDigits(number):
  return len(str(number))

# Quotient is a string
# Remainder is a number
def performLongDivision(quotient, digit, remainder, divisor, number):

  # Base case
  if digit == getNumDigits(number):
    print "Quotient: " + str(int(quotient)
    print "Remainder: " + str(remainder)

  currentNumber = remainder * 10 + getDigit(number, digit)
  if divisor > currentNumber:
    performLongDivision(quotient + "0", digit + 1, currentNumber, divisor, number)
  else:
    for i in [1..9]:
      if currentNumber >= i * divisor and currentNumber < ((i + 1) * divisor):
        currentNumber -= (i * divisor) 
        quotient += i
        performLongDivision(quotient, digit + 1, currentNumber, divisor, number)
        break

def performDivision(divisor, number):
  if divisor > number:
    print "Quotient: 0"
    print "Remainder: " + number
  else:
    performLongDivision("", 0, 0, divisor, number)

###############
# Section 2.1 #
###############

class Tag:
  # Attrs could be either a dictionary or an array
  def __init__(self, tagName, attrs={}, children=[]):
    self.tagName = tagName
    self.attrs = attrs
    self.children = children

  def __str__(self):
    return self.serialize()

  def serialize():
    attrsStr = (str(k) + "=\"" + str(v) + "\"" for k, v in attrs).join(" ")
    childrenStr = (str(child) for child in children).join("")
    str = "<" + self.tagName + " " + attrsStr +  ">" + childrenStr + "</" + self.tagName + ">"


div = Tag('div', attrs={'class' : 'greeting'}, children=['Hello,', Tag('b', children='world'), '!'])
div.serialize()


###############
# Section 2.2 #
###############

# TODO: Come back to this

# Let the dependency be represented as such:
# {'file' : ['file1', 'file2', ...]}

# O(n^2) solution
# With a graph, a O(n) solution is possible
# Fails with circular references

def printDependencies(depDict):
  # Base case
  if len(depDict.keys()) == 0: return
  
  fileToPrint = None

  for file, deps in depDict:
    if len(deps) = 0:
      fileToPrint = file
      break

  if not fileToPrint:
    print "Circularity in references!"
  else:
    depDict.remove(fileToPrint)
    print "<script src='" + fileToPrint + "''>" 
    
    # Remove the dependency from all other files since we've already included it
    for file, deps in depDict:
      if fileToPrint in deps:
        deps.remove(fileToPrint)

    printDependencies(depDict)


