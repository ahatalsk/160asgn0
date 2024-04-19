import * as THREE from "../../libs/three/node_modules/three/build/three.module.js";
import {OrbitControls} from '../../libs/three/node_modules/three/examples/jsm/controls/OrbitControls.js';
import { GUI } from '../../libs/three/node_modules/three/examples/jsm/libs/lil-gui.module.min.js';
import {OBJLoader} from '../../libs/three/node_modules/three/examples/jsm/loaders/OBJLoader.js';
import {MTLLoader} from '../../libs/three/node_modules/three/examples/jsm/loaders/MTLLoader.js';

function main() {
    
    const canvas = document.querySelector( '#c' );
    const renderer = new THREE.WebGLRenderer( { antialias: true, canvas } );
    
    const fov = 45;
    const aspect = 2; // the canvas default
    const near = 0.1;
    const far = 100;
    const camera = new THREE.PerspectiveCamera( fov, aspect, near, far );
    camera.position.set(0, 20, 50);
    
    const controls = new OrbitControls( camera, canvas );
    controls.target.set( 0, 0, 0 );
    controls.update();
    
    const scene = new THREE.Scene();
    scene.background = new THREE.Color( 'black' );
    
    {
        // Plane to represent the ocean
        const planeSize = 60;
        
        const loader = new THREE.TextureLoader();
        const texture = loader.load( '../../libs/images/water.png' );
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
        texture.magFilter = THREE.NearestFilter;
        texture.colorSpace = THREE.SRGBColorSpace;
        const repeats = planeSize / 2;
        texture.repeat.set( repeats, repeats );
        
        const planeGeo = new THREE.PlaneGeometry( planeSize, planeSize );
        const planeMat = new THREE.MeshPhongMaterial( {
        map: texture,
        side: THREE.DoubleSide,
        } );
        const mesh = new THREE.Mesh( planeGeo, planeMat );
        mesh.rotation.x = Math.PI * - .5;
        scene.add( mesh );
        
    }
    
    // Sphere to represent the sun
    const sphereRadius = 3;
    const sphereWidthDivisions = 32;
    const sphereHeightDivisions = 16;
    const sphereGeo = new THREE.SphereGeometry( sphereRadius, sphereWidthDivisions, sphereHeightDivisions );
    
    const sphereMat = new THREE.MeshBasicMaterial( {color: 0xFCCC62} );
    const meshSphere = new THREE.Mesh( sphereGeo, sphereMat );
    meshSphere.position.set(15, 0, 0 );
    scene.add( meshSphere );

    // Sphere to represent the moon
    const loader = new THREE.TextureLoader();
    const texture= loader.load( '../../libs/images/moon.jpg' );
    texture.colorSpace = THREE.SRGBColorSpace;
    
    const moonMat = new THREE.MeshPhongMaterial({
        map: texture,
    });
    
    const meshSphere2 = new THREE.Mesh( sphereGeo, moonMat );
    meshSphere2.position.set(15, 0, 0 );
    scene.add( meshSphere2 );
    
    // Octahedron to represent a star
    const octoRadius = 1;
    const octoGeometry = new THREE.OctahedronGeometry( octoRadius );
    const octoMat = new THREE.MeshBasicMaterial( {color: 0xFFF8D4} );
    const octoMesh = new THREE.Mesh(octoGeometry, octoMat);
    octoMesh.position.set(20, 15, 0);
    scene.add(octoMesh)
    
    
    // Load in the mountain object
    {
        const objLoader = new OBJLoader();
        const mtlLoader = new MTLLoader();
        mtlLoader.load('../../libs/models/mountain/part.mtl', (mtl) => {
            mtl.preload();
            objLoader.setMaterials(mtl);
        objLoader.load('../../libs/models/mountain/part.obj', (root) => {
            scene.add(root);
        });
        });
    }

    class ColorGUIHelper {
        constructor( object, prop ) {
            this.object = object;
            this.prop = prop;
        }
        
        get value() {
            return `#${this.object[ this.prop ].getHexString()}`;
        }

        set value( hexString ) {
            this.object[ this.prop ].set( hexString );
        }
    }
    
    // Directional light to rotate around the canvas with the sun, pointing at the center (0, 0, 0)
    const color = 0xFFFFFF;
    const intensity1 = 4;
    const light1 = new THREE.DirectionalLight(color, intensity1);
    light1.position.set(10, 10, 0);
    light1.target.position.set(0, 0, 0);
    scene.add(light1);
    scene.add(light1.target);
    
    {
  
        // Hemisphere light
        const skyColor = 0x0000FF;
        const groundColor = 0x000000;
        const intensity3 = 1;
        const light3 = new THREE.HemisphereLight(skyColor, groundColor, intensity3);
        scene.add(light3);
        
        const gui = new GUI();
        gui.addColor(new ColorGUIHelper(light3, 'color'), 'value').name('skyLightColor');
        gui.addColor(new ColorGUIHelper(light1, 'color'), 'value').name('sunlightColor');
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
        meshSphere.position.x = 25 * Math.cos(time);
        meshSphere.position.y = 25 * Math.sin(time);
        meshSphere2.position.x = 20 * Math.cos((time + Math.PI)* 0.8);
        meshSphere2.position.y = 20 * Math.sin((time + Math.PI) * 0.8);
        octoMesh.position.x = 30 * Math.sin(time);
        octoMesh.position.z = 30 * Math.cos(time);
        light1.position.x = 25 * Math.cos(time);
        light1.position.y = 25 * Math.sin(time)

        renderer.render( scene, camera );

        requestAnimationFrame( render );

    }

    requestAnimationFrame( render );
}

main();
