<script setup>
//library
import { onMounted } from 'vue'
import { RouterLink } from 'vue-router'

//component
import AdminLayout from "@/layouts/AdminLayout.vue"
import Table from "@/components/Table.vue"

//store
import { useAdminOrderStore } from '@/stores/admin/order'

//config variable
const adminOrderStore = useAdminOrderStore()

onMounted(async () => {
    await adminOrderStore.loadOrder()
})
</script>

<template>
    <AdminLayout>
    <!-- Order List View -->
    <div class="flex items-center justify-between my-4">
      <div class="text-3xl font-bold">Order</div>
    </div>
    <Table :headers="['Customer Name', 'Price', 'Status', 'Updated At', '']">
        <tr v-for="(order, index) in adminOrderStore.list">
            <td>{{ order.name }}</td>
            <td>{{ order.totalPrice }}</td>
            <td>{{ order.status }}</td>
            <td>{{ order.createdAt }}</td>
            <td>
                <RouterLink 
                :to="{ name: 'admin-orders-detail', params: { id: order.orderId } }" 
                class="btn">
                See detail
                </RouterLink>
            </td>
        </tr>
    </Table>
    </AdminLayout>
</template>