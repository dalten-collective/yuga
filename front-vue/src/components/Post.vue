<template>
  <div>
    <h1 class="text-2xl">{{ post.title }}</h1>
    <h1 class="text-lg">by: {{ post.author }}</h1>
    <h1 class="">comments {{ post.quipCount }}</h1>
    <p>
      TODO PREVIEW?: {{ post.content[0].inline[0] }}...
    </p>
    <ul>
      <li>
        posted on TODO: {{ (new Date(post.sent)).toLocaleString() }}
      </li>
    </ul>
    <button @click="getNote" class="p-2 text-white bg-blue-300 border rounded-md">get more</button>
    <a :href="postLink">Visit</a>
    <pre v-if="('value' in more)">{{ more }}</pre>
  </div>
</template>

<script setup lang="ts">
import * as T from "../types";
import * as D from "../types/diary-types";
import { useStore } from "../store/store";
import { reactive, computed } from "vue";

// import urbitAPI from "@/api/urbitAPI"
import * as diaryAPI from "@/api/diaryAPI"

interface Props {
  post: D.PostWithID;
  foundationName: string;
  foundationHost: T.Ship;
}

const removeDots = (postID: string) => {
  return postID.replaceAll('.', '')
}

const postLink = computed(() => {
  return `/apps/groups/groups/${ props.foundationHost }/${ props.foundationName }/channels/diary/${ props.foundationHost }/${ props.foundationName }/note/${ removeDots(props.post.id) }`
})

const props = defineProps<Props>();
const store = useStore();
const more = reactive({})

const getNote = () => {
  diaryAPI.getNote({
    host: props.foundationHost,
    found: props.foundationName,
    noteID: props.post.id,
  }).then((r) => {
    more.value = r
  })
}

</script>
