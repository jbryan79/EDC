// ==================== APP.JS - LEVEL 3 INTERACTIONS ====================

// ==================== THEME SWITCHER ====================
const themeSelector = document.getElementById('themeSelector');
const savedTheme = localStorage.getItem('preferred-theme') || 'theme-darkpro';
document.documentElement.className = savedTheme;
themeSelector.value = savedTheme;

themeSelector.addEventListener('change', (e) => {
  const theme = e.target.value;
  document.documentElement.className = theme;
  localStorage.setItem('preferred-theme', theme);
  
  // Update WebGL colors based on theme
  updateWebGLColors();
});

// ==================== CUSTOM CURSOR ====================
const cursor = document.getElementById('custom-cursor');
let mouseX = 0;
let mouseY = 0;

document.addEventListener('mousemove', (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
  cursor.style.left = mouseX + 'px';
  cursor.style.top = mouseY + 'px';
  cursor.classList.add('active');
});

// Hover effects on interactive elements
document.querySelectorAll('.product-card, .stat-card, .theme-selector, button, a').forEach(el => {
  el.addEventListener('mouseenter', () => cursor.classList.add('hover'));
  el.addEventListener('mouseleave', () => cursor.classList.remove('hover'));
});

// ==================== WEBGL HERO BACKGROUND ====================
const canvas = document.getElementById('hero-canvas');
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
camera.position.z = 5;

// Create gradient mesh geometry
const geometry = new THREE.PlaneGeometry(20, 20, 32, 32);
const material = new THREE.ShaderMaterial({
  uniforms: {
    time: { value: 0 },
    color1: { value: new THREE.Color(0x38bdf8) }, // Default accent
    color2: { value: new THREE.Color(0x22c55e) }, // Default accent-2
    mouseX: { value: 0.5 },
    mouseY: { value: 0.5 }
  },
  vertexShader: `
    varying vec2 vUv;
    varying float vWave;
    uniform float time;
    
    void main() {
      vUv = uv;
      vec3 pos = position;
      
      // Create wave effect
      float wave = sin(pos.x * 2.0 + time) * 0.5;
      wave += sin(pos.y * 2.0 + time * 0.8) * 0.5;
      pos.z = wave * 0.5;
      vWave = wave;
      
      gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
    }
  `,
  fragmentShader: `
    varying vec2 vUv;
    varying float vWave;
    uniform float time;
    uniform vec3 color1;
    uniform vec3 color2;
    uniform float mouseX;
    uniform float mouseY;
    
    void main() {
      // Create gradient based on position and mouse
      vec2 center = vec2(mouseX, mouseY);
      float dist = distance(vUv, center);
      
      // Animated gradient
      vec3 color = mix(color1, color2, vUv.y + vWave * 0.2 + sin(time * 0.5) * 0.2);
      
      // Add some shimmer
      float shimmer = sin(vUv.x * 10.0 + time) * sin(vUv.y * 10.0 + time * 0.8) * 0.1;
      color += shimmer;
      
      gl_FragColor = vec4(color, 0.8);
    }
  `,
  transparent: true
});

const mesh = new THREE.Mesh(geometry, material);
scene.add(mesh);

// Animate
function animateWebGL() {
  requestAnimationFrame(animateWebGL);
  material.uniforms.time.value += 0.01;
  
  // Rotate mesh slightly
  mesh.rotation.z += 0.001;
  
  renderer.render(scene, camera);
}
animateWebGL();

// Update colors based on theme
function updateWebGLColors() {
  const root = getComputedStyle(document.documentElement);
  const accent = root.getPropertyValue('--accent').trim();
  const accent2 = root.getPropertyValue('--accent-2').trim();
  
  material.uniforms.color1.value = new THREE.Color(accent);
  material.uniforms.color2.value = new THREE.Color(accent2);
}

// Mouse parallax effect
document.addEventListener('mousemove', (e) => {
  const x = (e.clientX / window.innerWidth);
  const y = (e.clientY / window.innerHeight);
  
  material.uniforms.mouseX.value = x;
  material.uniforms.mouseY.value = y;
  
  // Subtle camera movement
  camera.position.x = (x - 0.5) * 0.5;
  camera.position.y = -(y - 0.5) * 0.5;
});

