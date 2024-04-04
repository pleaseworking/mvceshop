const { initializeApp } = require('firebase-admin/app')
const { getFirestore } = require('firebase-admin/firestore')
const { getDatabase } = require('firebase-admin/database')
const { getAuth } = require('firebase-admin/auth')


initializeApp({
    projectId: 'mvc-eshop-test',
    databaseURL: 'http://127.0.0.1:9001/?ns=mvc-eshop-test-default-rtdb'
})

const db = getFirestore()
const auth = getAuth()
const realtimeDB = getDatabase()

module.exports = {
    db,
    auth,
    realtimeDB
  }