
// Monte Carlo Integration to integrate e^x from 0 to 2.
// Based on CS109 Lecture Notes
function integrate(){
	var NUM_POINTS = 1000000;
	var numBelowFn = 0;
	for(var i = 0; i < NUM_POINTS; i++){
		var x : number = Math.random() * 2.0;
		var y : number = Math.random() * Math.exp(2.0);
		if(y < Math.exp(x)) numBelowFn++;
	}
	var fraction: number = numBelowFn / NUM_POINTS;
	return 2 * Math.exp(2) * fraction;
}

// Monte Carlo Integration to integrate fn from 0 to upperLimit.
// TODO: Support arbitary lower limit
function integrateFn(upperLimit, fn){
	var NUM_POINTS = 1000000;
	var numBelowFn = 0;
	for(var i = 0; i < NUM_POINTS; i++){
		var x : number = Math.random() * upperLimit;
		var y : number = Math.random() * fn(upperLimit);
		if(y < fn(x)) numBelowFn++;
	}
	var fraction: number = numBelowFn / NUM_POINTS;
	return upperLimit * fn(upperLimit) * fraction;
}

console.log(integrate());
console.log(integrateFn(2.0, function(x){ return Math.exp(x); }));