// ColoredPoint.js (c) 2012 matsuda
// Vertex shader program
var VSHADER_SOURCE =
  'attribute vec4 a_Position;\n' +
  'uniform mat4 u_ModelMatrix;\n' +
  'uniform mat4 u_GlobalRotateMatrix;\n' +
  'void main() {\n' +
  '  gl_Position = u_GlobalRotateMatrix * u_ModelMatrix * a_Position;\n' +
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
    
    gl.enable(gl.DEPTH_TEST);
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
    
    // Get the storage location of u_ModelMatrix
    u_ModelMatrix = gl.getUniformLocation(gl.program, 'u_ModelMatrix');
    if (!u_ModelMatrix) {
      console.log('Failed to get the storage location of u_ModelMatrix');
      return;
    }
    
    // Get the storage location of u_GlobalRotateMatrix
    u_GlobalRotateMatrix = gl.getUniformLocation(gl.program, 'u_GlobalRotateMatrix');
    if (!u_GlobalRotateMatrix) {
      console.log('Failed to get the storage location of u_GlobalRotateMatrix');
      return;
    }
    
    var identityM = new Matrix4();
    gl.uniformMatrix4fv(u_ModelMatrix, false, identityM.elements);
}

// UI element globals
let g_selectedColor = [1.0, 1.0, 1.0, 1.0];
let g_selectedSize = 10.0;
let g_animation = false;
let g_globalAngle = 0;
let g_redAngle = 0;
let g_yellowAngle = 0;
let g_magentaAngle = 0;



// Set up actions for the HTML UI elements
function addActionsForHTML() {
    // Button Events
    document.getElementById('animationOnButton').onclick = function() {
        g_animation = true;
    };
    document.getElementById('animationOffButton').onclick = function() {
        g_animation = false;
    };

    
    // Slider Events
    document.getElementById('angleSlide').addEventListener('mousemove', function() {
        g_globalAngle = this.value;
    });
    document.getElementById('redSlide').addEventListener('mousemove', function() {
        g_redAngle = this.value;
    });
    document.getElementById('yellowSlide').addEventListener('mousemove', function() {
        g_yellowAngle = this.value;
    });
    document.getElementById('magentaSlide').addEventListener('mousemove', function() {
        g_magentaAngle = this.value;
    });
}





function main() {
        setupWebGL();
        connectVariablesToGLSL();
        
        // Set up actions for the HTML UI elements
        addActionsForHTML();
        
        // Register function (event handler) to be called on a mouse press
        //canvas.onmousedown = click;
        //canvas.onmousemove = function(ev) { if(ev.buttons == 1) { click(ev) } };

        // Specify the color for clearing <canvas>
        gl.clearColor(0.0, 0.0, 0.0, 1.0);

        // Render
        //renderAllShapes();
        requestAnimationFrame(tick);
}

var g_startTime = performance.now()/1000.0;
var g_seconds = performance.now()/1000.0 - g_startTime;

// Called by browser repeatedly to render the scene
function tick() {
    
    g_seconds = performance.now()/1000.0 - g_startTime;
    console.log(g_seconds);
    
    // Changes the animation angles if needed
    updateAnimationAngles();
    
    // Renders the canvas
    renderAllShapes();
    
    requestAnimationFrame(tick);
}





var g_shapesList = [];

function updateAnimationAngles() {
    if (g_animation) {
        g_redAngle = (45 * Math.sin(g_seconds));
        let redSlide = document.getElementById('redSlide');
        redSlide.value = g_redAngle;
        
        g_yellowAngle = (45 * Math.sin(g_seconds - 1));
        let yellowSlide = document.getElementById('yellowSlide');
        yellowSlide.value = g_yellowAngle;
        
        g_magentaAngle = (45 * Math.sin(g_seconds - 2));
        let magentaSlide = document.getElementById('magentaSlide');
        magentaSlide.value = g_magentaAngle;
    }
}
     
