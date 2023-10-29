const selectCoins = document.getElementById("coins");

const options = {
  headers: {
    "x-access-token":
      "coinranking0c02862274a6a585d3a8e1f3660f991479c61f2c419e87f2",
  },
};
const apiURL = "https://api.coinranking.com/v2/coins";

const makeApiRequest = async (url, opt) => {
  try {
    const response = await fetch(url, opt);

    if (response.ok) {
      const data = await response.json();
      data.data.coins.forEach((coin, i) => {
        createOption(coin.name, i);
      });
      return data.data.coins;
    } else {
      throw new Error(`Request failed with status ${response.status}`);
    }
  } catch (error) {
    throw new Error(`Request failed: ${error}`);
  }
};

const coins = makeApiRequest(apiURL, options);

selectCoins.addEventListener("change", (event) => {
  const selectedValue = event.target.value;
  coins.then((data) => {
    const selected = data[selectedValue];
    createCard(
      selected.name,
      selected.symbol,
      selected.iconUrl,
      selected.price,
      selected.change,
      selected.color
    );
  });
});

const createCard = (name, symbol, iconUrl, price, change, color) => {
  const coinItems = document.querySelectorAll(".card-item");
  document.querySelector('.coin-card').style.display = 'flex';
  coinItems.forEach((item) => {
    if (item.classList.contains("coin-name")) {
      item.textContent = name;
    } else if (item.classList.contains("coin-symbol")) {
        item.textContent = symbol;
        item.style.color = color
        item.style.borderColor = color
    } else if (item.classList.contains("coin-price")) {
        item.textContent = price;
    } else if (item.classList.contains("coin-img")) {
        item.setAttribute('src', iconUrl)
    } else if (item.classList.contains("coin-change")) {
        item.textContent = change;
        item.style.color = change < 0 ? 'red': 'green'
    } 
  });
};

const createOption = (coinName, coinIndex) => {
  const option = document.createElement("option");
  option.value = coinIndex;
  option.textContent = coinName;
  selectCoins.append(option);
};
