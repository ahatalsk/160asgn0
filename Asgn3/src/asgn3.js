// Vertex shader program
var VSHADER_SOURCE = `
  precision mediump float;
  attribute vec4 a_Position;
  attribute vec2 a_UV;
  varying vec2 v_UV;
  uniform mat4 u_ModelMatrix;
  uniform mat4 u_GlobalRotateMatrix;
  uniform mat4 u_ViewMatrix;
  uniform mat4 u_ProjectionMatrix;
  void main() {
    gl_Position = u_ProjectionMatrix * u_ViewMatrix * u_GlobalRotateMatrix * u_ModelMatrix * a_Position;
    v_UV = a_UV;
  }`

// Fragment shader program
var FSHADER_SOURCE = `
  precision mediump float;
  varying vec2 v_UV;
  uniform vec4 u_FragColor;
  uniform sampler2D u_Sampler0;
  uniform sampler2D u_Sampler1;
  uniform sampler2D u_Sampler2;
  uniform int u_WhichTexture;
  void main() {
    if (u_WhichTexture == -4) {
      gl_FragColor = texture2D(u_Sampler2, v_UV);           // Use texture 2
    }
    else if (u_WhichTexture == -3) {
      gl_FragColor = texture2D(u_Sampler1, v_UV);           // Use texture 1
    }
    else if (u_WhichTexture == -2) {
      gl_FragColor = texture2D(u_Sampler0, v_UV);           // Use texture 0
    }
    else if (u_WhichTexture == -1) {
      gl_FragColor = u_FragColor;                           // Use color
    }
    else if (u_WhichTexture == 0) {
      gl_FragColor = vec4(v_UV, 1.0, 1.0);                  // Use UV debug color
    }
    else {
      gl_FragColor = vec4(1.0, 0.2, 0.2, 1.0);              // Error, put redish
    }
  }`





// Global variables
let canvas;
let gl;
let a_Position;
let a_UV
let u_Size;
let u_ModelMatrix;
let u_ProjectionMatrix;
let u_ViewMatrix;
let u_GlobalRotateMatrix;
let u_FragColor;
let u_Sampler0;
let u_Sampler1;
let u_Sampler2;
let u_WhichTexture;

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

    // Get the storage location of a_Position
    a_Position = gl.getAttribLocation(gl.program, 'a_Position');
    if (a_Position < 0) {
      console.log('Failed to get the storage location of a_Position');
      return;
    }

    // Get the storage location of a_UV
    a_UV = gl.getAttribLocation(gl.program, 'a_UV');
    if (a_UV < 0) {
      console.log('Failed to get the storage location of a_UV');
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
    
    // Get the storage location of u_ViewMatrix
    u_ViewMatrix = gl.getUniformLocation(gl.program, 'u_ViewMatrix');
    if (!u_ViewMatrix) {
      console.log('Failed to get the storage location of u_ViewMatrix');
      return;
    }
    
    // Get the storage location of u_GlobalRotateMatrix
    u_ProjectionMatrix = gl.getUniformLocation(gl.program, 'u_ProjectionMatrix');
    if (!u_ProjectionMatrix) {
      console.log('Failed to get the storage location of u_ProjectionMatrix');
      return;
    }
    
    // Get the storage location of u_FragColor
    u_FragColor = gl.getUniformLocation(gl.program, 'u_FragColor');
    if (!u_FragColor) {
      console.log('Failed to get the storage location of u_FragColor');
      return;
    }
    
    // Get the storage location of u_Sampler0
    u_Sampler0 = gl.getUniformLocation(gl.program, 'u_Sampler0');
    if (!u_Sampler0) {
      console.log('Failed to get the storage location of u_Sampler0');
      return false;
    }
    
    // Get the storage location of u_Sampler1
    u_Sampler1 = gl.getUniformLocation(gl.program, 'u_Sampler1');
    if (!u_Sampler1) {
      console.log('Failed to get the storage location of u_Sampler1');
      return false;
    }
    
    // Get the storage location of u_Sampler2
    u_Sampler2 = gl.getUniformLocation(gl.program, 'u_Sampler2');
    if (!u_Sampler2) {
      console.log('Failed to get the storage location of u_Sampler2');
      return false;
    }
    
    // Get the storage location of u_whichTexture
    u_WhichTexture = gl.getUniformLocation(gl.program, 'u_WhichTexture');
    if (!u_WhichTexture) {
      console.log('Failed to get the storage location of u_WhichTexture');
      return;
    }
    
    var identityM = new Matrix4();
    gl.uniformMatrix4fv(u_ModelMatrix, false, identityM.elements);
}



