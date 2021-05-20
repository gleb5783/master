const heading = document.querySelector('.video-shooting__heading');
const renameHeading = () => {
  if (window.screen.width >= 1000) {
    heading.textContent = 'Сканер отпечатка в экране';
  }
  else {
    heading.textContent = 'Cъемка видео';
  }
}

setInterval(renameHeading, 10);
