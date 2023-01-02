<template>
  <div class="flex flex-col">
    <div class="flex flex-row">
      <label for="cover-field">
        Cover image URL
        <input id="cover-field" placeholder="http://image.com/picture.png" type="text" v-model="cover" />
      </label>

      <div class="w-48">
        cover preview:
        <img :src="cover" class="object-contain w-full h-48" />
      </div>
    </div>

    <div>
      <label for="title-field">
        Post title
        <input placeholder="" id="title-field" type="text" v-model="title" />
      </label>
    </div>

    <div>
      <label for="body-field">
        Post body
        <textarea rows="10" class="w-full" v-model="content" />
      </label>
    </div>

    <button @click="sendPost" class="action-btn">Post</button>
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
