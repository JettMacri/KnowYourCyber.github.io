// Scramble effect for nav links
const letters = "HP567!@#$&*";

document.querySelectorAll(".scramble").forEach(link => {
  let interval = null;
  
  link.addEventListener("mouseenter", () => {
    let iteration = 0;
    const original = link.dataset.text;
    clearInterval(interval);
    
    interval = setInterval(() => {
      link.innerText = original.split("").map((letter, index) => {
        if (index < iteration) return original[index];
        return letters[Math.floor(Math.random() * letters.length)];
      }).join("");
      
      if (iteration >= original.length) clearInterval(interval);
      iteration += 0.5;
    }, 60);
  });
  
  link.addEventListener("mouseleave", () => {
    clearInterval(interval);
    link.innerText = link.dataset.text;
  });
});

// Get elements for scroll effects and mobile menu
const logoWrapper = document.getElementById("logoWrapper");
const glassNav = document.querySelector(".glass-nav");
const mobileMenuBtn = document.getElementById("mobileMenuBtn");
const navLinks = document.getElementById("navLinks");

// When page scrolls past 80px, add 'scrolled' class to logo and navbar
window.addEventListener("scroll", () => {
  if (!logoWrapper) return;
  const scrollY = window.scrollY;
  
  if (scrollY > 80) {
    logoWrapper.classList.add("scrolled");
    glassNav.classList.add("scrolled");
  } else {
    logoWrapper.classList.remove("scrolled");
    glassNav.classList.remove("scrolled");
  }
});

// Mobile hamburger menu toggle
if (mobileMenuBtn) {
  mobileMenuBtn.addEventListener("click", () => {
    navLinks.classList.toggle("active");
    mobileMenuBtn.textContent = navLinks.classList.contains("active") ? "✕" : "☰";
  });
}

// Close mobile menu when a link is clicked
document.querySelectorAll(".nav-links a").forEach(link => {
  link.addEventListener("click", () => {
    navLinks.classList.remove("active");
    if (mobileMenuBtn) mobileMenuBtn.textContent = "☰";
  });
});

// Journey timeline: glowing thread and active cards
const journeyCards = document.querySelectorAll('.journey-card');
const threadGlow = document.getElementById('threadGlow');
const threadLine = document.querySelector('.thread-line');

function updateThreadGlow() {
  if (!threadGlow || !threadLine) return;
  
  let activeIndex = -1;
  journeyCards.forEach((card, idx) => {
    const rect = card.getBoundingClientRect();
    if (rect.top < window.innerHeight * 0.6 && rect.bottom > window.innerHeight * 0.3) {
      activeIndex = idx;
    }
  });
  
  journeyCards.forEach((card, idx) => {
    if (idx === activeIndex) {
      card.classList.add('active');
    } else {
      card.classList.remove('active');
    }
  });
  
  if (activeIndex >= 0) {
    const totalCards = journeyCards.length;
    const progress = activeIndex / (totalCards - 1);
    const maxTop = threadLine.offsetHeight - 15;
    threadGlow.style.top = (progress * maxTop) + 'px';
  }
}

window.addEventListener('scroll', () => {
  requestAnimationFrame(updateThreadGlow);
});
updateThreadGlow();

// Learn More button redirect to mission page
const aboutButton = document.querySelector(".about-button");
if (aboutButton) {
  aboutButton.addEventListener("click", () => {
    window.location.href = "mission.html";
  });
}

// Variables for breach database
let allBreaches = [];
let currentFilteredBreaches = [];
let displayedCount = 6;
const loadMoreBtn = document.getElementById('loadMoreBtn');
const loadMoreContainer = document.getElementById('loadMoreContainer');
const cardsContainer = document.getElementById('cardsContainer');
const searchInput = document.getElementById('searchInput');
const resultCountSpan = document.getElementById('resultCount');

// Display breaches (supports load more and search)
function displayBreaches(breaches, resetCount = true) {
  if (!cardsContainer) return;

  currentFilteredBreaches = breaches;
  if (resetCount) {
    displayedCount = 6;
  }

  const totalMatches = currentFilteredBreaches.length;
  if (resultCountSpan) resultCountSpan.textContent = totalMatches;

  const toShow = currentFilteredBreaches.slice(0, displayedCount);

  if (toShow.length === 0) {
    cardsContainer.innerHTML = '<div class="loading-placeholder">No matching records found.</div>';
    if (loadMoreContainer) loadMoreContainer.style.display = 'none';
    return;
  }

  cardsContainer.innerHTML = toShow.map(breach => `
    <div class="card">
      <h3>${escapeHtml(breach.email)}</h3>
      <div class="card-date">${breach.date} - ${breach.site}</div>
      <div class="card-details">${escapeHtml(breach.details)}</div>
    </div>
  `).join('');

  if (loadMoreContainer) {
    if (displayedCount < totalMatches) {
      loadMoreContainer.style.display = 'block';
    } else {
      loadMoreContainer.style.display = 'none';
    }
  }
}

