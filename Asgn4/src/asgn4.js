// Vertex shader program
var VSHADER_SOURCE = `
  precision mediump float;
  attribute vec4 a_Position;
  attribute vec2 a_UV;
  attribute vec3 a_Normal;
  varying vec2 v_UV;
  varying vec3 v_Normal;
  varying vec4 v_VertPos;
  uniform mat4 u_ModelMatrix;
  uniform mat4 u_NormalMatrix;
  uniform mat4 u_GlobalRotateMatrix;
  uniform mat4 u_ViewMatrix;
  uniform mat4 u_ProjectionMatrix;
  void main() {
    gl_Position = u_ProjectionMatrix * u_ViewMatrix * u_GlobalRotateMatrix * u_ModelMatrix * a_Position;
    v_UV = a_UV;
    v_Normal = normalize(vec3(u_NormalMatrix * vec4(a_Normal, 1)));
    v_VertPos = u_ModelMatrix * a_Position;
  }`

// Fragment shader program
var FSHADER_SOURCE = `
  precision mediump float;
  varying vec2 v_UV;
  varying vec3 v_Normal;
  uniform vec4 u_FragColor;
  uniform sampler2D u_Sampler0;
  uniform sampler2D u_Sampler1;
  uniform sampler2D u_Sampler2;
  uniform sampler2D u_Sampler3;
  uniform sampler2D u_Sampler4;
  uniform int u_WhichTexture;
  uniform vec3 u_LightPos;
  uniform vec4 u_LightColor;
  uniform vec3 u_SpotLightPos;
  uniform vec3 u_SpotLightLook;
  uniform float u_SpotLightRadius;
  uniform vec3 u_CameraPos;
  varying vec4 v_VertPos;
  uniform bool u_LightOn;
  uniform bool u_SpotLightOn;
  void main() {
    if (u_WhichTexture == -7) {
      gl_FragColor = vec4((v_Normal + 1.0) / 2.0, 1.0);     // Use normal
    }
    else if (u_WhichTexture == -6) {
      gl_FragColor = texture2D(u_Sampler4, v_UV);           // Use texture 4
    }
    else if (u_WhichTexture == -5) {
      gl_FragColor = texture2D(u_Sampler3, v_UV);           // Use texture 3
    }
    else if (u_WhichTexture == -4) {
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

    vec3 lightVector = u_LightPos - vec3(v_VertPos);
    float r = length(lightVector);

    // Diffuse
    vec3 L = normalize(lightVector);
    vec3 N = normalize(v_Normal);
    float NdotL = max(dot(N, L), 0.0);
    vec3 diffuse = vec3(gl_FragColor) * NdotL;

    // Specular
    vec3 R = reflect(-L, N);
    vec3 E = normalize(u_CameraPos - vec3(v_VertPos));
    float specular = pow(max(dot(E, R), 0.0), 32.0) * 0.8;

    // Ambient
    vec3 ambient = vec3(gl_FragColor) * 0.4;

    if (u_LightOn) {
      gl_FragColor = vec4(specular + diffuse + ambient, 1.0) * u_LightColor;
    }

    if (u_SpotLightOn) {
      vec3 TL = normalize(u_SpotLightPos - u_SpotLightLook);
      vec3 VL = normalize(u_SpotLightPos - vec3(v_VertPos));

      float TLdotVL = max(dot(TL, VL), 0.0);
      if (TLdotVL > (1.0 - u_SpotLightRadius)) {
        gl_FragColor = gl_FragColor + 0.5;
      }
    }
  }`





