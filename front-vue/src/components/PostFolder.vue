<template>
  <div>
    <header>
      <h1 class="flex flex-row justify-start text-xl">
        <div>
          {{ folder.folder === '' ? "No folder" : folder.folder }}
          <span class="text-gray-400 text-md">({{ posts.length }} posts)</span>
        </div>
        <div class="ml-2">
          <span v-if="!expanded" @click="expanded = true" class="link-text">Open</span>
          <span v-if="expanded" @click="expanded = false" class="link-text">Close</span>
        </div>
      </h1>
    </header>

    <div v-show="expanded">
      <li v-for="p in posts" class="p-2 my-4 border rounded-md shadow-sm" :key="p.id">
        <RamaPostPreview :post="p" :showFolder="false" :foundationHost="host" :foundationName="foundation" />
      </li>
    </div>

  </div>
</template>

<script setup lang="ts">
import * as T from "@/types"
import * as D from "@/types/diary"
import { onMounted, ref } from 'vue';
import * as diaryAPI from '@/api/diaryAPI'

// import Post from '@/components/Post.vue'
import RamaPostPreview from '@/components/RamaPostPreview.vue'

interface Props {
  folder: T.Folder;
  host: T.Ship;
  foundation: T.FoundationName;
  rama: boolean;
}

const props = defineProps<Props>();
const posts = ref<Array<D.PostWithID>>([])
const expanded = ref(false);

onMounted(() => {
  getPosts()
})

const getPosts = (): void => {
  const postIDs = props.folder.posts.map((post: T.FolderPost) => post.id)
  Promise.all(
    postIDs.map((noteID: string) => {
      return diaryAPI.getNote({
        host: props.host,
        found: props.foundation,
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

// TODO: will need to get all post IDs, then do a Promise.all on scrying them from
// diary.


</script>
