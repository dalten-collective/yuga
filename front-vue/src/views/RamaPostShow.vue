<template>
  <div>
    <div v-if="post && ('essay' in post)">
      <article>
        <header class="flex flex-col">
          <div>
            <h1 class="text-2xl">{{ post.essay.title }}</h1>
          </div>
          <div class="flex flex-row justify-between">
            <div>
              {{ (new Date(post.essay.sent)).toLocaleString() }}
            </div>
          </div>
          <div class="flex flex-row justify-between">
            <div>
              {{ post.essay.author }}
            </div>

            <div>
              {{ Object.keys(post.seal.quips).length }} comments
            </div>
          </div>
        </header>

        <main>
          <div>
            {{ bodyContent }}
          </div>
        </main>

        <aside>
          {{ post.seal.quips }}
        </aside>

      </article>

      <pre>
        post: {{ post }}
      </pre>
    </div>

    <div v-else>
      LOADING
    </div>
  </div>
</template>

<script setup lang="ts">
import * as T from "../types";
import * as D from "../types/diary-types";
import * as R from "../types/rama-types";
import {ActionTypes} from '@/store/action-types';

import { useStore } from "../store/store";
import { reactive, computed, ref, onMounted } from "vue";
import { GetterTypes } from "@/store/getter-types";
import { sigShip } from '@/helpers'

// import urbitAPI from "@/api/urbitAPI"
import * as diaryAPI from "@/api/diaryAPI"
import * as ramaAPI from "@/api/ramaAPI"

interface Props {
  postID: string;
  foundationName: string;
  host: T.Ship;
}

const props = defineProps<Props>();
const store = useStore();
const more = reactive({})
const post = ref({})

onMounted(async () => {
  // selectedFolder.value = currentFolder.value
  await store.dispatch(ActionTypes.RAMA_SCRY_STATE)
  getNote()
})

const removeDots = (postID: string) => {
  return postID.replaceAll('.', '')
}

const bodyContent = computed(() => {
  if (!post) {
    return ""
  }
  return post.value.essay.content[0].inline[0]
})

const postLink = computed(() => {
  return `/apps/groups/groups/${ props.host }/${ props.foundationName }/channels/diary/${ props.host }/${ props.foundationName }/note/${ removeDots(props.post.id) }`
})

const theFoundation = computed<R.SubFoundation | null>(() => {
  return store.getters[GetterTypes.HOSTED_FOUNDATION_BY_PROVIDER](`${ props.host }/${ props.foundationName }`)
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
  return store.getters[GetterTypes.HOSTED_FOLDERS_BY_PROVIDER](`${ props.host }/${ props.foundationName }`)
})

const foundationTags = computed<Array<R.TagsMeta>>(() => {
  if (!theFoundation) {
    return false
  }
  return store.getters[GetterTypes.HOSTED_TAGS_BY_PROVIDER](`${ props.host }/${ props.foundationName }`)
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
    who: sigShip(props.host),
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
    who: sigShip(props.host),
    folder: currentFolder.value,
    tags: newTags,
    post: props.post,
  })
}

const getNote = () => {
  diaryAPI.getNote({
    host: props.host,
    found: props.foundationName,
    noteID: props.postID,
  }).then((r) => {
    post.value = r
  })
}

const moveToFolder = () => {
  ramaAPI.moveToFolder({
    foundation: props.foundationName,
    who: sigShip(props.host),
    folder: selectedFolder.value,
    tags: [], // TODO: current tags strings
    post: props.post,
  })
}

</script>
