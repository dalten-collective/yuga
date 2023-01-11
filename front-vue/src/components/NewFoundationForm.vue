<template>
  <div class="p-2 border rounded-sm dark:border-stone-500">
    <form ref="form" @submit.prevent="create">
      <div class="mb-2">
        Form New Foundation
      </div>
      <div class="flex flex-row items-center">
        <label for="prefix">
          Name
          <input class="focus:ring-0 focus:ring-offset-0" id="prefix" type="text" :class="loading ? loading : ''" v-model="prefix" :disabled="loading" />
        </label>
        <button class="ml-2" :class="loading ? 'btn-loading' : ''" :disabled="loading" type="submit">{{ loading ? 'Creating...' : 'Create' }}</button>
      <div v-if="success">
        SUCCESS
      </div>

      </div>
      <pre>
        loading: {{ loading }}
        success: {{ success }}
        error: {{ error }}
        initial: {{ initial }}
      </pre>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import * as foundationAPI from "@/api/foundationAPI";
import { GetterTypes } from "@/store/getter-types";
import { ActionTypes } from "@/store/action-types";
import { useStore } from "@/store/store";

const store = useStore();

const initial = computed(() => {
  return store.getters[GetterTypes.ELEMENT_INITIAL]('foundationCreate')
})
const loading = computed(() => {
  return store.getters[GetterTypes.ELEMENT_LOADING]('foundationCreate')
})
const success = computed(() => {
  return store.getters[GetterTypes.ELEMENT_SUCCESS]('foundationCreate')
})
const error = computed(() => {
  return store.getters[GetterTypes.ELEMENT_ERROR]('foundationCreate')
})

const prefix = ref('')

const create = () => {
  store.dispatch(ActionTypes.LOADING_SET, 'foundationCreate')
  setTimeout(() => {
    store.dispatch(ActionTypes.SUCCESS_SET, 'foundationCreate')
  }, 1000)
  setTimeout(() => {
    store.dispatch(ActionTypes.INITIAL_SET, 'foundationCreate')
  }, 4000)

  return
  if (!prefix.value) {
    return
  }
  // TODO: validate this.$refs
  foundationAPI.createFoundation(prefix.value)
}

</script>
