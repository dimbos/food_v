'use strict';

const cartButton = document.querySelector("#cart-button");
const modal = document.querySelector(".modal");
const close = document.querySelector(".close");


//---

const buttonAuth = document.querySelector('.button-auth');
const modalAuth = document.querySelector('.modal-auth');
const closeAuth = document.querySelector('.close-auth');

const logInForm = document.querySelector('#logInForm');
const logInput = document.querySelector('#login');
const userName = document.querySelector('.user-name');
const buttonOut = document.querySelector('.button-out');



const cardsRestaurants = document.querySelector('.cards-restaurants');
const containerPromo = document.querySelector('.container-promo');
const restaurants = document.querySelector('.restaurants');
const menu = document.querySelector('.menu');
const logo = document.querySelector('.logo');
const cardsMenu = document.querySelector('.cards-menu');

let login = localStorage.getItem('DeliveryFood');

let restaurantTitle = document.querySelector('.restaurant-title');
let category = document.querySelector('.category');
let priceTitle = document.querySelector('.price-title');
let rating = document.querySelector('.rating');

let inputSearch = document.querySelector('.input-search');

const cart = [];
const modalBody = document.querySelector('.modal-body');
const modalPrice = document.querySelector('.modal-pricetag');
const buttonClearCart = document.querySelector('.clear-cart');


const getData = async function(url){
  const response = await fetch(url);

  if(!response.ok){
    throw new Error(`Ошибка по адресу: ${url}, статус ошибки ${response.status}`);
  }

  return await  response.json();

  console.log(response);
};



function toogleModalAuth(){
  modalAuth.classList.toggle('is-open');
  logInput.style.borderColor = '';
}

function toggleModal() {
  modal.classList.toggle("is-open");
}

function authorized(){

  function logOut(){
    login = '';
    buttonAuth.style.display = '';
    userName.style.display = '';
    buttonOut.style.display = '';
    buttonOut.removeEventListener('click', logOut);
    localStorage.removeItem('DeliveryFood');
    cartButton.style.display = '';
    checkAuth();
  }

  userName.textContent = login;
  buttonAuth.style.display = 'none';
  userName.style.display = 'inline';
  buttonOut.style.display = 'flex';
  cartButton.style.display = 'flex';
  buttonOut.addEventListener('click', logOut);
}

function notAuthorized(){
  function logIn(e){
    e.preventDefault();
    
    login = logInput.value;
    if(login === ''){
      alert('Логин не может быть пустым');
      logInput.style.borderColor = 'red';
    }else{
      localStorage.setItem('DeliveryFood', login);
      toogleModalAuth();
      buttonAuth.removeEventListener('click', toogleModalAuth);
      closeAuth.removeEventListener('click', toogleModalAuth);
      logInForm.removeEventListener('submit', logIn);
      
      logInForm.reset();
      checkAuth();
    }
  };

  buttonAuth.addEventListener('click', toogleModalAuth);
  closeAuth.addEventListener('click', toogleModalAuth);
  logInForm.addEventListener('submit', logIn);
}

function checkAuth(){
  if(login){
    authorized();
  }else{
    notAuthorized();
  }
};

function createCardsRestaurant(restaurant){
  const { name, image, kitchen, price, products, stars, time_of_delivery: timeOfDelivery } = restaurant;
  
  const card = `
        <a class="card card-restaurant" data-products="${products}" data-info="${[name, price, stars, kitchen]}">
        <img src="${image}" alt="${name}"/>
        <div class="card-text">
          <div class="card-heading">
            <h3 class="card-title">${name}</h3>
            <span class="card-tag tag">${timeOfDelivery}</span>
          </div>
          <div class="card-info">
            <div class="rating">
              ${stars}
            </div>
            <div class="price">От ${price} ₽</div>
            <div class="category">${kitchen}</div>
          </div>
        </div>
      </a>
  `;

  cardsRestaurants.insertAdjacentHTML('beforeend', card);
}



function createCardGood(goods){
  const { description, id, image, name, price } = goods;
  const card = document.createElement('div');
  card.className = 'card';
  //card.id = id;  вариант использования id, или на кнопке (стр: 161)

  card.insertAdjacentHTML('beforeend',  `
    <img src="${image}" alt="${name}" class="card-image"/>
    <div class="card-text">
      <div class="card-heading">
        <h3 class="card-title card-title-reg">${name}</h3>
      </div>
      <div class="card-info">
        <div class="ingredients">${description}
        </div>
      </div>
      <div class="card-buttons">
        <button class="button button-primary button-add-cart" id="${id}">
          <span class="button-card-text">В корзину</span>
          <span class="button-cart-svg"></span>
        </button>
        <strong class="card-price-bold card-price">${price} ₽</strong>
      </div>
    </div>
  `);

  cardsMenu.insertAdjacentElement('beforeend', card);
}
 
