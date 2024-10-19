document.addEventListener('DOMContentLoaded', function() {
    let currentFileUrl = '';
    
    // Обработчик для кнопок "Скачать" на карточках
    document.querySelectorAll('.download-btn').forEach(function(btn) {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            currentFileUrl = this.getAttribute('data-file');
        });
    });

    // Обработчик для кнопки "Скачать" в модальном окне
    document.getElementById('finalDownloadBtn').addEventListener('click', function() {
        if (currentFileUrl) {
            // Создаем временную ссылку для скачивания
            const link = document.createElement('a');
            link.href = currentFileUrl;
            link.download = currentFileUrl.split('/').pop(); // Получаем имя файла из URL
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            
            // Закрываем модальное окно
            const modal = bootstrap.Modal.getInstance(document.getElementById('downloadModal'));
            modal.hide();
        }
    });
});