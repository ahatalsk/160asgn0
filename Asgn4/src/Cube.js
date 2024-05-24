// Defines the cube class
class Cube {
    
    // Constructor
    constructor() {
        this.type='cube';
        this.color = [1.0, 1.0, 1.0, 1.0];
        this.textureNum = 0;
        this.matrix = new Matrix4();
        this.normalMatrix = new Matrix4();
        this.vertexBuffer = null;
        this.uvBuffer = null;
        this.normalBuffer = null;
        this.vertices = null;
        this.uvCoords = null;
        this.normals = null;
    }
    
    // Generates the vertices for the cube
    generateVertices() {
        // Top
        let v0 = [0.0,1.0,0.0,    0.0,1.0,1.0,    1.0,1.0,1.0,
                   0.0,1.0,0.0,    1.0,1.0,1.0,    1.0,1.0,0.0];
        
        let uv0 = [0,0,   0,1,    1,1,
                    0,0,    1,1,    1,0];

        let n0 = [0,1,0,    0,1,0,  0,1,0,
                  0,1,0,    0,1,0,  0,1,0];
                  
        // Front
        let v1 = [0.0,0.0,0.0,    1.0,1.0,0.0,    1.0,0.0,0.0,
                   0.0,0.0,0.0,    0.0,1.0,0.0,    1.0,1.0,0.0];

        let uv1 = [0,0,   1,1,    1,0,
                    0,0,    0,1,    1,1];

        let n1 = [0,0,-1,   0,0,-1,     0,0,-1,
                  0,0,-1,   0,0,-1,     0,0,-1];

        // Back
        let v2 = [0.0,0.0,1.0,    1.0,1.0,1.0,    1.0,0.0,1.0,
                   0.0,0.0,1.0,    0.0,1.0,1.0,    1.0,1.0,1.0];
        
        let uv2 = [1,0,   0,1,    0,0,
                    1,0,    1,1,    0,1];

        let n2 = [0,0,1,   0,0,1,     0,0,1,
                  0,0,1,   0,0,1,     0,0,1];
                  
        // Right
        let v3 = [1.0,1.0,0.0,    1.0,0.0,1.0,    1.0,0.0,0.0,
                   1.0,1.0,0.0,    1.0,1.0,1.0,    1.0,0.0,1.0];

        let uv3 = [0,1,   1,0,    0,0,
                    0,1,    1,1,    1,0];

        let n3 = [1,0,0,   1,0,0,     1,0,0,
                  1,0,0,   1,0,0,     1,0,0];

        // Left
        let v4 = [0.0,1.0,0.0,    0.0,0.0,1.0,    0.0,0.0,0.0,
                   0.0,1.0,0.0,    0.0,1.0,1.0,    0.0,0.0,1.0];
        
        let uv4 = [1,1,   0,0,    1,0,
                    1,1,    0,1,    0,0];

        let n4 = [-1,0,0,   -1,0,0,     -1,0,0,
                  -1,0,0,   -1,0,0,     -1,0,0];
                  
        // Bottom 
        let v5 = [0.0,0.0,0.0,    1.0,0.0,1.0,    1.0,0.0,0.0,
                   0.0,0.0,0.0,    0.0,0.0,1.0,    1.0,0.0,1.0];
        
        let uv5 = [0,1,   1,0,    1,1,
                   0,1,    0,0,    1,0];

        let n5 = [0,-1,0,    0,-1,0,  0,-1,0,
                  0,-1,0,    0,-1,0,  0,-1,0];
        
        this.vertices = new Float32Array([...v0, ...v1, ...v2, ...v3, ...v4, ...v5]); //[ new Float32Array(v0), new Float32Array(v1), new Float32Array(v2), new Float32Array(v3), new Float32Array(v4), new Float32Array(v5)];
        this.uvCoords = new Float32Array([...uv0, ...uv1, ...uv2, ...uv3, ...uv4, ...uv5]); //[ new Float32Array(uv0), new Float32Array(uv1), new Float32Array(uv2), new Float32Array(uv3), new Float32Array(uv4), new Float32Array(uv5)];
        this.normals = new Float32Array([...n0, ...n1, ...n2, ...n3, ...n4, ...n5]); //[ new Float32Array(n0), new Float32Array(n1), new Float32Array(n2), new Float32Array(n3), new Float32Array(n4), new Float32Array(n5)];
    }
        
    
    
