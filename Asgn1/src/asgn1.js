// ColoredPoint.js (c) 2012 matsuda
// Vertex shader program
var VSHADER_SOURCE =
  'attribute vec4 a_Position;\n' +
  'uniform float u_Size;\n' +
  'void main() {\n' +
  '  gl_Position = a_Position;\n' +
  '  gl_PointSize = u_Size;\n' +
  '}\n';

// Fragment shader program
var FSHADER_SOURCE =
  'precision mediump float;\n' +
  'uniform vec4 u_FragColor;\n' +  // uniform変数
  'void main() {\n' +
  '  gl_FragColor = u_FragColor;\n' +
  '}\n';





// Global variables
let canvas;
let gl;
let a_Position;
let u_FragColor;
let u_Size;

function setupWebGL() {
    // Retrieve <canvas> element
    canvas = document.getElementById('webgl');

    // Get the rendering context for WebGL
    //gl = getWebGLContext(canvas);
    gl = canvas.getContext("webgl", { preserveFrawingBuffer: true });
    if (!gl) {
      console.log('Failed to get the rendering context for WebGL');
      return;
    }
}

function connectVariablesToGLSL() {
    // Initialize shaders
    if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
      console.log('Failed to intialize shaders.');
      return;
    }

    // // Get the storage location of a_Position
    a_Position = gl.getAttribLocation(gl.program, 'a_Position');
    if (a_Position < 0) {
      console.log('Failed to get the storage location of a_Position');
      return;
    }

    // Get the storage location of u_FragColor
    u_FragColor = gl.getUniformLocation(gl.program, 'u_FragColor');
    if (!u_FragColor) {
      console.log('Failed to get the storage location of u_FragColor');
      return;
    }
    
    // Get the storage location of u_Size
    u_Size = gl.getUniformLocation(gl.program, 'u_Size');
    if (!u_Size) {
      console.log('Failed to get the storage location of u_Size');
      return;
    }
}

// UI element globals
let g_selectedColor = [1.0, 1.0, 1.0, 1.0];
let g_selectedSize = 10.0;
let g_selectedType = 'SQUARE';
let g_selectedSegments = 10;
let g_showPicture = 'FALSE';

// Set up actions for the HTML UI elements
function addActionsForHTML() {
    // Button Events
    document.getElementById('clearButton').onclick = function() {
        g_shapesList = [];
        g_showPicture = 'FALSE';
        gl.clearColor(0.0, 0.0, 0.0, 1.0);
        renderAllShapes();
    };
    document.getElementById('undoButton').onclick = function() {
        g_shapesList.pop();
        renderAllShapes();
    };
    document.getElementById('backgroundButton').onclick = function() {
        g_shapesList = [];
        g_showPicture = 'FALSE';
        gl.clearColor(g_selectedColor[0], g_selectedColor[1], g_selectedColor[2], g_selectedColor[3])
        renderAllShapes();
    };
    document.getElementById('randomButton').onclick = function() {
        for (var i = 0; i < 3; i++) {
            g_selectedColor[i] = Math.random();
        }
        
        var shape = Math.floor(Math.random()*5);
        if (shape == 0) {
            g_selectedType = 'SQUARE';
        } else if (shape == 1) {
            g_selectedType = 'TRIANGLE';
        } else if (shape == 2){
            g_selectedType = 'CIRCLE';
        } else if (shape == 3){
            g_selectedType = 'STAR';
        } else {
            g_selectedType = 'HEART';
        }
        
        let newSize = 5.0 + (Math.random() * 35)
        g_selectedSize = newSize;
        let sizeSlide = document.getElementById('sizeSlide')
        sizeSlide.value = newSize;
        
        let redSlide = document.getElementById('redSlide');
        let newColor = Math.random();
        g_selectedColor[0] = newColor;
        redSlide.value = newColor * 100;
        
        let greenSlide = document.getElementById('greenSlide');
        newColor = Math.random();
        g_selectedColor[1] = newColor;
        greenSlide.value = newColor * 100;
        
        let blueSlide = document.getElementById('blueSlide');
        newColor = Math.random();
        g_selectedColor[2] = newColor;
        blueSlide.value = newColor * 100;
    };
    document.getElementById('pictureButton').onclick = function() {
        g_shapesList = [];
        g_showPicture = 'TRUE';
        renderAllShapes();
    };
    document.getElementById('squareButton').onclick = function() {g_selectedType = 'SQUARE'; };
    document.getElementById('triButton').onclick = function() {g_selectedType = 'TRIANGLE'; };
    document.getElementById('circleButton').onclick = function() {g_selectedType = 'CIRCLE'; };
    document.getElementById('starButton').onclick = function() {g_selectedType = 'STAR'; };
    document.getElementById('heartButton').onclick = function() {g_selectedType = 'HEART'; };
    
    // Slider Events
    document.getElementById('redSlide').addEventListener('mouseup', function() { g_selectedColor[0] = this.value/100; });
    document.getElementById('greenSlide').addEventListener('mouseup', function() { g_selectedColor[1] = this.value/100; });
    document.getElementById('blueSlide').addEventListener('mouseup', function() { g_selectedColor[2] = this.value/100;} );
    
    document.getElementById('sizeSlide').addEventListener('mouseup', function() { g_selectedSize = this.value; });
    document.getElementById('segSlide').addEventListener('mouseup', function() { g_selectedSegments = this.value; });
}





