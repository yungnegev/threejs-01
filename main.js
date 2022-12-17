import './style.scss'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import gsap from 'gsap'

// scene
const scene = new THREE.Scene()

// sphere // (3 is the radius or size 64 is the number of segments, as high as it goes for the smooth feel)
const geometry = new THREE.SphereGeometry(3, 64, 64)
const material = new THREE.MeshStandardMaterial({
  color: '#008080',
  roughness: 0.6
})
const mesh = new THREE.Mesh(geometry, material)
scene.add(mesh)

// sizes
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
}

//light fff5b6
const light = new THREE.PointLight(0xffffff, 1, 100)
light.position.set(0, 10, 10)
light.intensity = 1.5
scene.add(light)

//camera
//takes in: FOV(45) AR(width/height) clipping points for camera 0.1, 100
const camera = new THREE.PerspectiveCamera(50, sizes.width/sizes.height, 0.1, 100)
camera.position.z = 20
scene.add(camera)


//renderer
const canvas = document.querySelector('.webgl')
const renderer = new THREE.WebGLRenderer({canvas})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(2)
renderer.render(scene,camera)


//controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true
controls.enablePan = false
/* controls.enableZoom = false */
controls.autoRotate = true
controls.autoRotateSpeed = 5

//Resize
window.addEventListener('resize', () => {
  sizes.width = window.innerWidth
  sizes.height = window.innerHeight
  camera.updateProjectionMatrix()
  camera.aspect = sizes.width / sizes.height
  renderer.setSize(sizes.width, sizes.height)
})

//loop

const loop = () => {
  renderer.render(scene, camera)
  window.requestAnimationFrame(loop)
  controls.update()
}
loop()

//timeline magic
const tl = gsap.timeline({defaults: {duration: 1}})
tl.fromTo(mesh.scale, {z: 0, x: 0, y: 0}, {z: 1, x: 1, y: 1 })
tl.fromTo('nav', {y: '-100%'}, {y: '0%'})
tl.fromTo('.title', {opacity: 0}, {opacity: 1})

// mouse animation color
let mouseDown = false
let rgb = [12, 23, 55]


window.addEventListener('mousedown', () => (mouseDown = true))
window.addEventListener('mouseup', () => (mouseDown = false))

window.addEventListener('mousemove', (e) => {
  if(mouseDown) {
    rgb = [
      Math.round((e.pageX / sizes.width) * 255),
      Math.round((e.pageY / sizes.height) * 255),
      150,
    ]

    let newColor = new THREE.Color(`rgb(${rgb.join(',')})`)
    gsap.to(mesh.material.color, {r: newColor.r, g:newColor.g, b:newColor.b})

  }
})