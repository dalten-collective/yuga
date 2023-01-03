<template>
  <div>
    <header class="justify-center mt-4 mb-12 grid grid-cols-3 gap-4">
      <div>
        <span class="text-xl">
          <RouterLink :to="{ name: 'hostFoundationShow', params: { foundationName, foundationHost: host } }">
            {{ foundationName }}
          </RouterLink>
        </span>
      </div>
      <div class="text-center">
        <h1 class="text-2xl text-center">
          <div>
            {{ decodedFolderName }}
            <span class="text-sm text-gray-400">({{ posts.length }} posts)</span>
          </div>
        </h1>
      </div>
      <div class="flex-grow">
      </div>
    </header>

    <div>
      <ul>
        <li v-for="p in posts" class="p-2 my-4 border rounded-md shadow-sm" :key="p.id">
          <RamaPostPreview :post="p" :showFolder="false" :foundationHost="host" :foundationName="foundationName" />
        </li>
      </ul>
    </div>

  </div>
</template>

<script setup lang="ts">
import * as T from "@/types"
import * as R from "@/types/rama-types"
import * as D from "@/types/diary"
import { onMounted, ref, computed } from 'vue';
import { useStore } from "../store/store";
import * as diaryAPI from '@/api/diaryAPI'
import { GetterTypes } from "@/store/getter-types";
import { ActionTypes } from "@/store/action-types";
import { useRouter, useRoute } from 'vue-router'

// import Post from '@/components/Post.vue'
import RamaPostPreview from '@/components/RamaPostPreview.vue'

interface Props {
  host: T.Ship;
  foundationName: T.FoundationName;
  folderName: string;
  rama: boolean;
}

const store = useStore();

const props = defineProps<Props>();
const posts = ref<Array<D.PostWithID>>([])
// const expanded = ref(false);
// const route = useRoute()

onMounted(async () => {
  await store.dispatch(ActionTypes.RAMA_SCRY_STATE);
  // await getFolder()
  await getPosts()
})

// const getFolder = (): void => {
//   const decodedFolderName = decodeURIComponent(props.folderName)
//   folder.value = store.getters[
//     GetterTypes.HOSTED_FOLDER_BY_DETAILS
//   ]({
//     host: props.host,
//     foundationName: props.foundationName,
//     folderName: decodedFolderName,
//   })
// }

const folder = computed<R.FoldersMeta>(() => {
  return store.getters[
    GetterTypes.HOSTED_FOLDER_BY_DETAILS
  ]({
    host: props.host,
    foundationName: props.foundationName,
    folderName: decodedFolderName.value,
  })
})

const decodedFolderName = computed(() => {
   return decodeURIComponent(props.folderName)
})

const getPosts = (): void => {
  if (!folder.value) {
    return
  }
  const postIDs = folder.value.posts.map((post: T.FolderPost) => post.id)
  Promise.all(
    postIDs.map((noteID: string) => {
      return diaryAPI.getNote({
        host: props.host,
        found: props.foundationName,
        noteID,
      })
    })
  ).then((values: Array<D.PostAsSealEssay>) => {
    posts.value = values.map((p, i: number) => {
      const post: D.PostWithID = p
      // TODO: extract a seal+essay -> PostWithID converter
      p.id = postIDs[i]
      p.quippers = [] // TODO:
      const quipCount = Object.keys(p.seal.quips).length
      p.quipCount = quipCount
      p.author = p.essay.author
      p.image = p.essay.image
      p.title = p.essay.title
      p.content = p.essay.content
      return p
    }) as Array<D.PostWithID>
  })
}


</script>
