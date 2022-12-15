<template>
  <div>
    This is the explore view
    <WatchForm />
  </div>
</template>

<script setup lang="ts">
import WatchForm from '@/components/WatchForm.vue'

import { onMounted } from 'vue';
import { useStore } from '@/store/store'
import {ActionTypes} from '@/store/action-types';

const store = useStore()

onMounted(() => {
  startAirlock("rama")
})

const startAirlock = (deskname: string) => {
  store.dispatch(ActionTypes.AIRLOCK_OPEN, deskname)
}

</script>

