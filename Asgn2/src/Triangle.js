// Defines the triangle class
class Triangle {
    
    // Constructor
    constructor() {
        this.type='triangle';
        this.position = [0.0, 0.0, 0.0];
        this.color = [1.0,, 1.0, 1.0, 1.0];
        this.size = 10.0;
    }
    
    // Render this shape
    render() {
        var xy = this.position;
        var rgba = this.color;
        var size = this.size;
            
        // Pass the color of a triangle to u_FragColor variable
        gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);
        // Pass the size of a triangle to u_Size variable
        gl.uniform1f(u_Size, size);
        
        // Draw
        var d = this.size/400.0
        drawTriangle([xy[0] - d, xy[1] - d, xy[0], xy[1] + d, xy[0] + d, xy[1] - d]);
    }
}

// Function to draw a triangle given the vertices
function drawTriangle(vertices) {
    var n = 3;
    
    // Create a buffer object
    var vertexBuffer = gl.createBuffer();
    if (!vertexBuffer) {
        console.log("Failed to create the buffer object");
        return;
    }
    
    // Bind the buffer object to target
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    // Write data into the buffer object
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.DYNAMIC_DRAW);
    
    // Assign the buffer object to a_Position variable
    gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0);

    // Enable the assignment to a_Position variable
    gl.enableVertexAttribArray(a_Position);
    
    // Draw the triangle
    gl.drawArrays(gl.TRIANGLES, 0, n);
}

// Function to draw a triangle given the vertices
function drawTriangle3D(vertices) {
    var n = 3;
    
    // Create a buffer object
    var vertexBuffer = gl.createBuffer();
    if (!vertexBuffer) {
        console.log("Failed to create the buffer object");
        return;
    }
    
    // Bind the buffer object to target
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    // Write data into the buffer object
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.DYNAMIC_DRAW);
    
    // Assign the buffer object to a_Position variable
    gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, 0, 0);

    // Enable the assignment to a_Position variable
    gl.enableVertexAttribArray(a_Position);
    
    // Draw the triangle
    gl.drawArrays(gl.TRIANGLES, 0, n);
}






