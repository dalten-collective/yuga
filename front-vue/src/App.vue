<template>
  <pre>
  DEBUG
  window.ship: {{ ourShip }}
  </pre>

  <div class="container mx-auto">
    <nav class="p-2 border">
      <div class="flex flex-row justify-start">
        <ul class="flex flex-row">
          <li class="mr-4">
        <router-link class="text-blue-500 underline" :to="{ name: 'admin' }">Admin</router-link>
          </li>
          <li class="mr-4">
        <router-link class="text-blue-500 underline" :to="{ name: 'explore' }">Explore</router-link>
          </li>
        </ul>
      </div>
    </nav>
    <div>
      <router-view />
    </div>
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

