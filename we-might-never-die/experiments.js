function integrate() {
    var NUM_POINTS = 1000000;
    var numBelowFn = 0;
    for(var i = 0; i < NUM_POINTS; i++) {
        var x = Math.random() * 2.0;
        var y = Math.random() * Math.exp(2.0);
        if(y < Math.exp(x)) {
            numBelowFn++;
        }
    }
    var fraction = numBelowFn / NUM_POINTS;
    return 2 * Math.exp(2) * fraction;
}
function integrateFn(upperLimit, fn) {
    var NUM_POINTS = 1000000;
    var numBelowFn = 0;
    for(var i = 0; i < NUM_POINTS; i++) {
        var x = Math.random() * upperLimit;
        var y = Math.random() * fn(upperLimit);
        if(y < fn(x)) {
            numBelowFn++;
        }
    }
    var fraction = numBelowFn / NUM_POINTS;
    return upperLimit * fn(upperLimit) * fraction;
}
console.log(integrate());
console.log(integrateFn(2.0, function (x) {
    return Math.exp(x);
}));
function nCk(n, k) {
    return factorial(n) / (factorial(k) * factorial(n - k));
}
function factorial(n) {
    if(n === 0) {
        return 1;
    } else {
        return n * factorial(n - 1);
    }
}
var Bin = (function () {
    function Bin(n, p) {
        this.n = n;
        this.p = p;
    }
    Bin.prototype.prob = function (i) {
        return nCk(this.n, i) * Math.pow(this.p, i) * Math.pow((1 - this.p), (this.n - i));
    };
    Bin.prototype.exp = function () {
        return this.n * this.p;
    };
    Bin.prototype.var = function () {
        var n = this.n;
        var p = this.p;
        return n * p * (1 - p);
    };
    return Bin;
})();
var servers = new Bin(100, 0.0038);
printSep();
console.log("P(X = 0) = " + servers.prob(0));
console.log("E[X] = " + servers.exp());
function printSep() {
    console.log("---------------------------------");
}
