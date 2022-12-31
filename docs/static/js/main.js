const canvas = document.querySelector('.canvas');

// set up scene and camera
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
scene.add(camera);
camera.position.set(0, 0, 30);
camera.lookAt(scene.position);

// set up renderer
var renderer = new THREE.WebGLRenderer({
    alpha: true,
    premultipliedAlpha: false,
    powerPreference: 'high-performance',
    antialias: true
});
renderer.gammaInput = true;
renderer.gammaOutput = true;
renderer.setPixelRatio(window.devicePixelRatio)
renderer.setSize( window.innerWidth, window.innerHeight );
canvas.appendChild( renderer.domElement );

window.addEventListener('resize', onWindowResize, false)
function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()
    renderer.setSize(window.innerWidth, window.innerHeight)
    render()
}

// add lights
var light = new THREE.PointLight(0xfef3c7); // amber-100
light.position.set(0, 10, 30);
var light2 = new THREE.PointLight(0xfef3c7); // amber-100
light2.position.set(-30, 20, 0);
scene.add(light);
scene.add(light2);
// const directionalLight = new THREE.DirectionalLight( 0xffffff, 0.5 );
// scene.add( directionalLight );

// add grid
// var grid = new THREE.GridHelper(100, 1);
// scene.add(grid);

// add line
const lineMaterial = new THREE.LineBasicMaterial({
    color : 0x737373
});
const points = [];
const lineGeometry = new THREE.BufferGeometry().setFromPoints(points);
const line = new THREE.Line(lineGeometry, lineMaterial);
scene.add(line);

// Create a circle around the mouse and move it. The sphere has opacity 0.
var mouse = {x : 0, y: 0};

var particleGeometry = new THREE.SphereGeometry(1, 16, 16);
var envMap = new THREE.TextureLoader().load('envMap.png');
envMap.mapping = THREE.SphericalReflectionMapping;

class Particle {
    constructor() {
        var particleMaterial = new THREE.MeshStandardMaterial({
            color: getRandomColour(),
            roughness: 0
        });
        // var particleMaterial = new THREE.MeshBasicMaterial({
        //     color: getRandomColour(),
        // });
        particleMaterial.envMap = envMap;
        this.particleMesh = new THREE.Mesh(particleGeometry, particleMaterial);
        this.particleMesh.position.z = -5;
        this.velocity = new THREE.Vector3();
        this.velocity.random();
        this.w = getRandomFloat(0.8, 0.95);
        this.c1 = 0.01;
        this.c2 = 0.015;

        this.frameCount = 0;
        this.frameMax = getRandomInt(300, 1500);
        this.pBest = this.newPBest();

        scene.add(this.particleMesh);
    }

    updatePosition(mousePos) {
        var currPos = new THREE.Vector3(this.particleMesh.position.x, this.particleMesh.position.y, this.particleMesh.position.z);
        this.updateVelocity(mousePos)
        this.particleMesh.position.x = currPos.x + this.velocity.x;
        this.particleMesh.position.y = currPos.y + this.velocity.y;
        this.particleMesh.position.z = currPos.z + this.velocity.z;

        this.frameCount += 1;
        if (this.frameCount > this.frameMax) {
            this.frameCount = 0;
            this.frameMax = getRandomInt(300, 1500);
            this.pBest = this.newPBest();
        }
    }

    updateVelocity(mousePos) {
        var currPos = new THREE.Vector3(this.particleMesh.position.x, this.particleMesh.position.y, this.particleMesh.position.z);
        // let r1 = getRandomFloat(0, 1);
        // let r2 = getRandomFloat(0, 1);
        this.velocity.x = this.w * this.velocity.x + 0.015 * (this.c1 * (this.pBest.x - currPos.x) + this.c2 * (mousePos.x - currPos.x));
        this.velocity.y = this.w * this.velocity.y + 0.015 * (this.c1 * (this.pBest.y - currPos.y) + this.c2 * (mousePos.y - currPos.y));
        this.velocity.z = this.w * this.velocity.z + 0.015 * (this.c1 * (this.pBest.z - currPos.z) + this.c2 * (mousePos.z - currPos.z));
    }

    newPBest() { return new THREE.Vector3(getRandomFloat(-80, 80), getRandomFloat(-50, 50), getRandomFloat(-10, 20)); }
}

let particles = [];
for (let i = 0; i < 20; i++) {
    particles.push(new Particle())
}

document.addEventListener('mousemove', onMouseMove, false);
var mouse3DPos = new THREE.Vector3();

// Follows the mouse event
function onMouseMove(event) {

	// Update the mouse variable
	event.preventDefault();
	mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
	mouse.y = - (event.clientY / window.innerHeight) * 2 + 1;

    // Make the sphere follow the mouse
    var vector = new THREE.Vector3(mouse.x, mouse.y, 0.5);
	vector.unproject( camera );
	var dir = vector.sub( camera.position ).normalize();
	var distance = - camera.position.z / dir.z;

    // Get mouse position
	var pos = camera.position.clone().add( dir.multiplyScalar( distance ) );
    mouse3DPos.copy(pos)
};

function updateParticles() {
    for (const particle of particles) {
        particle.updatePosition(mouse3DPos)
    }
}

function updateLine() {
    const points = [];
    for (const particle of particles) {
        points.push(new THREE.Vector3(particle.particleMesh.position.x,
                                      particle.particleMesh.position.y,
                                      particle.particleMesh.position.z));
    }
    const lineGeometry = new THREE.BufferGeometry().setFromPoints(points);
    line.geometry = lineGeometry;
}

function animate() {
    requestAnimationFrame(animate)
    updateParticles()
    updateLine()
    playScrollAnimations()
    render()
}

function render() {
    renderer.autoClear = false;
    renderer.clear();
    renderer.render(scene, camera)
}

function getRandomFloat(min, max) {
    return (Math.random() * (max - min) + min);
}

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomColour() {
    const colours = [
        0x15803d, 0x166534, // green-700-800
        0x0e7490, 0x155e75, // cyan-700-800
        0x0369a1, 0x075985   // sky-700-800
    ]
    var index = getRandomInt(0, colours.length - 1);
    console.log(index)
    return colours[index];
}

const animationScripts = [];

/* Liner Interpolation */
function lerp(x, y, a) {
    return (1 - a) * x + a * y
}

// Used to fit the lerps to start and end at specific scrolling percentages
function scalePercent(start, end) {
    return (scrollPercent - start) / (end - start)
}

//add an animation that moves the camera.
animationScripts.push({
    start: 0,
    end: 50,
    func: () => {
        camera.position.z = lerp(30, -10, scalePercent(0, 50))
    },
})

function playScrollAnimations() {
    animationScripts.forEach((a) => {
        if (scrollPercent >= a.start && scrollPercent < a.end) {
            a.func()
        }
    })
}

let scrollPercent = 0

document.body.onscroll = () => {
    //calculate the current scroll progress as a percentage
    scrollPercent =
        ((document.documentElement.scrollTop || document.body.scrollTop) /
            ((document.documentElement.scrollHeight ||
                document.body.scrollHeight) - document.documentElement.clientHeight)) * 100;
}

window.scrollTo({ top: 0, behavior: 'smooth' })
animate()
