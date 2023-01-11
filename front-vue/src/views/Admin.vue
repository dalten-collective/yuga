<template>
  <div>
    <div class="mt-4 mb-6">
      <NewFoundationForm />
    </div>

    <div v-if="foundationsStatus.loading">
      LOADING
    </div>

    <div v-else class="flex flex-col">
      <div v-if="foundations.length > 0" class="mb-4" v-for="f in foundations" :key="f.foundation.provider">
        <Foundation class="p-2 border rounded-md dark:border-stone-500" :provider="f.foundation.provider" :key="f.foundation.provider" :showPostForm="false" />
      </div>

      <div v-else>
        You haven't created any Foundations yet.
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
import {GetterTypes} from '@/store/getter-types';

const store = useStore()

const foundationsStatus = computed(() => {
  return store.getters[GetterTypes.ELEMENT_STATUS_MAP]('foundationListHost')
})

onMounted(() => {
  startAirlock("hari")
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
