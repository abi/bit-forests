$(document).ready(function(){
    renderApp();
});

function renderApp(){
    $("#app").html("" +
        "<div id='toolbar'>" +
        "<a href='javascript:void(0)' id='identity-btn' class='btn'>3x3 Identity</a>" +
        "<a href='javascript:void(0)' id='zeroes-btn' class='btn'>3x3 Zeroes</a>" +
        "<a href='javascript:void(0)' id='random-btn' class='btn'>3x3 Random</a>" +
        "</div>" +
        "<div id='input-box'><textarea id='input' rows=\"6\" cols=\"10\"></textarea></div>" +
        "<div id='matrix'></div>" +
        "<div id='matrix-props'></div>");
    
    $('#input').keyup(function(){
        var input = $('#input').val();
        var matrix = parseMatrix(input);
        
        $('#matrix').html(renderMatrix(matrix));
        $('#matrix-props').html(renderProperties(matrix));
    });
    
    $("#input").val(matrixToString(zeroes()));
    $('#input').trigger("keyup");
    
    $('#identity-btn').click(function(){
        updateInput(generateIdentity(3)); 
    });
    
    $('#zeroes-btn').click(function(){
        updateInput(zeroes()); 
    });
    
    $('#random-btn').click(function(){
        updateInput(generateRandomMatrix());
    });
    
    function updateInput(matrix){
        if(matrix instanceof Matrix){
            $("#input").val(matrix.toString());
            // renderer = new HtmlRenderer(matrix);
            // $("#input").renderer.html();
        }else{
            $("#input").val(matrixToString(matrix));
        }

        $("#input").focus();
        $("#input").trigger("keyup");
    }
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
    return html;
}

function identity(size){
    var matrix = [];
    for(var i = 0; i < size; i++){
        var row = [];
        for(var j = 0; j < size; j++){
            if(i == j){
                row.push(1);
            }else{
                row.push(0);
            }
        }
        matrix.push(row);
    }
    return matrix;
}

function zeroes(){
    var matrix = [];
    for(var i = 0; i < SIZE; i++){
        var row = [];
        for(var j = 0; j < SIZE; j++){
            row.push(0);
        }
        matrix.push(row);
    }
    return matrix;
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

function isSymmetric(matrix){
    for(var i = 0; i < matrix.length; i++){
        for(var j = 0; j < matrix[0].length; j++){
            if(matrix[i][j] !== matrix[j][i]){
                return false;
            }
        }
    }
    return true;
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

function Matrix(rows, cols){
    this.rows = rows;
    this.cols = cols;

    // Square matrices
    if(typeof cols == "undefined")
        this.cols = rows;

    // Initialize matrix to zeroes
    this._storage = [];
    for(var i = 0; i < rows; i++){
        var row = [];
        for(var j = 0; j < cols; j++){
            row.push(0);
        }
        this._storage.push(row);
    }
}

Matrix.prototype = {
    setSize: function(rows, cols){
        // TODO: Truncate existing arrays or add zeroes as necessary
    },
    at: function(i, j){
        return this._storage[i][j];
    },
    set: function(i, j, val){
        this._storage[i][j] = val;
    },
    // TODO: Overload or not to set and get element wise?
    setElementWise: function(fn){
        for(var i = 0; i < this.rows; i++){
            for(var j = 0; j < this.cols; j++){
                var val = fn(i, j);
                this.set(i, j, val);
            }
        }
        return this;
    },
    toString: function(){
        var str = "";
        for(var i = 0; i < this._storage.length; i++){
            var row = this._storage[i];
            for(var j = 0; j < row.length; j++){
                str += row[j] + " ";
            }
            str += "\n";
        }
        return str;
    }
}

function HtmlRenderer(matrix){
    var html = "<div>"; 
    // TODO: Design better API
    matrix._storage.each(function(row, i){
        html += "<div>";
        row.each(function(el, j){
            html += "<span>" + el + "</span>";
        });
       html += "</div>"; 
    });
    html += "</div>";
    this._html = html;
}

HtmlRenderer.prototype = {
    html: function(){
        return this._html;
    }
}


function generateIdentity(size){
    return (new Matrix(size)).setElementWise(function(i, j){
        if(i == j){ return 1; }
        else{ return 0; }
    });
}

function renderProperties(matrix){
    var html = "<div>";

    function displayMessage(prop, value, html){
        html += "<div>";
        if(value){
            html += prop;
        }else{
            html += "Not " + prop;
        }
        html += "</div>";
        return html;
    }

    html = displayMessage("Identity", isIdentity(matrix), html);
    html = displayMessage("Orthogonal", isOrthogonal(matrix), html);
    html = displayMessage("Symmetric", isSymmetric(matrix), html);

    html += "</div>";
    return html;
}

function parseMatrix(input){
    var matrix = [];
    input.split('\n').each(function(line){
        line = line.compact();
        // Ignore any empty new lines
        if(line.length == 0) return;
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
