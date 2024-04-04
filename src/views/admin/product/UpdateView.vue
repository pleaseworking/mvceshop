<script setup>
//library
import { onMounted, reactive, ref } from "vue"
import { useRouter, useRoute, RouterLink } from "vue-router"
import { storage } from '@/firebase'
import { ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage'

// component
import AdminLayout from "@/layouts/AdminLayout.vue"

// store
import { useAdminProductStore } from '@/stores/admin/product'

//config variable
const adminProductStore = useAdminProductStore()
const router = useRouter()
const route = useRoute()

const productData = reactive({
  name: "",
  imageUrl: "",
  price: 0,
  quantity: 0,
  about: "",
  status: "",
})

//variable
const formData = [
  {
    name: "Name",
    field: "name",
  },
  {
    name: "Image",
    field: "imageUrl",
    type: 'upload-image'
  },
  {
    name: "Price",
    field: "price",
  },
  {
    name: "Quantity",
    field: "quantity",
  },
  {
    name: "About",
    field: "about",
  },
]

//variable
const productIndex = ref(-1)
const mode = ref('ADD')

//function
const updateProduct = async () => {
    try {
      if (mode.value === 'EDIT') {
        await adminProductStore.updateProduct(productIndex.value, productData)
      } else {
        await adminProductStore.addProduct(productData)
      }
        router.push({ name: 'admin-products-list' })
      } catch (error) {
        console.log('error', error)
    }
}

const handleFileUpload = async (event) => {
  const file = event.target.files[0]

  let mainPath = ''

  if (productIndex.value !== -1) {
    mainPath = productIndex.value + '-'
  }

  if (file) {
    const uploadRef = storageRef(
      storage,
      `products/${mainPath}${file.name}`
    )
    
    const snapshot = await uploadBytes(uploadRef, file)
    const downloadUrl = await getDownloadURL(snapshot.ref)
    productData.imageUrl = downloadUrl
      // profileImageUrl.value = e.target.result
    }
}

onMounted(async () => {
  if(route.params.id) {
    productIndex.value = route.params.id
    mode.value = 'EDIT'

    const selectedProduct = await adminProductStore.getProduct(productIndex.value)
    
    productData.name = selectedProduct.name
    productData.imageUrl = selectedProduct.imageUrl
    productData.price = selectedProduct.price
    productData.quantity = selectedProduct.quantity
    productData.about = selectedProduct.about
    productData.status = selectedProduct.status
  }
})
</script>

<template>
  <AdminLayout>
    <!-- Product Update View -->
    <div class="shadow-xl p-8 mt-4">
      <div class="text-1xl font-bold">{{ mode }}</div>
      <div class="divider"></div>
      <div class="grid grid-cols-2 gap-2">
        <div v-for="form in formData" class="form-control w-full">
          <label class="label">
            <span class="label-text">{{ form.name }}</span>
          </label>

          <input 
            v-if="form.type !== 'upload-image'"
            type="text" 
            class="input input-bordered w-full" 
            v-model="productData[form.field]"
            />
          <div v-else>
            <div class="avatar">
              <div class="w-24 rounded-full">
                <img :src="productData[form.field]">
              </div>
            </div>
            <input type="file" @change="handleFileUpload">
          </div>
        </div>
      </div>
      <div class="divider"></div>
      <div class="grid grid-cols-2 gap-2">
        <div class="form-control w-full">
          <label class="label">
            <span class="label-text">Status</span>
          </label>
          <select v-model="productData.status" class="select select-bordered">
            <option disabled selected>Choose status</option>
            <option value="open">Open</option>
            <option value="close">Close</option>
          </select>
        </div>
      </div>
      <div>
        <div class="flex justify-end mt-4">
          <RouterLink :to="{ name: 'admin-products-list'}" class="btn btn-ghost">Back</RouterLink>
          <button class="btn btn-neutral" @click="updateProduct()">{{ mode }}</button>
        </div>
      </div>
    </div>
  </AdminLayout>
</template>