// Resize handler
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// ==================== STAT COUNTERS ====================
function animateCounter(element) {
  const target = parseFloat(element.getAttribute('data-target'));
  const duration = 2000;
  const start = 0;
  const startTime = performance.now();
  
  function updateCounter(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    
    // Easing function
    const easeOutQuart = 1 - Math.pow(1 - progress, 4);
    const current = start + (target - start) * easeOutQuart;
    
    // Format based on value
    if (target >= 1000) {
      element.textContent = current.toFixed(0);
    } else if (target < 10) {
      element.textContent = current.toFixed(1);
    } else {
      element.textContent = Math.floor(current);
    }
    
    if (progress < 1) {
      requestAnimationFrame(updateCounter);
    } else {
      // Final value
      if (target >= 1000) {
        element.textContent = target.toFixed(0);
      } else if (target < 10) {
        element.textContent = target.toFixed(1);
      } else {
        element.textContent = target;
      }
    }
  }
  
  requestAnimationFrame(updateCounter);
}

// Intersection Observer for stat counters
const statObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const statValue = entry.target.querySelector('.stat-value');
      if (statValue && statValue.textContent === '0') {
        animateCounter(statValue);
      }
    }
  });
}, { threshold: 0.5 });

document.querySelectorAll('.stat-card').forEach(card => {
  statObserver.observe(card);
});

// ==================== HEADER SCROLL EFFECT ====================
const header = document.getElementById('main-header');
let lastScroll = 0;

window.addEventListener('scroll', () => {
  const currentScroll = window.pageYOffset;
  
  if (currentScroll > 100) {
    header.classList.add('scrolled');
  } else {
    header.classList.remove('scrolled');
  }
  
  lastScroll = currentScroll;
});

// ==================== DAILY TRIVIA SYSTEM ====================
const triviaWidget = document.getElementById('trivia-widget');
const questionEl = document.getElementById('trivia-question');
const answerSection = document.getElementById('trivia-answer-section');
const streakCount = document.getElementById('streak-count');

