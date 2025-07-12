// Smooth scrolling for navigation links
document.addEventListener('DOMContentLoaded', function() {
  // Project horizontal scrolling system
  let currentProjectIndex = 0;
  const projectCards = document.querySelectorAll('.project-card');
  const projectsScroll = document.querySelector('.projects-scroll');
  const projectsSection = document.querySelector('.projects-section');
  let isInProjectsSection = false;
  let projectScrollLocked = false;
  
  // Create project indicators
  const indicatorsContainer = document.createElement('div');
  indicatorsContainer.className = 'project-indicators';
  projectCards.forEach((_, index) => {
    const dot = document.createElement('div');
    dot.className = `project-dot ${index === 0 ? 'active' : ''}`;
    dot.addEventListener('click', () => goToProject(index));
    indicatorsContainer.appendChild(dot);
  });
  document.querySelector('.projects-container').appendChild(indicatorsContainer);
  
  function updateProjectDisplay() {
    const cardWidth = projectCards[0].offsetWidth + 80; // card width + gap + buffer
    const translateX = -currentProjectIndex * cardWidth;
    
    projectsScroll.style.transform = `translateX(${translateX}px)`;
    
    // Update active states
    projectCards.forEach((card, index) => {
      card.classList.toggle('active', index === currentProjectIndex);
    });
    
    // Update indicators
    document.querySelectorAll('.project-dot').forEach((dot, index) => {
      dot.classList.toggle('active', index === currentProjectIndex);
    });
  }
  
  function goToProject(index) {
    if (index >= 0 && index < projectCards.length) {
      currentProjectIndex = index;
      updateProjectDisplay();
    }
  }
  
  function nextProject() {
    if (currentProjectIndex < projectCards.length - 1) {
      currentProjectIndex++;
      updateProjectDisplay();
      return true;
    }
    return false;
  }
  
  function prevProject() {
    if (currentProjectIndex > 0) {
      currentProjectIndex--;
      updateProjectDisplay();
      return true;
    }
    return false;
  }
  
  // Check if we're in projects section
  function checkProjectsSection() {
    const rect = projectsSection.getBoundingClientRect();
    const inSection = rect.top <= 100 && rect.bottom >= 100;
    
    if (inSection !== isInProjectsSection) {
      isInProjectsSection = inSection;
      if (isInProjectsSection) {
        updateProjectDisplay();
      }
    }
  }
  
  // Enhanced scroll handling for projects
  let scrollTimeout;
  window.addEventListener('wheel', (e) => {
    checkProjectsSection();
    
    if (isInProjectsSection && !projectScrollLocked) {
      e.preventDefault();
      
      clearTimeout(scrollTimeout);
      projectScrollLocked = true;
      
      if (e.deltaY > 0) {
        // Scrolling down
        if (!nextProject()) {
          // At last project, continue normal scroll
          projectScrollLocked = false;
          window.scrollBy(0, 150);
        }
      } else {
        // Scrolling up
        if (!prevProject()) {
          // At first project, continue normal scroll
          projectScrollLocked = false;
          window.scrollBy(0, -150);
        }
      }
      
      scrollTimeout = setTimeout(() => {
        projectScrollLocked = false;
      }, 1200);
    }
  }, { passive: false });
  
  // Touch support for mobile
  let touchStartX = 0;
  let touchEndX = 0;
  
  projectsSection.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
  });
  
  projectsSection.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
  });
  
  function handleSwipe() {
    const swipeThreshold = 50;
    const diff = touchStartX - touchEndX;
    
    if (Math.abs(diff) > swipeThreshold) {
      if (diff > 0) {
        nextProject();
      } else {
        prevProject();
      }
    }
  }
  
  // Initialize first project as active
  updateProjectDisplay();
  
  // Navigation functionality
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('.section');
  
  // Update active nav link on scroll
  function updateActiveNavLink() {
    checkProjectsSection();
    let current = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.clientHeight;
      if (scrollY >= sectionTop - 200) {
        current = section.getAttribute('id');
      }
    });
    
    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  }
  
  // Smooth scroll to sections
  navLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      const targetId = this.getAttribute('href');
      const targetSection = document.querySelector(targetId);
      
      if (targetSection) {
        targetSection.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });
  
  // Skills animation on scroll
  const skillCards = document.querySelectorAll('.skill-card');
  const observerOptions = {
    threshold: 0.3,
    rootMargin: '0px 0px -50px 0px'
  };
  
  const skillObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const progressBar = entry.target.querySelector('.progress-bar');
        if (progressBar) {
          // Trigger progress animation
          progressBar.style.width = '0%';
          setTimeout(() => {
            progressBar.style.width = progressBar.style.getPropertyValue('--progress');
          }, 100);
        }
      }
    });
  }, observerOptions);
  
  skillCards.forEach(card => {
    skillObserver.observe(card);
  });
  
  // Education semester tabs
  const semesterTabs = document.querySelectorAll('.semester-tab:not(.disabled)');
  const skillsContainers = document.querySelectorAll('.skills-learned');
  
  semesterTabs.forEach(tab => {
    tab.addEventListener('click', function() {
      const semester = this.getAttribute('data-semester');
      
      // Update active tab
      semesterTabs.forEach(t => t.classList.remove('active'));
      this.classList.add('active');
      
      // Show corresponding skills
      skillsContainers.forEach(container => {
        container.classList.add('hidden');
      });
      
      const targetContainer = document.getElementById(`skills-semester-${semester}`);
      if (targetContainer) {
        targetContainer.classList.remove('hidden');
      }
    });
  });
  
  // Parallax effect for landing section
  const landingBg = document.querySelector('.landing-bg');
  
  function handleParallax() {
    const scrolled = window.pageYOffset;
    const rate = scrolled * -0.5;
    
    if (landingBg) {
      landingBg.style.transform = `translateY(${rate}px)`;
    }
  }
  
  // 3D tilt effect for project cards
  const projectCardsForTilt = document.querySelectorAll('.project-card');
  
  projectCardsForTilt.forEach(card => {
    card.addEventListener('mousemove', function(e) {
      const rect = this.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      
      const rotateX = (y - centerY) / 30;
      const rotateY = (centerX - x) / 30;
      
      if (this.classList.contains('active')) {
        this.style.transform = `translateZ(50px) scale(1.05) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
      }
    });
    
    card.addEventListener('mouseleave', function() {
      if (this.classList.contains('active')) {
        this.style.transform = 'translateZ(50px) scale(1.05)';
      } else {
        this.style.transform = 'translateZ(-30px) scale(0.95)';
      }
    });
  });
  
  // 3D tilt effect for skill cards
  const skillCardsForTilt = document.querySelectorAll('.skill-card');
  
  skillCardsForTilt.forEach(card => {
    card.addEventListener('mousemove', function(e) {
      const rect = this.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      
      const rotateX = (y - centerY) / 15;
      const rotateY = (centerX - x) / 15;
      
      this.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(5px)`;
    });
    
    card.addEventListener('mouseleave', function() {
      this.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0px)';
    });
  });
  
  // Floating animation for profile image
  const profileImage = document.querySelector('.profile-image');
  if (profileImage) {
    let floatDirection = 1;
    setInterval(() => {
      floatDirection *= -1;
      profileImage.style.transform = `translateY(${floatDirection * 10}px) scale(1)`;
    }, 3000);
  }
  
  // Magnetic effect for buttons
  const buttons = document.querySelectorAll('.btn');
  
  buttons.forEach(button => {
    button.addEventListener('mousemove', function(e) {
      const rect = this.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      
      this.style.transform = `translate(${x * 0.1}px, ${y * 0.1}px)`;
    });
    
    button.addEventListener('mouseleave', function() {
      this.style.transform = 'translate(0px, 0px)';
    });
  });
  
  // Scroll event listeners
  window.addEventListener('scroll', () => {
    updateActiveNavLink();
    handleParallax();
  });
  
  // Initialize
  updateActiveNavLink();
  
  // Smooth reveal animations for sections
  const revealElements = document.querySelectorAll('.section-header, .project-card, .skill-card, .education-card');
  
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  });
  
  revealElements.forEach(element => {
    element.style.opacity = '0';
    element.style.transform = 'translateY(50px)';
    element.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
    revealObserver.observe(element);
  });
  
  // Add stagger effect to skill cards
  skillCards.forEach((card, index) => {
    card.style.transitionDelay = `${index * 0.1}s`;
  });
  
  // Cursor trail effect
  const cursor = document.createElement('div');
  cursor.className = 'cursor-trail';
  cursor.style.cssText = `
    position: fixed;
    width: 20px;
    height: 20px;
    background: radial-gradient(circle, var(--primary-color), transparent);
    border-radius: 50%;
    pointer-events: none;
    z-index: 9999;
    opacity: 0.6;
    transition: transform 0.1s ease;
  `;
  document.body.appendChild(cursor);
  
  document.addEventListener('mousemove', (e) => {
    cursor.style.left = e.clientX - 10 + 'px';
    cursor.style.top = e.clientY - 10 + 'px';
  });
  
  // Hide cursor trail on mobile
  if (window.innerWidth <= 768) {
    cursor.style.display = 'none';
  }
});

// Handle mailto link with Gmail fallback
function tryMailto(mailtoUrl) {
  const emailWindow = window.open(mailtoUrl, "_blank");
  setTimeout(() => {
    if (
      !emailWindow ||
      emailWindow.closed ||
      typeof emailWindow.closed === "undefined"
    ) {
      const params = mailtoUrl.split("?")[1];
      const subject = params.match(/subject=([^&]*)/)?.[1] || "";
      const body = params.match(/body=([^&]*)/)?.[1] || "";
      const to = mailtoUrl.split("?")[0].replace("mailto:", "");
      window.location.href = `https://mail.google.com/mail/?view=cm&fs=1&to=${to}&su=${subject}&body=${body}`;
    } else {
      emailWindow.close();
    }
  }, 500);
}