const changePassBtn = document.querySelector('.js-change-password');
const modal = document.querySelector('.js-modal-change-password');
const closeBtn = document.querySelector('.js-close-modal-change-password');

changePassBtn.addEventListener('click', () => modal.classList.add('open'));
closeBtn.addEventListener('click', () => modal.classList.remove('open'));