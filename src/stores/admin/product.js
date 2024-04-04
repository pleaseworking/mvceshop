import { defineStore } from "pinia";

import { db } from '@/firebase'

import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  setDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  limitToLast,
  startAfter,
  endBefore,
  getCountFromServer
} from 'firebase/firestore'

export const useAdminProductStore = defineStore("admin-product", {
  state: () => ({
    list: [],
    docList: [],
    total: 1,
    filter: {
      search: '',
      status: '',
      sort: {
        updatedAt: 'desc',
      }
    }
  }),
  getters: {
    list (state) {
      return state.docList.map(doc => {
      const convertedProduct = doc.data()
      convertedProduct.productId = doc.id
      convertedProduct.updatedAt = convertedProduct.updatedAt.toDate()
      return convertedProduct
    })
    },
    totalPage (state) {
      return Math.ceil(state.total / 2)
    }
  },
  actions: {
    async loadProducts () {
      let productCol = query(
        collection(db, 'products'),
        orderBy('updatedAt', this.filter.sort.updatedAt) // desc
      )
      if (this.filter.search) {
        productCol = query(productCol, where('name', '==', this.filter.search))
      }

      if (this.filter.status) {
        productCol = query(productCol, where('status', '==', this.filter.status))
      }

      const rawProductCol = productCol

      productCol = query(
        productCol, 
        limit(2)
      )

      const productSnapshot = await getDocs(productCol)
      this.docList = productSnapshot.docs

      const allSnapshot = await getCountFromServer(rawProductCol)
      this.total = allSnapshot.data().count
    },
    async loadNextProduct (mode) {
      let productCol = query(
        collection(db, 'products'),
        orderBy('updatedAt', this.filter.sort.updatedAt) // desc
      )

      if (mode === 'next') {
        const lastDocument = this.docList[this.docList.length - 1]
        // หน้าต่อไป
        productCol = query(
          productCol,
          startAfter(lastDocument),
          limit(2)
        )
      } else {
        // หน้าที่แล้ว
        const firstDocument = this.docList[0]
        productCol = query(
          productCol,
          endBefore(firstDocument),
          limitToLast(2)
        )
      }
      const productSnapshot = await getDocs(productCol)
      this.docList = productSnapshot.docs
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
