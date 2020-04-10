let cartButton = document.querySelector('#cart-button');
let modal = document.querySelector('.modal');
let close = document.querySelector('.close');

const toggleModel = () => {
    modal.classList.toggle('is-open');
}

cartButton.addEventListener('click', toggleModel);


close.addEventListener('click', toggleModel);
