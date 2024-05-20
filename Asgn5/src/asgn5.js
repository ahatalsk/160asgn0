import * as THREE from "three";
import {OrbitControls} from 'three/addons/controls/OrbitControls.js';
import {OBJLoader} from 'three/addons/loaders/OBJLoader.js';
import {MTLLoader} from 'three/addons/loaders/MTLLoader.js';

// Global vars
let canvas;
let cameraPos = [0, 0, 500];
let cameraTarget = [0, 0, 0];
let controls;
let camera;

function cameraSetup() {
    const fov = 45;
    const aspect = 2; // the canvas default
    const near = 1.0;
    const far = 2000;
    camera = new THREE.PerspectiveCamera( fov, aspect, near, far );
    camera.position.set(cameraPos[0], cameraPos[1], cameraPos[2]);
    
    controls = new OrbitControls( camera, canvas );
    controls.target.set( cameraTarget[0], cameraTarget[1], cameraTarget[2] );
    controls.update();
}

function main() {
    canvas = document.querySelector( '#c' );
    const renderer = new THREE.WebGLRenderer({
        antialias: true,
        canvas,
        alpha: true,
    });

    cameraSetup();
    
    const scene = new THREE.Scene();
    let bgTexture;
    {
        // load in the background texture
        const loader = new THREE.TextureLoader();
        bgTexture = loader.load('../lib/images/stars.jpg');
        bgTexture.colorSpace = THREE.SRGBColorSpace;
        scene.background = bgTexture;
    }

    {
        // Sphere to be the base world
        const radius = 100;
        const widthDivisions = 64;
        const heightDivisions = 32;
        const geometry = new THREE.SphereGeometry( radius, widthDivisions, heightDivisions );

        const mat = new THREE.MeshPhongMaterial( {color: 0x45D4F7} );
        const mesh = new THREE.Mesh( geometry, mat );
        mesh.position.set(0, 0, 0 );
        scene.add(mesh);
    }

    // Shapes to add land to the world;
    {
        const radius = 80;
        const widthDivisions = 64;
        const heightDivisions = 32;
        const geometry = new THREE.SphereGeometry( radius, widthDivisions, heightDivisions );

        const mat = new THREE.MeshPhongMaterial( {color: 0x73C42B} );
        const mesh = new THREE.Mesh( geometry, mat );
        mesh.position.set(0, 21.5, 0 );
        scene.add(mesh);
    }
    {
        const radius = 60;
        const widthDivisions = 64;
        const heightDivisions = 32;
        const geometry = new THREE.SphereGeometry( radius, widthDivisions, heightDivisions );

        const mat = new THREE.MeshPhongMaterial( {color: 0x73C42B} );
        const mesh = new THREE.Mesh( geometry, mat );
        mesh.position.set(-20, 37, 10 );
        scene.add(mesh);
    }
    {
        const radius = 60;
        const widthDivisions = 64;
        const heightDivisions = 32;
        const geometry = new THREE.SphereGeometry( radius, widthDivisions, heightDivisions );

        const mat = new THREE.MeshPhongMaterial( {color: 0x228A0E} );
        const mesh = new THREE.Mesh( geometry, mat );
        mesh.position.set(-5, 37, 20 );
        scene.add(mesh);
    }
    {
        const radius = 70;
        const widthDivisions = 64;
        const heightDivisions = 32;
        const geometry = new THREE.SphereGeometry( radius, widthDivisions, heightDivisions );

        const mat = new THREE.MeshPhongMaterial( {color: 0x73C42B} );
        const mesh = new THREE.Mesh( geometry, mat );
        mesh.position.set(-35, 5, 0 );
        scene.add(mesh);
    }
    {
        const radius = 70;
        const widthDivisions = 64;
        const heightDivisions = 32;
        const geometry = new THREE.SphereGeometry( radius, widthDivisions, heightDivisions );

        const mat = new THREE.MeshPhongMaterial( {color: 0x73C42B} );
        const mesh = new THREE.Mesh( geometry, mat );
        mesh.position.set(-30, -20, 0 );
        scene.add(mesh);
    }
    {
        const radius = 80;
        const widthDivisions = 64;
        const heightDivisions = 32;
        const geometry = new THREE.SphereGeometry( radius, widthDivisions, heightDivisions );

        const mat = new THREE.MeshPhongMaterial( {color: 0x73C42B} );
        const mesh = new THREE.Mesh( geometry, mat );
        mesh.position.set(5, -15, 18 );
        scene.add(mesh);
    }
    {
        const radius = 70;
        const widthDivisions = 64;
        const heightDivisions = 32;
        const geometry = new THREE.SphereGeometry( radius, widthDivisions, heightDivisions );

        const mat = new THREE.MeshPhongMaterial( {color: 0x228A0E} );
        const mesh = new THREE.Mesh( geometry, mat );
        mesh.position.set(7, -23.5, 25.5 );
        scene.add(mesh);
    }
    {
        const radius = 60;
        const widthDivisions = 64;
        const heightDivisions = 32;
        const geometry = new THREE.SphereGeometry( radius, widthDivisions, heightDivisions );

        const mat = new THREE.MeshPhongMaterial( {color: 0x73C42B} );
        const mesh = new THREE.Mesh( geometry, mat );
        mesh.position.set(15, -10, 40 );
        scene.add(mesh);
    }
    {
        const radius = 60;
        const widthDivisions = 64;
        const heightDivisions = 32;
        const geometry = new THREE.SphereGeometry( radius, widthDivisions, heightDivisions );

        const mat = new THREE.MeshPhongMaterial( {color: 0x73C42B} );
        const mesh = new THREE.Mesh( geometry, mat );
        mesh.position.set(15, 5, -38 );
        scene.add(mesh);
    }
    {
        const radius = 60;
        const widthDivisions = 64;
        const heightDivisions = 32;
        const geometry = new THREE.SphereGeometry( radius, widthDivisions, heightDivisions );

        const mat = new THREE.MeshPhongMaterial( {color: 0x228A0E} );
        const mesh = new THREE.Mesh( geometry, mat );
        mesh.position.set(5, 15, -37 );
        scene.add(mesh);
    }
    {
        const radius = 10;
        const height = 20;
        const radialsegments = 20;
        const geometry = new THREE.ConeGeometry( radius, height, radialsegments );
        geometry.rotateX(Math.PI/16);

        const mat = new THREE.MeshPhongMaterial( {color: 0x753913} );
        const mesh = new THREE.Mesh( geometry, mat );
        mesh.position.set(-25, 99, 30 );
        scene.add(mesh);
    }
    {
        const radius = 5;
        const height = 10;
        const radialsegments = 20;
        const geometry = new THREE.ConeGeometry( radius, height, radialsegments );
        geometry.rotateX(Math.PI/16);

        const mat = new THREE.MeshPhongMaterial( {color: 0x753913} );
        const mesh = new THREE.Mesh( geometry, mat );
        mesh.position.set(-15, 97, 35 );
        scene.add(mesh);
    }
    {
        const radius = 20;
        const height = 30;
        const radialsegments = 20;
        const geometry = new THREE.ConeGeometry( radius, height, radialsegments );
        geometry.rotateZ(Math.PI/2);

        const mat = new THREE.MeshPhongMaterial( {color: 0x753913} );
        const mesh = new THREE.Mesh( geometry, mat );
        mesh.position.set(-105, 0, 20 );
        scene.add(mesh);
    }
    {
        const radius = 25;
        const height = 35;
        const radialsegments = 20;
        const geometry = new THREE.ConeGeometry( radius, height, radialsegments );
        geometry.rotateZ(5 * Math.PI/9);

        const mat = new THREE.MeshPhongMaterial( {color: 0x753913} );
        const mesh = new THREE.Mesh( geometry, mat );
        mesh.position.set(-105, -15, 5 );
        scene.add(mesh);
    }
    {
        const radius = 10;
        const height = 20;
        const radialsegments = 20;
        const geometry = new THREE.ConeGeometry( radius, height, radialsegments );
        geometry.rotateZ(4 * Math.PI/7);

        const mat = new THREE.MeshPhongMaterial( {color: 0x753913} );
        const mesh = new THREE.Mesh( geometry, mat );
        mesh.position.set(-105, -30, -10 );
        scene.add(mesh);
    }
    {
        const radius = 15;
        const height = 25;
        const radialsegments = 20;
        const geometry = new THREE.ConeGeometry( radius, height, radialsegments );
        geometry.rotateZ(3 * Math.PI/5);

        const mat = new THREE.MeshPhongMaterial( {color: 0x753913} );
        const mesh = new THREE.Mesh( geometry, mat );
        mesh.position.set(-95, -45, 15 );
        scene.add(mesh);
    }
    {
        const radius = 10;
        const height = 20;
        const radialsegments = 20;
        const geometry = new THREE.ConeGeometry( radius, height, radialsegments );
        geometry.rotateZ(-3 * Math.PI/7);
        geometry.rotateY(Math.PI/3);

        const mat = new THREE.MeshPhongMaterial( {color: 0x753913} );
        const mesh = new THREE.Mesh( geometry, mat );
        mesh.position.set(40, 10, -95 );
        scene.add(mesh);
    }

    let jupiter;
    {
        // Jupiter
        const radius = 50;
        const widthDivisions = 64;
        const heightDivisions = 32;
        const geometry = new THREE.SphereGeometry( radius, widthDivisions, heightDivisions );

        const loader = new THREE.TextureLoader();
        const texture = loader.load( '../lib/images/jupiter.jpg' );
        const mat = new THREE.MeshPhongMaterial( {
            map: texture,
        } );
        jupiter = new THREE.Mesh( geometry, mat );
        jupiter.position.set(300, 10, 0 );
        scene.add(jupiter);
    }

    let sun;
    {
        // Sphere to represent the sun
        const radius = 30;
        const widthDivisions = 32;
        const heightDivisions = 16;
        const geometry = new THREE.SphereGeometry( radius, widthDivisions, heightDivisions );
        
        const mat = new THREE.MeshBasicMaterial( {color: 0xFCCC62} );
        sun = new THREE.Mesh( geometry, mat );
        sun.position.set(15, 0, 0 );
        scene.add( sun );
    }

    let moon;
    {
        // Sphere to represent the moon
        const radius = 15;
        const widthDivisions = 32;
        const heightDivisions = 16;
        const geometry = new THREE.SphereGeometry( radius, widthDivisions, heightDivisions );

        const loader = new THREE.TextureLoader();
        const texture= loader.load( '../lib/images/moon.jpg' );
        texture.colorSpace = THREE.SRGBColorSpace;
        
        const mat = new THREE.MeshPhongMaterial({
            map: texture,
        });
        
        moon = new THREE.Mesh( geometry, mat );
        moon.position.set(15, 0, 0 );
        scene.add( moon );
    }
    
    // Octahedrons to represent stars
    const octoRadius = 3;
    const octoGeometry = new THREE.OctahedronGeometry( octoRadius );
    const octoMat = new THREE.MeshBasicMaterial( {color: 0xFFF8D4} );
    const octoMesh1 = new THREE.Mesh(octoGeometry, octoMat);
    const octoMesh2 = new THREE.Mesh(octoGeometry, octoMat);
    const octoMesh3 = new THREE.Mesh(octoGeometry, octoMat);
    const octoMesh4 = new THREE.Mesh(octoGeometry, octoMat);
    const octoMesh5 = new THREE.Mesh(octoGeometry, octoMat);
    const octoMesh6 = new THREE.Mesh(octoGeometry, octoMat);
    octoMesh1.position.set(20, 15, 0);
    octoMesh2.position.set(20, 15, 0);
    octoMesh3.position.set(20, 15, 0);
    octoMesh4.position.set(20, 15, 0);
    octoMesh5.position.set(20, 15, 0);
    octoMesh6.position.set(20, 15, 0);
    scene.add(octoMesh1);
    scene.add(octoMesh2);
    scene.add(octoMesh3);
    scene.add(octoMesh4);
    scene.add(octoMesh5);
    scene.add(octoMesh6);
    
    let rock;
    {
        // Load in the meteor object
        const objLoader = new OBJLoader();
        const mtlLoader = new MTLLoader();
        mtlLoader.load('../lib/models/meteor/materials.mtl', (mtl) => {
            mtl.preload();
            objLoader.setMaterials(mtl);
        objLoader.load('../lib/models/meteor/model.obj', (root) => {
            root.scale.setScalar(20);
            root.position.x = 0;
            root.position.y = 150;
            root.position.z = 0;
            rock = root;
            scene.add(root);
        });
        });
    }
    
    let sunlight;
    {
        // Directional light to rotate around the canvas with the sun, pointing at the center (0, 0, 0)
        const color = 0xFFFFFF;
        const intensity = 4;
        sunlight = new THREE.DirectionalLight(color, intensity);
        sunlight.castShadow = true;
        sunlight.position.set(10, 10, 0);
        sunlight.target.position.set(0, 0, 0);
        scene.add(sunlight);
        scene.add(sunlight.target);
    }

    {
        // Point light for the origin
        const color = 0x8888FF;
		const intensity = 100000;
		const light = new THREE.PointLight( color, intensity );
		light.position.set( 0, 0, 0 );
		scene.add( light );
    }

    {
        // Hemisphere light
        const skyColor = 0x330066;
        const groundColor = 0x330066;
        const intensity = 3;
        const hemisphereLight = new THREE.HemisphereLight(skyColor, groundColor, intensity);
        scene.add(hemisphereLight);
    }

    function resizeRendererToDisplaySize( renderer ) {

        const canvas = renderer.domElement;
        const width = canvas.clientWidth;
        const height = canvas.clientHeight;
        const needResize = canvas.width !== width || canvas.height !== height;
        if ( needResize ) {

            renderer.setSize( width, height, false );

        }

        return needResize;

    }

    function render(time) {
        time *= 0.0005;

        if ( resizeRendererToDisplaySize( renderer ) ) {
            const canvas = renderer.domElement;
            camera.aspect = canvas.clientWidth / canvas.clientHeight;
            camera.updateProjectionMatrix();

        }
        
        // Make the shapes orbit the origin
        sun.position.x = 500 * Math.cos(time);
        sun.position.y = 500 * Math.sin(time);
        moon.position.x = 160 * Math.cos((time + Math.PI)* 0.8);
        moon.position.y = 160 * Math.sin((time + Math.PI) * 0.8);

        let starSpeed = 5;
        let starLoc = 300

        octoMesh1.position.x = starLoc * Math.sin(time/starSpeed);
        octoMesh1.position.z = starLoc * Math.cos(time/starSpeed);

        octoMesh2.position.x = starLoc * Math.sin(time/starSpeed + 5);
        octoMesh2.position.y = starLoc * Math.cos(time/starSpeed + 5);

        octoMesh3.position.x = starLoc * Math.sin(time/starSpeed + 20);
        octoMesh3.position.y = starLoc * Math.cos(time/starSpeed + 20);
        octoMesh3.position.z = starLoc * Math.cos(time/starSpeed + 20);

        octoMesh4.position.y = starLoc * Math.sin(time/starSpeed);
        octoMesh4.position.z = starLoc * Math.cos(time/starSpeed);

        octoMesh5.position.x = starLoc * Math.sin(time/starSpeed);
        octoMesh5.position.y = starLoc * Math.cos(time/starSpeed + 10);
        octoMesh5.position.z = starLoc * Math.cos(time/starSpeed);

        octoMesh6.position.x = starLoc * Math.sin(time/starSpeed + 10);
        octoMesh6.position.y = starLoc/2 * Math.sin(time/starSpeed + 20);
        octoMesh6.position.z = starLoc * Math.cos(time/starSpeed + 30);

        sunlight.position.x = 500 * Math.cos(time);
        sunlight.position.y = 500 * Math.sin(time)

        jupiter.position.x = 300 * Math.cos(time);
        jupiter.position.z = 300 * Math.sin(time);
        jupiter.rotation.y += 0.002;

        if (rock) {
            rock.position.x = 200 * Math.cos(2 * time);
            rock.position.y = 200 * Math.sin(2 * time);
            rock.position.z = 200 * Math.cos(2 * time);
            rock.rotation.x += 0.01;
            rock.rotation.y += 0.01;
        }

        renderer.render( scene, camera );

        requestAnimationFrame( render );

    }

    requestAnimationFrame( render );
}

main();
