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
import { ref } from "vue";

const ourShip = ref(window.ship);

</script>

