<template>
  <div>
    <pre>
      show folder: {{ showFolder }}
      post: {{ post }}
    </pre>

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

    <div v-if="amJanitor">
      <h1>janitor area</h1>
      <!--
      <pre>tags: {{ tags }}</pre>
      -->
      <pre>current: {{ currentFolder }}</pre>
      <select v-model="selectedFolder">
        <option v-for="name in folderNames" :key="name" :value="name">
          {{ name === '' ? 'No Folder' : name }}
        </option>
      </select>
      <button @click="moveToFolder">Move</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import * as T from "../types";
import * as D from "../types/diary-types";
import * as R from "../types/rama-types";
import { useStore } from "../store/store";
import { reactive, computed, ref, onMounted } from "vue";
import { GetterTypes } from "@/store/getter-types";
import { sigShip } from '@/helpers'

// import urbitAPI from "@/api/urbitAPI"
import * as diaryAPI from "@/api/diaryAPI"
import * as ramaAPI from "@/api/ramaAPI"

interface Props {
  post: D.PostWithID;
  foundationName: string;
  foundationHost: T.Ship;
  showFolder: boolean;
}

const props = defineProps<Props>();
const store = useStore();
const more = reactive({})
const selectedFolder = ref('')

onMounted(() => {
  selectedFolder.value = currentFolder.value
})

const removeDots = (postID: string) => {
  return postID.replaceAll('.', '')
}

const postLink = computed(() => {
  return `/apps/groups/groups/${ props.foundationHost }/${ props.foundationName }/channels/diary/${ props.foundationHost }/${ props.foundationName }/note/${ removeDots(props.post.id) }`
})

const theFoundation = computed<R.SubFoundation | null>(() => {
  return store.getters[GetterTypes.HOSTED_FOUNDATION_BY_PROVIDER](`${ props.foundationHost }/${ props.foundationName }`)
})

const amJanitor = computed(() => {
  if (!theFoundation || !theFoundation.value) {
    return false
  }
  return theFoundation.value.details.janitors.includes(sigShip(window.ship))
})

const folders = computed<Array<T.FoldersMeta> | []>(() => {
  if (!theFoundation) {
    return []
  }
  return store.getters[GetterTypes.HOSTED_FOLDERS_BY_PROVIDER](`${ props.foundationHost }/${ props.foundationName }`)
})

const tags = computed<Array<T.TagsMeta>>(() => {
  if (!theFoundation) {
    return false
  }
  return store.getters[GetterTypes.HOSTED_TAGS_BY_PROVIDER](`${ props.foundationHost }/${ props.foundationName }`)
})

const currentFolder = computed<string>(() => {
  return folders.value.filter((f: T.FoldersMeta) => {
    return f.posts.find(pm => pm.id === props.post.id)
  }).folder
})

const currentTags = computed<string>(() => {
  return tags.value.filter((f: T.FoldersMeta) => {
    return f.posts.find(pm => pm.id === props.post.id)
  }).tag
})

const folderNames = computed(() => {
  return folders.value.map(f => f.folder)
})

const getNote = () => {
  diaryAPI.getNote({
    host: props.foundationHost,
    found: props.foundationName,
    noteID: props.post.id,
  }).then((r) => {
    more.value = r
  })
}

const moveToFolder = () => {
  ramaAPI.moveToFolder({
    foundation: props.foundationName,
    who: sigShip(props.foundationHost),
    folder: selectedFolder.value,
    tags: ['fixme', 'pls'],
    post: props.post,
  })
}

</script>
