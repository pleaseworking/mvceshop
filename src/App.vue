<script setup>
//library
import { onMounted } from 'vue'
import { RouterView } from 'vue-router'

// store
import { useCartStore } from '@/stores/user/cart'

// config variable
const cartStore = useCartStore()

onMounted(() => {
  cartStore.loadCart()
})

</script>

<template>
  <RouterView />
</template>
