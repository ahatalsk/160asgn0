// Defines the cube class
class Cube {
    
    // Constructor
    constructor() {
        this.type='cube';
        this.color = [1.0, 0.0, 0.0, 1.0];
        this.matrix = new Matrix4();
        this.buffer = null;
        this.vertices = null;
    }
    
    // Generates the vertices for the cube
    generateVertices() {
        let v0 = [0.0,1.0,0.0,    0.0,1.0,1.0,    1.0,1.0,1.0,
                   0.0,1.0,0.0,    1.0,1.0,1.0,    1.0,1.0,0.0];
                  
        let v1 = [0.0,0.0,0.0,    1.0,1.0,0.0,    1.0,0.0,0.0,
                   0.0,0.0,0.0,    0.0,1.0,0.0,    1.0,1.0,0.0,
                   0.0,0.0,1.0,    1.0,1.0,1.0,    1.0,0.0,1.0,
                   0.0,0.0,1.0,    0.0,1.0,1.0,    1.0,1.0,1.0];
                  
        let v2 = [1.0,1.0,0.0,    1.0,0.0,1.0,    1.0,0.0,0.0,
                   1.0,1.0,0.0,    1.0,1.0,1.0,    1.0,0.0,1.0,
                   0.0,1.0,0.0,    0.0,0.0,1.0,    0.0,0.0,0.0,
                   0.0,1.0,0.0,    0.0,1.0,1.0,    0.0,0.0,1.0];
                  
        let v3 = [0.0,0.0,0.0,    1.0,0.0,1.0,    1.0,0.0,0.0,
                   0.0,0.0,0.0,    0.0,0.0,1.0,    1.0,0.0,1.0];
        
        this.vertices = [ new Float32Array(v0), new Float32Array(v1), new Float32Array(v2), new Float32Array(v3)];
    }
        
    // Render this shape
    render() {
        let [r, g, b, a] = this.color;
        
        // Pass the matrix to u_ModelMatrix attribute
        gl.uniformMatrix4fv(u_ModelMatrix, false, this.matrix.elements);
        
        // If the vertices have not been generated, generate them
        if (this.vertices == null) {
            this.generateVertices();
        }
        
        // If the buffer has not been generated, generate it
        if (this.buffer == null) {
            this.buffer = gl.createBuffer();
            if (!this.buffer) {
                console.log("Failed to create the buffer object");
                return;
            }
        }
        
        // For each section of the cube, use the buffer to draw the vertex array
        for (var i = 0; i < 4; i++) {
            // Set the fragment color
            let colorShade = 1 - (i * 0.1);
            gl.uniform4f(u_FragColor, r * colorShade, g * colorShade, b * colorShade, a);
            
            // Bind the buffer object to target
            gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);
            // Write data into the buffer object
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.vertices[i]), gl.DYNAMIC_DRAW);
            
            // Assign the buffer object to a_Position variable
            gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, 0, 0);

            // Enable the assignment to a_Position variable
            gl.enableVertexAttribArray(a_Position);
            
            // Draw the triangle
            gl.drawArrays(gl.TRIANGLES, 0, this.vertices[i].length / 3);
        }
    }
}

