import { defineStore } from 'pinia'

export const useProductStore = defineStore('product', {
  state: () => ({
    list: [
      {
      name: 'test',
      imageUrl: 'https://fastly.picsum.photos/id/849/200/200.jpg?hmac=LwsdGn2endKvoLY10FPqtfqKYCVMbPEp5J6S_tUN1Yg',
      quantity: 10,
      about: 'testt',
      status: 'open',
      price: 100,
      },
      {
        name: 'test 123',
        imageUrl: 'https://fastly.picsum.photos/id/360/200/200.jpg?hmac=uO4zEvFVrZ6_pBuLc0DuGdgwe5g3FiJCd7bGsr2lhCo',
        quantity: 10,
        about: 'Recheck for detail',
        status: 'open',
        price: 100,
      },
    ],
  }),
  actions: {
    filterProducts (searchText) {
      return this.list.filter(product => product.name.includes(searchText))
    }
  }
})
