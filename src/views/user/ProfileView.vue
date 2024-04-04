<script setup>
//library
import { ref,onMounted } from 'vue'
import { storage } from '@/firebase'
import { ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage'
// component
import UserLayout from '@/layouts/UserLayout.vue'

// store
import { useAccountStore } from '@/stores/account'

const accountStore = useAccountStore()

//variable
const profileImageUrl = ref()
const email = ref('')
const fullname = ref('')



onMounted(() => {
  const profileData = accountStore.profile
  profileImageUrl.value = (profileData.imageUrl || 'https://daisyui.com/images/stock/photo-1534528741775-53994a69daeb.jpg')
  fullname.value = profileData.fullname
  email.value = profileData.email
})

// function
const handleFileUpload = async (event) => {
  const file = event.target.files[0]

  if (file) {
    const uploadRef = storageRef(
      storage,
      `users/${accountStore.user.uid}/${file.name}`
    )
    
    const snapshot = await uploadBytes(uploadRef, file)
    const downloadUrl = await getDownloadURL(snapshot.ref)
    profileImageUrl.value = downloadUrl
      // profileImageUrl.value = e.target.result
    }
}

const updateProfile = async () => {
  try {
    const profileData = {
      imageUrl: profileImageUrl.value,
      fullname: fullname.value,
      email: email.value
    }
      await accountStore.updateProfile(profileData)
  } catch (error) {
      console.log('error', error)
  }
}
</script>

<template>
    <UserLayout>
      <div class="max-w-2xl mx-auto border border-base-200 shadow-xl p-8 my-4">
        <div class="font-bold text-2xl">Your Profile</div>

        <div class="flex flex-col items-center">
          <div class="flex flex-col items-center">
          <div class="avatar">
            <div class="w-24 rounded-full">
              <img :src="profileImageUrl">
            </div>
          </div>
          <input type="file" @change="handleFileUpload">
          </div>
          <div class="form-control w-full">
          <label class="label">
            <span class="label-text">Email</span>
          </label>
          <input type="text" placeholder="Type here" class="input input-bordered w-full" :value="email" disabled/>
        </div>
          <div class="form-control w-full">
          <label class="label">
            <span class="label-text">Name</span>
          </label>
          <input v-model="fullname" type="text" placeholder="Type here" class="input input-bordered w-full" />
        </div>
        <button @click="updateProfile" class="btn btn-neutral w-full mt-4">Update profile</button>
        </div>
      </div>
    </UserLayout>
</template>