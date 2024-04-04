const { initializeApp } = require('firebase-admin/app')
const { getFirestore } = require('firebase-admin/firestore')
const { getAuth } = require('firebase-admin/auth')


initializeApp({
    projectId: 'mvc-eshop-test',
})

const db = getFirestore()
const auth = getAuth()

module.exports = {
    db,
    auth,
  }