const canvas = document.querySelector('.canvas');
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
var renderer = new THREE.WebGLRenderer({
    alpha: true,
    premultipliedAlpha: false,
    powerPreference: 'high-performance',
    antialias: true
});

renderer.setPixelRatio(window.devicePixelRatio)
renderer.setSize( window.innerWidth, window.innerHeight );
canvas.appendChild( renderer.domElement );

// ----- Grid move with scroll -----

const geometry = new THREE.BoxGeometry()
const material = new THREE.MeshBasicMaterial({
    color: 0x00ff00,
    wireframe: true,
})

const cube = new THREE.Mesh(geometry, material)
cube.position.set(0, 0.5, -10)
scene.add(cube)

window.addEventListener('resize', onWindowResize, false)
function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()
    renderer.setSize(window.innerWidth, window.innerHeight)
    render()
}

/* Liner Interpolation */
function lerp(x, y, a) {
    return (1 - a) * x + a * y
}

// Used to fit the lerps to start and end at specific scrolling percentages
function scalePercent(start, end) {
    return (scrollPercent - start) / (end - start)
}

const animationScripts = [];

//add an animation that moves the cube through first 40 percent of scroll
animationScripts.push({
    start: 0,
    end: 40,
    func: () => {
        camera.lookAt(cube.position)
        camera.position.set(0, 1, 2)
        cube.position.z = lerp(-10, 0, scalePercent(0, 40))
        //console.log(cube.position.z)
    },
})

//add an animation that moves the camera between 60-80 percent of scroll
// animationScripts.push({
//     start: 60,
//     end: 80,
//     func: () => {
//         camera.position.x = lerp(0, 5, scalePercent(60, 80))
//         camera.position.y = lerp(1, 5, scalePercent(60, 80))
//         camera.lookAt(cube.position)
//         //console.log(camera.position.x + " " + camera.position.y)
//     },
// })

//add an animation that auto rotates the cube from 40 percent of scroll
animationScripts.push({
    start: 40,
    end: 101,
    func: () => {
        //auto rotate
        cube.rotation.x += 0.01
        cube.rotation.y += 0.01
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

function animate() {
    requestAnimationFrame(animate)
    playScrollAnimations()
    render()
}

function render() {
    renderer.render(scene, camera)
}

window.scrollTo({ top: 0, behavior: 'smooth' })
animate()

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