// Global variables
let canvas;
let gl;
let a_Position;
let a_UV
let a_Normal;
let u_Size;
let u_ModelMatrix;
let u_NormalMatrix;
let u_ProjectionMatrix;
let u_ViewMatrix;
let u_GlobalRotateMatrix;
let u_FragColor;
let u_Sampler0;
let u_Sampler1;
let u_Sampler2;
let u_Sampler3;
let u_Sampler4;
let u_WhichTexture;
let u_LightPos;
let u_LightColor;
let u_SpotLightPos;
let u_SpotLightLook;
let u_SpotLightRadius;
let u_CameraPos;
let u_LightOn;
let u_SpotLightOn;

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

    // Get the storage location of a_Normal
    a_Normal = gl.getAttribLocation(gl.program, 'a_Normal');
    if (a_Normal < 0) {
      console.log('Failed to get the storage location of a_Normal');
      return;
    }
    
    // Get the storage location of u_ModelMatrix
    u_ModelMatrix = gl.getUniformLocation(gl.program, 'u_ModelMatrix');
    if (!u_ModelMatrix) {
      console.log('Failed to get the storage location of u_ModelMatrix');
      return;
    }

    // Get the storage location of u_NormalMatrix
    u_NormalMatrix = gl.getUniformLocation(gl.program, 'u_NormalMatrix');
    if (!u_NormalMatrix) {
      console.log('Failed to get the storage location of u_NormalMatrix');
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

    // Get the storage location of u_Sampler3
    u_Sampler3 = gl.getUniformLocation(gl.program, 'u_Sampler3');
    if (!u_Sampler3) {
      console.log('Failed to get the storage location of u_Sampler3');
      return false;
    }
    
    // Get the storage location of u_Sampler4
    u_Sampler4 = gl.getUniformLocation(gl.program, 'u_Sampler4');
    if (!u_Sampler4) {
      console.log('Failed to get the storage location of u_Sampler4');
      return false;
    }
    
    // Get the storage location of u_WhichTexture
    u_WhichTexture = gl.getUniformLocation(gl.program, 'u_WhichTexture');
    if (!u_WhichTexture) {
      console.log('Failed to get the storage location of u_WhichTexture');
      return;
    }

    // Get the storage location of u_LightPos
    u_LightPos = gl.getUniformLocation(gl.program, 'u_LightPos');
    if (!u_LightPos) {
      console.log('Failed to get the storage location of u_LightPos');
      return;
    }

    // Get the storage location of u_LightColor
    u_LightColor = gl.getUniformLocation(gl.program, 'u_LightColor');
    if (!u_LightColor) {
      console.log('Failed to get the storage location of u_LightColor');
      return;
    }

     // Get the storage location of u_SpotLightPos
     u_SpotLightPos = gl.getUniformLocation(gl.program, 'u_SpotLightPos');
     if (!u_SpotLightPos) {
       console.log('Failed to get the storage location of u_SpotLightPos');
       return;
     }
 
     // Get the storage location of u_SpotLightLook
     u_SpotLightLook = gl.getUniformLocation(gl.program, 'u_SpotLightLook');
     if (!u_SpotLightLook) {
       console.log('Failed to get the storage location of u_SpotLightLook');
       return;
     }

     // Get the storage location of u_SpotLightRadius
     u_SpotLightRadius = gl.getUniformLocation(gl.program, 'u_SpotLightRadius');
     if (!u_SpotLightRadius) {
       console.log('Failed to get the storage location of u_SpotLightRadius');
       return;
     }

    // Get the storage location of u_CameraPos
    u_CameraPos = gl.getUniformLocation(gl.program, 'u_CameraPos');
    if (!u_CameraPos) {
      console.log('Failed to get the storage location of u_CameraPos');
      return;
    }

    // Get the storage location of u_LightOn
    u_LightOn = gl.getUniformLocation(gl.program, 'u_LightOn');
    if (!u_LightOn) {
      console.log('Failed to get the storage location of u_LightOn');
      return;
    }

    // Get the storage location of u_SpotLightOn
    u_SpotLightOn = gl.getUniformLocation(gl.program, 'u_SpotLightOn');
    if (!u_SpotLightOn) {
      console.log('Failed to get the storage location of u_SpotLightOn');
      return;
    }
    
    var identityM = new Matrix4();
    gl.uniformMatrix4fv(u_ModelMatrix, false, identityM.elements);
}



// UI element globals
let g_globalAnglex = 0;
let g_globalAngley = 0;
let g_flowerFrequency = 0.8;
let g_normalOn = false;
let g_lightPos = [0, 1.5, 0];
let g_lightColor = [1.0, 1.0, 1.0, 1.0];
let g_spotLightPos = [0, 5, 0];
let g_spotLightLook = [0, -1, 0];
let g_spotLightRadius = 0.05;
let g_lightOn = false;
let g_spotLightOn = false;
let g_animation = false;
let g_spotAnimation = false;



