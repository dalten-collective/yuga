<template>
  <div>
    <header>
      <h1 class="flex flex-row justify-start text-xl">
        <div>
          <span v-if="folder.folder !== ''">
            {{ folder.folder }}
          </span>
          <span v-else>No Folder</span>
          <span class="ml-2 text-sm text-gray-400"
            >({{ posts.length }} post{{ posts.length === 1 ? "" : "s" }})</span
          >
        </div>
        <div class="ml-2">
          <span
            v-if="!expanded"
            @click="expanded = true"
            class="no-underline-link-text"
            >
              <ExpandIcon />
          </span>
          <span
            v-if="expanded"
            @click="expanded = false"
            class="no-underline-link-text"
          >
            <CollapseIcon />
          </span>
        </div>
      </h1>
    </header>

    <div v-show="expanded">
      <ul>
        <li
          v-for="p in posts"
          class="p-2 my-4 border rounded-md shadow-sm"
          :key="p.id"
        >
          <PostPreview
            :post="p"
            :showFolder="false"
            :foundationHost="host"
            :foundationName="foundation"
            showAuthor
          />
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import * as T from "@/types";
import * as D from "@/types/diary";
import { onMounted, ref, computed } from "vue";
import * as diaryAPI from "@/api/diaryAPI";

import ExpandIcon from '@/icons/ExpandIcon.vue'
import CollapseIcon from '@/icons/CollapseIcon.vue'

import PostPreview from "@/components/PostPreview.vue";

interface Props {
  folder: T.Folder;
  host: T.Ship;
  foundation: T.FoundationName;
}

const props = defineProps<Props>();
const posts = ref<Array<D.PostWithID>>([]);
const expanded = ref(false);

onMounted(() => {
  if (props.folder.folder === "") {
    expanded.value = true;
  }
  getPosts();
});

const urlSafeFolder = computed(() => {
  return encodeURIComponent(props.folder.folder);
});

const getPosts = (): void => {
  const postIDs = props.folder.posts.map((post: T.FolderPost) => post.id);
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
      const quipCount = Object.keys(p.seal.quips).length;
      p.quipCount = quipCount;
      p.author = p.essay.author;
      p.image = p.essay.image;
      p.title = p.essay.title;
      p.content = p.essay.content;
      return p;
    }) as Array<D.PostWithID>;
  });
};
</script>