// UI element globals
let g_animation = false;
let g_event = false;
let g_globalAnglex = 0;
let g_globalAngley = 0;
let g_vertical = false;
let g_tailAngle1 = 0;
let g_tailAngle2 = 0;
let g_tailAngle3 = 0;
let g_tailAngle4 = 0;
let g_tailAngle5 = 0;
let g_jawAngle = 30;
let g_finx = -15;
let g_finy = -15;
let g_eyebrowWidth = 0.1;
let g_littleFishLocation = 0.4;



// Set up actions for the HTML UI elements
function addActionsForHTML() {
    // Button events
    document.getElementById('frontButton').onclick = function() {
        g_globalAnglex = 0;
        g_globalAngley = 0;
        let gAngle = document.getElementById('angleSlide');
        gAngle.value = 0;
    };
    document.getElementById('backButton').onclick = function() {
        g_globalAnglex = 180;
        g_globalAngley = 0;
        let gAngle = document.getElementById('angleSlide');
        gAngle.value = 180;
    };
    document.getElementById('topButton').onclick = function() {
        g_globalAnglex = 0;
        g_globalAngley = 90;
        let gAngle = document.getElementById('angleSlide');
        gAngle.value = 0;
    };
    document.getElementById('bottomButton').onclick = function() {
        g_globalAnglex = 0;
        g_globalAngley = -90;
        let gAngle = document.getElementById('angleSlide');
        gAngle.value = 0;
    };
    document.getElementById('headButton').onclick = function() {
        g_globalAnglex = -90;
        g_globalAngley = 0;
        let gAngle = document.getElementById('angleSlide');
        gAngle.value = -90;
    };
    document.getElementById('tailButton').onclick = function() {
        g_globalAnglex = 90;
        g_globalAngley = 0;
        let gAngle = document.getElementById('angleSlide');
        gAngle.value = 90;
    };
    
    // Slider Events
    document.getElementById('angleSlide').addEventListener('mousemove', function() {
        g_globalAnglex = this.value;
    });
}


// Initializes the textures
// Copied from WebGL Programming Guide ch.5
function initTextures() {
  // Create a texture object
  var texture0 = gl.createTexture();
  var texture1 = gl.createTexture();
  var texture2 = gl.createTexture();
  if (!texture0 || !texture1 || !texture2) {
    console.log('Failed to create the texture object');
    return false;
  }

  // Create the image object
  var image0 = new Image();
  var image1 = new Image();
  var image2 = new Image();
  if (!image0 || !image1 || !image2) {
    console.log('Failed to create the image object');
    return false;
  }
  // Register the event handler to be called when image loading is completed
  image0.onload = function(){ loadTexture(texture0, u_Sampler0, image0, 0); };
  image1.onload = function(){ loadTexture(texture1, u_Sampler1, image1, 1); };
  image2.onload = function(){ loadTexture(texture2, u_Sampler2, image2, 2); };
  // Tell the browser to load an Image
  image0.src = '../lib/images/pinkFlowers.jpg';
  image1.src = '../lib/images/grass.jpg';
  image2.src = '../lib/images/skyGrass.jpg';

  return true;
}

