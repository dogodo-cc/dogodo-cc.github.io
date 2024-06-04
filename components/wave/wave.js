import * as THREE from 'three';

const Xvertex = `
  attribute float scale;

			void main() {

				vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );

				gl_PointSize = scale * ( 100.0 / - mvPosition.z );

				gl_Position = projectionMatrix * mvPosition;

			}
`;
const Xfragment = `
  uniform vec3 color;

			void main() {

				if ( length( gl_PointCoord - vec2( 0.5, 0.5 ) ) > 0.475 ) discard;

				gl_FragColor = vec4( color, 0.5 );

			}
`;

class Wave {
  constructor({
    el,
    dotColor = 0xFF00FF,
    backgroundColor = 0x000000,
    willResize = false,
    cameraPositionY = 500 }) {

    this.SEPARATION = 50;
    this.AMOUNTX = 50;
    this.AMOUNTY = 50;

    this.container = el;
    this.camera = null;
    this.scene = null;
    this.renderer = null;
    this.particles = null;
    this.count = 0;
    this.dotColor = dotColor;
    this.backgroundColor = backgroundColor;

    this.willResize = willResize;
    this.cameraPositionY = cameraPositionY;

    const { width, height } = this.container.getBoundingClientRect();
    this.containerW = width;
    this.containerH = height;

    this.IO = new IntersectionObserver((entries) => {
      this.active = entries[0].intersectionRatio > 0;
    }, { root: null, rootMargin: '0px 0px 0px 0px', threshold: [0, 0.1] });
    // 0 是为了可以监听不可见的状态
    // 0.1 为了快速度监听可见状态

    this.IO.observe(this.container);
    this.init()
  }

  get containerHalfW() {
    return this.containerW / 2;
  }

  get containerHalfH() {
    return this.containerH / 2;
  }

  init() {
    const { AMOUNTX, AMOUNTY, SEPARATION, dotColor, backgroundColor, containerW, containerH, cameraPositionY } = this;

    this.camera = new THREE.PerspectiveCamera(75, containerW / containerH, 1, 10000);
    this.camera.position.z = 1000;
    this.camera.position.x = 0;
    this.camera.position.y = cameraPositionY;

    this.scene = new THREE.Scene();


    const numParticles = AMOUNTX * AMOUNTY;

    const positions = new Float32Array(numParticles * 3);
    const scales = new Float32Array(numParticles);

    let i = 0, j = 0;

    for (let ix = 0; ix < AMOUNTX; ix++) {

      for (let iy = 0; iy < AMOUNTY; iy++) {

        positions[i] = ix * SEPARATION - ((AMOUNTX * SEPARATION) / 2); // x
        positions[i + 1] = 0; // y
        positions[i + 2] = iy * SEPARATION - ((AMOUNTY * SEPARATION) / 2); // z

        scales[j] = 1;

        i += 3;
        j++;

      }

    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('scale', new THREE.BufferAttribute(scales, 1));

    const material = new THREE.ShaderMaterial({

      uniforms: {
        color: { value: new THREE.Color(dotColor) },
      },
      vertexShader: Xvertex,
      fragmentShader: Xfragment
    });


    this.particles = new THREE.Points(geometry, material);
    this.scene.add(this.particles);


    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(containerW, containerH);
    this.renderer.setClearColor(backgroundColor, 1);
    this.container.appendChild(this.renderer.domElement);


    this.container.style.touchAction = 'none';

    if (this.willResize) {
      window.addEventListener('resize', this.onWindowResize.bind(this));
    }

    this.animate();
  }

  onWindowResize() {

    const { width, height } = this.container.getBoundingClientRect();
    this.containerW = width;
    this.containerH = height;

    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();

    this.renderer.setSize(width, height);
  }

  animate() {
    requestAnimationFrame(this.animate.bind(this));
    if (this.active) {
      this.render();
    }
  }

  render() {

    const { AMOUNTX, AMOUNTY, count } = this;
    this.camera.lookAt(this.scene.position);

    const positions = this.particles.geometry.attributes.position.array;
    const scales = this.particles.geometry.attributes.scale.array;

    let i = 0, j = 0;

    for (let ix = 0; ix < AMOUNTX; ix++) {

      for (let iy = 0; iy < AMOUNTY; iy++) {

        positions[i + 1] = (Math.sin((ix + count) * 0.3) * 50) +
          (Math.sin((iy + count) * 0.5) * 50);

        scales[j] = (Math.sin((ix + count) * 0.3) + 1) * 20 +
          (Math.sin((iy + count) * 0.5) + 1) * 20;

        i += 3;
        j++;

      }

    }

    this.particles.geometry.attributes.position.needsUpdate = true;
    this.particles.geometry.attributes.scale.needsUpdate = true;

    this.renderer.render(this.scene, this.camera);

    this.count += 0.1;

  }
}

export default Wave;
