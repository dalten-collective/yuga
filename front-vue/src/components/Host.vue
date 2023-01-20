<template>
  <div class="p-2 border rounded-lg shadow-inner">
    <h1 class="text-xl">{{ theHost.host }}</h1>

    <div>
      <h2>Foundations offered:</h2>
      <div class="flex flex-col">
        <ul class="list-disc">
          <li v-for="f in theHost.foundations" :key="f.name">
            <RouterLink class="text-blue-500 underline" :to="{ name: 'hostFoundationShow', params: { foundationName: f.name, foundationHost: theHost.host } }">
              {{ f.name }}
            </RouterLink>
            <!-- TODO: <pre>{{ f.subscribed }}</pre> -->
          </li>
        </ul>
      </div>

    </div>

  </div>
</template>

<script setup lang="ts">
import HostFoundation from "@/views/HostFoundation.vue"

import * as R from "../types/rama-types";
import { computed, onMounted } from "vue";
import { useStore } from "../store/store";
import { GetterTypes } from "@/store/getter-types";

import urbitAPI from "@/api/urbitAPI"

interface Props {
  host: R.HostObject;
}
const props = defineProps<Props>();
const store = useStore();

const theHost = computed(() =>
  store.getters[GetterTypes.HOST_BY_HOST](props.host.host)
);

onMounted(() => {
})

</script>
