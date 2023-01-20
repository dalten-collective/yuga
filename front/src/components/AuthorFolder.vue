<template>
  <div>
    <h1 class="text-xl">

      <router-link
        :to="{
          name: 'authorShow',
          params: {
            host,
            foundationName: foundation,
            authorName: urlSafeAuthor,
          },
        }"
      >
        {{ author.author }}
      </router-link>


      <span class="ml-1 text-sm text-gray-400"
        >({{ posts.length }} {{ posts.length === 1 ? "post" : "posts" }})</span
      >
    </h1>

    <div v-if="false">
      <!-- TODO -->
      <h2>Posts</h2>
      <li v-for="p in posts" :key="p.id">
        <RamaPostPreview
          :post="p"
          :showFolder="true"
          :showAuthor="false"
          :foundationHost="host"
          :foundationName="foundation"
        />
      </li>
    </div>
  </div>
</template>

<script setup lang="ts">
import * as T from "@/types";
import * as D from "@/types/diary";
import * as R from "@/types/rama-types";
import { onMounted, ref, computed } from "vue";
import * as diaryAPI from "@/api/diaryAPI";

import RamaPostPreview from "@/components/RamaPostPreview.vue";

interface Props {
  author: R.Metadata["authors"];
  host: T.Ship;
  foundation: T.FoundationName;
}

const props = defineProps<Props>();
const posts = ref<Array<D.PostWithID>>([]);
const expanded = ref(false);

onMounted(() => {
  getPosts();
});

const urlSafeAuthor = computed(() => {
  return encodeURIComponent(props.author.author);
});

const getPosts = (): void => {
  const postIDs = props.author.posts.map((post: R.RamaPost) => post.id);
  Promise.all(
    postIDs.map((noteID: string) => {
      return diaryAPI.getNote({
        host: props.host,
        found: props.foundation,
        noteID,
      });
    })
  ).then((values: Array<D.PostAsSealEssay>) => {
    posts.value = values.map((p, i: number) => {
      const post: D.PostWithID = p;
      // TODO: extract a seal+essay -> PostWithID converter
      p.id = postIDs[i];
      p.quippers = []; // TODO:
      p.quipCount = 0; // TODO:
      p.author = p.essay.author;
      p.image = p.essay.image;
      p.title = p.essay.title;
      p.content = p.essay.content;
      return p;
    }) as Array<D.PostWithID>;
  });
};

// TODO: will need to get all post IDs, then do a Promise.all on scrying them from
// diary.
</script>
