// Load header from external file
async function loadHeader() {
  try {
    const response = await fetch('header.html');
    const headerContent = await response.text();
    const headerPlaceholder = document.getElementById('header-placeholder');
    if (headerPlaceholder) {
      headerPlaceholder.innerHTML = headerContent;
      setActiveNavLink();
    }
  } catch (error) {
    console.error('Error loading header:', error);
  }
}

// Set active navigation link based on current page
function setActiveNavLink() {
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  const navLinks = document.querySelectorAll('nav a');
  
  navLinks.forEach(link => {
    link.classList.remove('active');
    const href = link.getAttribute('href');
    
    if (currentPage === '' || currentPage === 'index.html') {
      if (link.classList.contains('nav-home')) {
        link.classList.add('active');
      }
    } else if (href === currentPage) {
      link.classList.add('active');
    }
  });
}

// Load header when DOM is ready
document.addEventListener('DOMContentLoaded', loadHeader);
