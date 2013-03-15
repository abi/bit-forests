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
