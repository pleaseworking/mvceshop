import { defineStore } from 'pinia'

import { collection, doc, getDoc, getDocs, setDoc } from 'firebase/firestore'

import { db } from '@/firebase'

export const useAdminUserStore = defineStore('admin-user', {
  state: () => ({
    list: []
  }),
  actions: {
    async loadUser() {
      const userCol = collection(db, 'users')
      const userSnapshot = await getDocs(userCol)
      const userList = userSnapshot.docs.map(doc => {
        let convertedUser = doc.data()
        convertedUser.uid = doc.id
        convertedUser.updatedAt = convertedUser.updatedAt.toDate()
        return convertedUser
      })
      this.list = userList
    },
    async getUser(uid) {
      try {
        const userRef = doc(db, 'users', uid)
        const userSnapshot = await getDoc(userRef)
        return userSnapshot.data()
      } catch (error) {
        console.log('error', error)
      }
    },
    async updateUser(uid, userData) {
      try {
        //เราอยากได้ข้อมูลอะไรไป update
        const updatedUser = {
          fullname: userData.fullname,
          status: userData.status,
          role: userData.role,
          updatedAt: new Date()
        }
        const docRef = doc(db, 'users', uid)
        await setDoc(docRef, updatedUser)
      } catch (error) {
        console.log('error', error)
      }
    },
  },
})
