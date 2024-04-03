<script setup>
//library
import { ref, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'

// component
import UserLayout from '@/layouts/UserLayout.vue'
import Product from '@/components/Product.vue'

// store
import { useProductStore } from '@/stores/user/product'
import { useCartStore } from '@/stores/user/cart'

// config variable
const route = useRoute()
const router = useRouter()
const productStore = useProductStore()
const cartStore = useCartStore()

// variable
const searchText = ref('')

// function
const addToCart = (product) => {
  // console.log('Hello add to cart')
  // console.log(product)
  cartStore.addToCart(product)
  router.push({ name: 'cart' })
}

const filterProducts = computed(() => {
  return productStore.filterProducts(searchText.value)
})

watch(() => route.query.q, (newSearchText) => {
  searchText.value = newSearchText
})

</script>

<template>
    <UserLayout>
      <div class="text-3xl m-4">Search: <b>{{ searchText }}</b></div>
      <Product
        :products="filterProducts"
        :addToCart="addToCart"
      ></Product>
    </UserLayout>
</template>