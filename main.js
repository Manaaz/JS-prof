/////////////////////////Basket////////////////////////////////////

const modal = document.querySelector('#modal');
const screen = document.querySelector('.screen');
const sections = document.querySelectorAll('.section');
const prev = document.querySelector('#prev');
const next = document.querySelector('#next');
const span = document.getElementsByClassName("close")[0];
const Mail = document.querySelector('#email');
const Phone = document.querySelector('#phone');
const formError = document.querySelector('#formError');

const $catalog = document.querySelector('.catalog');
const API_URL = 'https://raw.githubusercontent.com/GeekBrainsTutorial/online-store-api/master/responses';

var currentSection = 0;

function imageOnClickModal(id) {
    let modal = document.getElementsByClassName('modalImg');

    let img = document.getElementById(id);
    let modalImg = document.getElementById("img01");

    modal[0].style.display = "block";
    modalImg.src = img.src;
}

span.onclick = function() {
    let modal = document.getElementsByClassName('modalImg')[0];
    modal.style.display = "none";
}

screen.addEventListener('click', function(e) {
    modal.style.display = 'none';
})

document.addEventListener('keydown', function(e) {
    if (e.key == 'Escape') {
        modal.style.display = 'none';
    }
})

next.addEventListener('click', function() {
    if (currentSection + 1 < sections.length) {
        showSection(currentSection + 1);
    }
})

prev.addEventListener('click', function() {
    if (currentSection - 1 >= 0) {
        showSection(currentSection - 1);
    }
})

function openBasket() {
    //modal.style.display = 'block';
    //updateBasket();
    basket_.openBasket();
}

function deleteItemFromBasket(id) {
    basket_.deleteItemFromBasket(id);
}

function showSection(id) {
    basket_.showSection(id);
}

function updateBasketItems(id) {
    basket_.updateBasketItems(id);
}

function validateForm() {
    let errEmail = validateEmail();
    let errPhone = validatePhone();
    if (errEmail != "" || errPhone != "") {
        formError.insertAdjacentHTML('beforeend', "<p>" + errPhone + "<br>" + errEmail + "</p>");
    } else {
        formError.insertAdjacentHTML('beforeend', "");
    }
}

function validateEmail() {
    let reg = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
    let value = Mail.value;
    if (reg.test(value) == false) {
        Mail.classList.add("error");
        return "Не корректный e-mail";
    } else {
        Mail.classList.remove("error");
        return "";
    }
}

function validatePhone() {
    let reg = /^\d[\d\(\)\ -]{4,14}\d$/;
    let valid = reg.test(phone);
    let value = Phone.value;
    if (reg.test(value) == false) {
        Phone.classList.add("error");
        return "Номер телефона введен неправильно!";
    } else {
        Phone.classList.remove("error");
        return "";
    }
}

class Api {
    constructor() {
        this.url = '/goods.json';
    }
    fetch(error, success) {

        let xhr;

        if (window.XMLHttpRequest) {
            xhr = new XMLHttpRequest();
        } else if (window.ActiveXObject) {
            xhr = new ActiveXObject("Microsoft.XMLHTTP");
        }

        xhr.onreadystatechange = function() {
            if (xhr.readyState === 4) {
                if (xhr.status === 200) {
                    success(JSON.parse(xhr.responseText));
                } else if (xhr.status > 400) {
                    error();
                }
            }
        }

        xhr.open('GET', this.url, true);
        xhr.send();
    }

    fetchPromise() {
        return new Promise((resolve, reject) => {
            this.fetch(reject, resolve)
        })
    }
}

class GoodsItem {
    constructor(id, title, price) {
        this.id = id;
        this.title = title;
        this.price = price;
    }
    getHtml() {
        return `  
        <div class="card col-sm-2">
            <div class="card-img">
              <img src="img/catalogItem-${this.id}.jpg" alt="${this.title}" class="rounded mx-auto d-block">
            </div>
            <div class="card-body">
                <h5 class="card-title">${this.title}</h5>
                <p class="card-text text-price">${this.price}</p>
                <a class="btn btn-primary" id="catalogItem-${this.id}">Купить</a>
            </div>
        </div>
        `;
    }
}

class GoodsList {
    constructor() {
        this.api = new Api();
        this.$goodsList = $catalog;
        this.goods = [];

        //this.api.fetch(this.onFetchError.bind(this), this.onFetchSuccess.bind(this));

        const fetch = this.api.fetchPromise();

        fetch.then((goods) => {
            this.onFetchSuccess(goods)
        }).catch((err) => {
            this.onFetchError(err)
        });
    }

    searchHandler() {
        if (this.search === '') {
            this.filtredGoods = this.goods;
        }
        const regexp = new RegExp(this.search, 'gi');
        this.filtredGoods = this.goods.filter((good) => regexp.test(good.title));
    }

    onFetchSuccess(goods) {
        this.goods = goods.map(({ id, title, price }) => new GoodsItem(id, title, price));
        this.render();
        this.addBtnEvent();
    }

    onFetchError(error) {
        this.$goodsList.insertAdjacentHTML('beforeend', '<h3>Произошла ошибка</h3><br>' + error);
    }

