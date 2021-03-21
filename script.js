const API_URL = '/goods.json';

Vue.component('goods-item', { // Создание нового компонента
    template: `
            <div :data-id="id" class="goods-item">
                <div class="card-img">
                    <img src="img/catalogItem-1.jpg" class="rounded mx-auto d-block">
                </div>
                <h5 class="card-title">{{ title }}</h5>
                <p class="card-text text-price">{{ price }}</p>
            </div>`,
    props: ['title', 'price', 'id'] // задаем параметры компонента
})

Vue.component('cart', { // создание компонента корзины
    template: `<div>
                <button class="cart-button" @click="openCartHandler" type="button">Корзина</button>
                <div v-if="isVisibleCart" v-on:click="removeHandler">
                <slot></slot>
                </div>
            </div>`,
    data() { // данные компонента (Обязательно в виде метода!)
        return {
            isVisibleCart: false
        }
    },
    methods: {
        openCartHandler() {
            this.isVisibleCart = !this.isVisibleCart;
        },

        removeHandler(e) {
            this.$emit('remove', e) // Генерируем пользовательское событие
        }
    }
})

const vue = new Vue({
    el: "#app",
    data: {
        cart: [],
        goods: [],
        filtredGoods: [],
        search: ''
    },
    methods: {
        addToCartHandler(e) {
            const id = e.target.closest('.goods-item').dataset.id;
            const good = this.goods.find((item) => item.id == id);

            this.cart.push(good);
        },

        removeFromCartHandler(e) {
            console.log(e)
            const id = e.target.closest('.goods-item').dataset.id;
            const goodIndex = this.cart.findIndex((item) => item.id == id);

            this.cart.splice(goodIndex - 1, 1);
        },

        searchHandler() {
            if (this.search === '') {
                this.filtredGoods = this.goods;
            }
            const regexp = new RegExp(this.search, 'gi');
            this.filtredGoods = this.goods.filter((good) => regexp.test(good.title));
        },

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
                        error('все пропало');
                    }
                }
            }

            xhr.open('GET', API_URL, true);
            xhr.send();
        },

        fetchPromise() {
            return new Promise((resolve, reject) => {
                this.fetch(reject, resolve)
            })
        }
    },
    mounted() {
        this.fetchPromise()
            .then(data => {
                this.goods = data;
                this.filtredGoods = data;
            })
            .catch(err => {
                console.log(err);
            })
    }
})