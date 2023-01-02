<template>
  <div>
    <div class="my-2">
      <WatchForm />
    </div>

    <div class="flex flex-col">
      <div v-if="hosts.length > 0" class="mb-4" v-for="h in hosts" :key="h.host">
        <Host :host="h" />
      </div>
      <div v-else>
        You aren't watching any hosts yet. Add one above.
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import WatchForm from '@/components/WatchForm.vue'
import Host from '@/components/Host.vue'

import { onMounted, computed } from 'vue';
import { useStore } from '@/store/store'
import {ActionTypes} from '@/store/action-types';
import * as ramaAPI from '@/api/ramaAPI'

const store = useStore()

onMounted(() => {
  store.dispatch(ActionTypes.RAMA_SCRY_STATE)
})

const hosts = computed(() => store.state.hosts)

const startAirlock = (deskname: string) => {
  store.dispatch(ActionTypes.AIRLOCK_OPEN, deskname)
}

</script>

