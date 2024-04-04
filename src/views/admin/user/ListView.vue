<script setup>
//library
import { RouterLink } from "vue-router"

//component
import AdminLayout from "@/layouts/AdminLayout.vue"
import Edit from "@/components/icons/Edit.vue"
import Trash from "@/components/icons/Trash.vue"
import Table from "@/components/Table.vue"

//store
import { useAdminUserStore } from "@/stores/admin/user"

//config variable
const adminUserStore = useAdminUserStore()

//function
const changeStatus = (index) => {
  let selectedUser = adminUserStore.list[index]
  selectedUser.status =
    selectedUser.status === "active" ? "inactive" : "active"
  adminUserStore.updateUser(selectedUser)
};
</script>

<template>
  <AdminLayout>
    <!-- User List View -->
    <div class="flex items-center justify-between my-4">
      <div class="text-3xl font-bold">User</div>
    </div>
    <Table :headers="['Name', 'Role', 'Status', 'Updated At', '']">
      <tr v-for="(user, index) in adminUserStore.list">
        <td>{{ user.fullname }}</td>
        <td>{{ user.role }}</td>
        <td>{{ user.status }}</td>
        <td>{{ user.updatedAt }}</td>
        <td>
          <div class="flex gap-2">
            <RouterLink
              :to="{ name: 'admin-users-update', params: { id: index } }"
              class="btn">Edit
              </RouterLink>
            <button class="btn" @click="changeStatus(index)">
              {{ user.status === "active" ? "Disable" : "Enable" }}
            </button>
          </div>
        </td>
      </tr>
    </Table>
  </AdminLayout>
</template>
