$(document).ready(function(){
	renderApp();
});

function renderApp(){
	$("#app").html("" +
        "<textarea id='input' rows=\"20\" cols=\"20\"></textarea>" +
        "<div id='matrix'><div>");
    
    $('#input').keyup(function(){
        var input = $('#input').val();
        var matrix = parseMatrix(input);
        
        $('#matrix').html(renderMatrix(matrix));
        $('#matrix').append($(renderProperties(matrix)));
    });
    
}

function renderMatrix(matrix){
    var html = "<div>"; 
    matrix.each(function(row, i){
        html += "<div>";
        row.each(function(el, j){
            html += "<span>(" + i + "," + j + ") " + el + "</span>";
        });
       html += "</div>"; 
    });
    html += "</div>";
    console.log(html);
    return html;
}

// Iterates through rows, and then each row's columns
function iterateElements(matrix, fn){
    matrix.each(function(row, i){
        row.each(function(el, j){
            fn(el, i, j);
        });
    });
}

function isIdentity(matrix){
    var success = true;
    iterateElements(matrix, function(el, i, j){
        console.log(el, i, j);
        if (i == j && el != 1){
            success = false;
        }
        if (i != j && el != 0){
            success = false;
        }
    });
    return success;
}

function renderProperties(matrix){
    var html = "<div>"; 
    if(isIdentity(matrix)){
        html += "Identity";
    }else{
        html += "Not identity";
    }
    html += "</div>";
    return html;
}

function parseMatrix(input){
    var matrix = [];
    input.split('\n').each(function(line){
        var row = [];
        line.split(' ').each(function(el){
            // Allow real numbers (and even complex numbers?)
            row.push(parseInt(el)); 
        });
        matrix.push(row);
    });
    renderMatrix(matrix);
    return matrix;
}

renderApp();
