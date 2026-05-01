const letters = "HP567!@#$&*";

document.querySelectorAll(".scramble").forEach(link => {
  let interval = null;
  let timeout = null;
  
  link.addEventListener("mouseenter", () => {
    let iteration = 0;
    const original = link.dataset.text;
    
    if (timeout) clearTimeout(timeout);
    clearInterval(interval);
    
    interval = setInterval(() => {
      link.innerText = original.split("").map((letter, index) => {
        if (index < iteration) return original[index];
        return letters[Math.floor(Math.random() * letters.length)];
      }).join("");
      
      if (iteration >= original.length) {
        clearInterval(interval);
      }
      iteration += 0.5;
    }, 60);
  });
  
  link.addEventListener("mouseleave", () => {
    clearInterval(interval);
    const original = link.dataset.text;
    let revIteration = original.length;
    
    const revealInterval = setInterval(() => {
      link.innerText = original.split("").map((letter, index) => {
        if (index >= revIteration) return letters[Math.floor(Math.random() * letters.length)];
        return original[index];
      }).join("");
      
      revIteration -= 0.5;
      
      if (revIteration < 0) {
        clearInterval(revealInterval);
        link.innerText = original;
      }
    }, 40);
  });
});

const logoWrapper = document.getElementById("logoWrapper");
const glassNav = document.querySelector(".glass-nav");
const mobileMenuBtn = document.getElementById("mobileMenuBtn");
const navLinks = document.getElementById("navLinks");

let scrollTimeout;

window.addEventListener("scroll", () => {
  if (!logoWrapper) return;
  
  if (scrollTimeout) cancelAnimationFrame(scrollTimeout);
  
  scrollTimeout = requestAnimationFrame(() => {
    const scrollY = window.scrollY;
    
    if (scrollY > 100) {
      logoWrapper.classList.add("scrolled");
      glassNav.classList.add("scrolled");
    } else {
      logoWrapper.classList.remove("scrolled");
      glassNav.classList.remove("scrolled");
    }
  });
});

if (mobileMenuBtn) {
  mobileMenuBtn.addEventListener("click", () => {
    navLinks.classList.toggle("active");
    const isOpen = navLinks.classList.contains("active");
    mobileMenuBtn.textContent = isOpen ? "✕" : "☰";
  });
}

document.querySelectorAll(".nav-links a").forEach(link => {
  link.addEventListener("click", () => {
    navLinks.classList.remove("active");
    if (mobileMenuBtn) mobileMenuBtn.textContent = "☰";
  });
});

let allData = [];

fetch("data.json")
  .then(res => res.json())
  .then(data => {
    allData = data;
    displayData(data);
  })
  .catch(() => {
    const container = document.getElementById("dataContainer");
    if (container) {
      container.innerHTML = "<p style='color:red'>Failed to load data</p>";
    }
  });

function displayData(data) {
  const container = document.getElementById("dataContainer");
  if (!container) return;
  container.innerHTML = "";
  data.forEach(item => {
    container.innerHTML += `
      <div class="card">
        <h3>${item.website}</h3>
        <p>${item.year}</p>
        <p>${item.data}</p>
      </div>
    `;
  });
}

function searchData() {
  const input = document.getElementById("search").value.toLowerCase();
  const filtered = allData.filter(item => item.website.toLowerCase().includes(input));
  displayData(filtered);
}

const aboutButton = document.querySelector(".about-button");
if (aboutButton) {
  aboutButton.addEventListener("click", () => {
    window.location.href = "mission.html";
  });
}

function setupGlowOnScroll() {
  const textElement = document.querySelector('.glow-text-line');
  if (!textElement) return;
  
  const words = textElement.innerText.split(' ');
  textElement.innerHTML = words.map(word => `<span>${word} </span>`).join('');
  
  const spans = textElement.querySelectorAll('span');
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        spans.forEach((span, index) => {
          setTimeout(() => {
            span.classList.add('highlight');
          }, index * 80);
        });
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });
  
  observer.observe(textElement);
}

setupGlowOnScroll();