$(document).ready(function(){
	renderApp();
});

function renderApp(){
	$("#app").html("" +
        "<div id='input-box'><textarea id='input' rows=\"6\" cols=\"10\"></textarea></div>" +
        "<div id='matrix'></div>" +
        "<div id='matrix-props'></div>");
    
    $('#input').keyup(function(){
        var input = $('#input').val();
        var matrix = parseMatrix(input);
        
        $('#matrix').html(renderMatrix(matrix));
        $('#matrix-props').html(renderProperties(matrix));
    });
    
    $("#input").val(matrixToString(generateRandomMatrix()));
    
}

function renderMatrix(matrix){
    var html = "<div>"; 
    matrix.each(function(row, i){
        html += "<div>";
        row.each(function(el, j){
            html += "<span>" + el + "</span>";
        });
       html += "</div>"; 
    });
    html += "</div>";
    console.log(html);
    return html;
}

var SIZE = 3;
function generateRandomMatrix(){
    var matrix = [];
    for(var i = 0; i < SIZE; i++){
        var row = [];
        for(var j = 0; j < SIZE; j++){
            row.push(Math.floor(Math.random() * 10));
        }
        matrix.push(row);
    }
    return matrix;
}

function matrixToString(matrix){
    var str = "";
    for(var i = 0; i < matrix.length; i++){
        var row = matrix[i];
        for(var j = 0; j < row.length; j++){
            str += row[j] + " ";
        }
        str += "\n";
    }
    return str;
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
        if (i == j && el != 1){
            success = false;
        }
        if (i != j && el != 0){
            success = false;
        }
    });
    return success;
}

function isUpperTriangular(matrix){
        
}

function isOrthogonal(matrix){
    // Check that every row is orthogonal to every other row
    for(var i = 0; i < matrix.length; i++){
        // TODO: Out of bounds
        for(var j = i + 1; j < matrix.length; j++){
            if(dot(matrix[i], matrix[j]) != 0){
                return false;
            }
        }
    }
    
    var cols = getCols(matrix);
    for(var i = 0; i < cols.length; i++){
        // TODO: Out of bounds
        for(var j = i + 1; j < cols.length; j++){
            if(dot(cols[i], cols[j]) != 0){
                return false;
            }
        }
    }
    return true;
}

function getCols(matrix){
    // TODO: Bounds checking
    var cols = [];
    for(var j = 0; j < matrix[0].length; j++){
        var col = [];
        for(var i = 0; i < matrix.length; i++){
            col.push(matrix[i][j]);
        }
        cols.push(col);
    }
    console.log(cols);
    return cols;
}

function tranpose(vector){
    // Don't need this for now       
}

function dot(v1, v2){
    if(v1.length != v2.length){
        //alert("BAD BAD BAD!");
        // TODO: Return a bad a value or throw an exception
        return;
    }
    
    var sum = 0;
    for(var i = 0; i < v1.length; i++){
        sum += v1[i] * v2[i];
    }
    return sum;
}

function renderProperties(matrix){
    var html = "<div>"; 
    if(isIdentity(matrix)){
        html += "Identity";
    }else{
        html += "Not identity";
    }
    
    if(isOrthogonal(matrix)){
        html += "Orthogonal";
    }else{
        html += "Not orthogonal";
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
