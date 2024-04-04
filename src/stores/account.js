import { defineStore } from 'pinia'

import {
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithPopup,
  signOut,
  signInWithEmailAndPassword,
} from 'firebase/auth'

import { auth } from '@/firebase'

const provider = new GoogleAuthProvider()

export const useAccountStore = defineStore('account', {
  state: () => ({
    isLoggedIn: false,
    isAdmin: false,
    user: {},
  }),
  actions: {
    async checkAuth() {
      return new Promise((resolve) => {
        onAuthStateChanged(auth, (user) => {
          if (user) {
            this.user = user
            // Testing
            if (user.email === 'admin@test.com') {
                this.isAdmin = true
            }
            this.isLoggedIn = true
            resolve(true)
          } else {
            resolve(false)
          }
        })
      })
    },
    async signInWithGoogle() {
      try {
        const result = await signInWithPopup(auth, provider)
        this.isLoggedIn = true
        this.user = result.user
        console.log(this.user)
      } catch (error) {
        console.log('error', error)
      }
    },
    async signInAdmin(email, password) {
      try {
        const result = await signInWithEmailAndPassword(
          auth,
          email,
          password
        )
        this.isLoggedIn = true
        this.isAdmin = true
        this.user = result.user
      } catch (error) {
        console.log('error store = ', error.code)
        switch (error.code) {
          case 'auth/invalid-email':
            throw new Error('Email ไม่ถูกต้อง')
          case 'auth/wrong-password':
            throw new Error('Password ไม่ถูกต้อง')
          default:
            throw new Error('มีปัญหาเกี่ยวกับการ Login')
        }
      }
    },
    async logout() {
      this.isLoggedIn = false
      this.isAdmin = false
      await signOut(auth)
    },
  },
})
