import { defineStore } from "pinia";

import { db } from '@/firebase'

import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  setDoc,
  deleteDoc
} from 'firebase/firestore'

export const useAdminProductStore = defineStore("admin-product", {
  state: () => ({
    list: [],
    loaded: false
  }),
  actions: {
    async loadProducts () {
      const productCol = collection(db, 'products')
      const productSnapshot = await getDocs(productCol)
      const products = productSnapshot.docs.map(doc => {
        const convertedProduct = doc.data()
        convertedProduct.productId = doc.id
        convertedProduct.updatedAt = convertedProduct.updatedAt.toDate()
        return convertedProduct
      })
        this.list = products
    },
    async getProduct (productId) {
      try {
        const productRef = doc(db, 'products', productId)
        const productSnapshot = await getDoc(productRef)
        return productSnapshot.data()
      } catch (error) {
        console.log('error', error)
      }
    },
    async addProduct (productData) {
      try {
        productData.remainQuantity = productData.quantity
        productData.updatedAt = new Date()
        const productCol = collection(db, 'products')
        await addDoc(productCol, productData)
      } catch (error) {
        console.log('error', error)
      }
    },
    async updateProduct (productId, productData) {
      try {
        const updateProduct = {}
        updateProduct.name = productData.name
        updateProduct.imageUrl = productData.imageUrl
        updateProduct.price = productData.price
        updateProduct.quantity = productData.quantity
        updateProduct.remainQuantity = productData.quantity
        updateProduct.status = productData.status
        updateProduct.updatedAt = new Date()

        const productRef = doc(db, 'products', productId)
        await setDoc(productRef, updateProduct)
      } catch (error) {
        console.log('error', error)
      }
    },
    async removeProduct (productId) {
        try {
          const productRef = doc(db, 'products', productId)
          await deleteDoc(productRef)
        } catch (error) {
          console.log('error', error)
        }
    }
  }
})