function main() {
   setupWebGL();
   connectVariablesToGLSL();
    
  // Set up actions for the HTML UI elements
  addActionsForHTML();
    
  // Register function (event handler) to be called on a mouse press
  canvas.onmousedown = click;
  canvas.onmousemove = function(ev) { if(ev.buttons == 1) { click(ev) } };

  // Specify the color for clearing <canvas>
  gl.clearColor(0.0, 0.0, 0.0, 1.0);

  // Clear <canvas>
  gl.clear(gl.COLOR_BUFFER_BIT);
}





var g_shapesList = [];

function click(ev) {
    // Extract the event click and return it in WebGL coordinates
    [x, y] = convertCoordinatesEventToGL(ev);
    
    // Create a new point, set its attributes, and push it to the list
    let point;
    if (g_selectedType == 'SQUARE'){
        point = new Square();
    } else if (g_selectedType == 'TRIANGLE') {
        point = new Triangle();
    } else if (g_selectedType == 'CIRCLE') {
        point = new Circle();
        point.segments = g_selectedSegments;
    } else if (g_selectedType == 'STAR'){
        point = new Star();
    } else {
        point = new Heart();
    }

    point.position = [x, y];
    point.color = g_selectedColor.slice();
    point.size = g_selectedSize;
    g_shapesList.push(point);

    renderAllShapes();
}

// Extract the event click and return it in WebGL coordinates
function convertCoordinatesEventToGL(ev) {
    var x = ev.clientX; // x coordinate of a mouse pointer
    var y = ev.clientY; // y coordinate of a mouse pointer
    var rect = ev.target.getBoundingClientRect();

    x = ((x - rect.left) - canvas.width/2)/(canvas.width/2);
    y = (canvas.height/2 - (y - rect.top))/(canvas.height/2);

    return([x, y]);
}
     
// Draw every shape that is supposed to be in the canvas
function renderAllShapes() {
    // Clear <canvas>
    gl.clear(gl.COLOR_BUFFER_BIT);
        
    if (g_showPicture == 'TRUE') {
        drawPicture();
    }

    // Render all shapes in the list
    var len = g_shapesList.length;
    for(var i = 0; i < len; i++) {
        g_shapesList[i].render();
    }
}
         
