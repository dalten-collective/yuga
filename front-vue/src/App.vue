<template>
  <nav>
    <router-link class="text-blue-500 underline" :to="{ name: 'admin' }">Admin</router-link>
    <router-link class="text-blue-500 underline" :to="{ name: 'explore' }">Explore</router-link>
  </nav>
  <div>
    <router-view />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
})
</script>

