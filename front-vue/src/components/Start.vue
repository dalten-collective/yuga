<template>
  <div>
    <div>
      <NewFoundationForm />
    </div>

    <hr />

    <div class="flex flex-col">
      <div class="mb-4" v-for="f in foundations" :key="f.foundation.provider">
        <Foundation :provider="f.foundation.provider" :key="f.foundation.provider" />
      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted } from 'vue';
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


