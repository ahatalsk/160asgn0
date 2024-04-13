// Defines the circle class
class Circle {
    
    // Constructor
    constructor() {
        this.type='circle';
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
        var d = this.size/400.0;
        
        let angleStep = 360/this.segments;
        for(var angle = 0; angle < 360; angle = angle + angleStep) {
            let centerPt = [xy[0], xy[1]];
            let angle1 = angle * Math.PI / 180;
            let angle2 = (angle + angleStep) * Math.PI / 180;
            
            let vec1 = [Math.cos(angle1) * d, Math.sin(angle1) * d];
            let vec2 = [Math.cos(angle2) * d, Math.sin(angle2) * d];
            
            let pt1 = [centerPt[0] + vec1[0], centerPt[1] + vec1[1]];
            let pt2 = [centerPt[0] + vec2[0], centerPt[1] + vec2[1]];
            
            drawTriangle([xy[0], xy[1], pt1[0], pt1[1], pt2[0], pt2[1]]);
        }
    }
}
