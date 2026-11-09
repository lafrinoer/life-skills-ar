
import './style.css';

// ==========================================
// DATA 10 LIFE SKILLS
// ==========================================

const lifeSkills = [
  {
    id: '01',
    title: 'Mengenal Diri Sendiri',
    english: 'Self Awareness',
    icon: '🪞',
    description:
      'Memahami identitas, potensi, kelebihan, kekurangan, dan karakteristik diri sendiri.',
    color: 'blue',
  },
  {
    id: '02',
    title: 'Mengelola Emosi',
    english: 'Managing Emotions',
    icon: '💜',
    description:
      'Mengenali, memahami, dan mengendalikan emosi dalam berbagai situasi.',
    color: 'purple',
  },
  {
    id: '03',
    title: 'Berpikir Kritis',
    english: 'Critical Thinking',
    icon: '🔍',
    description:
      'Menganalisis informasi, mengevaluasi fakta, dan berpikir secara logis.',
    color: 'orange',
  },
  {
    id: '04',
    title: 'Berpikir Kreatif',
    english: 'Creative Thinking',
    icon: '💡',
    description:
      'Mengembangkan ide baru dan menemukan berbagai alternatif solusi.',
    color: 'yellow',
  },
  {
    id: '05',
    title: 'Membuat Keputusan',
    english: 'Decision Making',
    icon: '🧭',
    description:
      'Menentukan pilihan terbaik dengan mempertimbangkan berbagai konsekuensi.',
    color: 'green',
  },
  {
    id: '06',
    title: 'Hubungan Interpersonal',
    english: 'Interpersonal Relationships',
    icon: '🤝',
    description:
      'Membangun dan menjaga hubungan yang positif dengan orang lain.',
    color: 'pink',
  },
  {
    id: '07',
    title: 'Empati',
    english: 'Empathy',
    icon: '❤️',
    description:
      'Memahami perasaan, pengalaman, dan sudut pandang orang lain.',
    color: 'red',
  },
  {
    id: '08',
    title: 'Komunikasi Efektif',
    english: 'Effective Communication',
    icon: '💬',
    description:
      'Menyampaikan dan menerima pesan secara jelas, tepat, dan positif.',
    color: 'cyan',
  },
  {
    id: '09',
    title: 'Mengatasi Stres',
    english: 'Coping with Stress',
    icon: '🌿',
    description:
      'Mengembangkan cara sehat untuk menghadapi tekanan dan stres.',
    color: 'mint',
  },
  {
    id: '10',
    title: 'Memecahkan Masalah',
    english: 'Problem Solving',
    icon: '🧩',
    description:
      'Mengidentifikasi masalah dan menentukan langkah penyelesaian yang tepat.',
    color: 'violet',
  },
];

// ==========================================
// RENDER LIFE SKILLS CARDS
// ==========================================

const skillsGrid = document.getElementById('skillsGrid');

skillsGrid.innerHTML = lifeSkills
  .map(
    (skill) => `
      <article class="skill-card" data-color="${skill.color}">
        <div class="skill-card-top">
          <span class="skill-number">${skill.id}</span>
          <span class="skill-arrow">↗</span>
        </div>

        <div class="skill-icon-wrapper">
          <span class="skill-icon">${skill.icon}</span>
        </div>

        <div class="skill-card-content">
          <span class="skill-english">${skill.english}</span>
          <h3>${skill.title}</h3>
          <p>${skill.description}</p>
        </div>

        <div class="skill-card-bottom">
          <span>EXPLORE SKILL</span>
          <span class="bottom-arrow">→</span>
        </div>
      </article>
    `
  )
  .join('');

// ==========================================
// CURRENT YEAR
// ==========================================

document.getElementById('currentYear').textContent =
  new Date().getFullYear();

// ==========================================
// MOBILE NAVIGATION
// ==========================================

const mobileMenu = document.getElementById('mobileMenu');
const navLinks = document.querySelector('.nav-links');

mobileMenu.addEventListener('click', () => {
  const isOpen = navLinks.classList.toggle('active');

  mobileMenu.setAttribute('aria-expanded', String(isOpen));
  mobileMenu.textContent = isOpen ? '✕' : '☰';
});

navLinks.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('active');
    mobileMenu.setAttribute('aria-expanded', 'false');
    mobileMenu.textContent = '☰';
  });
});

// ==========================================
// TOAST NOTIFICATION
// ==========================================

const toast = document.getElementById('toast');
let toastTimer;

function showToast(message) {
  toast.textContent = message;
  toast.classList.add('show');

  clearTimeout(toastTimer);

  toastTimer = setTimeout(() => {
    toast.classList.remove('show');
  }, 3000);
}

// ==========================================
// AR BUTTON PREPARATION
// ==========================================

// Scanner MindAR.js akan diintegrasikan pada tahap berikutnya.
// Untuk sekarang, tombol mengarahkan pengguna ke daftar kartu.

document.getElementById('startButton').addEventListener('click', () => {
  window.location.href = '/scanner.html';
});

document.getElementById('ctaButton').addEventListener('click', () => {
  showToast('Pilih kartu yang ingin kamu eksplorasi.');
});

console.log('LIFE SKILLS AR - Landing Page initialized.');
console.log(`${lifeSkills.length} Life Skills cards loaded.`);
