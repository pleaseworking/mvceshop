<script setup>
//library
import { ref, onMounted } from "vue"
import { RouterLink } from "vue-router"

// component
import AdminLayout from "@/layouts/AdminLayout.vue"
import Edit from "@/components/icons/Edit.vue"
import Trash from "@/components/icons/Trash.vue"
import Table from "@/components/Table.vue"
import Pagination from '@/components/Pagination.vue'

// store
import { useAdminProductStore } from '@/stores/admin/product'

// config variable
const adminProductStore = useAdminProductStore()
const currentPage = ref(1)

onMounted(async () => {
  await adminProductStore.loadProducts()
})

//function
const changePage = async (newPage) => {
  if (newPage < currentPage.value) {
    // ย้อนกลับ
    await adminProductStore.loadNextProduct('previous')
  } else if (newPage > currentPage.value) {
    // ไปข้างหน้า
    await adminProductStore.loadNextProduct('next')
  }
  currentPage.value = newPage
}


const removeProduct = async (index) => {
  try {
    await adminProductStore.removeProduct(index)
    await adminProductStore.loadProducts()
  } catch (error) {
    console.log('error', error)
  }
}
const searchProduct = async () => {
  await adminProductStore.loadProducts()
}

const changeStatusFilter = async (newStatus) => {
  adminProductStore.filter.status = newStatus
  await adminProductStore.loadProducts()
}

const changeSortUpdateAt = async (newSort) => {
  adminProductStore.filter.sort.updatedAt = newSort
  await adminProductStore.loadProducts()  
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
    <div class="flex gap-2 items-center">
      <div class="flex-1">
        <input v-model="adminProductStore.filter.search" type="text" placeholder="Type here" class="input input-bordered w-full" />
      </div>
      <div class="flex-1">
        <div>Updated At</div>
        <div class="join">
          <button 
          @click="changeSortUpdateAt('asc')" 
          class="btn join-item"
            :class="adminProductStore.filter.sort.updatedAt === 'asc' ? 'btn-active' : ''"
            >ASC</button>
          <button 
          @click="changeSortUpdateAt('desc')" 
          class="btn join-item"
            :class="adminProductStore.filter.sort.updatedAt === 'desc' ? 'btn-active' : ''"          
            >DESC</button>
      </div>
      </div>
      <div class="flex-1">
        <div>Status</div>
        <div class="join">
          <button 
            @click="changeStatusFilter('open')" 
            class="btn join-item"
            :class="adminProductStore.filter.status === 'open' ? 'btn-active' : ''"
            >OPEN</button>
          <button 
          @click="changeStatusFilter('close')" 
          class="btn join-item"
          :class="adminProductStore.filter.status === 'close' ? 'btn-active' : ''"
          >CLOSE</button>
      </div>
      </div>
      <div class="flex-1 items-center">
        <button @click="searchProduct()" class="btn">Search</button>
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
        <Pagination
          :activePage="currentPage"
          :maxPage="adminProductStore.totalPage"
          :changePage="changePage"
        ></Pagination>
  </AdminLayout>
</template>
