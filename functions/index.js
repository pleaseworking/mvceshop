
const { onRequest } = require("firebase-functions/v2/https")
const express = require('express')
const app = express()

const { db, auth } = require('./firebaseConfig.js')

app.post('/placeorder', async (req, res) => {
    console.log(req.body)

    try{
    const checkoutData = req.body.checkout
    let checkoutProducts = []
    let totalPrice = 0
    let orderData = {}
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

        orderData = {
            ...checkoutData,
            chargeId: `charge ${orderId}`, // ประกอบตอนรวมกับ omise
            products: checkoutProducts,
            totalPrice,
            paymentMethod: 'rabbit_linepay',
            createdAt: new Date(),
            status: 'successful'
        }

        t.set(orderRef.doc(orderId), orderData)

        successOrderId = orderId
    })

    res.json({
        message: 'Hello from Firebase',
        redirectUrl: `http://localhost:5173/success?order_id=${successOrderId}`
    })
    } catch (error) {
        // คืนสินค้า
        console.log('error', error)
        res.status(400).json({
            message: error.message
        })
    }

    // ลดจำนวนสินค้า


    // stamp order

  })

exports.api = onRequest(app)