function openGoods(e){
  const target =  e.target;
  if(login == null || localStorage.getItem('DeliveryFood') == null){
    toogleModalAuth();
  }else{
  //console.log(login);
  
  const restaurant = target.closest('.card-restaurant');

  if(restaurant){

    const info = restaurant.dataset.info.split(',');

    const [name, price, stars, kitchen] = info;
    console.log(name, price);

    cardsMenu.textContent = '';
    containerPromo.classList.add('hide');
    restaurants.classList.add('hide');
    menu.classList.remove('hide');
    restaurantTitle.textContent = name;
    category.textContent = kitchen;
    priceTitle.textContent = price + ' ₽';
    rating.textContent = stars;

    getData(`./db/${restaurant.dataset.products}`).then(function(data){
      data.forEach(createCardGood);
    });
  }
  }

}

function addToCart(e){
  const target = e.target;

  const buttonAddToCart = target.closest('.button-add-cart');

  if(buttonAddToCart){
    //получим карту товара
    const  card = target.closest('.card');
    const title = card.querySelector('.card-title-reg').textContent;
    const cost = card.querySelector('.card-price').textContent;
    const id = buttonAddToCart.id;

    const food = cart.find(function(item){
      return item.id === id
    })

    if(food){
      food.count += 1;
    } else{
      cart.push({
        id,
        title,
        cost,
        count: 1
      })
    }



    console.log(cart);

  }
}

function renderCart(){
  modalBody.textContent = '';
  cart.forEach(function(item){
    const itemCart = `
        <div class="food-row">
        <span class="food-name">${item.title}</span>
        <strong class="food-price">${item.cost}</strong>
        <div class="food-counter">
          <button class="counter-button counter-minus" data-id="${item.id}">-</button>
          <span class="counter">${item.count}</span>
          <button class="counter-button counter-plus" data-id="${item.id}">+</button>
        </div>
      </div>
    `;
    modalBody.insertAdjacentHTML('afterbegin', itemCart);
  });

  const totalPrice = cart.reduce(function(result, item){
    return result + (parseFloat(item.cost)) * item.count;
  }, 0);
  modalPrice.textContent = totalPrice + ' ₽';
  
}

function changeCount(e){
  const target = e.target;

  if(target.classList.contains('counter-button')){
    const food = cart.find(function(item){
      return item.id === target.dataset.id;
    });
  
  if(target.classList.contains('counter-minus')){
    food.count--;
    if(food.count === 0){
      cart.splice(cart.indexOf(food), 1);
    }
  }

  if(target.classList.contains('counter-plus')){
    food.count++;
  }

  renderCart();
  }

}

function init(){
  getData('./db/partners.json').then(function(data){
    data.forEach(createCardsRestaurant)
  });
  
  cartButton.addEventListener("click", function(){
    renderCart();
    toggleModal();
  });
  close.addEventListener('click', toggleModal);

  buttonClearCart.addEventListener('click', function(){
    cart.length = 0;
    renderCart();
  })

  modalBody.addEventListener('click', changeCount);
  
  cardsRestaurants.addEventListener('click', openGoods);

  cardsMenu.addEventListener('click', addToCart);
  
  logo.addEventListener('click', function(){
    containerPromo.classList.remove('hide');
    restaurants.classList.remove('hide');
    menu.classList.add('hide');
  });

	inputSearch.addEventListener('keydown', function(event) {

		if (event.keyCode === 13) {
			const target = event.target;
			
			const value = target.value.toLowerCase().trim();

			target.value = '';

			if (!value || value.length < 3) {
				target.style.backgroundColor = 'tomato';
				setTimeout(function(){
					target.style.backgroundColor = '';
				}, 2000);
				return;
			}

			const goods = [];
			
			getData('./db/partners.json')
				.then(function(data) {
					
					const products = data.map(function(item){
						return item.products;
					});


					products.forEach(function(product){
						getData(`./db/${product}`)
							.then(function(data){
								
								goods.push(...data);

								const searchGoods = goods.filter(function(item) {
									return item.name.toLowerCase().includes(value)
								})

								console.log(searchGoods);
								
								cardsMenu.textContent = '';

								containerPromo.classList.add('hide');
								restaurants.classList.add('hide');
								menu.classList.remove('hide');

								restaurantTitle.textContent = 'Результат поиска';
								rating.textContent = '';
								priceTitle.textContent = '';
								category.textContent = '';

								return searchGoods;
							})
							.then(function(data){
								data.forEach(createCardGood);
							})
					})
					
					
				});

			
				
		}
		
	});
  checkAuth();
}

init();

