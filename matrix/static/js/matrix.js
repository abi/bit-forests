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
        var matrix = matrixParser(input);
        
        var renderer = new HtmlRenderer(matrix);
        $('#matrix').html(renderer.html());
        $('#matrix-props').html(renderProperties(matrix));
    });
    
    var matrixGen = new MatrixGenerator(3);

    updateInput(matrixGen.zeroes());
    
    $('#identity-btn').click(function(){
        updateInput(matrixGen.identity()); 
    });
    
    $('#zeroes-btn').click(function(){
        updateInput(matrixGen.zeroes()); 
    });
    
    $('#random-btn').click(function(){
        updateInput(matrixGen.random(40));
    });
    
    function updateInput(matrix){
        $("#input").val(matrix.toString());

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
    if(typeof rows === "undefined")
        rows = 0;

    this.rows = rows;
    this.cols = cols;

    // Default to square matrices
    if(typeof cols == "undefined")
        this.cols = rows;

    this.init();
}

Matrix.prototype = {
    init: function(){
        // Initialize matrix to zeroes
        this._storage = [];
        for(var i = 0; i < this.rows; i++){
            var row = [];
            for(var j = 0; j < this.cols; j++){
                row.push(0);
            }
            this._storage.push(row);
        }
    },
    setSize: function(rows, cols){
        // TODO: Truncate existing arrays or add zeroes as necessary
        this.rows = rows;
        this.cols = cols;
        this.init();
    },
    at: function(i, j){
        return this._storage[i][j];
    },
    set: function(i, j, val){
        // TODO: Check bounds
        this._storage[i][j] = val;
    },
    // Properties 
    isSymmetric: function(){
        var isSymmetric = true;
        var self = this;
        this.getElementWise(function(i, j, el){
            if(el !== self.at(j, i)){
                isSymmetric = false;
            }
        });
        return isSymmetric;
    },
    isIdentity: function(){
        var isIdentity = true;
        this.getElementWise(function(i, j, el){
            if (i === j && el !== 1)
                isIdentity = false;
            if (i !== j && el !== 0)
                isIdentity = false;
        });
        return isIdentity;
    },
    getElementWise: function(fn){
        for(var i = 0; i < this.rows; i++){
            for(var j = 0; j < this.cols; j++){
                // TODO: Call fn with the correct context
                fn(i, j, this._storage[i][j]);
            }
        }
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

function matrixParser(str){
    var matrix = [];
    str.split('\n').each(function(line){
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
    
    // HACK
    var mMatrix = new Matrix(matrix.length, matrix[0].length);
    mMatrix._storage = matrix;
    
    return mMatrix;
}


// TODO: Copy the matrices and return a new instance of the matrix
function MatrixGenerator(size){
    this._size = size;
    this._matrix = new Matrix(size);
}

MatrixGenerator.prototype = {
    identity: function(){
        return this._matrix.setElementWise(function(i, j){
            if(i == j){ return 1; }
            else{ return 0; }
        });
    },
    zeroes: function(){
        return this._matrix.setElementWise(function(){
            return 0;
        });
    },
    random: function(rangeEnd){
        return this._matrix.setElementWise(function() {
            return Math.floor(Math.random() * rangeEnd);
        });
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

    html = displayMessage("Identity", matrix.isIdentity(), html);
//    html = displayMessage("Orthogonal", isOrthogonal(matrix), html);
    html = displayMessage("Symmetric", matrix.isSymmetric(), html);

    html += "</div>";
    return html;
}

renderApp();
