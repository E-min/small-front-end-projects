const products = [];

//constructor function for new products
function Product(name, imgSrc, price, amount, discount, id) {
  this.name = name;
  this.imgSrc = imgSrc;
  this.price = price;
  this._amount = amount;
  this.total = this._amount * this.price;
  this.discount = discount;
  this.id = id;
 
  //function for dynamically calculating 'total' based on 'amount'
  Object.defineProperty(this, "amount", {
    get: function () {
      return this._amount;
    },
    set: function (value) {
      this._amount = value;
      this.total = (this._amount * this.price).toFixed(2);
    },
  });
}

// adding new product using their informations
products.push(new Product("Antique Clock", "./img/photo3.jpg", 74.99, 0.00, 12, 111111111));
products.push(new Product("Levi Shoes", "./img/photo2.png", 45.99, 0, 18, 111111112));
products.push(new Product("Vintage Bag", "./img/photo1.png", 34.99, 0, 18, 111111113));

const cartContainer = document.querySelector('.cart');

window.addEventListener('load', () => {
  products.forEach(product => createProducts(product));
});

cartContainer.addEventListener('click', (e) => {
  //get subtotal, tax , shipping and total by using DOM for dynamically change their innerText's
  let subtotal = document.getElementById('subtotal');
  let tax = document.getElementById('tax');
  let shipping = document.getElementById('shipping');
  let total = document.getElementById('total');
  
  //calculating final costs
  const finalCosts = () => {
   let subtotalValue = 0;
   let amountOfProductsSelected = 0;  
   //calculating subtotal by geting sum of all products total's
   products.forEach((product) => {
     subtotalValue += +product.total;
     amountOfProductsSelected += product.amount;
    });
    subtotal.innerText = `$${subtotalValue.toFixed(2)}`;
    
    //calculating tax multiplying subtotalValue by 0.18
    taxValue = (subtotalValue * 0.18).toFixed(2)
    tax.innerText = `$${taxValue}`;
    
    let shippingValue = amountOfProductsSelected ? 15 : 0;
     shipping.innerText = `$${shippingValue}.00`
    //calculating Total by getting sum of subtotal, tax and shipping costs
    total.innerText = `$${(+taxValue + subtotalValue + shippingValue).toFixed(2)}`
  }

  //if statments for buttons 
  if(e.target.value === 'Remove') {
      e.target.parentNode.parentNode.parentNode.remove()
      products.forEach(product => {
        e.target.closest(`.product`).id == product.id && (product.amount = 0);
      });
      finalCosts()
  } else if (e.target.classList.contains('fa-plus')) {
      let amountValue = +e.target.previousElementSibling.innerText
      amountValue += 1;
      e.target.previousElementSibling.innerText = amountValue;
      updateProductsByAmount(e, amountValue);
      finalCosts()
  } else if (e.target.classList.contains('fa-minus')) {
      let amountValue = Number(e.target.nextElementSibling.innerText);
      if (amountValue > 0) {
         amountValue -= 1;
         updateProductsByAmount(e, amountValue);
      }
      e.target.nextElementSibling.innerText = amountValue;
      finalCosts()
   }

});

const updateProductsByAmount = (e, number) => {
  products.forEach(product => {
    e.target.closest(`.product`).id == product.id && (product.amount = number,
      e.target.parentNode.nextElementSibling.nextElementSibling.innerText = `Total: $${product.total}`
    )
  })
}

const createProducts = (product) => {
  const {name, imgSrc, price, amount, total, discount, id} = product;
  
  const createProduct = document.createElement('div');
  createProduct.setAttribute('class','container product p-3 border rounded-3 my-2');
  createProduct.setAttribute('id', `${id}`);
  
  const createRow = document.createElement('div');
  createRow.classList.add('row');

  const createColImg = document.createElement('div');
  createColImg.setAttribute('class', 'col-sm-7');

  const createImg = document.createElement('img');
  createImg.setAttribute('class', 'img-fluid rounded-4');
  createImg.setAttribute('src', `${imgSrc}`);

  const createColProductInfo = document.createElement('div');
  createColProductInfo.classList.add('col-sm-5');

  const createProductName = document.createElement('p');
  createProductName.setAttribute('class', 'my-1 fs-5');
  createProductName.innerText = `${name}`;

  const createDiscountPrice = document.createElement('span');
  createDiscountPrice.setAttribute('class','fs-5 mx-1');
  createDiscountPrice.innerText = `$${(price - (price *(discount/100))).toFixed(2)}`
  
  const createPrice =  document.createElement('span');
  createPrice.setAttribute('class', 'text-decoration-line-through');
  createPrice.innerText = `$${price}`

  const createIcons = document.createElement('div');
  createIcons.setAttribute('class', 'border d-flex justify-content-around align-items-center py-1 rounded-2 my-2');

  const createIconMinus = document.createElement('i');
  createIconMinus.setAttribute('class','fa-solid fa-minus');
  
  const createAmount = document.createElement('span');
  createAmount.innerText = amount;

  const createIconPlus = document.createElement('i');
  createIconPlus.setAttribute('class', 'fa-solid fa-plus');
  
  const createRemoveButton = document.createElement('input');
  createRemoveButton.setAttribute('type', 'button');
  createRemoveButton.setAttribute('class', 'mt-1');
  createRemoveButton.setAttribute('value', 'Remove');
  
  const createProductTotal = document.createElement('p');
  createProductTotal.classList.add('mt-1');
  createProductTotal.innerText = `Total: $${total}`

  cartContainer.prepend(createProduct);
  createProduct.appendChild(createRow);
  createRow.appendChild(createColImg);
  createColImg.appendChild(createImg);
  createRow.appendChild(createColProductInfo);
  createColProductInfo.appendChild(createProductName);
  createColProductInfo.appendChild(createDiscountPrice);
  createColProductInfo.appendChild(createPrice);
  createColProductInfo.appendChild(createIcons);
  createIcons.appendChild(createIconMinus);
  createIcons.appendChild(createAmount);
  createIcons.appendChild(createIconPlus);
  createColProductInfo.appendChild(createRemoveButton);
  createColProductInfo.appendChild(createProductTotal);
}