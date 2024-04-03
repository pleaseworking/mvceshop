import { defineStore } from 'pinia'

export const useCartStore = defineStore('cart', {
    state: () => ({
        items: [],
        checkout: {}
    }),
    getters: {
        summaryQuantity (state) {
            // state.items.reduce((acc, item) => {
            //     return acc + item.quantity
            // }, 0)
            return state.items.reduce((acc, item) => acc + item.quantity, 0)
        },
        summaryPrice (state) {
            return state.items.reduce((acc, item) => {
                return acc + (item.price * item.quantity)
            }, 0)
        }
    },
    actions: {
        loadCart () {
            const previousCart = localStorage.getItem('cart-data')
            if (previousCart) {
                this.items = JSON.parse(previousCart)
            }
        },
        addToCart (productData) {
            const findProductIndex = this.items.findIndex(item => {
                return item.name === productData.name
            })

            if (findProductIndex < 0) {
                productData.quantity = 1
                this.items.push(productData)
            } else {
                const currentItem = this.items[findProductIndex]
                this.updateQuantity(findProductIndex, currentItem.quantity + 1)
            }

            localStorage.setItem('cart-data', JSON.stringify(this.items))
        },
        updateQuantity (index, quantity) {
            this.items[index].quantity = quantity
            localStorage.setItem('cart-data', JSON.stringify(this.items))
        },
        removeItemInCart (index) {
            this.items.splice(index, 1)
            localStorage.setItem('cart-data', JSON.stringify(this.items))
        },
        placeorder (userData) {
            const orderData = {
                ...userData,
                totalPrice: this.summaryPrice,
                paymentMethod: 'Credit Card',
                createdDate: (new Date()).toLocaleString(),
                orderNumber: `AA${Math.floor((Math.random() * 90000) + 10000)}`,
                products: this.items
            }
            localStorage.setItem('order-data', JSON.stringify(orderData))
        },
        loadCheckout () {
            const orderData = localStorage.getItem('order-data')
            if (orderData) {
                this.checkout = JSON.parse(orderData)
            }
        }
    }
})