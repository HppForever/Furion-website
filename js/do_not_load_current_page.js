document.addEventListener("DOMContentLoaded", function() {
    let currentPage = window.location.pathname.split("/").pop();
    
    let flagLinks = document.querySelectorAll(".nav-link");
    flagLinks.forEach(function(link) {
        if (link.getAttribute("href") === currentPage) { 
            link.addEventListener("click", function(event) {
                event.preventDefault();
            });
        }
    });
});