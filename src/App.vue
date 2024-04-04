<script setup>
//library
import { onMounted } from 'vue'
import { RouterView } from 'vue-router'

// store
import { useCartStore } from '@/stores/user/cart'
import { useProductStore } from '@/stores/user/product'
import { useEventStore } from '@/stores/event'

// config variable
const cartStore = useCartStore()
const productStore = useProductStore()
const eventStore = useEventStore()

onMounted(() => {
  cartStore.loadCart()
  productStore.loadProducts()
})

</script>

<template>
  <div v-if="eventStore.alert" class="toast">
  <div class="alert" :class="`alert-${eventStore.data.status}`">
    <span>{{ eventStore.data.message }}</span>
  </div>
</div>
  <RouterView />
</template>
