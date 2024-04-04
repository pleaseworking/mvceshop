import { defineStore } from "pinia";

import {
    ref,
    get
    } from 'firebase/database'

import {
    realtimeDB
  } from '@/firebase'

export const useAdminDashboardStore = defineStore("admin-dashboard", {
    state: () => ({
        stats: {
            order: 0,
            product: 0,
            user: 0
        }
    }),
    actions: {
        async loadDashboard () {
            const statRef = ref(realtimeDB, 'stats')
            const statSnapshot = await get(statRef)
            this.stats = statSnapshot.val()
        }
    }
})