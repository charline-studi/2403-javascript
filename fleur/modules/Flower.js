import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'

class Flower {
    constructor() {
        this.canvas = document.querySelector('.js-canvas')
        this.canvasWidth = window.innerWidth
        this.canvasHeight = window.innerHeight
        this.flowerSize = 50
        this.animation = {
            rotationX: 0, 
            rotationZ: 0
        }

        this.init()
    }

    init() {
        this.createScene()
        this.createCamera()
        this.createRender()

        this.createGroupofObjects()
        this.createStem()
        this.createPistil()
        this.createPetals()
        
        this.createOrbitControls()
        this.createHelper()

        this.addGroupToScene()

        this.animate()
    } 

    createScene() {
        this.scene = new THREE.Scene()
        this.scene.background = new THREE.Color('skyblue')
    }

    createCamera() {
        const aspectRatio = this.canvasWidth / this.canvasHeight
        this.camera = new THREE.PerspectiveCamera( 45, aspectRatio, 0.1, 1000 )
        this.camera.position.z = 250
        this.camera.position.y = 150
        this.camera.position.x = 5
    } 

    createOrbitControls() {
        this.controls = new OrbitControls( this.camera, this.renderer.domElement )
    }

    createHelper() {
        const axesHelper = new THREE.AxesHelper( 50 )
        this.scene.add( axesHelper )
    }

    createRender() {
        this.renderer = new THREE.WebGLRenderer()
        this.renderer.setSize( this.canvasWidth, this.canvasHeight )
        this.canvas.appendChild( this.renderer.domElement )
    }

    createGroupofObjects() {
        this.flowerGroup = new THREE.Group()
    }

    createStem(){
        const geometry = new THREE.CylinderGeometry( 2, 2, this.flowerSize, 32 )
        const color = new THREE.Color('rgb(0, 255, 0)')
        const material = new THREE.MeshBasicMaterial( {color: color} )
        const cylinder = new THREE.Mesh( geometry, material )
        cylinder.position.y = this.flowerSize / 2
        this.flowerGroup.add( cylinder )
    } 

    createPistil() {
        const geometry = new THREE.SphereGeometry( 4.5, 32, 16 )
        const material = new THREE.MeshBasicMaterial( { color: 0xffff00 } )
        const sphere = new THREE.Mesh( geometry, material )
        sphere.position.y = this.flowerSize
        this.flowerGroup.add( sphere )
    }

    createPetals() {
        const geometry = new THREE.TorusGeometry( 6, 1, 16, 100 )
        const color = new THREE.Color(255, 0, 0)
        const material = new THREE.MeshBasicMaterial( { color: color } )

        const positionsX = [-5, 0, 5, 0]
        const positionsZ = [0, -5, 0, 5]
        const rotationY = [-30, 0, 30, 0]
        const rotationX = [90, 120, 90, 60]
        for (let i = 0; i < 4; i++){
            const torus = new THREE.Mesh( geometry, material )
            torus.position.y = this.flowerSize
            torus.position.x = positionsX[i]
            torus.position.z = positionsZ[i]
            torus.rotation.x = THREE.MathUtils.degToRad(rotationX[i])
            torus.rotation.y = THREE.MathUtils.degToRad(rotationY[i])
            this.flowerGroup.add( torus )
        }
    }

    addGroupToScene() {
        this.scene.add(this.flowerGroup)
    }

    animate() {
        requestAnimationFrame( this.animate.bind(this) )
        this.controls.update()

        /* Animation de la fleur : 
        - [x] Si pas de ville sélectionnée la fleur tourne sur elle-même
        - [ ] Si une ville est sélectionnée la fleur s'oriente en fonction des données API
        */
        if (window.app.city === ""){
            this.flowerGroup.rotation.y += 0.01
        } else {
            if (window.app.resetAnimation) {
                this.animation.rotationX = 0
                this.animation.rotationZ = 0
                window.app.resetAnimation = false
            }
            else {
                if (this.animation.rotationX < 17 && this.animation.rotationZ < 17 ) {
                    const speed = 0.01 * window.app.windSpeed
                    this.animation.rotationX += speed
                    this.animation.rotationZ += speed
                }
            }
            this.flowerGroup.rotation.z = THREE.MathUtils.degToRad(this.animation.rotationZ)
            this.flowerGroup.rotation.x = THREE.MathUtils.degToRad(this.animation.rotationX)
        }

        this.renderer.render( this.scene, this.camera )
    }
}

export { Flower }