<script setup>
//library
import { useRouter } from 'vue-router'

// component
import UserLayout from '@/layouts/UserLayout.vue'
import Product from '@/components/Product.vue'

// store
import { useProductStore } from '@/stores/user/product'
import { useCartStore } from '@/stores/user/cart'

// config variable
const productStore = useProductStore()
const cartStore = useCartStore()
const router = useRouter()

// function
const addToCart = (product) => {
  // console.log('Hello add to cart')
  // console.log(product)
  cartStore.addToCart(product)
  router.push({ name: 'cart' })
}
</script>


<template>
    <UserLayout>
      <!-- Hero -->
      <div class="hero h-96 bg-base-200">
      <div class="hero-content text-center">
        <div class="max-w-md">
          <h1 class="text-5xl font-bold">Welcome to MVCEShop</h1>
          <p class="py-6">Online Shopping System</p>
        </div>
      </div>
      </div>

      <!-- Card -->
      <Product
        :products="productStore.list"
        :addToCart="addToCart"
      ></Product>
    </UserLayout>
</template>