<script setup>
//library
import { useRouter } from 'vue-router'
import { ref } from 'vue'
import { useAccountStore } from '@/stores/account'
import { useEventStore } from '@/stores/event'

const router = useRouter()
const accountStore = useAccountStore()
const eventStore = useEventStore()

const email = ref('')
const password = ref('')

const login = async () => {
  try {
    await accountStore.signInAdmin(email.value, password.value)
    router.push({ name: 'admin-dashboard' })
  } catch (error) {
    eventStore.popupMessage('error', error.message)
  }
}

</script>

<template>
  <!-- Login View -->
  <div class="h-screen flex items-center">
    <div class="flex-1 max-w-2xl shadow-xl mx-auto">
      <div class="flex flex-col items-center">
        <h1 class="text-3xl">Login</h1>
        <div class="form-control w-full">
          <label class="label">
            <span class="label-text">Email</span>
          </label>
          <input v-model="email" type="text" placeholder="Your email" class="input input-bordered w-full"/>
        </div>
        <div class="form-control w-full">
          <label class="label">
            <span class="label-text">Password</span>
          </label>
          <input v-model="password" type="password" placeholder="Your password" class="input input-bordered w-full"/>
        </div>
        <button @click="login" class="btn btn-neutral mt-4 w-full">
            Login
        </button>
      </div>
    </div>
  </div>
</template>
