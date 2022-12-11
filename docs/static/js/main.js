const canvas = document.querySelector('.canvas');

// set up scene and camera
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
scene.add(camera);
camera.position.set(0, 0, 25);
camera.lookAt(scene.position);

// set up renderer
var renderer = new THREE.WebGLRenderer({
    alpha: true,
    premultipliedAlpha: false,
    powerPreference: 'high-performance',
    antialias: true
});

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
// var light = new THREE.PointLight(0xFFFFFF);
// light.position.set(-50, 50, 0);
// scene.add(light);
const directionalLight = new THREE.DirectionalLight( 0xffffff, 0.5 );
scene.add( directionalLight );

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

class Particle {
    constructor() {
        var mouseGeometry = new THREE.SphereGeometry(1, 16, 16);
        var mouseMaterial = new THREE.MeshBasicMaterial({
            color: getRandomColour()
        });
        this.mouseMesh = new THREE.Mesh(mouseGeometry, mouseMaterial);
        this.mouseMesh.position.z = -5;
        this.velocity = new THREE.Vector3();
        this.velocity.random();
        this.w = getRandomFloat(0.95, 0.99);
        this.c1 = 0.005;
        this.c2 = 0.015;

        this.frameCount = 0;
        this.frameMax = getRandomInt(300, 1500);
        this.pBest = this.newPBest();

        scene.add(this.mouseMesh);
    }

    updatePosition(mousePos) {
        var currPos = new THREE.Vector3(this.mouseMesh.position.x, this.mouseMesh.position.y, this.mouseMesh.position.z);
        this.updateVelocity(mousePos)
        this.mouseMesh.position.x = currPos.x + this.velocity.x;
        this.mouseMesh.position.y = currPos.y + this.velocity.y;
        this.mouseMesh.position.z = currPos.z + this.velocity.z;

        this.frameCount += 1;
        if (this.frameCount > this.frameMax) {
            this.frameCount = 0;
            this.frameMax = getRandomInt(300, 1500);
            this.pBest = this.newPBest();
        }
    }

    updateVelocity(mousePos) {
        var currPos = new THREE.Vector3(this.mouseMesh.position.x, this.mouseMesh.position.y, this.mouseMesh.position.z);
        // let r1 = getRandomFloat(0, 1);
        // let r2 = getRandomFloat(0, 1);
        this.velocity.x = this.w * this.velocity.x + 0.01 * (this.c1 * (this.pBest.x - currPos.x) + this.c2 * (mousePos.x - currPos.x));
        this.velocity.y = this.w * this.velocity.y + 0.01 * (this.c1 * (this.pBest.y - currPos.y) + this.c2 * (mousePos.y - currPos.y));
        this.velocity.z = this.w * this.velocity.z + 0.01 * (this.c1 * (this.pBest.z - currPos.z) + this.c2 * (mousePos.z - currPos.z));
    }

    newPBest() { return new THREE.Vector3(getRandomFloat(-80, 80), getRandomFloat(-50, 50), getRandomFloat(-50, 30)); }
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
        points.push(new THREE.Vector3(particle.mouseMesh.position.x,
                                      particle.mouseMesh.position.y,
                                      particle.mouseMesh.position.z));
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
    // tailwind - cyan, green
    const colours = [0xa5f3fc, 0x67e8f9, 0x22d3ee, 0x06b6d4, 0x0891b2, 0x0e7490, 0x4ade80, 0x22c55e, 0x16a34a, 0x15803d, 0x14b8a6];
    return colours[getRandomInt(0, colours.length)];
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

//add an animation that moves the camera between 20-40 percent of scroll
animationScripts.push({
    start: 0,
    end: 75,
    func: () => {
        camera.position.z = lerp(25, -8, scalePercent(0, 75))
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


// -----------------------------------------------------------------------------



// Move cube around with mouse

// camera.position.setZ(50)
// renderer.render(scene, camera)

// const ambl = new THREE.AmbientLight(0xFFFFFF)
// scene.add(ambl)

// const box = new THREE.Mesh(
//     new THREE.BoxGeometry(3, 3, 3),
//     new THREE.MeshBasicMaterial({color:0xFFFFFF})
// )
// box.scale.set(3, 3, 3)
// scene.add(box)

// function animate(){
//     requestAnimationFrame(animate)
//     box.rotation.x += 0.01
//     box.rotation.y += 0.01
//     box.rotation.z += 0.01
//     renderer.render(scene, camera)
// }
// animate()

// window.onresize = function(e) {
//     camera.aspect = window.innerWidth / window.innerHeight
//     camera.updateProjectionMatrix()
//     renderer.setSize(window.innerWidth, window.innerHeight)
// }

// let oldx = 0
// let oldy = 0

// window.onmousemove = function(ev) {
//     let changex = ev.x - oldx
//     let changey = ev.y - oldy
//     camera.position.x += changex / 100
//     camera.position.y -= changey / 100

//     oldx = ev.x
//     oldy = ev.y
// }