// Set up actions for the HTML UI elements
function addActionsForHTML() {
    // Button events
    document.getElementById('normalOn').onclick = function() {
      g_normalOn = true;
    };
    document.getElementById('normalOff').onclick = function() {
      g_normalOn = false;
    };
    document.getElementById('lightOn').onclick = function() {
      g_lightOn = true;
    };
    document.getElementById('spotLightOn').onclick = function() {
      g_spotLightOn = true;
    };
    document.getElementById('lightOff').onclick = function() {
      g_lightOn = false;
      g_spotLightOn = false;
    };
    document.getElementById('animationOn').onclick = function() {
      g_animation = true;
    };
    document.getElementById('spotAnimationOn').onclick = function() {
      g_spotAnimation = true;
    };
    document.getElementById('animationOff').onclick = function() {
      g_animation = false;
      g_spotAnimation = false;
    };
    document.getElementById('mazeButton').onclick = function() {
        // Randomly selects which corner the camera will start in
        let location = Math.random();
        if (location > 0.75) {
            g_camera.eye = new Vector3([14.5, 1.5, 14.5]);
            console.log("Bottom Right!")
        } else if (location > 0.5) {
            g_camera.eye = new Vector3([-14.5, 1.5, 14.5]);
            console.log("Bottom Left!")
        } else if (location > 0.25) {
            g_camera.eye = new Vector3([14.5, 1.5, -14.5]);
            console.log("Top Right!")
        } else {
            g_camera.eye = new Vector3([-14.5, 1.5, -14.5]);
            console.log("Top Left!")
        }
    };
    document.getElementById('resetButton').onclick = function() {
        g_camera.eye = new Vector3([0, 1.5, 6]);
        g_camera.at = new Vector3([0, 0, -100]);
    };
    document.getElementById('topViewButton').onclick = function() {
      g_camera.eye = new Vector3([0, 29, 0.1]);
      g_camera.at = new Vector3([0, -100, 0]);
    };
    document.getElementById('breakButton').onclick = function() {
        deleteBlock();
    };
    document.getElementById('addButton').onclick = function() {
        addBlock();
    };
    
    // Slider Events
    document.getElementById('flowerSlide').addEventListener('mousemove', function() {
      g_flowerFrequency = 1 - this.value;
    });
    document.getElementById('lightSlideX').addEventListener('mousemove', function() {
      g_lightPos[0] = this.value;
    });
    document.getElementById('lightSlideY').addEventListener('mousemove', function() {
      g_lightPos[1] = this.value;
    });
    document.getElementById('lightSlideZ').addEventListener('mousemove', function() {
      g_lightPos[2] = this.value;
    });
    document.getElementById('colorSlideR').addEventListener('mousemove', function() {
      g_lightColor[0] = this.value;
    });
    document.getElementById('colorSlideG').addEventListener('mousemove', function() {
      g_lightColor[1] = this.value;
    });
    document.getElementById('colorSlideB').addEventListener('mousemove', function() {
      g_lightColor[2] = this.value;
    });
    document.getElementById('spotLightRadius').addEventListener('mousemove', function() {
      g_spotLightRadius = this.value;
    });
}


// Initializes the textures
// Copied from WebGL Programming Guide ch.5
function initTextures() {
  // Create a texture object
  var texture0 = gl.createTexture();
  var texture1 = gl.createTexture();
  var texture2 = gl.createTexture();
  var texture3 = gl.createTexture();
  var texture4 = gl.createTexture();
  if (!texture0 || !texture1 || !texture2 || !texture3 || !texture4) {
    console.log('Failed to create the texture object');
    return false;
  }

  // Create the image object
  var image0 = new Image();
  var image1 = new Image();
  var image2 = new Image();
  var image3 = new Image();
  var image4 = new Image();
  if (!image0 || !image1 || !image2 || !image3 || !image4) {
    console.log('Failed to create the image object');
    return false;
  }
  // Register the event handler to be called when image loading is completed
  image0.onload = function(){ loadTexture(texture0, u_Sampler0, image0, 0); };
  image1.onload = function(){ loadTexture(texture1, u_Sampler1, image1, 1); };
  image2.onload = function(){ loadTexture(texture2, u_Sampler2, image2, 2); };
  image3.onload = function(){ loadTexture(texture3, u_Sampler3, image3, 3); };
  image4.onload = function(){ loadTexture(texture4, u_Sampler4, image4, 4); };
  // Tell the browser to load an Image
  image0.src = '../lib/images/pixelFlower3.jpg';
  image1.src = '../lib/images/cobblestone.jpg';
  image2.src = '../lib/images/clouds.jpg';
  image3.src = '../lib/images/bark.jpg';
  image4.src = '../lib/images/flowerTree.jpg';

  return true;
}

// Specify whether the texture unit is ready to use
var g_texUnit0 = false, g_texUnit1 = false, g_texUnit2 = false, g_texUnit3 = false, g_texUnit4 = false;;
function loadTexture(texture, u_Sampler, image, texUnit) {
  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);// Flip the image's y-axis
  // Make the texture unit active
  if (texUnit == 0) {
    gl.activeTexture(gl.TEXTURE0);
    g_texUnit0 = true;
  } else if (texUnit == 1){
    gl.activeTexture(gl.TEXTURE1);
    g_texUnit1 = true;
  } else if (texUnit == 2){
    gl.activeTexture(gl.TEXTURE2);
    g_texUnit2 = true;
  } else if (texUnit == 3){
    gl.activeTexture(gl.TEXTURE3);
    g_texUnit3 = true;
  } else {
    gl.activeTexture(gl.TEXTURE4);
    g_texUnit4 = true;
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

  if (g_texUnit0 && g_texUnit1 && g_texUnit2 && g_texUnit3 && g_texUnit4) {
      return;
  }
}




