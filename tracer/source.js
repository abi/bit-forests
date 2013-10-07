var a = 4;
a = 6;
a += 2;
a = (function(){ return 8; })()

var b = 2;
var c = 1;
var str = "";
var arr = [];
for(var i = 1; i <= 5; i++){
	b = (b * 2);
	c = b % i;
  c++;
	arr.push(a);
	str += "a";
}

//
// var a = 5;

// function insertionSort(items) {

//     var len     = items.length,     // number of items in the array
//         value,                      // the value currently being compared
//         i,                          // index into unsorted section
//         j;                          // index into sorted section

//     for (var i = 0; i < len; i++) {
//         value = items[i];
//         for (var j=i-1; j > -1 && items[j] > value; j--) {
//             items[j+1] = items[j];
//         }

//         items[j+1] = value;
//     }

//     return items;
// }

// insertionSort([5, 3, 2, 1]);