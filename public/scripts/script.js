const hamburger = document.querySelector('.hamburger');
const mainMenu = document.querySelector('.main-menu');

hamburger.addEventListener('click', () => {
    mainMenu.classList.toggle('active');
});

if(window.innerHeight < document.body.scrollHeight && navigator.maxTouchPoints <= 0) {
	document.querySelector(".scroll-down").style.display = "block";
}

if ("serviceWorker" in navigator) {
    window.addEventListener("load", function() {
      navigator.serviceWorker
        .register("/scripts/serviceworker.js")
        .then(res => console.log("service worker registered"))
        .catch(err => console.log("service worker not registered", err))
    })
  }