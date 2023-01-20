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

    <div class="mb-2">
      <label for="title-field">
        Post title
        <input placeholder="" id="title-field" type="text" v-model="title" />
      </label>
    </div>

    <div class="flex flex-row mb-2">
      <div class="mr-2">
        <label for="url-field">
          Content URL
          <input placeholder="Fetch markdown from URL..." id="url-field" type="text" v-model="articleURL" />
        </label>
      </div>
      <div>
        <button :disabled="articleURL == ''" @click="getMarkdown" :class="articleURL === '' ? 'loading-btn' : 'action-btn' ">{{ articleURL === '' ? 'Enter URL' : 'Fetch!' }}</button>
      </div>
    </div>

    <div class="flex flex-row">
      <div class="flex-grow w-1/2 h-[40em]" :class="loading ? 'opacity-20' : ''">
        <label for="body-field">
          Post body
          <textarea :disabled="loading" class="w-full h-[37em]" v-model="content" />
        </label>
      </div>
      <div class="w-1/2 ml-2 h-[38em]" :class="loading ? 'opacity-20' : ''">
        Post preview:
        <div class="border border-2 rounded-sm shadow-inner">
          <div v-html="postPreview" class="h-[38em] p-2 overflow-scroll rendered-markdown">
          </div>
        </div>
      </div>
    </div>

    <button :disabled="loading" :class="loading ? ['loading-btn'] : ['action-btn']" @click="sendPost">{{ loading ? 'Fetching...' : 'Post' }}</button>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import * as T from "@/types"
import * as ramaAPI from '@/api/ramaAPI'
import { sigShip } from "@/helpers"

import TurndownService from 'turndown'
import { extract } from '@extractus/article-extractor'
import { marked } from 'marked'
import * as DOMPurify from 'dompurify'

interface Props {
  host: T.Ship;
  foundation: T.FoundationName;
}
const props = defineProps<Props>();

const articleURL = ref('');
const title = ref('');
const content = ref('');
const cover = ref('');
const loading = ref(false);

const getMarkdown = () => {
  loading.value = true
  const t = new TurndownService();

  const encodedUrl = encodeURIComponent(articleURL.value);
  const reqUrl = "https://extract-article.deta.dev/?url=" + encodedUrl;

  fetch(reqUrl, {method: 'GET', redirect: 'follow'})
  .then(response => response.json())
  .then(result => {
  // extract(articleURL.value)
      console.log('article ', result.data)
      const markdownContent = t.turndown(result.data.content)
      content.value = `[Article source](${articleURL.value})\n\n`
      content.value = content.value + markdownContent
      loading.value = false
    }).catch((err) => {
      loading.value = false
      content.value = "Could not fetch markdown"
    })
}

const postPreview = computed(() => {
  return marked(content.value)
})

const sendPost = () => {
  const who = sigShip(props.host)
  const foundation = props.foundation
  loading.value = true

  ramaAPI.addNote({
    who,
    foundation,
    title: title.value,
    cover: cover.value,
    folder: '',  // TODO
    tags: [],    // TODO
    content: content.value,
  })
  .then(() => {
    // TODO: redirect to foundation?
    // window.location = "/apps/cyclo/explore"
  })
  .finally(() => {
    loading.value = false;
  })
}


</script>
