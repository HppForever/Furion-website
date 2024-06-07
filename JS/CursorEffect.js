document.addEventListener('mousemove', function(e) {
    const sparkles = document.getElementById('sparkles');
    const sparkle = document.createElement('div');
    sparkle.classList.add('sparkle');

    if (e.clientX <= 5 || e.clientX >= window.innerWidth - 38 || e.clientY <= 5 || e.clientY >= window.innerHeight - 38) // Проверяем, находится ли курсор на границе страницы
        return;

    sparkle.style.left = e.pageX + 'px';
    sparkle.style.top = e.pageY + 'px';
    sparkles.appendChild(sparkle);

    sparkle.addEventListener('animationend', function() {
        sparkles.removeChild(sparkle);
    });
});