function drawPicture() {
        // Set background to blue
        gl.clearColor(0.5, 0.7, 1.0, 1.0);
        gl.clear(gl.COLOR_BUFFER_BIT);
        
        // Draw the sun
        gl.uniform4f(u_FragColor, 1.0, 0.85, 0.45, 1.0);
        drawTriangle([-1.0, 1.0, -0.6196, 0.8764, -0.6, 1.0]);
        drawTriangle([-1.0, 1.0, -0.6764, 0.7649, -0.6196, 0.8764]);
        drawTriangle([-1.0, 1.0, -0.7649, 0.6764, -0.6764, 0.7649]);
        drawTriangle([-1.0, 1.0, -0.8764, 0.6196, -0.7649, 0.6764]);
        drawTriangle([-1.0, 1.0, -1.0, 0.6, -0.8764, 0.6196]);
        
        // Draw the ground
        gl.uniform4f(u_FragColor, 0.45, 0.70, 0.25, 1.0);
        drawTriangle([-1.0, -0.4, -1.0, -1.0, 1.0, -1.0]);
        drawTriangle([-1.0, -0.4, 1.0, -1.0, 1.0, -0.4]);
        
        // Draw the lake
        gl.uniform4f(u_FragColor, 0.25, 0.35, 1.0, 1.0);
        drawTriangle([-0.3, -0.45, -0.3, -0.95, 0.3, -0.45]);
        drawTriangle([-0.3, -0.95, 0.3, -0.95, 0.3, -0.45]);
        drawTriangle([-0.3, -0.45, -0.5, -0.6, -0.3, -0.7]);
        drawTriangle([-0.3, -0.7, -0.5, -0.6, -0.5, -0.8]);
        drawTriangle([-0.5, -0.8, -0.3, -0.95, -0.3, -0.7]);
        drawTriangle([0.3, -0.45, 0.5, -0.6, 0.3, -0.7]);
        drawTriangle([0.3, -0.7, 0.5, -0.6, 0.5, -0.8]);
        drawTriangle([0.5, -0.8, 0.3, -0.95, 0.3, -0.7]);
        
        // Draw the mountains
        gl.uniform4f(u_FragColor, 0.6, 0.6, 0.6, 1.0);
        drawTriangle([-1.1, -0.4, -0.3, -0.4, -0.7, 0.2]); // Left
        drawTriangle([1.1, -0.4, 0.3, -0.4, 0.7, 0.2]); // Right
        gl.uniform4f(u_FragColor, 0.5, 0.5, 0.5, 1.0);
        drawTriangle([-0.5, -0.4, 0.5, -0.4, 0.0, 0.5]); // Center
        
        // Draw the snow
        gl.uniform4f(u_FragColor, 1.0, 1.0, 1.0, 1.0);
        drawTriangle([0.0, 0.5, -0.225, 0.095, 0.225, 0.095]); // Center
        drawTriangle([-0.225, 0.095, -0.15, 0.02, -0.075, 0.095]);
        drawTriangle([-0.075, 0.095, 0.0, 0.02, 0.075, 0.095]);
        drawTriangle([0.225, 0.095, 0.15, 0.02, 0.075, 0.095]);
        drawTriangle([-0.7, 0.2, -0.85, -0.025, -0.55, -0.025]); // Left
        drawTriangle([-0.85, -0.025, -0.8, -0.075, -0.75, -0.025]);
        drawTriangle([-0.75, -0.025, -0.7, -0.075, -0.65, -0.025]);
        drawTriangle([-0.65, -0.025, -0.6, -0.075, -0.55, -0.025]);
        drawTriangle([0.7, 0.2, 0.85, -0.025, 0.55, -0.025]); // Right
        drawTriangle([0.85, -0.025, 0.8, -0.075, 0.75, -0.025]);
        drawTriangle([0.75, -0.025, 0.7, -0.075, 0.65, -0.025]);
        drawTriangle([0.65, -0.025, 0.6, -0.075, 0.55, -0.025]);
        
        // Draw the flower stems
        gl.uniform4f(u_FragColor, 0.15, 0.5, 0.15, 1.0);
        drawTriangle([-0.76, -0.9, -0.74, -0.9, -0.75, -0.4]);
        drawTriangle([-0.75, -0.65, -0.75, -0.6, -0.8, -0.55]);
        drawTriangle([-0.75, -0.75, -0.75, -0.7, -0.7, -0.65]);
        
        drawTriangle([0.76, -0.85, 0.74, -0.85, 0.75, -0.5]);
        drawTriangle([0.75, -0.75, 0.75, -0.7, 0.7, -0.65]);
        
        // Draw the flower center
        gl.uniform4f(u_FragColor, 0.4, 0.3, 0.1, 1.0);
        drawTriangle([-0.8, -0.35, -0.8, -0.45, -0.7, -0.35]);
        drawTriangle([-0.8, -0.45, -0.7, -0.45, -0.7, -0.35]);
        
        // Draw the petals
        gl.uniform4f(u_FragColor, 0.8, 0.6, 0.1, 1.0);
        drawTriangle([-0.75, -0.35, -0.9, -0.25, -0.8, -0.4]);
        drawTriangle([-0.8, -0.4, -0.9, -0.55, -0.75, -0.45]);
        drawTriangle([-0.75, -0.45, -0.6, -0.55, -0.7, -0.4]);
        drawTriangle([-0.7, -0.4, -0.6, -0.25, -0.75, -0.35]);
        drawTriangle([0.725, -0.55, 0.775, -0.55, 0.75, -0.45]);
        drawTriangle([0.725, -0.55, 0.775, -0.55, 0.75, -0.6]);
}


