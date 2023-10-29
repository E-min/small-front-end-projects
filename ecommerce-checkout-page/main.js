const productsContainer = document.querySelector(".products");
const defaultProductCard = document.getElementById("default-product");
const productsTotal = document.getElementById("products-price");
const totalPrice = document.getElementById("total");
const taxPrice = document.getElementById("tax");
const shippingPrice = document.getElementById("shipping");
const changeProducts = document.getElementById("change-products");
const shipping = 25;
const tax = 0.18;

const createProductCard = ({
  name,
  id,
  quantity,
  discountedPrice,
  discountPercent,
}) => {
  // Clone the default card template
  const newCard = defaultProductCard.cloneNode(true);
  // Modify the necessary elements and attributes of the new card
  const price = discountedPrice / (1 - discountPercent);
  newCard.id = id;
  newCard.querySelector(".product-name").textContent = name;
  newCard.querySelector(".discounted").textContent = discountedPrice;
  newCard.querySelector(".price").textContent = parseInt(price);
  newCard.querySelector(".quantity").textContent = quantity;
  newCard.querySelector(".product-total").textContent = (
    quantity * discountedPrice
  ).toFixed(2);
  // Append the new card to the desired parent element
  productsContainer.appendChild(newCard);
};

const updateProductsSummary = (products) => {
  let cartTotalPrice = 0;
  products.forEach((item, i) => {
    cartTotalPrice += item.quantity * item.discountedPrice;
  });
  if (!cartTotalPrice) {
    shippingPrice.innerText = "0.00";
    totalPrice.innerText = "0.00";
  } else {
    shippingPrice.innerText = shipping.toFixed(2);
    totalPrice.innerText = (
      cartTotalPrice +
      shipping +
      cartTotalPrice * tax
    ).toFixed(2);
  }
  productsTotal.innerText = cartTotalPrice.toFixed(2);
  taxPrice.innerText = (cartTotalPrice * tax).toFixed(2);
};

let productNo = 1;
changeProducts.addEventListener("click", (e) => {
  const getProducts = JSON.parse(localStorage.getItem("products")) || [];
  if (e.target.id === "add-new") {
    const newProduct = {
      name: `Product No.${productNo}`,
      id: Date.now(),
      quantity: 1,
      discountedPrice: 50 * productNo,
      discountPercent: 0.12,
    };
    productNo++;
    getProducts.push(newProduct);
    createProductCard(newProduct);
  } else if (e.target.id === "delete") {
    const productElements = document.querySelectorAll(".product");
    productElements.forEach((element) => {
      if (element.id !== "default-product") {
        element.remove();
      }
    });
    getProducts.splice(0, getProducts.length);
  }
  updateProductsSummary(getProducts);
  localStorage.setItem("products", JSON.stringify(getProducts));
});

window.addEventListener("load", () => {
  const getProducts = JSON.parse(localStorage.getItem("products")) || [];
  updateProductsSummary(getProducts);
  getProducts.forEach((item) => {
    createProductCard(item);
  });
});

const updateProducts = (parentElement, functions) => {
  const getProducts = JSON.parse(localStorage.getItem("products")) || [];
  let currentElementIndex;
  getProducts.forEach((item, i) => {
    if (item.id == parentElement.id) {
      if (functions === "trash") {
        return;
      } else if (functions === "plus") {
        item.quantity++;
      } else if (functions === "minus" && item.quantity > 1) {
        item.quantity--;
      }
      parentElement.querySelector(".product-total").textContent = (
        item.quantity * item.discountedPrice
      ).toFixed(2);
      currentElementIndex = i;
    }
  });
  if (functions === "trash") {
    getProducts.splice(currentElementIndex, 1);
  }
  updateProductsSummary(getProducts);
  localStorage.setItem("products", JSON.stringify(getProducts));
};

productsContainer.addEventListener("click", (e) => {
  const parentElement = e.target.closest(".product");
  if (e.target.classList.contains("fa-minus")) {
    const itemQuantity = e.target.nextElementSibling;
    if (itemQuantity.innerText > 1) {
      itemQuantity.innerText--;
    }
    updateProducts(parentElement, "minus");
  } else if (e.target.classList.contains("fa-plus")) {
    const itemQuantity = e.target.previousElementSibling;
    itemQuantity.innerText++;
    updateProducts(parentElement, "plus");
  } else if (e.target.classList.contains("fa-trash-can")) {
    parentElement.remove();
    updateProducts(parentElement, "trash");
  }
});
