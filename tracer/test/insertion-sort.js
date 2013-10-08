function insertionSort(items) {

  var len = items.length,     // number of items in the array
    value,                      // the value currently being compared
    i,                          // index into unsorted section
    j;                          // index into sorted section

  for (var i = 0; i < len; i++) {
    value = items[i];
    for (var j=i-1; j > -1 && items[j] > value; j--) {
      items[j+1] = items[j];
    }

    items[j+1] = value;
  }

  return items;
}

insertionSort([5, 3, 2, 1]);