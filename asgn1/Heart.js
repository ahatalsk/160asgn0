// Defines the circle class
class Heart {
    
    // Constructor
    constructor() {
        this.type='heart';
        this.position = [0.0, 0.0, 0.0];
        this.color = [1.0,, 1.0, 1.0, 1.0];
        this.size = 10.0;
        this.segments = 8;
    }
    
    // Render this shape
    render() {
        var xy = this.position;
        var rgba = this.color;
        var size = this.size;
            
        // Pass the color of a circle to u_FragColor variable
        gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);
        
        // Draw
        var dx = this.size/450.0;
        var dx2 = dx/2;
        var dx3 = dx/3;
        var dx23 = 2 * dx/3;
        var dy = this.size/550.0;
        var dy2 = dy/2;
        var dy3 = dy/3;
        var dy23 = 2 * dy/3;
        
        var cx = xy[0];
        var cy = xy[1];
        
        drawTriangle([(cx - dx), cy, cx, (cy - dy), (cx + dx), cy]);
        drawTriangle([(cx - dx), cy, (cx + dx), cy, (cx + dx), (cy + dy2)]);
        drawTriangle([(cx - dx), (cy + dy2), (cx - dx), cy, (cx + dx), (cy + dy2)]);
        drawTriangle([(cx - dx), (cy + dy2), (cx - dx23), (cy + dy2), (cx - dx23), (cy + dy)]);
        drawTriangle([(cx - dx23), (cy + dy2), (cx - dx3), (cy + dy), (cx - dx23), (cy + dy)]);
        drawTriangle([(cx - dx23), (cy + dy2), (cx - dx3), (cy + dy2), (cx - dx3), (cy + dy)]);
        drawTriangle([(cx - dx3), (cy + dy2), cx, (cy + dy2), (cx - dx3), (cy + dy)]);
        drawTriangle([cx, (cy + dy2), (cx + dx3), (cy + dy2), (cx + dx3), (cy + dy)]);
        drawTriangle([(cx + dx3), (cy + dy2), (cx + dx23), (cy + dy), (cx + dx3), (cy + dy)]);
        drawTriangle([(cx + dx3), (cy + dy2), (cx + dx23), (cy + dy2), (cx + dx23), (cy + dy)]);
        drawTriangle([(cx + dx23), (cy + dy2), (cx + dx), (cy + dy2), (cx + dx23), (cy + dy)]);
    }
}

