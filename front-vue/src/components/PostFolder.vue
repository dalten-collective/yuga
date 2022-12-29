<template>
  <div>
    <h1>{{ folder.folder === '' ? "No folder" : folder.folder }}</h1>
    <div>
      <h2>Posts</h2>
      <pre>rama: {{ rama }}</pre>
      <li v-for="p in posts" :key="p.id">
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
      p.quipCount = 0 // TODO:
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
