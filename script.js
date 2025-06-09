// ──────────────────────────────────────────────────────────────────
// 1) PASSCODE & TYPEWRITER BOOT
const secretCode = 'magic8ball';  // set your actual code here

// Kick off the typewriter on page1
document.addEventListener('DOMContentLoaded', () => {
  const tagline = document.getElementById('tagline');
  const text    = tagline.textContent.trim();
  tagline.style.setProperty('--char-count', text.length);
  tagline.style.setProperty('--typing-duration', '4s');
  tagline.classList.add('typing');
});

// Check code, reveal page2, reset scroll, build gallery
function checkCode() {
  const val = document.getElementById('codeInput').value.toLowerCase();
  if (val === secretCode) {
    document.getElementById('page1').classList.add('hidden');
    const page2 = document.getElementById('page2');
    page2.classList.remove('hidden');
    page2.scrollTop = 0;               // ensure top image is visible
    buildGallery();
  } else {
    alert('Wrong code. Try again.');
  }
}
document.getElementById('enterBtn')
  .addEventListener('click', checkCode);
document.getElementById('codeInput')
  .addEventListener('keypress', e => {
    if (e.key === 'Enter') { e.preventDefault(); checkCode(); }
});

// ──────────────────────────────────────────────────────────────────
// 2) BUILD GALLERY & LIGHTBOX
// Auto-generate img1.jpg through img65.jpg
const images = Array.from({ length: 65 }, (_, i) => `img${i+1}.jpg`);

function buildGallery() {
  const gallery = document.getElementById('gallery');
  images.forEach(src => {
    const cont = document.createElement('div');
    cont.className = 'photo-container';
    const img = document.createElement('img');
    img.src = src;
    cont.appendChild(img);
    gallery.appendChild(cont);

    cont.addEventListener('click', () => {
      img.style.filter = 'none';
      openLightbox(src);
    });
  });
}

// LIGHTBOX OPEN/CLOSE & DOWNLOAD
const lb       = document.getElementById('lightbox');
const lbImg    = document.getElementById('lightboxImg');
const dlBtn    = document.getElementById('downloadBtn');
const closeBtn = document.getElementById('closeBtn');

function openLightbox(src) {
  lbImg.src = src;
  dlBtn.onclick = async () => {
    try {
      const resp = await fetch(src);
      const blob = await resp.blob();
      const url  = URL.createObjectURL(blob);
      const a    = document.createElement('a');
      a.href     = url;
      a.download = src.split('/').pop();
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch {
      window.open(src, '_blank');
    }
  };
  lb.classList.add('active');
}

closeBtn.addEventListener('click', () => lb.classList.remove('active'));
lb.addEventListener('click', e => {
  if (e.target === lb) lb.classList.remove('active');
});
