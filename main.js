/////////////////////////Basket////////////////////////////////////

const modal = document.querySelector('#modal');
const screen = document.querySelector('.screen');
const sections = document.querySelectorAll('.section');
const next = document.querySelector('#next');
const span = document.getElementsByClassName("close")[0];

let currentSection = 0;

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

var basket = {
    items: [],
    totalItems: 0,
    summ: 0,
    addItem: function (newItem) {

        let searchItem = this.items.find(item => item.name == newItem.name);

        if (searchItem == null) {
            this.items.push(newItem);
        } else {
            searchItem.count = searchItem.count + 1;
            searchItem.summ = searchItem.count*searchItem.price;
        }
    },
    getSumm: function(){
        let summLocal = 0;
        let totalItemLocal = 0;
        for (let i = 0; i < this.items.length; i++){ //
            price = this.items[i].price;
            count = this.items[i].count;  
            totalItemLocal = totalItemLocal + count;
            summLocal = summLocal + (count*price); //Цена * количество
        }
        this.totalItems = totalItemLocal;
        this.summ = summLocal;
    }
}

//структура элемента "Товар"        
function getItem(data){
    var item = {
        id:     data[0],
        name:   data[1],
        price:  data[2],
        count:  data[3],            
        summ:   data[2]*data[3]
    }
    return item;
}

function addItemOnBasket(data) {
    if (data != undefined) {
        item = getItem(data);
        basket.addItem(item);
        basket.getSumm();
        updateBasket();
    }
}

function updateBasketItems(id) {
    if (id<=basket.items.length) {
        let thisItemValue = document.getElementById('basket-item-count-'+id);
        basket.items[id]['count'] = Number(thisItemValue.value);
        updateBasket();
    }
}

function deleteItemFromBasket(id) {
   if (id<=basket.items.length) {
        basket.items.splice(id, 1);
        updateBasket();
    } 
}

function updateBasket(){

    let divBasket = document.getElementById("basket_id");
    divBasket.style.display = "flex";
    divBasket.style.flexDirection = "column";

    let divBasketText = "";
    let html = "";

    if (basket.items.length == 0 ){
        divBasketText = "<p>Корзина пуста!</p>";
        divBasket.innerHTML = divBasketText;
    } else {
        divBasketText = "";
        divBasket.innerHTML = divBasketText;
        
        totalItems = 0;
        totalSum = 0;
        //Выводим элементы "корзины"
        for (let i = 0; i < basket.items.length; i++){

            let itemCount = basket.items[i]['count'];       
            basket.items[i]['summ'] = itemCount * basket.items[i]['price'];
            
            totalItems = totalItems + itemCount;
            totalSum = totalSum + basket.items[i]['summ'];
            
            //получаем текущий элемент-товар
            let outputItem = basket.items[i];
    
            html = html + `<div id="item-${i}" class="basket-item">  
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
        
        basket.totalItems = totalItems;
        basket.summ = totalSum;
        
        let basketSummary = document.createElement("basketSummary");
        basketSummary.style.display = "flex";
        basketSummary.style.flexDirection = "column";
        basketSummary.innerHTML = "<hr><p>В корзине: "+basket.totalItems+" товаров на сумму: "+basket.summ+" рублей</p>";
        divBasket.appendChild(basketSummary);
  
    }

}

function openBasket() {
    modal.style.display = 'block';
    updateBasket();
}

screen.addEventListener('click', function(e) {
    modal.style.display = 'none';
})

document.addEventListener('keydown', function(e){
    if(e.key == 'Escape') {
        modal.style.display = 'none';
    }
})

function showSection(id) {
    sections[currentSection].classList.remove('opened');
    sections[id].classList.add('opened');
    currentSection = id;
}

next.addEventListener('click', function(){
    if (currentSection + 1 < sections.length) {
        showSection(currentSection + 1);
    } 
})

prev.addEventListener('click', function(){
    if (currentSection - 1 >= 0) {
        showSection(currentSection - 1);
    } 
})

showSection(0);




////////////////////////////Catalog///////////////////////////

const $catalog = document.querySelector('.catalog');

class ApiMock {
    constructor() {

    }
    fetch() {
      return [
            { id: '1', title: 'Shirt',  price: 150 },
            { id: '2', title: 'Socks',  price: 50 },
            { id: '3', title: 'Jacket', price: 350 },
            { id: '4', title: 'Shoes',  price: 250 },
        ];
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
      this.api = new ApiMock();
      this.$goodsList = $catalog;
      this.goods = [];
    }

    fetchGoods() {
      this.goods = this.api.fetch().map(({id, title, price}) => new GoodsItem(id, title, price));
    }

    render() {
      this.$goodsList.textContent = '';
      this.goods.forEach((good) => {
          this.$goodsList.insertAdjacentHTML('beforeend', good.getHtml());
          
      })
    }
    
    addBtnEvent() {
        for (let i = 0; i< this.goods.length; i++){
            let listElement = this.goods[i];
            let btn_id = document.getElementById('catalogItem-'+listElement.id);
            btn_id.addEventListener("click", function(){
                                addItemOnBasket(
                                    ['catalogItem-'+listElement.id, 
                                     listElement.title, 
                                     listElement.price, 
                                     1]
                                    )
                                }
                               ); 
        }
    }
}

class basketClass {
    constructor(){
        this.goods = [];
    }
    addItem() {
        
    }
    delItem() {
        
    }
    getSumm() {
        
    }
    render() {
      
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

goodsList.fetchGoods();
goodsList.render();
goodsList.addBtnEvent();