function escapeHtml(str) {
  if (!str) return '';
  return str.replace(/[&<>]/g, function(m) {
    if (m === '&') return '&amp;';
    if (m === '<') return '&lt;';
    if (m === '>') return '&gt;';
    return m;
  });
}

// Fetch data.json from parent folder (because database.html is inside /database/)
async function loadBreaches() {
  if (!cardsContainer) return;
  try {
    cardsContainer.innerHTML = '<div class="loading-placeholder">Loading breach data...</div>';
    const response = await fetch('/database/data.json');
    if (!response.ok) throw new Error('Failed to load data');
    const data = await response.json();
    allBreaches = data.breaches || [];
    currentFilteredBreaches = allBreaches;
    displayedCount = 6;
    displayBreaches(allBreaches, true);
  } catch (error) {
    console.error('Error loading data.json:', error);
    cardsContainer.innerHTML = '<div class="loading-placeholder">Error loading data. Make sure data.json exists in the root folder.</div>';
    if (loadMoreContainer) loadMoreContainer.style.display = 'none';
  }
}

// Search filter (by email or site)
if (searchInput) {
  searchInput.addEventListener('input', function(e) {
    const term = e.target.value.toLowerCase();
    const filtered = allBreaches.filter(b => 
      (b.email && b.email.toLowerCase().includes(term)) ||
      (b.site && b.site.toLowerCase().includes(term))
    );
    displayedCount = 6;
    displayBreaches(filtered, true);
  });
}

// Load More button: show 6 more cards
if (loadMoreBtn) {
  loadMoreBtn.addEventListener('click', () => {
    displayedCount += 6;
    displayBreaches(currentFilteredBreaches, false);
  });
}

loadBreaches();

// Email breach checker (searches local data.json)
function checkEmail() {
  const emailInput = document.getElementById('emailInput');
  const emailResult = document.getElementById('emailResult');
  const email = emailInput.value.toLowerCase().trim();
  
  if (!email) {
    emailResult.innerHTML = 'Please enter an email address to check';
    emailResult.className = 'email-result';
    return;
  }
  
  emailResult.innerHTML = 'Searching our breach database...';
  emailResult.className = 'email-result loading';
  
  setTimeout(() => {
    const foundBreaches = allBreaches.filter(breach => 
      breach.email && breach.email.toLowerCase().includes(email.split('@')[0])
    );
    
    if (foundBreaches.length > 0) {
      const sites = foundBreaches.map(b => b.site).join(', ');
      emailResult.innerHTML = `⚠️ BREACHED! This email was found in ${foundBreaches.length} data breach(es): ${sites}. Change your passwords immediately and enable 2FA.`;
      emailResult.className = 'email-result breached';
    } else {
      emailResult.innerHTML = `✅ SAFE! This email was not found in our breach database. However, always practice good security habits.`;
      emailResult.className = 'email-result safe';
    }
  }, 800);
}

const checkEmailBtn = document.getElementById('checkEmailBtn');
if (checkEmailBtn) {
  checkEmailBtn.addEventListener('click', checkEmail);
}
document.getElementById('emailInput')?.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') checkEmail();
});