    render() {
        this.$goodsList.textContent = '';
        this.goods.forEach((good) => {
            this.$goodsList.insertAdjacentHTML('beforeend', good.getHtml());

        })
    }

    addBtnEvent() {
        for (let i = 0; i < this.goods.length; i++) {
            let listElement = this.goods[i];
            let btn_id = document.getElementById('catalogItem-' + listElement.id);
            btn_id.addEventListener("click", function() {
                //addItemOnBasket(
                basket_.addItemOnBasket(
                    ['catalogItem-' + listElement.id,
                        listElement.title,
                        listElement.price,
                        1
                    ]
                )
            });
        }
    }
}

class basketClass {
    constructor() {
        this.goods = [];
        this.totalItems = 0;
        this.summ = 0;
        this.item = undefined;

    }
    addItem() {
        let newItem = this.item;
        let searchItem = this.goods.find(item => item.name == newItem.name);

        if (searchItem == null) {
            this.goods.push(newItem);
        } else {
            searchItem.count = searchItem.count + 1;
            searchItem.summ = searchItem.count * searchItem.price;
        }
    }
    getSumm() {
        let summLocal = 0;
        let totalItemLocal = 0;
        for (let i = 0; i < this.goods.length; i++) { //
            let iItem = this.goods[i];
            let price = 0;
            let count = 0;
            if (iItem.price != undefined && iItem.price != null) {
                price = iItem.price;
            }
            if (iItem.count != undefined) {
                count = iItem.count;
            }
            totalItemLocal = totalItemLocal + count;
            summLocal = summLocal + (count * price); //Цена * количество
        }
        this.totalItems = totalItemLocal;
        this.summ = summLocal;
    }
    addItemOnBasket(data) {
        if (data != undefined) {
            this.getItem(data);
            this.addItem();
            this.getSumm();
            this.render();
        }
    }
    deleteItemFromBasket(id) {
        if (id <= this.goods.length) {
            this.goods.splice(id, 1);
            this.render();
        }
    }
    getItem(data) {
        this.item = {
            id: data[0],
            name: data[1],
            price: data[2],
            count: data[3],
            summ: data[2] * data[3]
        }
    }
    updateBasketItems(id) {
        if (id <= this.goods.length) {
            let thisItemValue = document.getElementById('basket-item-count-' + id);
            this.goods[id]['count'] = Number(thisItemValue.value);
            this.render();
        }
    }
    openBasket() {
        modal.style.display = 'block';
        this.render();
    }
    render() {
        let divBasket = document.getElementById("basket_id");
        divBasket.style.display = "flex";
        divBasket.style.flexDirection = "column";

        let divBasketText = "";
        let html = "";

        if (this.goods.length == 0) {
            divBasketText = "<p>Корзина пуста!</p>";
            divBasket.innerHTML = divBasketText;
        } else {
            divBasketText = "";
            divBasket.innerHTML = divBasketText;

            let totalItems = 0;
            let totalSum = 0;
            //Выводим элементы "корзины"
            for (let i = 0; i < this.goods.length; i++) {

                let itemCount = this.goods[i]['count'];
                this.goods[i]['summ'] = itemCount * this.goods[i]['price'];

                totalItems = totalItems + itemCount;
                totalSum = totalSum + this.goods[i]['summ'];

                //получаем текущий элемент-товар
                let outputItem = this.goods[i];

                html = html +
                    `<div id="item-${i}" class="basket-item">  
                        <div class="basket-item-left">
                            <p><b>Наименование: </b> ${outputItem.name}</p>
                            <p><b>Количество: </b>
                                <input type="number" id="basket-item-count-${i}" class="basket-item-counter" value="${outputItem.count}"  onchange="updateBasketItems(${i})"></input>
                            </p>
                            <p><b>Цена: </b>
                                ${outputItem.price}
                            </p>
                            <p><b>Сумма: </b>
                                <p id="itemSum" class="basket-item-sum">${outputItem.summ}</p>
                            </p>
                            <button data-id="${i}" class="basket-item_btn" onclick="deleteItemFromBasket(${i})">Удалить</button>
                        </div>
                        <div class="basket-item-right">
                            <img src="img/${outputItem.id}.jpg" alt="${outputItem.title}" class="rounded mx-auto d-block">
                        </div>
                    </div>`;
            }

            divBasket.insertAdjacentHTML('beforeend', html);

            this.totalItems = totalItems;
            this.summ = totalSum;

            let basketSummary = document.createElement("basketSummary");
            basketSummary.style.display = "flex";
            basketSummary.style.flexDirection = "column";
            basketSummary.innerHTML = "<hr><p>В корзине: " + this.totalItems + " товаров на сумму: " + this.summ + " рублей</p>";
            divBasket.appendChild(basketSummary);

        }
    }
    showSection(id) {
        sections[currentSection].classList.remove('opened');
        sections[id].classList.add('opened');
        currentSection = id;
    }
}

class basketItem {
    constructor(id, title, count, price) {
        this.id = id;
        this.title = title;
        this.price = price;
        this.count = this.count + count;
    }
}

const goodsList = new GoodsList();
const basket_ = new basketClass();

showSection(0);