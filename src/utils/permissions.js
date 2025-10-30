import { useAuthStore } from "../stores/auth"
import { storeToRefs } from 'pinia'
import { computed } from "vue"

export function can(permissionOrRole) {
  const auth = useAuthStore()
  const { roles, permissions } = storeToRefs(auth)
   return computed(() => 
    roles.value.includes(permissionOrRole) || permissions.value.includes(permissionOrRole)
  ).value
 // return roles.value.includes(permissionOrRole) || permissions.value.includes(permissionOrRole)
}