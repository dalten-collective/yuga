<template>
  <div>
    <div>
      <div v-for="f in foundations" :key="f.foundation.provider">
        <Foundation :provider="f.foundation.provider" :key="f.foundation.provider" />
        <AddAlmoners :foundation="f" />
        <AddJanitors :foundation="f" />
        <AddTag :foundation="f" />
        <AddFolder :foundation="f" />
      </div>
    </div>

    <button @click="closeAirlocks">close</button>
    <NewFoundationForm />
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted } from 'vue';
import AddAlmoners from '@/components/AddAlmoners.vue'
import AddJanitors from '@/components/AddJanitors.vue'
import AddTag from '@/components/AddTag.vue'
import AddFolder from '@/components/AddFolder.vue'
import Foundation from '@/components/Foundation.vue'
import NewFoundationForm from '@/components/NewFoundationForm.vue'

import { useStore } from '@/store/store'
import {ActionTypes} from '@/store/action-types';

const store = useStore()

onMounted(() => {
  startAirlock("hari")
  startAirlock("rama")
})

const foundations = computed(() => store.state.foundations)

const startAirlock = (deskname: string) => {
  store.dispatch(ActionTypes.AIRLOCK_OPEN, deskname)
}
const closeAirlocks = () => {
  console.log('closing...')
  store.dispatch(ActionTypes.AIRLOCK_CLOSE);
}

onUnmounted(() => {
  closeAirlocks()
})
</script>


