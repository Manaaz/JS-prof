//const API_URL = '/goods.json';

Vue.component('search', {
    template: `<div>
                    <input id="search" v-model="search">
                    <button v-on:click="searchHandler">SEARCH</button>
                </div>`,
    data() {
        return {
            search: '',
        }
    },
    methods: {
        searchHandler() {
            this.$emit('search', this.search);
        }
    }
})

Vue.component('goods-item', { // Создание нового компонента
    template: `
            <div :data-id="id" class="goods-item">
                <!--<div class="card-img">
                    <img src="" class="rounded mx-auto d-block">
                </div>-->
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
        search: '',
        isLoaded: false
    },
    methods: {
        addToCartHandler(e) {
            const id = e.target.closest('.goods-item').dataset.id;
            const good = this.goods.find((item) => item.id == id);

            fetch('/cart', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(good)
            })

            this.cart.push(good);
        },

        removeFromCartHandler(e) {
            //console.log(e)
            const id = e.target.closest('.goods-item').dataset.id;
            const goodIndex = this.cart.findIndex((item) => item.id == id);

            this.cart.splice(goodIndex, 1);
        },

        searchHandler(search) {
            if (search === '') {
                this.filtredGoods = this.goods;
            }
            const regexp = new RegExp(search, 'gi');
            this.filtredGoods = this.goods.filter((good) => regexp.test(good.title))
        },
    },
    mounted() {
        fetch('/data')
            .then(response => response.json())
            .then(data => {
                this.goods = data;
                this.filtredGoods = data;

                this.isLoaded = true;
            })
            .catch(err => {
                console.log(err);
            })

        fetch('/cart')
            .then(response => response.json())
            .then(data => {
                this.cart = data;
            })
            .catch(err => {
                console.log(err);
            })
    }
})