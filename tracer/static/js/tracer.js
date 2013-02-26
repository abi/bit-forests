var global = {
    'original': Array.prototype.push
};

Array.prototype.push=(function(){
    var original = Array.prototype.push;
    return function() {
        trace('arr', arguments, 11);
        //console.log(arguments);
        return original.apply(this,arguments);
    };
})();

$(document).ready(function(){
    var socket = io.connect('http://localhost');
    socket.on('update', function (data) {
      console.log("UPDATING");
      $('#source').html(data['source'].replace(/\n/gi, '<br/>'));
      eval(data['transformed']);
      $('#trace').html(renderTrace());
    });
});


var traces = {};
function trace(name, value, line){
    line = parseInt(line);
    if(!Object.has(traces, line)) traces[line] = [];
    global['original'].apply(traces[line], [{'name' : name, 'value' : value, 'line' : line}]);
}

function renderTrace(){
    // Convert all keys to strings
    var lines = Object.keys(traces).map(function(i){return parseInt(i);}).sortBy();
    var html = "";
    var prevLine = 0;
    for(var i = 0; i < lines.length; i++){
    var line = lines[i];
    var traceList = traces[line];

    var linesSkipped = parseInt(line) - prevLine;

    if(linesSkipped > 1){
        for(var k = 0; k < linesSkipped; k++)
            html += "<br/>";
    }

    for(var j = 0; j < traceList.length; j++){
      var trace = traceList[j];
      html += trace['name'] + " = " + trace['value'];
      if(j != traceList.length - 1){
        html += " | ";
      }
    }
    html += "<br/>";
    prevLine = parseInt(line);
    }
    console.log(html);
    return html;
}