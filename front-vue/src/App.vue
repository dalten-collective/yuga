<template>
  <div class="container mx-auto">
    <nav class="flex flex-row justify-between p-2 border">
      <div class="flex flex-row justify-start">
        <ul class="flex flex-row">
          <li class="mr-4">
        <router-link class="text-blue-500 underline" :to="{ name: 'admin' }">Admin</router-link>
          </li>
          <li class="mr-4">
        <router-link class="text-blue-500 underline" :to="{ name: 'explore' }">Explore</router-link>
          </li>
        </ul>
        <span class="font-mono">window.ship: {{ ourShip }}</span>
      </div>
      <div>
        <div class="flex flex-row items-center">

          <div class="flex items-center justify-center mr-2">
            <span class="mr-1 text-sm font-medium dark:text-stone-100">&#127779;</span>
            <label class="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" value="" v-model="currentThemeDark" class="sr-only peer">
              <div class="w-11 h-6 bg-amber-300 peer-focus:outline-none peer-focus:ring-0 peer-focus:ring-sky-0 dark:peer-focus:ring-sky-0 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-stone-500 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-stone-500 after:border-gray-300 after:border-stone-500 after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-sky-600 dark:peer-checked:bg-sky-800"></div>
              <span class="ml-1 text-sm font-medium dark:text-stone-100">&#9790;</span>
            </label>
          </div>

          <span class="text-sm link-text" @click="useSystemTheme">use system theme</span>
        </div>
      </div>
    </nav>
    <div>
      <router-view />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, watch } from "vue";
import { useStore } from '@/store/store'
import {ActionTypes} from '@/store/action-types';
import {current} from "immer";

const store = useStore();

const ourShip = ref(window.ship);
const currentThemeDark = ref(true);

const startAirlock = (deskname: string) => {
  store.dispatch(ActionTypes.AIRLOCK_OPEN, deskname)
}

onMounted(() => {
  startAirlock("hari")
  startAirlock("rama")

  store.dispatch(ActionTypes.RAMA_SCRY_STATE)
  if (
    localStorage.theme === 'dark' || (
      !('theme' in localStorage) &&
      window.matchMedia('(prefers-color-scheme: dark)').matches
    )) {
    document.documentElement.classList.add('dark')
    currentThemeDark.value = true
  } else {
    document.documentElement.classList.remove('dark')
    currentThemeDark.value = false
  }
})

watch(currentThemeDark,  async (val) => {
    if (val) {
      darkTheme()
    } else {
      lightTheme()
    }
  }
)

const toggleTheme = () => {
  if (localStorage.theme === 'dark' || (
    !('theme' in localStorage) &&
    window.matchMedia('(prefers-color-scheme: dark)').matches
  )) {
    document.documentElement.classList.add('dark')
    currentThemeDark.value = true
  } else {
    document.documentElement.classList.remove('dark')
    currentThemeDark.value = false
  }
}
const lightTheme = () => {
  localStorage.theme = 'light'
  document.documentElement.classList.remove('dark')
    currentThemeDark.value = false
}
const darkTheme = () => {
  localStorage.theme = 'dark'
  document.documentElement.classList.add('dark')
  currentThemeDark.value = true
}
const useSystemTheme = () => {
  localStorage.removeItem('theme')
  toggleTheme()
}

</script>

