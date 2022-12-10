import './styles.css'

const canvas = document.querySelector('.canvas');
canvas.innerHTML += 'YUOYOYOYOYOYOYOYOYOYO'

print('succesjaskldjfasjdf')

// const scene = new THREE.Scene();
// const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
// const renderer = new THREE.WebGLRenderer();

// renderer.setSize( window.innerWidth, window.innerHeight );
// canvas.appendChild( renderer.domElement );

// const geometry = new THREE.BoxGeometry( 1, 1, 1 );
// const material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
// const cube = new THREE.Mesh( geometry, material );
// scene.add( cube );

// camera.position.z = 5;

// function animate() {
//     requestAnimationFrame( animate );

//     cube.rotation.x += 0.01;
//     cube.rotation.y += 0.01;

//     renderer.render( scene, camera );
// };

// animate();





// import './styles.css'
// import * as THREE from 'three';

// // Setup

// const scene = new THREE.Scene();
// const camera = new THREE.PerspectiveCamera(75, window.innerWidth / innerHeight, 0.1, 1000)
// const renderer = new THREE.WebGLRenderer({
//     canvas: document.querySelector('.canvas')
// })

// renderer.setPixelRatio(window.devicePixelRatio)
// renderer.setSize(window.innerWidth, window.innerHeight)

// // Misc

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
