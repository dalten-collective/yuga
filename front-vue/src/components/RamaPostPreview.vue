<template>
  <div>
    <h1 class="text-2xl">
      <router-link class="text-blue-500 underline" :to="{ name: 'ramaPostShow', params: { host: foundationHost, foundationName, postID: post.id } }">
        {{ post.title }}
      </router-link>
    </h1>
    <h1 class="text-lg">by: {{ post.author }} TODO: link to author page</h1>
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

    <pre>
      am janitor? {{ amJanitor }}
      am almoner? {{ amAlmoner }}
    </pre>

    <div v-if="amJanitor">
      <h1>janitor area</h1>
      <pre>current: {{ currentFolder }}</pre>
      <select v-model="selectedFolder">
        <option v-for="name in folderNames" :key="name" :value="name">
          {{ name === '' ? 'No Folder' : name }}
        </option>
      </select>
      <button @click="moveToFolder">Move</button>

      <h2 class="text-xl">Tags</h2>
      <ul>
        <li v-for="tag in currentTags" :key="tag">
          {{ tag }}
          <div v-if="amJanitor">
            <button class="p-2 text-white bg-red-400 rounded-md" @click="removeTag(tag)">Remove</button>
          </div>
        </li>
      </ul>
      <select v-model="selectedTag">
        <option disabled value="">Choose a tag</option>
        <option v-for="tagName in potentialTags" :key="tagName" :value="tagName">
          {{ tagName }}
        </option>
      </select>
      <button @click="addTag">Add Tag</button>
    </div>

    <div v-if="amAlmoner">
      <h1>almoner area</h1>
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

const amJanitor = computed(() => {
  if (!theFoundation || !theFoundation.value) {
    return false
  }
  return theFoundation.value.details.janitors.includes(sigShip(window.ship))
})
const amAlmoner = computed(() => {
  if (!theFoundation || !theFoundation.value) {
    return false
  }
  return theFoundation.value.details.almoners.includes(sigShip(window.ship))
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

const folderNames = computed(() => {
  return foundationFolders.value.map((fm: R.FoldersMeta) => fm.folder)
})

const potentialTags = computed<Array<string>>(() => {
  return foundationTags.value.map(t => t.tag).filter((tag: string) => {
    return !currentTags.value.includes(tag)
  })
})

const addTag = () => {
  const newTags = currentTags.value || []
  newTags.push(selectedTag.value)

  ramaAPI.editNoteTags({
    foundation: props.foundationName,
    who: sigShip(props.foundationHost),
    folder: currentFolder.value,
    tags: newTags,
    post: props.post,
  })
}

const removeTag = (tag: string) => {
  const prevTags = currentTags.value || []
  const newTags = prevTags.filter((t: string) => t != tag)

  ramaAPI.editNoteTags({
    foundation: props.foundationName,
    who: sigShip(props.foundationHost),
    folder: currentFolder.value,
    tags: newTags,
    post: props.post,
  })
}

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
