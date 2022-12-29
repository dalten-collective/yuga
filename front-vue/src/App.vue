<template>
  DEBUG/TODO: Ship: {{ ourShip }}
  <nav>
    <router-link class="text-blue-500 underline" :to="{ name: 'admin' }">Admin</router-link>
    <router-link class="text-blue-500 underline" :to="{ name: 'explore' }">Explore</router-link>
  </nav>
  <div>
    <router-view />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useStore } from '@/store/store'
import {ActionTypes} from '@/store/action-types';

const store = useStore();

const ourShip = ref(window.ship);

onMounted(() => {
  store.dispatch(ActionTypes.RAMA_SCRY_STATE)
})

</script>

