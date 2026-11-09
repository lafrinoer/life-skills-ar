
import * as THREE from 'three';
import { MindARThree } from 'mind-ar/dist/mindar-image-three.prod.js';
import './scanner.css';

const container = document.querySelector('#ar-container');

const startButton = document.querySelector('#startCamera');
const stopButton = document.querySelector('#stopCamera');

const statusText = document.querySelector('#scannerStatus');
const scanMessage = document.querySelector('#scanMessage');
const detectedPanel = document.querySelector('#detectedPanel');

let mindarThree = null;
let animationFrame = null;
let isDetected = false;
let isRunning = false;

// ==========================================
// STATUS
// ==========================================

function updateStatus(message, detected = false) {
  statusText.innerHTML = `
    <span class="status-dot ${detected ? 'active' : ''}"></span>
    ${message}
  `;
}

// ==========================================
// CREATE 3D CHARACTER
// ==========================================

function createCharacter() {
  const group = new THREE.Group();

  const skinMaterial = new THREE.MeshStandardMaterial({
    color: 0xffc99e,
    roughness: 0.8
  });

  const shirtMaterial = new THREE.MeshStandardMaterial({
    color: 0x687be5,
    roughness: 0.7
  });

  const hairMaterial = new THREE.MeshStandardMaterial({
    color: 0x392c35,
    roughness: 0.9
  });

  const whiteMaterial = new THREE.MeshStandardMaterial({
    color: 0xffffff
  });

  const blackMaterial = new THREE.MeshStandardMaterial({
    color: 0x25253a
  });

  // BODY
  const body = new THREE.Mesh(
    new THREE.SphereGeometry(0.22, 32, 32),
    shirtMaterial
  );

  body.scale.set(1.15, 1.3, 0.75);
  body.position.y = 0.18;
  group.add(body);

  // HEAD
  const headGroup = new THREE.Group();

  const head = new THREE.Mesh(
    new THREE.SphereGeometry(0.19, 32, 32),
    skinMaterial
  );

  head.scale.set(0.9, 1.05, 0.85);
  head.position.y = 0.52;
  headGroup.add(head);

  // HAIR
  const hair = new THREE.Mesh(
    new THREE.SphereGeometry(0.195, 32, 24, 0, Math.PI * 2, 0, Math.PI * 0.48),
    hairMaterial
  );

  hair.position.y = 0.57;
  hair.scale.set(1, 0.85, 0.9);
  headGroup.add(hair);

  // EYES
  [-0.065, 0.065].forEach((x) => {
    const eye = new THREE.Mesh(
      new THREE.SphereGeometry(0.022, 16, 16),
      whiteMaterial
    );

    eye.position.set(x, 0.53, 0.158);
    headGroup.add(eye);

    const pupil = new THREE.Mesh(
      new THREE.SphereGeometry(0.011, 16, 16),
      blackMaterial
    );

    pupil.position.set(x, 0.53, 0.178);
    headGroup.add(pupil);
  });

  // SMILE
  const smile = new THREE.Mesh(
    new THREE.TorusGeometry(0.035, 0.005, 8, 24, Math.PI),
    blackMaterial
  );

  smile.position.set(0, 0.46, 0.17);
  smile.rotation.z = Math.PI;
  headGroup.add(smile);

  group.add(headGroup);

  // NECK
  const neck = new THREE.Mesh(
    new THREE.CylinderGeometry(0.055, 0.065, 0.1, 24),
    skinMaterial
  );

  neck.position.y = 0.34;
  group.add(neck);

  // MIRROR
  const mirrorGroup = new THREE.Group();

  const mirrorFrame = new THREE.Mesh(
    new THREE.TorusGeometry(0.34, 0.025, 16, 64),
    new THREE.MeshStandardMaterial({
      color: 0x9b8ae9,
      metalness: 0.4,
      roughness: 0.3
    })
  );

  mirrorFrame.position.set(0.38, 0.55, -0.15);
  mirrorGroup.add(mirrorFrame);

  const mirrorSurface = new THREE.Mesh(
    new THREE.CircleGeometry(0.32, 48),
    new THREE.MeshStandardMaterial({
      color: 0xc9d8ff,
      metalness: 0.6,
      roughness: 0.2,
      side: THREE.DoubleSide
    })
  );

  mirrorSurface.position.set(0.38, 0.55, -0.16);
  mirrorGroup.add(mirrorSurface);

  group.add(mirrorGroup);

  // FINAL POSITION
  group.scale.set(0.65, 0.65, 0.65);

  return {
    group,
    headGroup,
    mirrorGroup
  };
}

