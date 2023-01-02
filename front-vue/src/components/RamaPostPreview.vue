<template>
  <div>
    <div class="flex flex-row items-center justify-between">
      <header class="flex flex-col">
        <h1 class="text-2xl">
          <router-link class="text-blue-500 underline" :to="{ name: 'ramaPostShow', params: { host: foundationHost, foundationName, postID: post.id } }">
            {{ post.title }}
          </router-link>
        </h1>
        <span class="">by: {{ post.author }} on {{ (new Date(post.seal.time)).toLocaleString() }}</span>
      </header>

      <aside class="flex flex-row justify-between">
        <div class="text-right">
          <h1 class="">{{ post.quipCount }} comments</h1>
          <ul class="flex flex-row">
            <li v-for="tag in currentTags" class="px-2 py-1 ml-2 text-sm font-bold text-blue-400 bg-blue-100 border border-blue-300 rounded-lg">
              {{ tag }}
            </li>
          </ul>
        </div>
      </aside>
    </div>

    <div v-if="amJanitor" class="text-right">
      <div class="mt-2 mb-4">
        <span @click="toolsExpanded = true" class="text-blue-500 underline cursor-pointer" v-if="!toolsExpanded">Show Janitor Tools</span>
        <span @click="toolsExpanded = false" class="text-blue-500 underline cursor-pointer" v-if="toolsExpanded">Close Janitor Tools</span>
      </div>

      <div v-if="toolsExpanded" class="flex flex-col justify-end">
        <div class="self-end w-1/3 pb-2 mb-4 border-b">
          <select v-model="selectedFolder" class="p-2 mr-2 rounded-md">
            <option v-for="name in folderNames" :key="name" :value="name">
              {{ name === '' ? 'No Folder' : name }}
            </option>
          </select>
          <button class="action-btn" @click="moveToFolder">Move to folder</button>
        </div>

        <ul>
          <li v-for="tag in currentTags" :key="tag" class="mb-1">
            <span class="px-2 py-1 ml-2 text-sm font-bold text-blue-400 bg-blue-100 border border-blue-300 rounded-lg">
              {{ tag }}
            </span>
            <span v-if="amJanitor" @click="removeTag(tag)" class="p-1 text-sm font-bold text-red-400 underline cursor-pointer">remove</span>
          </li>
        </ul>
        <div class="my-2">
          <select v-model="selectedTag" class="p-2 mr-2 rounded-md">
            <option disabled value="">Add a tag</option>
            <option v-for="tagName in potentialTags" :key="tagName" :value="tagName">
              {{ tagName }}
            </option>
          </select>
          <button @click="addTag" class="action-btn">Add Tag</button>
        </div>
      </div>
    </div>

    <div v-if="false"> <!-- TODO -->
      <div v-if="amAlmoner">
        <h1>almoner area</h1>
        <!--
        <pre>tags: {{ tags }}</pre>
        -->
        <select v-model="selectedFolder">
          <option v-for="name in folderNames" :key="name" :value="name">
            {{ name === '' ? 'No Folder' : name }}
          </option>
        </select>
        <button @click="moveToFolder">Move</button>
      </div>
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
const toolsExpanded = ref(false);

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