    // Render this shape
    render() {
        let [r, g, b, a] = this.color;
        
        // Pass the matrix to u_ModelMatrix attribute
        gl.uniformMatrix4fv(u_ModelMatrix, false, this.matrix.elements);

        // Pass the normal matrix to u_NormalMatrix attribute
        gl.uniformMatrix4fv(u_NormalMatrix, false, this.normalMatrix.elements);
        
        // If the vertices or uv coords have not been generated, generate them
        if (this.vertices == null  || this.uvCoords == null || this.normals == null) {
            this.generateVertices();
        }
        
        // If the vertex buffer has not been generated, generate it
        if (this.vertexBuffer == null) {
            this.vertexBuffer = gl.createBuffer();
            if (!this.vertexBuffer) {
                console.log("Failed to create the buffer object");
                return;
            }
        }
        
        // If the uv buffer has not been generated, generate it
        if (this.uvBuffer == null) {
            this.uvBuffer = gl.createBuffer();
            if (!this.uvBuffer) {
                console.log("Failed to create the buffer object");
                return;
            }
        }

        // If the normal buffer has not been generated, generate it
        if (this.normalBuffer == null) {
            this.normalBuffer = gl.createBuffer();
            if (!this.normalBuffer) {
                console.log("Failed to create the buffer object");
                return;
            }
        }

        // Pass the fragment color
        gl.uniform4f(u_FragColor, r, g, b, a);

        // Bind the buffer object to target
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
        // Write data into the buffer object
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.vertices), gl.DYNAMIC_DRAW);
        // Assign the buffer object to a_Position variable
        gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, 0, 0);
        // Enable the assignment to a_Position variable
        gl.enableVertexAttribArray(a_Position);
        
        
        // Bind the uv buffer object to target
        gl.bindBuffer(gl.ARRAY_BUFFER, this.uvBuffer);
        // Write data into the uv buffer object
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.uvCoords), gl.DYNAMIC_DRAW);
        // Assign the buffer object to a_UV variable
        gl.vertexAttribPointer(a_UV, 2, gl.FLOAT, false, 0, 0);
        // Enable the assignment to a_UV variable
        gl.enableVertexAttribArray(a_UV);

        // Bind the normal buffer object to target
        gl.bindBuffer(gl.ARRAY_BUFFER, this.normalBuffer);
        // Write data into the normal buffer object
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.normals), gl.DYNAMIC_DRAW);
        // Assign the buffer object to a_Normal variable
        gl.vertexAttribPointer(a_Normal, 3, gl.FLOAT, false, 0, 0);
        // Enable the assignment to a_Normal variable
        gl.enableVertexAttribArray(a_Normal);
        
        // Pass the texture number
        gl.uniform1i(u_WhichTexture, this.textureNum);
        
        // Draw the cube
        gl.drawArrays(gl.TRIANGLES, 0, this.vertices.length / 3);
        
        /*// For each section of the cube, use the buffers to draw the triangles
        for (var i = 0; i < 6; i++) {
            // Set the fragment color
            let colorShade = 1 - (i * 0.1);
            gl.uniform4f(u_FragColor, r * colorShade, g * colorShade, b * colorShade, a);
            
            // Bind the buffer object to target
            gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
            // Write data into the buffer object
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.vertices[i]), gl.DYNAMIC_DRAW);
            // Assign the buffer object to a_Position variable
            gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, 0, 0);
            // Enable the assignment to a_Position variable
            gl.enableVertexAttribArray(a_Position);
            
            
            // Bind the uv buffer object to target
            gl.bindBuffer(gl.ARRAY_BUFFER, this.uvBuffer);
            // Write data into the uv buffer object
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.uvCoords[i]), gl.DYNAMIC_DRAW);
            // Assign the buffer object to a_UV variable
            gl.vertexAttribPointer(a_UV, 2, gl.FLOAT, false, 0, 0);
            // Enable the assignment to a_UV variable
            gl.enableVertexAttribArray(a_UV);

            // Bind the normal buffer object to target
            gl.bindBuffer(gl.ARRAY_BUFFER, this.normalBuffer);
            // Write data into the normal buffer object
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.normals[i]), gl.DYNAMIC_DRAW);
            // Assign the buffer object to a_Normal variable
            gl.vertexAttribPointer(a_Normal, 3, gl.FLOAT, false, 0, 0);
            // Enable the assignment to a_Normal variable
            gl.enableVertexAttribArray(a_Normal);
            
            // Pass the texture number
            gl.uniform1i(u_WhichTexture, this.textureNum);
            
            // Draw the triangle
            gl.drawArrays(gl.TRIANGLES, 0, this.vertices[i].length / 3);
        }*/
    }
}

