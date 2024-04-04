
const { onRequest } = require("firebase-functions/v2/https")
const { onDocumentWritten } = require('firebase-functions/v2/firestore')
const express = require('express')
const app = express()

const { db, auth, realtimeDB } = require('./firebaseConfig.js')

const omise = require('omise')({
    secretKey: process.env.OMISE_SECRET_KEY,
    omiseVersion: '2019-05-29'
})

const createCharge = (source, amount, orderId) => {
    return new Promise((resolve, reject) => {
      omise.charges.create({
        amount: (amount * 100),
        currency: 'THB',
        return_uri: `http://localhost:5173/success?order_id=${orderId}`,
        metadata: {
          orderId
        },
        source,
      }, (err, resp) => {
        if (err) {
          return reject(err)
        }
        resolve(resp)
      })
    })
  }



app.post('/placeorder', async (req, res) => {
    console.log(req.body)
    try{
    const checkoutData = req.body.checkout
    const sourceOmise = req.body.source
    let checkoutProducts = []
    let totalPrice = 0
    let orderData = {}
    let omiseResponse = {}
    let successOrderId = ''

    const products = checkoutData.products

    await db.runTransaction(async (t) => {
        for (const product of products) {
            const productRef = db.collection('products').doc(product.productId)
            const productSnapshot = await productRef.get()
            const productData = productSnapshot.data()
    
            let checkoutProduct = product
            checkoutProduct.name = productData.name
            checkoutProduct.imageUrl = productData.imageUrl
            checkoutProduct.price = productData.price
            checkoutProduct.totalPrice = productData.price * product.quantity
            totalPrice += (productData.price * product.quantity)
            checkoutProducts.push(checkoutProduct)

            if (productData.remainQuantity - product.quantity < 0) {
                throw new Error (`Product ${productData.name} out of stock`)
            }
            // ลดจำนวนสินค้าลง
            t.update(productRef, {
                remainQuantity: productData.remainQuantity - product.quantity
            })
        }
        const orderRef = db.collection('orders')

        const orderId = orderRef.doc().id

        omiseResponse = await createCharge(sourceOmise, totalPrice, orderId)

        orderData = {
            ...checkoutData,
            chargeId: omiseResponse.id, // ประกอบตอนรวมกับ omise charge
            products: checkoutProducts,
            totalPrice,
            paymentMethod: 'rabbit_linepay',
            createdAt: new Date(),
            status: 'pending'
        }

        t.set(orderRef.doc(orderId), orderData)

        successOrderId = orderId
    })

    res.json({
        message: 'Hello from Firebase',
        redirectUrl: omiseResponse.authorize_uri
    })
    } catch (error) {
        // คืนสินค้า
        console.log('error', error)
        res.status(400).json({
            message: error.message
        })
    }
    

  })

    // ลดจำนวนสินค้า


    // stamp order

    app.post('/webhook', async (req, res) => {
      try {
        if (req.body.key === 'charge.complete') {
          const webhookData = req.body.data
  
          const orderId = webhookData.metadata.orderId
          const chargeId = webhookData.id
          const statusOrder = webhookData.status
  
          const orderRef = db.collection('orders').doc(orderId)
          const orderSnapshot = await orderRef.get()
          const orderData = orderSnapshot.data()
  
          // Wrong order
          if (orderData.chargeId !== chargeId) {
            throw new Error('charge not found')
          }

          if (orderData.status === 'pending') {
            await orderRef.update({
              status: statusOrder
            })

            if (statusOrder !== 'successful') {
              // คืน stock ออกมา
              db.runTransaction(async (t) => {
                for (const product of orderData.products) {
                  const productRef = db.collection('product').doc(product.productId)
                  const productSnapshot = await productRef.get()
                  const productData = productSnapshot.data()
                  t.update(productRef, {
                    remainQuantity: productData.remainQuantity + product.quantity
                  })
                }
              })
            }
          }
        }
      } catch (error) {
        console.log('error', error)
      }
    })

exports.api = onRequest(app)

exports.updateOrder = onDocumentWritten('orders/{orderId}', async (event) => {
  const oldData = event.data.before.data()
  const newData = event.data.after.data()
  console.log('oldData', oldData)
  console.log('newData', newData)

  const orderStatRef = realtimeDB.ref('stats/order')

  if (
    newData.status === 'successful' &&
    oldData && oldData.status === 'pending'
  ) {
    await orderStatRef.transaction((currentValue) => {
      return currentValue + newData.totalPrice
    })
  }
})