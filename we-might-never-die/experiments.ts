
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

// Test Monte Carlo integration
console.log(integrate());
console.log(integrateFn(2.0, function(x){ return Math.exp(x); }));

// Probability distributions
// -------------------------


// Basic math utilities

// n choose k
// Why is this the formula for n choose k?
function nCk(n, k){
	return factorial(n) / (factorial(k) * factorial(n-k));
}

// RangeError: Maximum call stack size exceeded
function factorial(n : number){
	if(n === 0){
		return 1;
	}else{
		return n * factorial(n-1);
	}
}

// Some distributions don't have an expecation or variance
// such as the Cauchy distribution
interface Distribution{
	exp(): number;
	var(): number;
	prob(i : number): number;
}

// Binomial distribution
class Bin implements Distribution{
	// TODO: Error check n > 0, 0 <= p <= 1
	private poisson : Poisson;
    constructor(public n, public p) {
    	this.poisson = new Poisson(this.n * this.p);
    }
    // TypeScript Q: Why do I have to explicity do this here?
    public prob(i : number){
    	// Support: [0, 1, ..., n]
    	if (i < 0 || i > this.n) return 0;
    	return nCk(this.n, i) * Math.pow(this.p, i) * Math.pow((1 - this.p), (this.n - i));
    }
    public exp(){
    	return this.n * this.p;
    }
    public var(){
    	var n = this.n;
    	var p = this.p;
    	return n * p * (1 - p);
    }
    // Approximate using Poisson distrib 
    // Only works n is large, p is small and lambda is moderate
    public probPoisson(i : number){
    	return this.poisson.prob(i);
    }

    // FEATURES
    // Approximate using Normal distrib
}

// Poisson distribution
class Poisson implements Distribution{
	// Lambda
	constructor(public l : number) {}
	public prob(i : number){
		var l = this.l;
		return Math.exp(-l) * (Math.pow(l, i) / factorial(i));
	}
	public exp(){
		return this.l;
	}
	public var(){
		return this.l;
	}
}

var servers: Bin = new Bin(100, 0.0038);
printSep();
console.log("P(X = 0) = " + servers.prob(0));
console.log("E[X] = " + servers.exp());

var hashbucket: Bin = new Bin(20000, (1 / 5000));
console.log("P(X = 0) = " + hashbucket.probPoisson(0));

function printSep(){
	console.log("---------------------------------");
}