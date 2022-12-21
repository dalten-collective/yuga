<template>
  <div>
    <input type="text" v-model="cover" />
    <div class="w-48">
      <img :src="cover" class="object-contain w-full h-48" />
    </div>
    <input type="text" v-model="title" />
    <textarea v-model="content" />
    <button @click="sendPost">Post</button>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import * as T from "@/types"
import * as ramaAPI from '@/api/ramaAPI'
import { sigShip } from "@/helpers"

interface Props {
  host: T.Ship;
  foundation: T.FoundationName;
}
const props = defineProps<Props>();

const title = ref('');
const content = ref('');
const cover = ref('');

const sendPost = () => {
  const who = sigShip(props.host)
  const foundation = props.foundation

  ramaAPI.addNote({
    who,
    foundation,
    title: title.value,
    cover: cover.value,
    folder: '',  // TODO
    tags: [],    // TODO
    content: content.value,
  })
}


</script>