// Complete setup and start the rendering sequence
function main() {
        setupWebGL();
        connectVariablesToGLSL();
        
        // Set up actions for the HTML UI elements
        addActionsForHTML();

        // Register event for when the keyboard is pressed
        document.onkeydown = keydown;
    
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




var g_startTime = performance.now()/1000.0;
var g_seconds = performance.now()/1000.0 - g_startTime;
// Called by browser repeatedly to render the scene
function tick() {
    // Calculate the # of seconds since start time
    g_seconds = performance.now()/1000.0 - g_startTime;

    // Animate
    updateAnimation();
    
    // Renders the canvas
    renderScene();
    
    // Repeat the sequence
    requestAnimationFrame(tick);
}


let g_camera = new Camera();

let g_map = [
  [4, 4, 4, 4, 4, 4, 4, 4,    4, 4, 4, 4, 4, 4, 4, 4,    4, 4, 4, 4, 4, 4, 4, 4,    4, 4, 4, 4, 4, 4, 4, 4],
  [4, 5, 5, 5, 5, 5, 5, 5,    5, 5, 5, 3, 5, 5, 5, 5,    5, 5, 1, 2, 2, 3, 3, 2,    2, 2, 2, 5, 5, 5, 5, 4],
  [4, 5, 2, 2, 3, 5, 3, 3,    2, 2, 5, 2, 5, 3, 3, 3,    2, 2, 1, 5, 5, 5, 5, 5,    5, 5, 5, 5, 1, 1, 5, 4],
  [4, 5, 5, 5, 3, 5, 5, 5,    5, 3, 5, 1, 5, 5, 5, 5,    5, 5, 5, 5, 1, 1, 2, 5,    2, 2, 1, 1, 2, 5, 5, 4],
  [4, 3, 2, 2, 2, 2, 3, 3,    5, 3, 5, 1, 5, 2, 2, 2,    1, 1, 2, 5, 1, 5, 5, 5,    5, 5, 5, 5, 5, 5, 1, 4],
  [4, 5, 5, 5, 5, 5, 3, 5,    5, 3, 5, 5, 5, 2, 5, 5,    5, 5, 2, 5, 2, 5, 2, 2,    2, 3, 3, 3, 3, 2, 2, 4],
  [4, 5, 3, 3, 2, 5, 2, 5,    1, 3, 5, 2, 5, 2, 5, 1,    1, 5, 2, 5, 2, 5, 5, 5,    5, 5, 5, 5, 5, 5, 2, 4],
  [4, 5, 3, 5, 2, 5, 3, 5,    5, 5, 5, 3, 5, 3, 5, 2,    2, 3, 3, 5, 3, 3, 5, 2,    1, 1, 1, 5, 2, 5, 1, 4],
  
  [4, 5, 2, 5, 2, 5, 3, 5,    3, 3, 5, 3, 5, 5, 5, 5,    5, 5, 5, 5, 3, 5, 5, 2,    5, 5, 5, 5, 2, 5, 5, 4],
  [4, 5, 2, 5, 2, 5, 5, 5,    5, 3, 3, 3, 3, 3, 3, 0,    0, 3, 3, 3, 3, 3, 3, 3,    5, 2, 2, 3, 3, 5, 1, 4],
  [4, 5, 1, 5, 5, 5, 2, 3,    5, 3, 0, 0, 0, 0, 0, 0,    0, 0, 0, 0, 0, 0, 3, 5,    5, 2, 5, 5, 5, 5, 5, 4],
  [4, 5, 1, 1, 2, 3, 2, 5,    5, 3, 0, 0, 0, 0, 0, 0,    0, 0, 0, 0, 0, 0, 3, 5,    1, 1, 5, 1, 1, 1, 1, 4],
  [4, 5, 5, 5, 5, 5, 2, 2,    3, 3, 0, 0, 8, 0, 0, 0,    0, 0, 0, 8, 0, 0, 3, 5,    1, 1, 5, 1, 5, 5, 5, 4],
  [4, 3, 5, 3, 3, 5, 5, 5,    5, 3, 0, 0, 0, 0, 0, 0,    0, 0, 0, 0, 0, 0, 3, 5,    5, 2, 5, 1, 5, 1, 1, 4],
  [4, 5, 5, 5, 3, 2, 3, 3,    3, 3, 0, 0, 0, 0, 5, 6,    6, 5, 0, 0, 0, 0, 3, 2,    1, 2, 5, 5, 5, 5, 5, 4],
  [4, 5, 1, 5, 5, 5, 5, 5,    5, 5, 5, 5, 5, 5, 6, 7,    7, 6, 5, 5, 5, 5, 5, 5,    5, 2, 5, 1, 2, 2, 5, 4],

  [4, 5, 2, 3, 4, 2, 2, 3,    5, 5, 5, 5, 5, 5, 6, 7,    7, 6, 5, 5, 5, 5, 5, 5,    5, 3, 5, 1, 5, 3, 5, 4],
  [4, 5, 5, 5, 5, 5, 5, 5,    3, 3, 0, 0, 0, 0, 5, 6,    6, 5, 0, 0, 0, 0, 3, 2,    5, 3, 5, 1, 5, 3, 5, 4],
  [4, 3, 2, 2, 5, 2, 3, 3,    3, 3, 0, 0, 0, 0, 0, 0,    0, 0, 0, 0, 0, 0, 3, 2,    5, 5, 5, 2, 5, 2, 5, 4],
  [4, 5, 5, 5, 5, 5, 5, 5,    5, 3, 0, 0, 8, 0, 0, 0,    0, 0, 0, 8, 0, 0, 3, 2,    2, 3, 5, 2, 5, 1, 5, 4],
  [4, 5, 3, 3, 2, 2, 2, 2,    5, 3, 0, 0, 0, 0, 0, 0,    0, 0, 0, 0, 0, 0, 3, 5,    5, 3, 5, 2, 5, 5, 5, 4],
  [4, 5, 5, 5, 5, 5, 2, 3,    5, 3, 0, 0, 0, 0, 0, 0,    0, 0, 0, 0, 0, 0, 3, 2,    5, 2, 5, 2, 3, 3, 3, 4],
  [4, 2, 2, 3, 3, 5, 3, 5,    5, 5, 3, 3, 3, 3, 3, 0,    0, 3, 3, 3, 3, 3, 3, 2,    5, 2, 5, 5, 5, 5, 3, 4],
  [4, 5, 5, 5, 3, 5, 3, 3,    3, 3, 3, 5, 5, 5, 3, 3,    5, 3, 3, 5, 2, 2, 5, 5,    5, 2, 1, 1, 2, 5, 5, 4],

  [4, 5, 1, 2, 2, 5, 5, 5,    5, 3, 5, 5, 2, 5, 5, 5,    5, 3, 5, 5, 2, 5, 5, 2,    2, 2, 5, 5, 2, 1, 5, 4],
  [4, 5, 5, 5, 2, 2, 3, 3,    5, 3, 5, 2, 2, 2, 1, 1,    5, 3, 5, 1, 2, 5, 2, 2,    5, 1, 1, 5, 5, 5, 5, 4],
  [4, 5, 3, 5, 5, 5, 5, 3,    5, 2, 5, 1, 5, 5, 5, 5,    5, 3, 5, 1, 5, 5, 3, 5,    5, 5, 2, 2, 2, 3, 5, 4],
  [4, 5, 3, 3, 2, 2, 3, 3,    5, 2, 2, 2, 5, 1, 5, 1,    5, 2, 5, 5, 5, 1, 2, 5,    1, 5, 2, 5, 5, 5, 5, 4],
  [4, 5, 5, 5, 5, 5, 5, 3,    5, 5, 5, 5, 5, 1, 5, 2,    5, 2, 5, 1, 5, 5, 5, 5,    2, 5, 2, 5, 3, 3, 3, 4],
  [4, 3, 3, 2, 5, 1, 2, 2,    5, 3, 3, 2, 2, 2, 5, 2,    5, 1, 5, 2, 5, 1, 1, 2,    3, 5, 3, 5, 5, 5, 2, 4],
  [4, 5, 5, 5, 5, 5, 5, 5,    5, 3, 5, 5, 5, 5, 5, 3,    5, 5, 5, 3, 5, 5, 5, 5,    5, 5, 5, 5, 3, 5, 5, 4],
  [4, 4, 4, 4, 4, 4, 4, 4,    4, 4, 4, 4, 4, 4, 4, 4,    4, 4, 4, 4, 4, 4, 4, 4,    4, 4, 4, 4, 4, 4, 4, 4],
];

g_flowers = [
  Array.from({length: 14}, () => Math.random()),
  Array.from({length: 14}, () => Math.random()),
  Array.from({length: 14}, () => Math.random()),
  Array.from({length: 14}, () => Math.random()),
  Array.from({length: 14}, () => Math.random()),
  Array.from({length: 14}, () => Math.random()),
  Array.from({length: 14}, () => Math.random()),
  Array.from({length: 14}, () => Math.random()),
  Array.from({length: 14}, () => Math.random()),
  Array.from({length: 14}, () => Math.random()),
  Array.from({length: 14}, () => Math.random()),
  Array.from({length: 14}, () => Math.random()),
  Array.from({length: 14}, () => Math.random()),
  Array.from({length: 14}, () => Math.random()),
];

function drawMap() {
  for (x = 0; x < 32; x++) {
    for (y = 0; y < 32; y++) {
      // Numbers < 5 are special values in the map
      if (g_map[x][y] > 4) {
        if (g_map[x][y] == 5) {
          var body = new Cube();
          body.color = [0.5, 0.5, 0.5, 1.0];
          if (g_normalOn) {body.textureNum = -7;} else {body.textureNum = -1;}
          body.matrix.translate(y - 15.75, -0.05, x - 15.75);
          body.matrix.scale(0.5, 0.1, 0.5);
          body.render();
        }
        else if (g_map[x][y] == 6) {
          var body = new Cube();
          if (g_normalOn) {body.textureNum = -7;} else {body.textureNum = -3;}
          body.matrix.translate(y - 16, -0.3, x - 16);
          body.matrix.scale(1.0, 1.0, 1.0);
          body.render();
        }
        else if (g_map[x][y] == 7) {
          var body = new Cube();
          body.color = [0.3, 0.4, 1.0, 0.8];
          if (g_normalOn) {body.textureNum = -7;} else {body.textureNum = -1;}
          body.matrix.translate(y - 16, -0.05, x - 16);
          body.matrix.scale(1.0, 0.7, 1.0);
          body.render();
        }
        else if (g_map[x][y] == 8) {
          drawTree(x, y);
        }

      }
      // Numbers 1-4 are wall values in the map
      else {
        if (g_map[x][y] > 0) {
          var body = new Cube();
          if (g_normalOn) {body.textureNum = -7;} else {body.textureNum = -2;}
          body.matrix.translate(y - 16, 0.001, x - 16);
          body.render();
        }
        if (g_map[x][y] > 1) {
          var body = new Cube();
          if (g_normalOn) {body.textureNum = -7;} else {body.textureNum = -2;}
          body.matrix.translate(y - 16, 1.0, x - 16);
          body.render();
        }
        if (g_map[x][y] > 2) {
          var body = new Cube();
          if (g_normalOn) {body.textureNum = -7;} else {body.textureNum = -2;}
          body.matrix.translate(y - 16, 2.0, x - 16);
          body.render();
        }
        if (g_map[x][y] > 3) {
          var body = new Cube();
          if (g_normalOn) {body.textureNum = -7;} else {body.textureNum = -2;}
          body.matrix.translate(y - 16, 3.0, x - 16);
          body.render();
        }
      }
    }
  }

  // fill in the rest of the empty center with flowers
  for (x = 10; x <22; x++) {
    for (y = 10; y < 22; y++) {
      // 0 in the center is empty, but with a ranom chance to generate a flower
      if (g_map[x][y] == 0) {
        if (g_flowers[x-9][y-9] > g_flowerFrequency) {
          drawFlower(x, y);
        }
      }
    }
  }
}

// Functions to draw specialty figures
function drawTree(x, y) {
  var body = new Cube();
  body.color = [0.0, 0.0, 1.0, 1.0];
  if (g_normalOn) {body.textureNum = -7;} else {body.textureNum = -5;}       
  body.matrix.translate(y - 15.75, -0.05, x - 15.75);
  body.matrix.scale(0.5, 1.0, 0.5);
  body.render();

  var body2 = new Cube();
  body2.color = [0.0, 0.0, 1.0, 1.0];
  if (g_normalOn) {body2.textureNum = -7;} else {body2.textureNum = -5;}
  body2.matrix.translate(y - 15.75, 0.95, x - 15.75);
  body2.matrix.scale(0.5, 1.0, 0.5);
  body2.render();

  var body3 = new Cube();
  body3.color = [0.0, 0.0, 1.0, 1.0];
  if (g_normalOn) {body3.textureNum = -7;} else {body3.textureNum = -6;}
  body3.matrix.translate(y - 16, 1.95, x - 16);
  body3.matrix.scale(1.0, 2.0, 1.0);
  body3.render();

  var body4 = new Cube();
  body4.color = [0.0, 0.0, 1.0, 1.0];
  if (g_normalOn) {body4.textureNum = -7;} else {body4.textureNum = -6;}
  body4.matrix.translate(y - 15, 1.95, x - 16);
  body4.matrix.scale(1.0, 1.5, 1.0);
  body4.render();

  var body5 = new Cube();
  body5.color = [0.0, 0.0, 1.0, 1.0];
  if (g_normalOn) {body5.textureNum = -7;} else {body5.textureNum = -6;}
  body5.matrix.translate(y - 16, 1.95, x - 15);
  body5.matrix.scale(1.0, 1.5, 1.0);
  body5.render();

  var body6 = new Cube();
  body6.color = [0.0, 0.0, 1.0, 1.0];
  if (g_normalOn) {body6.textureNum = -7;} else {body6.textureNum = -6;}
  body6.matrix.translate(y - 17, 1.95, x - 16);
  body6.matrix.scale(1.0, 1.5, 1.0);
  body6.render();

  var body7 = new Cube();
  body7.color = [0.0, 0.0, 1.0, 1.0];
  if (g_normalOn) {body7.textureNum = -7;} else {body7.textureNum = -6;}
  body7.matrix.translate(y - 16, 1.97, x - 17);
  body7.matrix.scale(1.0, 1.5, 1.0);
  body7.render();
}

function drawFlower(x, y) {
  var body = new Cube();
  body.color = [1.0, 1.0, 0.0, 1.0];
  if (g_normalOn) {body.textureNum = -7;} else {body.textureNum = -1;}
  body.matrix.translate(y - 15.5, 0.001, x - 15.5);
  body.matrix.scale(0.05, 0.05, 0.05);
  body.render();

  var body2 = new Cube();
  body2.color = [1.0, 0.4, 0.9, 1.0];
  if (g_normalOn) {body2.textureNum = -7;} else {body2.textureNum = -1;}
  body2.matrix.translate(y - 15.55, 0.001, x - 15.5);
  body2.matrix.scale(0.05, 0.05, 0.05);
  body2.render();

  var body3 = new Cube();
  body3.color = [1.0, 0.4, 0.9, 1.0];
  if (g_normalOn) {body3.textureNum = -7;} else {body3.textureNum = -1;}
  body3.matrix.translate(y - 15.5, 0.001, x - 15.45);
  body3.matrix.scale(0.05, 0.05, 0.05);
  body3.render();

  var body4 = new Cube();
  body4.color = [1.0, 0.4, 0.9, 1.0];
  if (g_normalOn) {body4.textureNum = -7;} else {body4.textureNum = -1;}
  body4.matrix.translate(y - 15.45, 0.001, x - 15.5);
  body4.matrix.scale(0.05, 0.05, 0.05);
  body4.render();

  var body5 = new Cube();
  body5.color = [1.0, 0.4, 0.9, 1.0];
  if (g_normalOn) {body5.textureNum = -7;} else {body5.textureNum = -1;}
  body5.matrix.translate(y - 15.5, 0.001, x - 15.55);
  body5.matrix.scale(0.05, 0.05, 0.05);
  body5.render();
}

function keydown(ev) {
  if (ev.keyCode == 68) {
    g_camera.moveRight();
  } 
  else if (ev.keyCode == 65) {
    g_camera.moveLeft();
  }
  else if (ev.keyCode == 87) {
    g_camera.moveForward();
  }
  else if (ev.keyCode == 83) {
    g_camera.moveBack();
  }
  else if (ev.keyCode == 81) {
    g_camera.lookLeft();
  }
  else if (ev.keyCode == 69) {
    g_camera.lookRight();
  }

  console.log(ev.keyCode);
}

function deleteBlock() {
  // Calculate the angle of rotation
  let d = new Vector3(g_camera.at.elements);
  d.sub(g_camera.eye);
  let o = Math.atan2(d.elements[2], d.elements[0]);

  let xblock = Math.floor(g_camera.eye.elements[2] + 16)
  let yblock = Math.floor(g_camera.eye.elements[0] + 16);
  
  // Based on the rotation and position of the camera, break a block if possible
  if (o < (-Math.PI/4) && o >= (-3 * Math.PI/4)) {
    if (g_map[xblock - 1][yblock] > 0 && g_map[xblock - 1][yblock] < 4) {
      g_map[xblock - 1][yblock] -= 1;
    }
  }
  else if (o < (Math.PI/4) && o >= (-Math.PI/4)) {
    if (g_map[xblock][yblock + 1] > 0 && g_map[xblock][yblock + 1] < 4) {
      g_map[xblock][yblock + 1] -= 1;
    }
  }
  else if (o < (3 * Math.PI/4) && o >= (Math.PI/4)) {
    if (g_map[xblock + 1][yblock] > 0 && g_map[xblock + 1][yblock] < 4) {
      g_map[xblock + 1][yblock] -= 1;
    }
  } else {
    if (g_map[xblock][yblock - 1] > 0 && g_map[xblock][yblock - 1] < 4) {
      g_map[xblock][yblock - 1] -= 1;
    }
  }
}
function addBlock() {
  // Calculate the angle of rotation
  let d = new Vector3(g_camera.at.elements);
  d.sub(g_camera.eye);
  let o = Math.atan2(d.elements[2], d.elements[0]);

  let xblock = Math.floor(g_camera.eye.elements[2] + 16)
  let yblock = Math.floor(g_camera.eye.elements[0] + 16);
  
  // Based on the rotation and position of the camera, break a block if possible
  if (o < (-Math.PI/4) && o >= (-3 * Math.PI/4)) {
    if (g_map[xblock - 1][yblock] < 4) {
      g_map[xblock - 1][yblock] += 1;
    }
  }
  else if (o < (Math.PI/4) && o >= (-Math.PI/4)) {
    if (g_map[xblock][yblock + 1] < 4) {
      g_map[xblock][yblock + 1] += 1;
    }
  }
  else if (o < (3 * Math.PI/4) && o >= (Math.PI/4)) {
    if (g_map[xblock + 1][yblock] < 4) {
      g_map[xblock + 1][yblock] += 1;
    }
  } else {
    if (g_map[xblock][yblock - 1] < 4) {
      g_map[xblock][yblock - 1] += 1;
    }
  }
}


function updateAnimation() {
  if (g_animation) {
    // Update light position
    g_lightPos[0] = 4 * Math.cos(g_seconds/2);
    let lightSlideX = document.getElementById('lightSlideX');
    lightSlideX.value = g_lightPos[0];

    g_lightPos[2] = 4 * Math.sin(g_seconds/2);
    let lightSlideZ = document.getElementById('lightSlideZ');
    lightSlideZ.value = g_lightPos[2];
  }
  if (g_spotAnimation) {
    g_spotLightLook[0] = 8 * Math.cos(-g_seconds/3);
    g_spotLightLook[2] = 8 * Math.sin(-g_seconds/3);
  }
}

         
// Draw every shape that is supposed to be in the canvas
function renderScene() {
    let projMat = new Matrix4();
    projMat.setPerspective(60, canvas.width/canvas.height, 0.1, 100); // (angle, aspect ratio,
    gl.uniformMatrix4fv(u_ProjectionMatrix, false, projMat.elements);
        
    let viewMat = new Matrix4();
    viewMat.setLookAt(g_camera.eye.elements[0], g_camera.eye.elements[1], g_camera.eye.elements[2],   g_camera.at.elements[0], g_camera.at.elements[1], g_camera.at.elements[2],    g_camera.up.elements[0], g_camera.up.elements[1], g_camera.up.elements[2]); // (eye, at, up)
    
    gl.uniformMatrix4fv(u_ViewMatrix, false, viewMat.elements);
        
    // Pass the angle matrix to u_GlobalRotateMatrix
    let globalRotMat = new Matrix4().rotate(g_globalAnglex, 0, 1, 0);
    globalRotMat.rotate(g_globalAngley, 1, 0, 0);
    gl.uniformMatrix4fv(u_GlobalRotateMatrix, false, globalRotMat.elements);

    // Pass the light position
    gl.uniform3f(u_LightPos, g_lightPos[0], g_lightPos[1], g_lightPos[2]);

    // Pass the light color
    gl.uniform4f(u_LightColor, g_lightColor[0], g_lightColor[1], g_lightColor[2], g_lightColor[3]);

    // Pass the spotlight position
    gl.uniform3f(u_SpotLightPos, g_spotLightPos[0], g_spotLightPos[1], g_spotLightPos[2]);

    // Pass the spotlight target
    gl.uniform3f(u_SpotLightLook, g_spotLightLook[0], g_spotLightLook[1], g_spotLightLook[2]);

    // Pass the spotlight radius
    gl.uniform1f(u_SpotLightRadius, g_spotLightRadius);

    // Pass the camera position
    gl.uniform3f(u_CameraPos, g_camera.eye.elements[0], g_camera.eye.elements[1], g_camera.eye.elements[2]);
    
    // Pass the light on variable
    gl.uniform1i(u_LightOn, g_lightOn);

    // Pass the spotlight on variable
    gl.uniform1i(u_SpotLightOn, g_spotLightOn);

    // Clear <canvas>
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    
    
    var light = new Cube();
    light.color = [2, 2, 0, 1];
    light.textureNum = -1;
    light.matrix.translate(g_lightPos[0], g_lightPos[1], g_lightPos[2]);
    light.matrix.scale(-0.1, -0.1, -0.1);
    light.matrix.translate(-0.5, -0.5, -0.5);
    light.render();

    var spotLight = new Cube();
    spotLight.color = [1, 1, 1, 1];
    spotLight.textureNum = -1;
    spotLight.matrix.translate(g_spotLightPos[0], g_spotLightPos[1], g_spotLightPos[2]);
    spotLight.matrix.scale(-0.1, -0.1, -0.1);
    spotLight.matrix.translate(-0.5, -0.5, -0.5);
    spotLight.render();
    
        
    var grass = new Cube();
    grass.color = [0.15, 0.67, 0.07, 1.0];
    if (g_normalOn) {grass.textureNum = -7;} else {grass.textureNum = -1;}
    grass.matrix.translate(0, 0.0, 0);
    grass.matrix.scale(32, 0, 32);
    grass.matrix.translate(-0.5, -0.5, -0.5);
    grass.render();
        
    var sky = new Cube();
    sky.color = [0.5, 0.8, 1.0, 1.0];
    if (g_normalOn) {sky.textureNum = -7;} else {sky.textureNum = -1;}
    sky.matrix.scale(-60, -60, -60);
    sky.matrix.translate(-0.5, -0.5, -0.5);
    sky.render();

    var sphere = new Sphere();
    sphere.color = [1.0, 0.0, 0.0, 1.0];
    if (g_normalOn) {sphere.textureNum = -7;} else {sphere.textureNum = -1;}
    sphere.matrix.translate(0, 3, 0);
    sphere.render();

    drawMap();     
}
         
function sendTextToHTML(text, htmlID) {
        var element = document.getElementById(htmlID);
        if (!element) {
            console.log("Failed to get element from HTML");
            return;
        }
        element.innerHTML = text;
}