// ==========================================
// START AR
// ==========================================

async function startAR() {
  if (isRunning) return;

  startButton.disabled = true;
  startButton.textContent = 'Menyiapkan kamera...';

  updateStatus('Meminta izin kamera...');

  try {
    mindarThree = new MindARThree({
      container,
      imageTargetSrc: '/targets/life-skills.mind',
      maxTrack: 1
    });

    const { renderer, scene, camera } = mindarThree;

    // LIGHTING
    scene.add(new THREE.HemisphereLight(
      0xffffff,
      0x777799,
      2
    ));

    const light = new THREE.DirectionalLight(0xffffff, 2);
    light.position.set(0, 3, 3);
    scene.add(light);

    // ANCHOR
    const anchor = mindarThree.addAnchor(0);

    // 3D CHARACTER
    const character = createCharacter();

    anchor.group.add(character.group);

    // DETECTION EVENTS
    anchor.onTargetFound = () => {
      isDetected = true;

      scanMessage.style.display = 'none';
      detectedPanel.hidden = false;

      updateStatus('Kartu berhasil terdeteksi!', true);
    };

    anchor.onTargetLost = () => {
      isDetected = false;

      scanMessage.style.display = 'flex';
      detectedPanel.hidden = true;

      updateStatus('Mencari kartu Life Skills...');
    };

    await mindarThree.start();

    isRunning = true;

    startButton.hidden = true;
    stopButton.hidden = false;

    updateStatus('Kamera aktif. Arahkan ke kartu.');

    // ANIMATION
    const clock = new THREE.Clock();

    renderer.setAnimationLoop(() => {
      const elapsed = clock.getElapsedTime();

      // Character floating animation
      character.group.position.y =
        Math.sin(elapsed * 2) * 0.035;

      // Head animation
      character.headGroup.rotation.y =
        Math.sin(elapsed * 1.2) * 0.08;

      // Mirror subtle movement
      character.mirrorGroup.rotation.y =
        Math.sin(elapsed * 0.8) * 0.04;

      renderer.render(scene, camera);
    });

  } catch (error) {
    console.error('AR Error:', error);

    updateStatus('Gagal mengaktifkan AR.');

    startButton.disabled = false;
    startButton.textContent = 'Coba Lagi';

    alert(
      'Kamera atau AR gagal diaktifkan. Pastikan izin kamera diberikan dan website menggunakan HTTPS atau localhost.'
    );

    if (mindarThree) {
      try {
        await mindarThree.stop();
      } catch (stopError) {
        console.error(stopError);
      }

      mindarThree = null;
    }

    isRunning = false;
  }
}

// ==========================================
// STOP AR
// ==========================================

async function stopAR() {
  if (!mindarThree) return;

  try {
    mindarThree.renderer.setAnimationLoop(null);

    await mindarThree.stop();

    mindarThree.renderer.dispose();

    mindarThree = null;
    isRunning = false;
    isDetected = false;

    container.innerHTML = '';

    detectedPanel.hidden = true;
    scanMessage.style.display = 'flex';

    stopButton.hidden = true;
    startButton.hidden = false;

    startButton.disabled = false;
    startButton.textContent = 'Aktifkan Kamera';

    updateStatus('Kamera telah dihentikan.');

  } catch (error) {
    console.error('Stop AR Error:', error);
    updateStatus('Terjadi kesalahan saat menghentikan kamera.');
  }
}

// ==========================================
// EVENT LISTENERS
// ==========================================

startButton.addEventListener('click', startAR);
stopButton.addEventListener('click', stopAR);

window.addEventListener('beforeunload', () => {
  if (mindarThree) {
    mindarThree.stop();
  }
});

console.log('LIFE SKILLS AR Scanner initialized.');