// 30 starter questions (you can expand this to 365)
const triviaQuestions = [
  {
    q: "What year was USB-C officially released?",
    a: "2014 - USB-C was introduced in August 2014 and quickly became the new standard for data transfer and charging.",
    day: 1
  },
  {
    q: "How much does this complete portable setup weigh?",
    a: "8.5 pounds - Light enough to carry all day, powerful enough for professional work.",
    day: 2
  },
  {
    q: "What does 'GaN' stand for in modern chargers?",
    a: "Gallium Nitride - A semiconductor material that allows chargers to be smaller, cooler, and more efficient than traditional silicon-based chargers.",
    day: 3
  },
  {
    q: "How many cores does the Intel Core Ultra 9 285H have?",
    a: "16 cores (6 Performance-cores + 10 Efficient-cores) - This hybrid architecture provides both power and efficiency.",
    day: 4
  },
  {
    q: "What is the maximum resolution supported by HDMI 2.0?",
    a: "4K at 60Hz - HDMI 2.0 supports up to 3840×2160 resolution at 60 frames per second, perfect for productivity.",
    day: 5
  },
  {
    q: "How long can the Logitech G305 last on a single AA battery?",
    a: "250 hours - With its HERO 12K sensor efficiency, the G305 offers incredible battery life for a wireless gaming mouse.",
    day: 6
  },
  {
    q: "What is the total value of this portable workstation?",
    a: "Approximately $2,300 - A professional-grade setup that prioritizes quality and portability.",
    day: 7
  },
  {
    q: "How many touch points does the Zenbook 14's display support?",
    a: "10 touch points - Full multi-touch support for precise pen input and gestures.",
    day: 8
  },
  {
    q: "What is the maximum power delivery of the UGREEN car charger?",
    a: "130W total - Enough to fast-charge laptops, phones, and tablets simultaneously while on the road.",
    day: 9
  },
  {
    q: "How many USB ports are in the UGREEN 5-in-1 hub?",
    a: "3 USB-A 3.0 ports, plus 1 HDMI and 100W power delivery - Expands one port into five connections.",
    day: 10
  },
  {
    q: "What resolution is the Zenbook 14's display?",
    a: "1920x1200 (16:10 aspect ratio) - Taller than standard 1080p, giving you more vertical space for productivity.",
    day: 11
  },
  {
    q: "How much data can HDMI 2.0 transfer per second?",
    a: "18 Gbps (Gigabits per second) - Enough bandwidth for 4K video with HDR and multi-channel audio.",
    day: 12
  },
  {
    q: "What year did the first MacBook Air release?",
    a: "2008 - Steve Jobs famously pulled it out of a manila envelope, setting the standard for ultraportable laptops.",
    day: 13
  },
  {
    q: "How many items are in this core portable setup?",
    a: "8 essential items - Laptop, monitor, cable, hub, 2 chargers, mouse, and headphones.",
    day: 14
  },
  {
    q: "What is the DPI of the Logitech G305 HERO sensor?",
    a: "12,000 DPI maximum - Adjustable sensitivity from 200 to 12,000 DPI for precise control.",
    day: 15
  },
  {
    q: "How much does a typical 15.6\" portable monitor weigh?",
    a: "1.5-2 lbs - Modern portable monitors are incredibly light, using thin IPS panels and minimalist frames.",
    day: 16
  },
  {
    q: "What does ANC stand for in headphones?",
    a: "Active Noise Cancellation - Uses microphones and inverse sound waves to cancel out ambient noise.",
    day: 17
  },
  {
    q: "How many generations of USB have there been?",
    a: "4 major generations - USB 1.0 (1996), USB 2.0 (2000), USB 3.0 (2008), and USB4 (2019).",
    day: 18
  },
  {
    q: "What is the ideal laptop screen distance for ergonomics?",
    a: "20-26 inches (arm's length) - This reduces eye strain and maintains proper posture.",
    day: 19
  },
  {
    q: "How much power does the Zenbook 14 consume under normal use?",
    a: "15-25W typically - The Core Ultra 9's efficient cores handle most tasks, sipping power for all-day battery.",
    day: 20
  },
  {
    q: "What year was Bluetooth invented?",
    a: "1994 - Named after Harald Bluetooth, a 10th-century Danish king who united Denmark and Norway.",
    day: 21
  },
  {
    q: "How many watts does a USB 3.0 port provide?",
    a: "4.5W (0.9A @ 5V) - Enough for peripherals like mice and keyboards, but not for charging laptops.",
    day: 22
  },
  {
    q: "What is the benefit of a micro HDMI cable for portable setups?",
    a: "Smaller connector - Micro HDMI allows devices like portable monitors and cameras to stay compact while supporting full 4K resolution.",
    day: 23
  },
  {
    q: "What does DDR stand for in RAM?",
    a: "Double Data Rate - DDR memory transfers data on both the rising and falling edges of the clock signal, doubling throughput.",
    day: 24
  },
  {
    q: "How many devices can the UGREEN car charger power simultaneously?",
    a: "Multiple devices - With 130W total output and multiple ports, you can charge laptop, phone, and tablet at the same time.",
    day: 25
  },
  {
    q: "What is the screen-to-body ratio of modern ultraportables?",
    a: "85-90% - Thin bezels maximize screen real estate while keeping the laptop compact.",
    day: 26
  },
  {
    q: "How much does a typical laptop charger weigh?",
    a: "0.4-0.8 lbs for ultraportables - Heavier gaming laptops can have 1-2 lb power bricks.",
    day: 27
  },
  {
    q: "What is the refresh rate of most productivity laptop displays?",
    a: "60Hz - Sufficient for work, though some models now offer 90Hz or 120Hz for smoother scrolling.",
    day: 28
  },
  {
    q: "How long is the UGREEN HDMI cable in this setup?",
    a: "6.6 feet - Long enough for flexible monitor placement without being excessive for portability.",
    day: 29
  },
  {
    q: "What percentage lighter is this setup compared to a gaming laptop setup?",
    a: "50-60% lighter - Gaming setups with bulky laptops and power bricks often weigh 15-20 lbs total.",
    day: 30
  }
];

// Get day of year
function getDayOfYear() {
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 0);
  const diff = now - start;
  const oneDay = 1000 * 60 * 60 * 24;
  return Math.floor(diff / oneDay);
}

