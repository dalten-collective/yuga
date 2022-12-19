<template>
  <div>
    <h1 class="text-xl">{{ theHost.host }}</h1>

    <div>
      <h2>Foundations offered</h2>
      <div class="flex flex-col">
        <div v-for="f in theHost.foundations" :key="f.name">
          {{ f }}
        </div>
      </div>

    </div>

  </div>
</template>

<script setup lang="ts">
import * as R from "../types/rama-types";
import { computed } from "vue";
import { useStore } from "../store/store";
import { GetterTypes } from "@/store/getter-types";

interface Props {
  host: R.HostObject;
}
const props = defineProps<Props>();
const store = useStore();

const theHost = computed(() =>
  store.getters[GetterTypes.HOST_BY_HOST](props.host.host)
);
</script>
