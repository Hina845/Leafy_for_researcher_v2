// components.js
function loadComponent(selector, file) {
    fetch(file)
      .then(res => res.text())
      .then(html => {
        document.querySelector(selector).innerHTML = html;
      })
      .catch(err => console.error(`Error loading ${file}:`, err));
  }
  
  document.addEventListener("DOMContentLoaded", () => {
    loadComponent("#navigation", "../components/navigation.html");
    loadComponent("#footer", "../components/footer.html");
<<<<<<< HEAD:public/scripts/component.js
    loadComponent('#search-panel', '../components/search-panel.html');
    loadComponent('.profile-card', '../components/profile-card.html');
    loadComponent('.content-card', '../components/content-card.html');
=======
>>>>>>> main:public/scripts/index.js
  });
  