<template>
  <div>
    <div v-if="!theFoundation">LOADING</div>

    <div v-if="theFoundation && 'details' in theFoundation">
      <header class="flex flex-col my-4">
        <div class="flex flex-row justify-around">
          <h1 class="text-3xl">{{ foundationName }}</h1>
        </div>
        <div class="flex flex-row justify-between">
          <div class="flex flex-col subtle">
            <div v-if="amJanitor">I am a janitor</div>
            <div v-if="amAlmoner">I am an almoner</div>
          </div>
          <div>
            <button
              v-if="!theFoundation.subscribed"
              class="action-btn"
              @click="enter"
            >
              Subscribe
            </button>
            <button
              v-if="theFoundation.subscribed"
              class="cancel-btn"
              @click="leave"
            >
              Leave
            </button>
          </div>
        </div>
      </header>

      <main>
        <div class="p-2 my-4">
          <h3 class="text-2xl">Folders:</h3>
          <ul>
            <li
              v-for="f in theFoundation.details.metadata.folders"
              :key="f.folder"
            >
              <PostFolder
                :rama="true"
                :folder="f"
                :host="host"
                :foundation="foundationName"
              />
            </li>
          </ul>
        </div>

        <div class="p-2 my-4">
          <h3 class="text-2xl">Authors:</h3>
          <ul>
            <li
              v-for="a in theFoundation.details.metadata.authors"
              :key="a.author"
            >
              <AuthorFolder
                :author="a"
                :host="host"
                :foundation="foundationName"
              />
            </li>
          </ul>
        </div>

        <div v-if="amAlmoner">
          <div class="p-2 my-2 border rounded-md">
            <h2 class="text-2xl">Add a post in {{ foundationName }}</h2>
            <CreateNote :host="host" :foundation="foundationName" />
          </div>
        </div>

        <div v-if="false">
          <pre>{{ theFoundation }}</pre>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import Post from "@/components/Post.vue";
import CreateNote from "@/components/CreateNote.vue";
import PostFolder from "@/components/PostFolder.vue";
import AuthorFolder from "@/components/AuthorFolder.vue";

import * as R from "../types/rama-types";
import * as D from "../types/diary-types";
import { watch, computed, onMounted, ref, reactive, Ref } from "vue";
import { useStore } from "../store/store";
import { GetterTypes } from "@/store/getter-types";
import { sigShip } from "@/helpers";
import { ActionTypes } from "@/store/action-types";

import urbitAPI from "@/api/urbitAPI";
import * as ramaAPI from "@/api/ramaAPI";

interface Props {
  foundationName: string;
  host: R.Host;
}
const props = defineProps<Props>();
const store = useStore();
const posts: D.PostList = ref([]);

const postsWithIDs = computed<Array<D.PostWithID>>(() => {
  const ids = Object.keys(posts.value);
  return ids.map((id: string) => {
    const post = posts.value[id];
    post.id = id;
    return post;
  });
});

const enter = () => {
  console.log("entering ", props.host, props.foundationName);
  ramaAPI.joinFoundation({
    who: props.host,
    fond: props.foundationName,
  });
};
const leave = () => {
  console.log("leaving ", props.host, props.foundationName);
  ramaAPI.leaveFoundation({
    who: props.host,
    fond: props.foundationName,
  });
};

const theFoundation = ref<R.SubFoundation | null>(null);
const setFoundation = () => {
  theFoundation.value = store.getters[
    GetterTypes.HOSTED_FOUNDATION_BY_PROVIDER
  ](`${props.host}/${props.foundationName}`);
};

// const theFoundation = computed<R.SubFoundation | null>(() => {
//   return store.getters[GetterTypes.HOSTED_FOUNDATION_BY_PROVIDER](`${ props.host }/${ props.foundationName }`)
// })

const amJanitor = computed(() => {
  if (!theFoundation || !theFoundation.value) {
    return false;
  }
  return theFoundation.value.details.janitors.includes(sigShip(window.ship));
});
const amAlmoner = computed(() => {
  if (!theFoundation || !theFoundation.value) {
    return false;
  }
  return theFoundation.value.details.almoners.includes(sigShip(window.ship));
});

watch(theFoundation, (newVal) => {
  console.log("watch f ", newVal);
});

onMounted(async () => {
  // TODO: only if we don't have this yet?
  await store.dispatch(ActionTypes.RAMA_SCRY_STATE);
  setFoundation();

  // if (!theFoundation || !theFoundation.value.subscribed) {
  //   console.log('not entered')
  //   return
  // }
  // // TODO: move to diaryAPI
  // urbitAPI.scry({
  //   app: 'diary',
  //   // path: `/diary/${ theHost.host }/${ theHost.foundation.name }-paedia/notes/newest/10/outline`
  //   path: `/diary/${ props.host }/${ props.foundationName }/notes/newest/10/outline`
  // }).then((r) => {
  //   posts.value = r
  // })
});
</script>
