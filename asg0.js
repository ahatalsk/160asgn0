// DrawRectangle.js
function main() {
    // Retrieve <canvas> element <- (1)
    var canvas = document.getElementById('example');
    if (!canvas) {
        console.log('Failed to retrieve the <canvas> element');
        return;
    }
    
    // Get the rendering context for 2DCG <- (2)
    var ctx = canvas.getContext('2d');
    
    // Change background to black
    ctx.fillStyle = "black";
    ctx.fillRect(0,0,canvas.width,canvas.height);
    
    // Wait for user to input the x and y coords and submit
    let coordForm = document.getElementById("coordForm");
    coordForm.addEventListener("submit", event=> {
        handleDrawEvent();
        event.preventDefault();
    });
    
    // Wait for user to input the x and y coords and an operation and submit
    let opForm = document.getElementById("opForm");
    opForm.addEventListener("submit", event=> {
        handleDrawOperationEvent();
        event.preventDefault();
    });
}

function drawVector(v, color) {
    // Retrieve <canvas> element <- (1)
    var canvas = document.getElementById('example');
    if (!canvas) {
        console.log('Failed to retrieve the <canvas> element');
        return;
    }
    
    // Get the rendering context for 2DCG <- (2)
    var ctx = canvas.getContext('2d');
    
    // Gets the x and y coordinats of the origin
    var ox = canvas.width / 2;
    var oy = canvas.height / 2;
    
    // Draw the vector
    ctx.beginPath();
    ctx.moveTo(ox,oy);
    ctx.lineTo(ox + v.elements[0] * 20, oy - v.elements[1] * 20);
    ctx.strokeStyle = color;
    ctx.stroke();
}

// Function to draw two vectors
// Clears the canvas, obtains the input values, creates the vectors, and draws the vectors
// Triggered when 1st draw button is clicked
function handleDrawEvent() {
    // Retrieve <canvas> element <- (1)
    var canvas = document.getElementById('example');
    if (!canvas) {
        console.log('Failed to retrieve the <canvas> element');
        return;
    }
    
    // Get the rendering context for 2DCG <- (2)
    var ctx = canvas.getContext('2d');
    
    // Clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    
    // Set background to black
    ctx.fillStyle = "black";
    ctx.fillRect(0,0,canvas.width,canvas.height);
    
    // Get the coordinate values from the input
    let x1 = document.getElementById("xCoord1").value;
    let y1 = document.getElementById("yCoord1").value;
    
    let x2 = document.getElementById("xCoord2").value;
    let y2 = document.getElementById("yCoord2").value;
    
    if (isNaN(x1) || isNaN(y1) || isNaN(x2) || isNaN(y2)) {
        console.log("Invalid Vectors");
        return;
    }
    
    // Instantiate new vectors
    const v1 = new Vector3([x1, y1, 0]);
    const v2 = new Vector3([x2, y2, 0]);
    
    // Draw the vectors
    drawVector(v1, "red");
    drawVector(v2, "blue");
}

// Function to draw two vectors and the operation
// Clears the canvas, obtains the input values, creates/draws the vectors, extracts/performs the operation, draws the operation vectors
// Triggered when 2nd draw button is clicked
function handleDrawOperationEvent() {
    // Retrieve <canvas> element <- (1)
    var canvas = document.getElementById('example');
    if (!canvas) {
        console.log('Failed to retrieve the <canvas> element');
        return;
    }
    
    // Get the rendering context for 2DCG <- (2)
    var ctx = canvas.getContext('2d');
    
    // Clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    
    // Set background to black
    ctx.fillStyle = "black";
    ctx.fillRect(0,0,canvas.width,canvas.height);
    
    // Get the coordinate values from the input
    let x1 = document.getElementById("xCoord1").value;
    let y1 = document.getElementById("yCoord1").value;
    
    let x2 = document.getElementById("xCoord2").value;
    let y2 = document.getElementById("yCoord2").value;
    
    // Instantiate new vectors
    let v1 = new Vector3([x1, y1, 0]);
    let v2 = new Vector3([x2, y2, 0]);
    
    // Draw the vectors
    drawVector(v1, "red");
    drawVector(v2, "blue");
    
    let op = document.getElementById("operation").value;
    
    if (op == "add") {
        v1.add(v2);
        drawVector(v1, "green");
    }
    else if (op == "sub") {
        v1.sub(v2);
        drawVector(v1, "green");
    }
    else if (op == "div") {
        let scalar = document.getElementById("scalar").value;
        v1.div(scalar);
        v2.div(scalar);
        drawVector(v1, "green");
        drawVector(v2, "green");
    }
    else if (op == "mul") {
        let scalar = document.getElementById("scalar").value;
        v1.mul(scalar);
        v2.mul(scalar);
        drawVector(v1, "green");
        drawVector(v2, "green");
    }
    else if (op == "mag") {
        let m1 = v1.magnitude();
        let m2 = v2.magnitude();
        console.log("Magnitude v1: " + m1);
        console.log("Magnitude v2: " + m2);
    }
    else if (op == "norm") {
        v1.normalize();
        v2.normalize();
        drawVector(v1, "green");
        drawVector(v2, "green");
    }
    else if (op == "ang") {
        angleBetween(v1, v2);
    }
    else if (op == "area") {
        areaTriangle(v1, v2);
    }
}

// Finds the angle between two vectors and prints result to the console
function angleBetween(v1, v2) {
    // Normalize the two vectors
    v1.normalize();
    v2.normalize();
    
    // Compute the dot product
    let d = Vector3.dot(v1, v2);
    
    // Find the inverse cosine and convert to degrees
    d = Math.acos(d) * (180 / Math.PI);
    
    // Print answer to console
    console.log("Angle: " + d);
}

// Finds the area of the triangle created by the two vectors and prints result to the console
function areaTriangle(v1, v2) {
    // Compute the cross product
    let v3 = Vector3.cross(v1, v2);
    
    // Find the magnitude of this cross product
    let m = v3.magnitude();
    
    // Divide by 2 to get the area of the triangle
    let area = m / 2;
    
    // Print answer to console
    console.log("Area of the triangle: " + area);
}

