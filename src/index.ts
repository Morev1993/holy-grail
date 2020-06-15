import {
  WebGLRenderer,
  Color,
  PerspectiveCamera,
  Scene,
  AxesHelper,
  PlaneGeometry,
  MeshLambertMaterial,
  Mesh,
  DoubleSide,
  DirectionalLight,
  AmbientLight,
  PCFSoftShadowMap,
} from 'three';
import { resizeRenderer, fetchGltf } from './util';
import { CameraController } from './CameraController';
import characterGltfSrc from './assets/knight_runnig/scene.gltf';

async function start() {
  const renderer = createRenderer();
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = PCFSoftShadowMap;
  const camera = new PerspectiveCamera(75, 1, 0.1, 100);
  const cameraController = new CameraController(4, 0.01);
  cameraController.setRotation(Math.PI / 8, 0);
  const scene = new Scene();

  const axes = new AxesHelper(2);
  scene.add(axes);

  const ground = createGround();
  scene.add(ground);

  const characterGltf = await fetchGltf(characterGltfSrc);
  characterGltf.scene.traverse((obj) => {
    obj.castShadow = true;
    obj.receiveShadow = true;
  });
  characterGltf.scene.scale.set(0.5, 0.5, 0.5);
  scene.add(characterGltf.scene);

  const sun = createSun();
  sun.position.set(1, 1, 1).normalize();
  scene.add(sun);

  const ambient = new AmbientLight();
  scene.add(ambient);

  const render = () => {
    resizeRenderer(renderer, camera);

    cameraController.update(camera);

    renderer.render(scene, camera);
    requestAnimationFrame(render);
  };

  render();
}

start();

export function createRenderer() {
  const renderer = new WebGLRenderer({ antialias: true });
  document.body.appendChild(renderer.domElement);
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setClearColor(new Color('white'));

  renderer.domElement.style.position = 'fixed';
  renderer.domElement.style.left = '0';
  renderer.domElement.style.top = '0';
  renderer.domElement.style.width = '100%';
  renderer.domElement.style.height = '100%';

  return renderer;
}

function createGround() {
  const geometry = new PlaneGeometry(100, 100);
  const material = new MeshLambertMaterial({ color: 'gray', side: DoubleSide });
  const ground = new Mesh(geometry, material);
  ground.rotation.x = Math.PI / 2;
  ground.receiveShadow = true;
  return ground;
}

function createSun() {
  const sun = new DirectionalLight('white');
  const shadowCameraSize = 10;
  sun.castShadow = true;
  sun.shadow.camera.near = -shadowCameraSize;
  sun.shadow.camera.far = shadowCameraSize;
  sun.shadow.camera.left = -shadowCameraSize;
  sun.shadow.camera.right = shadowCameraSize;
  sun.shadow.camera.top = shadowCameraSize;
  sun.shadow.camera.bottom = -shadowCameraSize;
  return sun;
}
