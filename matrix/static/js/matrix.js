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

        //$("#input").focus();
        $("#input").trigger("keyup");
    }
}

function Vector(length, arr){
    this.length = length;
    this._storage = [];
    if(typeof arr !== 'undefined'){
        if(arr.length != length){
            throw new Exception();
        } else{
            this._storage = arr;
        }
    }
}

Vector.prototype = {
    get: function(i){
        return this._storage[i];
    },
    set: function(i, val){
        this._storage[i] = val;
    },
    setVector: function(arr){
        if(arr.length != this.length){
            throw new Exception();
        }
        this._storage = arr;
    },
    dot: function(toDot){
        if(toDot.length !== this.length){
            throw new Exception();
        }
        
        var sum = 0;
        for(var i = 0; i < v1.length; i++){
            sum += this._storage[i] * toDot.get(i);
        }
        return sum;
    },
    norm: function(v){
        return Math.sqrt(this.dot(this));
    }
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
    determinant: function(){
        // TODO: Using the general formula
    },
    // Properties 
    // Support Hermitian matrices
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
    isOrthogonal: function(){

        // Check that every row is orthogonal to every other row
        var rows = this.getRows();
        for(var i = 0; i < rows.length; i++){
            // TODO: Out of bounds
            for(var j = i + 1; j < rows.length; j++){
                if(Utils.dot(rows[i], rows[j]) != 0){
                    return false;
                }
            }
        }
    
        var cols = this.getCols();
        for(var i = 0; i < cols.length; i++){
            for(var j = i + 1; j < cols.length; j++){
                if(Utils.dot(cols[i], cols[j]) != 0){
                    return false;
                }
            }
        }
        return true;
    },
    // Upper triangular only requires that all the entries below the main diagonal are zero
    isUpperTriangular: function(){
        var isUT = true;
        this.getElementWise(function(i, j, el){
            if (i > j && el !== 0)
                isUT = false;
        });
        return isUT;
    },
    isLowerTriangular: function(){
        var isLT = true;
        this.getElementWise(function(i, j, el){
            if (j > i && el !== 0)
                isLT = false;
        });
        return isLT;
    },
    isDiagonal: function(){
        var isD = true;
        this.getElementWise(function(i, j, el){
            if (j != i && el !== 0)
                isD = false;
        });
        return isD;
    },
    // Many linear algebra algorithms require significantly less computational effort when applied to diagonal matrices,
    // and this improvement often carries over to tridiagonal matrices as well.
    isTridiagonal: function(){
        var isT = true;
        this.getElementWise(function(i, j, el){
            if (Math.abs(i-j) > 1 && el !== 0){
                isT = false;
            }
        });
        return isT;
    },
    getCols: function(){
        var cols = [];
        for(var j = 0; j < this._storage[0].length; j++){
            var col = [];
            for(var i = 0; i < this._storage.length; i++){
                col.push(this._storage[i][j]);
            }
            cols.push(col);
        }
        return cols;
    },
    getRows: function(){
        return this._storage;
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

// Gram-Schmidt process that generates an orthonormal basis from a given basis
// Test: GS([[3, 1], [2, 2]])
// Have better testing (test that the results are orthonormal)
// This code could be traced.
// TODO: Vector class
// This is what it's come down to.
function GS(basis){
    var orthoBasis = Object.clone(basis, true);
    var dim = orthoBasis.length;
    for (var i = 0; i < dim; i++) {
        var v = orthoBasis[i];
        var norm = Utils.norm(v);
        
        for(var j = 0; j < v.length; j++)
            v[j] = v[j] / norm;

        //Utils.dot(orthoBasis[i], orthoBasis[j])
        // TODO: Create projection operator
        for(var j = i+1; j < dim; j++){
            //orthoBasis[j] -= 
        }
    }
    return orthoBasis;
}

// Gaussian Elimination Algorithm without pivoting
// LU decomposition
function gaussianElimination(matrix){
    var L = new Matrix(matrix.rows, matrix.cols); // TODO: Make this the identity matrix
    var U  = matrix;
    for(var i = 0; i < matrix.rows; i++){
        for(var j = i + 1; j < matrix.rows; j++){
            L.set(j, i, U.get(j, i) / U.get(i, i)); 
            //U.set();
        }
    }
    return L;
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

    props = ["Identity", "Orthogonal", "Symmetric", "UpperTriangular", "LowerTriangular", "Diagonal", "Tridiagonal"];
    for(var i = 0; i < props.length; i++){
        var isProp = matrix["is" + props[i]]();
        if(isProp){
            html = displayMessage(props[i], isProp, html);
        }else{
            // Display but hide the container unless the user wants it visible.
        }
    }

    html += "</div>";
    return html;
}

renderApp();
