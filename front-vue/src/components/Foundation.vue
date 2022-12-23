<template>
  <div>
    <h1 class="text-xl">{{ foundation.name }}</h1>
    <CreateNote :host="hostShip" :foundation="foundation.name" />
    <div class="p-2 border rounded-sm">
      <div>
        <h2>Almoners</h2>
        <ul>
          <li v-for="a in foundation.foundation.almoners" :key="a">
            <div class="flex flex-row">
              {{ a }}
              <RemoveAlmoner :foundation="foundation" :almoner="a" />
            </div>
          </li>
        </ul>
        <AddAlmoners :foundation="foundation" />
      </div>

      <div>
        <h2>Janitors</h2>
        <ul>
          <li v-for="j in foundation.foundation.janitors" :key="j">
            <div class="flex flex-row">
              {{ j }}
              <RemoveJanitor :foundation="foundation" :janitor="j" />
            </div>
          </li>
        </ul>
        <AddJanitors :foundation="foundation" />
      </div>

      <div>
        <h2>Accepted Tags</h2>
        <ul>
          <li v-for="t in foundation.foundation.metadata.public.tags" :key="t.tag">
            {{ t }}
          </li>
        </ul>
        <AddTag :foundation="foundation" />
      </div>
    </div>

    <div>
      <h2>Posts</h2>
      <ul>
        <li v-for="f in foundation.foundation.metadata.public.folders" :key="f.folder">
          <PostFolder :folder="f" :host="hostShip" :foundation="foundation.name" />
        </li>
      </ul>
      <AddFolder :foundation="foundation" />
    </div>

    <div>
      <h2>Secret TODO</h2>
      {{ foundation.foundation.metadata.secret }}
    </div>

    <div>
      <h2>Public TODO</h2>
      {{ foundation.foundation.metadata.public }}
    </div>

  </div>
</template>

<script setup lang="ts">
import * as T from "../types";
import { computed, ref } from "vue";
import { useStore } from "../store/store";
import { GetterTypes } from "@/store/getter-types";
import { sigShip } from "@/helpers";
import * as diaryAPI from '@/api/diaryAPI'

import AddAlmoners from '@/components/AddAlmoners.vue'
import RemoveAlmoner from '@/components/RemoveAlmoner.vue'

import AddJanitors from '@/components/AddJanitors.vue'
import RemoveJanitor from '@/components/RemoveJanitor.vue'

import AddTag from '@/components/AddTag.vue'
import AddFolder from '@/components/AddFolder.vue'

import CreateNote from '@/components/CreateNote.vue'
import PostFolder from '@/components/PostFolder.vue'

interface Props {
  provider: T.Provider;
}
const props = defineProps<Props>();
const store = useStore();

const hostShip = computed<T.Ship>(() => {
  return foundation.value.foundation.provider.split('/')[0]
})

const foundation = computed<T.StateFoundation>(() => {
  return store.getters[GetterTypes.FOUNDATION_BY_PROVIDER](props.provider)
});
</script>
