import { defineStore } from 'pinia'

import axios from 'axios'

import {
    doc,
    getDoc
} from 'firebase/firestore'

import { ref, onValue, set } from 'firebase/database'

import { db, realtimeDB } from '@/firebase'

import { useAccountStore } from '@/stores/account'

export const useCartStore = defineStore('cart', {
    state: () => ({
        items: [],
        checkout: {}
    }),
    getters: {
        summaryQuantity (state) {
            return state.items.reduce((acc, item) => acc + item.quantity, 0)
        },
        summaryPrice (state) {
            return state.items.reduce((acc, item) => {
                return acc + (item.price * item.quantity)
            }, 0)
        },
        user (state) {
            const accountStore = useAccountStore()
            return accountStore.user
        },
        cartRef (state) {
            return ref(realtimeDB, `carts/${this.user.uid}`)
        }
    },
    actions: {
        async loadCart () {
            if (this.user.uid) {
                onValue(this.cartRef, (snapshot) => {
                    const data = snapshot.val()
                    if (data) {
                        this.items = data
                    }
                  }, (err) => {
                    console.log('error', err)
                  })
            } else {
                const previousCart = localStorage.getItem('cart-data')
                if (previousCart) {
                    this.items = JSON.parse(previousCart)
                }
            }
        },
        async addToCart (productData) {
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

            await set(this.cartRef, this.items)
            localStorage.setItem('cart-data', JSON.stringify(this.items))
        },
        async updateQuantity (index, quantity) {
            this.items[index].quantity = quantity
            await set(this.cartRef, this.items)
            localStorage.setItem('cart-data', JSON.stringify(this.items))
        },
        async removeItemInCart (index) {
            this.items.splice(index, 1)
            await set(this.cartRef, this.items)
            localStorage.setItem('cart-data', JSON.stringify(this.items))
        },
        async placeorder (userData) {
        try {   
            const checkoutData = {
                ...userData,
                products: this.items.map(product => ({
                    productId: product.productId,
                    quantity: product.quantity
                }))
            }

            console.log('orderData', checkoutData)

            const response = await axios.post('/api/placeorder', {
                source: 'test_src', // เราจะเพิ่มตอนทำ omise,
                checkout: checkoutData
            })
            return response.data
            
            // localStorage.setItem('order-data', JSON.stringify(orderData))
        } catch (error) {
            console.log('error', error)
        }
        },
        async loadCheckout (orderId) {
            try {
                const orderRef = doc(db, 'orders', orderId)
                const orderSnapshot = await getDoc(orderRef)
                let orderData = orderSnapshot.data()
                orderData.createdAt = orderData.createdAt.toDate()
                orderData.orderNumber = orderSnapshot.id
                return orderData
            } catch (error) {
                console.log('error', error)
            }            
        }
    }
})