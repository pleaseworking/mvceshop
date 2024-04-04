<script setup>
//library
import { ref, reactive,onMounted } from 'vue'
import { useRoute,useRouter } from 'vue-router'
// component
import AdminLayout from '@/layouts/AdminLayout.vue'

//store
import { useAdminUserStore } from "@/stores/admin/user"
import { useEventStore } from '@/stores/event'

//config variable
const adminUserStore = useAdminUserStore()
const eventStore = useEventStore()
const route = useRoute()
const router = useRouter()
const userIndex = ref(-1)
const userData = reactive({
    fullname: '',
    role: '',
    status: ''
})

// variable
const formData = [
    {
        name: 'Name',
        field: 'fullname',
        type: 'text',
    },
    {
        name: 'Role',
        field: 'role',
        type: 'select',
        dropdownList: ['admin', 'moderator', 'user'],
    },
    {
        name: 'Status',
        field: 'status',
        type: 'select',
        dropdownList: ['active', 'inactive'],
    },
]

// function
const updateUser = () => {
    console.log(userIndex.value, userData)
    adminUserStore.updateUser(userIndex.value, userData)
    eventStore.popupMessage('info', 'Update user successful')
    router.push({ name: 'admin-users-list' })
}


onMounted(() => {
    if (route.params.id) {
        userIndex.value = parseInt(route.params.id)
        const selectedUser = adminUserStore.getUser(userIndex.value)

        userData.fullname = selectedUser.fullname
        userData.role = selectedUser.role
        userData.status = selectedUser.status
    }
})

</script>

<template>
    <AdminLayout>
    <!-- User Update View -->
    <div class="shadow-xl p-8 mt-4">
      <div class="text-1xl font-bold">Update user</div>
      <div class="divider"></div>
      <div class="grid grid-cols-1 gap-2">
        <div v-for="form in formData" class="form-control w-full">
          <label class="label">
            <span class="label-text">{{ form.name }}</span>
          </label>
          <input 
            v-if="form.type === 'text'"
            v-model="userData[form.field]"
            type="text" 
            class="input input-bordered w-full" 
            />
          <select 
            v-if="form.type === 'select'"
            v-model="userData[form.field]"
            type="text" 
            class="input input-bordered w-full" 
            >
            <option v-for="item in form.dropdownList">
                {{ item }}
            </option>
          </select>
        </div>
      </div>      
      <div class="flex justify-end mt-4">
          <button class="btn btn-ghost">Back</button>
          <button class="btn btn-neutral" @click="updateUser()">Update</button>
    </div>         
    </div> 
    </AdminLayout>
</template>