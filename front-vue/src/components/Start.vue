<template>
  <div>
    <div>
      <div v-for="f in foundations" :key="f.foundation.provider">
        <Foundation :provider="f.foundation.provider" :key="f.foundation.provider" />
        <AddAlmoners :foundation="f" />
      </div>
    </div>

    <NewFoundationForm />
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted } from 'vue';
import AddAlmoners from '@/components/AddAlmoners.vue'
import Foundation from '@/components/Foundation.vue'
import NewFoundationForm from '@/components/NewFoundationForm.vue'

import { useStore } from '@/store/store'
import {ActionTypes} from '@/store/action-types';

const store = useStore()

onMounted(() => {
  startAirlock(deskname)
})

const deskname = "hari"
const foundations = computed(() => store.state.foundations)

const startAirlock = (deskname: string) => {
  store.dispatch(ActionTypes.AIRLOCK_OPEN, deskname)
}
const closeAirlocks = () => {
  store.dispatch(ActionTypes.AIRLOCK_CLOSE);
}

onUnmounted(() => {
  closeAirlocks()
})
</script>