// Load trivia
function loadTrivia() {
  const dayOfYear = getDayOfYear();
  const questionIndex = (dayOfYear - 1) % triviaQuestions.length;
  const todaysTrivia = triviaQuestions[questionIndex];
  
  questionEl.textContent = todaysTrivia.q;
  
  // Check if user has answered today
  const lastAnswered = localStorage.getItem('trivia-last-answered');
  const today = new Date().toDateString();
  
  if (lastAnswered === today) {
    // Show answer
    answerSection.innerHTML = `
      <div class="trivia-answer">
        <strong>Answer:</strong> ${todaysTrivia.a}
      </div>
      <p style="text-align: center; margin-top: 1rem; font-size: 0.85rem; color: var(--muted);">
        Come back tomorrow for a new question!
      </p>
    `;
  } else {
    // Show locked state
    answerSection.innerHTML = `
      <div class="trivia-locked">
        🔒 Answer will be revealed tomorrow!<br>
        <small style="display: block; margin-top: 0.5rem;">Check back in 24 hours</small>
      </div>
    `;
  }
  
  // Update streak
  updateStreak();
  
  // Show widget after 3 seconds
  setTimeout(() => {
    triviaWidget.classList.add('visible');
  }, 3000);
}

// Update streak counter
function updateStreak() {
  const streak = parseInt(localStorage.getItem('trivia-streak') || '0');
  streakCount.textContent = streak;
}

// Check and update streak
function checkStreak() {
  const lastVisit = localStorage.getItem('trivia-last-visit');
  const today = new Date().toDateString();
  
  if (lastVisit) {
    const lastDate = new Date(lastVisit);
    const currentDate = new Date(today);
    const diffTime = currentDate - lastDate;
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) {
      // Consecutive day - increment streak
      const currentStreak = parseInt(localStorage.getItem('trivia-streak') || '0');
      localStorage.setItem('trivia-streak', (currentStreak + 1).toString());
    } else if (diffDays > 1) {
      // Streak broken - reset
      localStorage.setItem('trivia-streak', '1');
    }
    // If same day, do nothing
  } else {
    // First visit
    localStorage.setItem('trivia-streak', '1');
  }
  
  localStorage.setItem('trivia-last-visit', today);
}

// Close trivia widget
function closeTriviaWidget() {
  triviaWidget.classList.remove('visible');
}

// Initialize trivia
checkStreak();
loadTrivia();

// ==================== SCROLL REVEAL ANIMATIONS ====================
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.fade-in-up').forEach(el => {
  revealObserver.observe(el);
});

// ==================== PRODUCT CARD 3D TILT ====================
document.querySelectorAll('.product-card').forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    const rotateX = (y - centerY) / 20;
    const rotateY = (centerX - x) / 20;
    
    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-12px)`;
  });
  
  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
  });
});

// ==================== EASTER EGG: KONAMI CODE ====================
let konamiCode = [];
const konamiPattern = [
  'ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown',
  'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight',
  'b', 'a'
];

document.addEventListener('keydown', (e) => {
  konamiCode.push(e.key);
  konamiCode = konamiCode.slice(-10);
  
  if (konamiCode.join(',') === konamiPattern.join(',')) {
    activateSecretTheme();
  }
});

function activateSecretTheme() {
  document.documentElement.style.setProperty('--accent', '#ff00ff');
  document.documentElement.style.setProperty('--accent-2', '#00ff00');
  
  alert('🎉 SECRET THEME UNLOCKED! Refresh to return to normal.');
}

// ==================== PERFORMANCE MONITORING ====================
console.log('%c🚀 Portable Workstation v3.0', 'font-size: 20px; color: #38bdf8; font-weight: bold;');
console.log('%cBuilt with Three.js, WebGL, and pure JavaScript', 'color: #22c55e;');
console.log('%cTry the Konami Code: ↑ ↑ ↓ ↓ ← → ← → B A', 'color: #9ca3af; font-style: italic;');

// Performance metrics
window.addEventListener('load', () => {
  const perfData = window.performance.timing;
  const loadTime = perfData.loadEventEnd - perfData.navigationStart;
  console.log(`⚡ Page loaded in ${loadTime}ms`);
});
