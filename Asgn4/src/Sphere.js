// Defines the cube class
class Sphere {
    
    // Constructor
    constructor() {
        this.type='sphere';
        this.color = [1.0, 1.0, 1.0, 1.0];
        this.textureNum = 0;
        this.matrix = new Matrix4();
        this.vertexBuffer = null;
        this.uvBuffer = null;
        this.normalBuffer = null;
        this.vertices = null;
        this.uvCoords = null;
        this.normals = null;
    }
    
    // Generates the vertices for the cube
    generateVertices() {
        var d = Math.PI/20;
        var dd = Math.PI/20;

        var v = [];
        var uv = [];

        for (var t = 0; t < Math.PI; t += d) {
            for (var r = 0; r < (2 * Math.PI); r += d) {
                var p1 = [Math.sin(t)*Math.cos(r), Math.sin(t)*Math.sin(r), Math.cos(t)];
                var p2 = [Math.sin(t+dd)*Math.cos(r), Math.sin(t+dd)*Math.sin(r), Math.cos(t+dd)];
                var p3 = [Math.sin(t)*Math.cos(r+dd), Math.sin(t)*Math.sin(r+dd), Math.cos(t)];
                var p4 = [Math.sin(t+dd)*Math.cos(r+dd), Math.sin(t+dd)*Math.sin(r+dd), Math.cos(t+dd)];

                var uv1 = [t/Math.PI, r/(2*Math.PI)];
                var uv2 = [(t+dd)/Math.PI, r/(2*Math.PI)];
                var uv3 = [t/Math.PI, (r+dd)/(2*Math.PI)];
                var uv4 = [(t+dd)/Math.PI, (r+dd)/(2*Math.PI)];

                v = v.concat(p1);
                v = v.concat(p2);
                v = v.concat(p4);
                uv = uv.concat(uv1);
                uv = uv.concat(uv2);
                uv = uv.concat(uv4);

                v = v.concat(p1);
                v = v.concat(p4);
                v = v.concat(p3);
                uv = uv.concat(uv1);
                uv = uv.concat(uv4);
                uv = uv.concat(uv3);
            }
        }

        this.vertices = new Float32Array(v);
        this.uvCoords = new Float32Array(uv);
        this.normals = new Float32Array(v);
    }
        
    
    
    // Render this shape
    render() {
        let [r, g, b, a] = this.color;
        
        // Pass the matrix to u_ModelMatrix attribute
        gl.uniformMatrix4fv(u_ModelMatrix, false, this.matrix.elements);
        
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