// Draw every shape that is supposed to be in the canvas
function renderAllShapes() {
    // Pass the angle matrix to u_GlobalRotateMatrix
    var globalRotMat = new Matrix4().rotate(g_globalAngle, 1.0, 0.0, 0.0);
    gl.uniformMatrix4fv(u_GlobalRotateMatrix, false, globalRotMat.elements);
    
    // Clear <canvas>
    gl.clear(gl.COLOR_BUFFER_BIT);
    
    var bodyColor = [0.36, 0.54, 0.82, 1.0];
    
    // Body of the shark
    var body = new Cube();
    body.color = bodyColor;
    body.matrix.translate(-0.15, -0.35, -0.15);
    body.matrix.scale(0.3, 0.7, 0.3);
    body.render();
    
    var body2 = new Cube();
    body2.color = bodyColor;
    body2.matrix = new Matrix4(body.matrix);
    body2.matrix.translate(0.5, 0.025, 0.5);
    body2.matrix.scale(1.0, 0.95, 0.95);
    body2.matrix.rotate(g_redAngle, 0, 1, 0);
    body2.matrix.translate(0.0, 0.0, -0.5);
    body2.render();
    
    var body3 = new Cube();
    body3.color = bodyColor;
    body3.matrix = new Matrix4(body2.matrix);
    body3.matrix.translate(0.6, 0.075, 0.07);
    body3.matrix.scale(1.0, 0.85, 0.85);
    body3.matrix.rotate(g_redAngle, 0, 1, 0);
    body2.matrix.translate(0.0, 0.0, -0.5);
    body3.render();
    
    var body4 = new Cube();
    body4.color = bodyColor;
    body4.matrix = new Matrix4(body3.matrix);
    body4.matrix.translate(0.8, 0.15, 0.15);
    body4.matrix.scale(0.7, 0.7, 0.7);
    body3.matrix.rotate(g_redAngle, 0, 1, 0);
    body2.matrix.translate(0.0, 0.0, -0.5);
    body4.render();
    
    var body5 = new Cube();
    body5.color = bodyColor;
    body5.matrix = new Matrix4(body4.matrix);
    body5.matrix.translate(0.6, 0.15, 0.2);
    body5.matrix.scale(1.0, 0.7, 0.7);
    body3.matrix.rotate(g_redAngle, 0, 1, 0);
    body2.matrix.translate(0.0, 0.0, -0.5);
    body5.render();
    
    var fin1 = new Cube();
    fin1.color = bodyColor;
    fin1.matrix = new Matrix4(body.matrix);
    fin1.matrix.translate(0.4, 0.7, 0.45);
    fin1.matrix.rotate(45, 0, 0, 1);
    fin1.matrix.scale(0.5, 0.4, 0.1);
    fin1.render();
    
    var fin2 = new Cube();
    fin2.color = bodyColor;
    fin2.matrix = new Matrix4(body.matrix);
    fin2.matrix.translate(0.0, 0.08, 0.2);
    fin2.matrix.rotate(-45, 0, 0, 1);
    fin2.matrix.scale(0.35, 0.2, 0.1);
    fin2.render();
    
    var fin3 = new Cube();
    fin3.color = bodyColor;
    fin3.matrix = new Matrix4(fin2.matrix);
    fin3.matrix.translate(0.0, 0.0, 5.0);
    fin3.render();
    
    var backFin1 = new Cube();
    backFin1.color = bodyColor;
    backFin1.matrix = new Matrix4(body5.matrix);
    backFin1.matrix.translate(1.4, 0.55, 0.35);
    backFin1.matrix.rotate(45, 0, 0, 1);
    backFin1.matrix.scale(0.9, 0.7, 0.2);
    backFin1.matrix.translate(-0.5, 0.0, 0.0);
    backFin1.render();
    
    var backFin1Top = new Cube();
    backFin1Top.color = bodyColor;
    backFin1Top.matrix = new Matrix4(backFin1.matrix);
    backFin1Top.matrix.translate(1.0, 0.25, 0.25);
    backFin1Top.matrix.scale(0.5, 0.5, 0.5);
    backFin1Top.render();
    
    var backFin2 = new Cube();
    backFin2.color = bodyColor;
    backFin2.matrix = new Matrix4(body5.matrix);
    backFin2.matrix.translate(1.0, 0.0, 0.35);
    backFin2.matrix.rotate(-35, 0, 0, 1);
    backFin2.matrix.scale(0.8, 0.5, 0.2);
    backFin2.matrix.translate(-0.5, 0.0, 0.0);
    backFin2.render();
    
    var backFin2Top = new Cube();
    backFin2Top.color = bodyColor;
    backFin2Top.matrix = new Matrix4(backFin2.matrix);
    backFin2Top.matrix.translate(0.85, 0.25, 0.25);
    backFin2Top.matrix.scale(0.5, 0.5, 0.5);
    backFin2Top.render();
    
    
    
}