// Specify whether the texture unit is ready to use
var g_texUnit0 = false, g_texUnit1 = false, g_texUnit2 = false;
function loadTexture(texture, u_Sampler, image, texUnit) {
  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);// Flip the image's y-axis
  // Make the texture unit active
  if (texUnit == 0) {
    gl.activeTexture(gl.TEXTURE0);
    g_texUnit0 = true;
  } else if (texUnit == 1){
    gl.activeTexture(gl.TEXTURE1);
    g_texUnit1 = true;
  } else {
    gl.activeTexture(gl.TEXTURE2);
    g_texUnit2 = true;
  }
  // Bind the texture object to the target
  gl.bindTexture(gl.TEXTURE_2D, texture);

  // Set texture parameters
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  // Set the image to texture
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
  
  gl.uniform1i(u_Sampler, texUnit);   // Pass the texure unit to u_Sampler
  
  // Clear <canvas>
  gl.clear(gl.COLOR_BUFFER_BIT);

  if (g_texUnit0 && g_texUnit1 && g_texUnit2) {
      return;
  }
}




// Complete setup and start the rendering sequence
function main() {
        setupWebGL();
        connectVariablesToGLSL();
        
        // Set up actions for the HTML UI elements
        addActionsForHTML();
    
        // Set up the textures
        initTextures();
    
        // Specify the color for clearing <canvas>
        gl.clearColor(0.0, 0.0, 0.0, 1.0);

        // Start rendering sequence
        requestAnimationFrame(tick);
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





// Called by browser repeatedly to render the scene
function tick() {
    
    // Renders the canvas
    renderScene();
    
    // Repeat the sequence
    requestAnimationFrame(tick);
}


         
var g_eye = [0, 0, 3];
var g_at = [0, 0, -100];
var g_up = [0, 1, 0];
         
// Draw every shape that is supposed to be in the canvas
function renderScene() {
    var projMat = new Matrix4();
    projMat.setPerspective(60, canvas.width/canvas.height, 0.1, 100); // (angle, aspect ratio,
    gl.uniformMatrix4fv(u_ProjectionMatrix, false, projMat.elements);
        
    var viewMat = new Matrix4();
    viewMat.setLookAt(0, 0, 3,   0, 0, -100,    0, 1, 0); // (eye, at, up)
    gl.uniformMatrix4fv(u_ViewMatrix, false, viewMat.elements);
        
    // Pass the angle matrix to u_GlobalRotateMatrix
    var globalRotMat = new Matrix4().rotate(g_globalAnglex, 0, 1, 0);
    globalRotMat.rotate(g_globalAngley, 1, 0, 0);
    gl.uniformMatrix4fv(u_GlobalRotateMatrix, false, globalRotMat.elements);
    
    // Clear <canvas>
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    
    
    
        
    var grass = new Cube();
    grass.color = [0.3, 1.0, 1.0, 1.0];
    grass.textureNum = -3;
    grass.matrix.translate(0, -0.5, 0);
    grass.matrix.scale(5, 0, 5);
    grass.matrix.translate(-0.5, -0.5, -0.5);
    grass.render();
    
    var flowers = new Cube();
    flowers.color = [1.0, 0.0, 1.0, 1.0];
    flowers.textureNum = -2;
    flowers.matrix.translate(-0.15, -0.499, 0.0);
    flowers.matrix.scale(0.4, 0.4, 0.4);
    flowers.matrix.translate(0.0, 0.0, -0.5);
    flowers.render();
        
    var cube = new Cube();
    cube.color = [0.5, 0.5, 0.5, 1.0];
    cube.textureNum = -1;
    cube.matrix.translate(-1.0, -0.499, 1.5);
    cube.matrix.scale(0.3, 0.7, 0.3);
    cube.matrix.translate(0.0, 0.0, -2.0);
    cube.render();
        
    var sky = new Cube();
    sky.color = [0.5, 0.8, 1.0, 1.0];
    sky.textureNum = -4;
    sky.matrix.scale(50, 50, 50);
    sky.matrix.translate(-0.5, -0.5, -0.5);
    sky.render();
        
}
         
function sendTextToHTML(text, htmlID) {
        var element = document.getElementById(htmlID);
        if (!element) {
            console.log("Failed to get element from HTML");
            return;
        }
        element.innerHTML = text;
}
