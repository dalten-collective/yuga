<template>
  <div>
    <h1 class="text-lg">{{ post.title }}</h1>
    <h1 class="text-lg" v-if="showAuthor">by: {{ post.author }}</h1>
    <h1 class="">comments {{ post.quipCount }}</h1>
    <div v-if="showFolder">
      <pre>folder: {{ currentFolder === '' ? 'No Folder' : currentFolder }}</pre>
    </div>
    <div>
      <pre>tags: {{ currentTags }}</pre>
    </div>
    <p>
      TODO PREVIEW?: {{ post.content[0].inline[0] }}...
    </p>
    <ul>
      <li>
        posted on TODO: {{ (new Date(post.sent)).toLocaleString() }}
      </li>
    </ul>
    <button @click="getNote" class="p-2 text-white bg-blue-300 border rounded-md">get more</button>
    <pre v-if="('value' in more)">{{ more }}</pre>
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
  showAuthor: boolean;
}

const props = defineProps<Props>();
const store = useStore();
const more = reactive({})
const selectedFolder = ref('')
const selectedTag = ref('')

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

const foundationFolders = computed<Array<R.FoldersMeta> | []>(() => {
  if (!theFoundation) {
    return []
  }
  return store.getters[GetterTypes.HOSTED_FOLDERS_BY_PROVIDER](`${ props.foundationHost }/${ props.foundationName }`)
})

const foundationTags = computed<Array<R.TagsMeta>>(() => {
  if (!theFoundation) {
    return false
  }
  return store.getters[GetterTypes.HOSTED_TAGS_BY_PROVIDER](`${ props.foundationHost }/${ props.foundationName }`)
})

const currentFolder = computed<string>(() => {
  const folder = foundationFolders.value.find((fm: R.FoldersMeta) => {
    const post = fm.posts.find((pm: R.RamaPost) => pm.id === props.post.id)
    if (post) {
      return true
    }
    return false
  })
  if (folder) {
    return folder.folder
  }
  return ''
})

const currentTags = computed<Array<string> | []>(() => {
  const ct = foundationTags.value.filter((tm: R.TagsMeta) => {
    return tm.posts.find((rp: R.RamaPost) => rp.id === props.post.id)
  })
  return ct.map(t => t.tag)
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
    tags: [], // TODO: current tags strings
    post: props.post,
  })
}

</script>
