class Camera {
    constructor() {
        this.eye = new Vector3([0, 1.5, 6]);
        this.at = new Vector3([0, 0.0, -100]);
        this.up = new Vector3([0, 1, 0]);
    }

    moveForward() {
        var d = new Vector3(this.at.elements);
        d.sub(this.eye);
        d.normalize();
        d.mul(0.2);
        if (this.allowMove(d)) {
            this.at.add(d);
            this.eye.add(d);
            this.eye.elements[1] = 1.5;
        }
    }

    moveBack() {
        var d = new Vector3(this.eye.elements);
        d.sub(this.at);
        d.normalize();
        d.mul(0.2);
        if (this.allowMove(d)) {
            this.at.add(d);
            this.eye.add(d);
            this.eye.elements[1] = 1.5;
        }
    }

    moveLeft() {
        var d = new Vector3(this.eye.elements);
        d.sub(this.at);
        d.normalize();
        var s = Vector3.cross(d, this.up);
        s.normalize();
        s.mul(0.2);
        if (this.allowMove(s)) {
            this.at.add(s);
            this.eye.add(s);
            this.eye.elements[1] = 1.5;
        }
    }

    moveRight() {
        var d = new Vector3(this.eye.elements);
        d.sub(this.at);
        d.normalize();
        var s = Vector3.cross(d, this.up);
        s.normalize();
        s.mul(-0.2);
        if (this.allowMove(s)) {
            this.at.add(s);
            this.eye.add(s);
            this.eye.elements[1] = 1.5;
        }
    }

    lookLeft() {
        var d = new Vector3(this.at.elements);
        d.sub(this.eye);
        var r = d.magnitude();
        var o = Math.atan2(d.elements[2], d.elements[0]);
        o = o - Math.PI/16;
        var newX = r * Math.cos(o);
        var newZ = r * Math.sin(o);
        d.elements[0] = newX;
        d.elements[2] = newZ;
        d.add(this.eye);
        this.at = d;
    }

    lookRight() {
        var d = new Vector3(this.at.elements);
        d.sub(this.eye);
        var r = Math.sqrt( (d.elements[0])**2 + (d.elements[2])**2 );
        var o = Math.atan2(d.elements[2], d.elements[0]);
        o = o + Math.PI/16;
        var newX = r * Math.cos(o);
        var newZ = r * Math.sin(o);
        d.elements[0] = newX;
        d.elements[2] = newZ;
        d.add(this.eye);
        this.at = d;
    }

    // Checks to see if moving eye by the moveVector will cause a collision
    allowMove(moveVector) {
        // Have to swap x and y since the map is inverted
        let potentialX = Math.floor(this.eye.elements[2] + 2 * moveVector.elements[2] + 16);
        let potentialY = Math.floor(this.eye.elements[0] + 2 * moveVector.elements[0] + 16);

        if (g_map[potentialX][potentialY] > 0 && g_map[potentialX][potentialY] < 5) {
            return false;
        }
        else if (g_map[potentialX][potentialY] > 5) {
            return false;
        }
        return true;
    }
}