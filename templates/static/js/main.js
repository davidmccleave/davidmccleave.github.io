const canvas = document.querySelector('.canvas');

// set up scene and camera
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
scene.add(camera);
camera.position.set(0, 0, 5);
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
var light = new THREE.PointLight(0xFFFFFF);
light.position.set(20, 0, 20);
// var lightAmb = new THREE.AmbientLight(0x777777);
scene.add(light);
// scene.add(lightAmb);

// Create a circle around the mouse and move it. The sphere has opacity 0.
var mouse = {x : 0, y: 0};
var mouseGeometry = new THREE.SphereGeometry(1, 0, 0);
var mouseMaterial = new THREE.MeshBasicMaterial({
    color: 0x0000ff
});
var mouseMesh = new THREE.Mesh(mouseGeometry, mouseMaterial);
mouseMesh.position.z = -5;
scene.add(mouseMesh);

// When the mouse moves, call the given function
document.addEventListener('mousemove', onMouseMove, false);

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

	var pos = camera.position.clone().add( dir.multiplyScalar( distance ) );
	mouseMesh.position.copy(pos);
};

function animate() {
    requestAnimationFrame(animate)
    // playScrollAnimations()
    render()
}

function render() {
    renderer.autoClear = false;
    renderer.clear();
    renderer.render(scene, camera)
}

window.scrollTo({ top: 0, behavior: 'smooth' })
animate()

/* Liner Interpolation */
// function lerp(x, y, a) {
//     return (1 - a) * x + a * y
// }

// Used to fit the lerps to start and end at specific scrolling percentages
// function scalePercent(start, end) {
//     return (scrollPercent - start) / (end - start)
// }

// const animationScripts = [];

//add an animation that moves the cube through first 40 percent of scroll
// animationScripts.push({
//     start: 0,
//     end: 40,
//     func: () => {
//         camera.lookAt(cube.position)
//         camera.position.set(0, 1, 2)
//         cube.position.z = lerp(-10, 0, scalePercent(0, 40))
//         //console.log(cube.position.z)
//     },
// })

//add an animation that moves the camera between 20-40 percent of scroll
// animationScripts.push({
//     start: 40,
//     end: 80,
//     func: () => {
//         camera.position.x = lerp(0, 5, scalePercent(60, 80))
//         camera.position.y = lerp(1, 5, scalePercent(60, 80))
//         camera.lookAt(cube.position)
//         //console.log(camera.position.x + " " + camera.position.y)
//     },
// })

// function playScrollAnimations() {
//     animationScripts.forEach((a) => {
//         if (scrollPercent >= a.start && scrollPercent < a.end) {
//             a.func()
//         }
//     })
// }

// let scrollPercent = 0

// document.body.onscroll = () => {
//     //calculate the current scroll progress as a percentage
//     scrollPercent =
//         ((document.documentElement.scrollTop || document.body.scrollTop) /
//             ((document.documentElement.scrollHeight ||
//                 document.body.scrollHeight) - document.documentElement.clientHeight)) * 100;
// }

// function rotateCube() {
//     cube.rotation.x += 0.01
//     cube.rotation.y += 0.01
// }

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
