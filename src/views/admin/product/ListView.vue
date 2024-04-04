<script setup>
//library
import { RouterLink } from "vue-router"

// component
import AdminLayout from "@/layouts/AdminLayout.vue"
import Edit from "@/components/icons/Edit.vue"
import Trash from "@/components/icons/Trash.vue"
import Table from "@/components/Table.vue"

// store
import { useAdminProductStore } from '@/stores/admin/product'
import { onMounted } from "vue"

// config variable
const adminProductStore = useAdminProductStore()

onMounted(async () => {
  await adminProductStore.loadProducts()
})

//function
const removeProduct = async (index) => {
  try {
    await adminProductStore.removeProduct(index)
    await adminProductStore.loadProducts()
  } catch (error) {
    console.log('error', error)
  }
}
</script>

<template>
  <AdminLayout>
    <!-- Product List View -->
    <div class="flex items-center justify-between my-4">
      <div class="text-3xl font-bold">Product</div>
      <div>
      <RouterLink :to="{ name: 'admin-products-create'}" class="btn btn-neutral">Add New</RouterLink>
    </div>
    </div>
    <Table
      :headers="['Name', 'image', 'price', 'quantity', 'status', 'updatedAt', '']"
    >
          <tr v-for="(product, index) in adminProductStore.list">
            <th>{{ product.name }}</th>
            <td>
              <img :src="product.imageUrl" class="w-12" />
            </td>
            <td>{{ product.price }}</td>
            <td>{{ product.remainQuantity }} / {{ product.quantity }}</td>
            <td>
              <div class="badge" 
              :class="product.status === 'open' ? 'badge-success' : 'badge-error'">
                {{ product.status }}
              </div>
            </td>
            <td>{{ product.updatedAt }}</td>
            <td>
              <div class="flex gap-2">
                <RouterLink 
                :to="{ name: 'admin-products-update', params: {id: product.productId} }" 
                class="btn btn-ghost">
                  <Edit></Edit>
                </RouterLink>
                <div @click="removeProduct(product.productId)" class="btn btn-ghost">
                  <Trash></Trash>
                </div>
              </div>
            </td>
          </tr>
        </Table>
  </AdminLayout>
</template>