// Password checker using Have I Been Pwned API (k-anonymity)
async function sha1(message) {
  const msgBuffer = new TextEncoder().encode(message);
  const hashBuffer = await crypto.subtle.digest('SHA-1', msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  return hashHex.toUpperCase();
}

async function checkPassword() {
  const passwordInput = document.getElementById('passwordInput');
  const resultDiv = document.getElementById('passwordResult');
  const password = passwordInput.value;
  
  if (!password) {
    resultDiv.innerHTML = 'Please enter a password to check';
    resultDiv.className = 'password-result';
    return;
  }
  
  resultDiv.innerHTML = 'Checking password securely...';
  resultDiv.className = 'password-result loading';
  
  try {
    const hash = await sha1(password);
    const prefix = hash.substring(0, 5);
    const suffix = hash.substring(5);
    
    const response = await fetch(`https://api.pwnedpasswords.com/range/${prefix}`);
    const data = await response.text();
    
    if (data.includes(suffix)) {
      const lines = data.split('\n');
      let count = 0;
      for (let line of lines) {
        if (line.includes(suffix)) {
          const parts = line.split(':');
          count = parseInt(parts[1]);
          break;
        }
      }
      resultDiv.innerHTML = `⚠️ BREACHED! This password has been found ${count.toLocaleString()} times in data breaches. DO NOT use this password.`;
      resultDiv.className = 'password-result breached';
    } else {
      resultDiv.innerHTML = `✅ SAFE! This password was not found in any known data breaches.`;
      resultDiv.className = 'password-result safe';
    }
  } catch (error) {
    console.error('Password check error:', error);
    resultDiv.innerHTML = 'Error checking password. Please try again.';
    resultDiv.className = 'password-result';
  }
}

const checkPasswordBtn = document.getElementById('checkPasswordBtn');
if (checkPasswordBtn) {
  checkPasswordBtn.addEventListener('click', checkPassword);
}
document.getElementById('passwordInput')?.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') checkPassword();
});

// Password strength meter (on mission page)
function updatePasswordStrength() {
  const password = document.getElementById('gamePasswordInput').value;
  
  const hasLength = password.length >= 8;
  const hasNumber = /[0-9]/.test(password);
  const hasUppercase = /[A-Z]/.test(password);
  const hasLowercase = /[a-z]/.test(password);
  const hasSpecial = /[!@#$%^&*]/.test(password);
  
  const checks = [hasLength, hasNumber, hasUppercase, hasLowercase, hasSpecial];
  const checkIds = ['checkLength', 'checkNumber', 'checkUppercase', 'checkLowercase', 'checkSpecial'];
  
  let score = 0;
  checks.forEach((check, index) => {
    const element = document.getElementById(checkIds[index]);
    if (check) {
      element.classList.add('checked');
      score++;
    } else {
      element.classList.remove('checked');
    }
  });
  
  const strengthBar = document.getElementById('strengthBar');
  const strengthText = document.getElementById('strengthText');
  const percent = (score / 5) * 100;
  strengthBar.style.width = percent + '%';
  
  if (percent <= 20) {
    strengthBar.style.background = '#ff5555';
    strengthText.textContent = 'Very Weak';
    strengthText.style.color = '#ff5555';
  } else if (percent <= 40) {
    strengthBar.style.background = '#ffaa66';
    strengthText.textContent = 'Weak';
    strengthText.style.color = '#ffaa66';
  } else if (percent <= 60) {
    strengthBar.style.background = '#ffdd55';
    strengthText.textContent = 'Medium';
    strengthText.style.color = '#ffdd55';
  } else if (percent <= 80) {
    strengthBar.style.background = '#88ff88';
    strengthText.textContent = 'Strong';
    strengthText.style.color = '#88ff88';
  } else {
    strengthBar.style.background = '#4caf50';
    strengthText.textContent = 'Very Strong!';
    strengthText.style.color = '#4caf50';
  }
}

const gameInput = document.getElementById('gamePasswordInput');
if (gameInput) {
  gameInput.addEventListener('input', updatePasswordStrength);
}

// Flip cards on mission page (click to show back)
const interactiveCards = document.querySelectorAll('.interactive-card');
interactiveCards.forEach(card => {
  card.addEventListener('click', function(e) {
    e.stopPropagation();
    this.classList.toggle('active');
  });
});

// Click outside to close any open flip card
document.addEventListener('click', function(e) {
  if (!e.target.closest('.interactive-card')) {
    interactiveCards.forEach(card => {
      card.classList.remove('active');
    });
  }
});

// Animated counters for impact numbers (count up when scrolled into view)
const impactNumbers = document.querySelectorAll('.impact-number[data-target]');
const impactObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const element = entry.target;
      const target = parseInt(element.getAttribute('data-target'));
      let current = 0;
      const increment = target / 50;
      const updateNumber = () => {
        current += increment;
        if (current < target) {
          element.textContent = Math.floor(current).toLocaleString() + '+';
          requestAnimationFrame(updateNumber);
        } else {
          element.textContent = target.toLocaleString() + '+';
        }
      };
      updateNumber();
      impactObserver.unobserve(element);
    }
  });
}, { threshold: 0.5 });

impactNumbers.forEach(num => impactObserver.observe(num));