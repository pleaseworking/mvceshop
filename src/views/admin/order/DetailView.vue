<script setup>
// library
import { ref, onMounted } from 'vue'
import { useRoute, RouterLink } from 'vue-router'
import { useAdminOrderStore } from '@/stores/admin/order'
// component
import AdminLayout from '@/layouts/AdminLayout.vue'

// config variable
const route = useRoute()
const adminOrderStore = useAdminOrderStore()
const orderIndex = ref(-1)
const orderData = ref({
    products: []
})

onMounted(async () => {
    if (route.params.id) {
        orderIndex.value = route.params.id
        const selectedOrder = await adminOrderStore.getOrder(orderIndex.value)
        orderData.value = selectedOrder
    }
})
</script>

<template>
    <AdminLayout>
    <!-- Order Detail View -->
    <div class="shadow-xl p-8 mt-4">
      <div class="text-3xl font-bold">Order detail id: {{ orderIndex }}</div>
      <div class="divider"></div>  
      <div class="grid grid-cols-2 gap-2">
        <div>
            <div class="font-bold">Order date</div>            
            <div>{{ orderData.createdAt }}</div>
        </div>
        <div>
            <div class="font-bold">Order number</div>            
            <div>{{ orderData.orderId }}</div>
        </div>        
        <div>
            <div class="font-bold">Payment method</div>            
            <div>{{ orderData.paymentMethod }}</div>
        </div>
        <div>
            <div class="font-bold">Address</div>            
            <div>{{ orderData.address }}</div>
        </div>
    </div>  
    <div class="divider"></div>    
    <div>
        <div v-for="product in orderData.products" class="grid grid-cols-4 items-center">
            <div class="mx-auto">
                <img class="p-2 w-20" :src="product.imageUrl">
            </div>
            <div>
                <div class="font-bold">{{ product.name }}</div>
                <div>{{ product.description }}</div>
            </div>
            <div>
                จำนวนชิ้น {{ product.quantity }} ชิ้น
            </div>
            <div>
                {{ product.price }} B
            </div>
        </div>
    </div>
    <div class="divider"></div>    
    <div class="flex justify-between">
        <div class="font-bold">ราคาสินค้าทั้งหมด</div>
        <div>{{ orderData.totalPrice }}</div>
    </div>
    <div class="flex justify-end mt-4">
        <RouterLink :to="{ name: 'admin-orders-list'}" class="btn btn-ghost">Back</RouterLink>
    </div>
    </div>
    </AdminLayout>
</template>