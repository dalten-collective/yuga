<template>
  <div>
    <h1 class="text-lg">{{ foundation.name }}</h1>

    <div>
      subscribed: {{ foundation.subscribed }}
      <button class="p-2 text-white bg-blue-300 border rounded-md" @click="enter">Subscribe</button>
      <button class="p-2 text-white bg-blue-300 border rounded-md" @click="leave">Leave</button>
      <pre>Am Janitor? {{ amJanitor }}</pre>
      <pre>Am Almoner? {{ amAlmoner }}</pre>
    </div>

    <div>
      <h3 class="text-lg">Posts:</h3>
      <ul>
        <h1>FOLDERS</h1>
        <li v-for="f in foundation.details.metadata.folders" :key="f.folder">
          <PostFolder :folder="f" :host="host" :foundation="foundation.name" />
        </li>
      </ul>
    </div>

    <div v-if="amAlmoner">
      <h3>TODO: Add post:</h3>
      <div>
        <CreateNote :host="host" :foundation="foundation.name" />
      </div>
    </div>

    <div v-if="false">
      <pre>{{ foundation }}</pre>
    </div>

  </div>
</template>

<script setup lang="ts">
import Post from "@/components/Post.vue"
import CreateNote from '@/components/CreateNote.vue'
import PostFolder from '@/components/PostFolder.vue'

import * as R from "../types/rama-types";
import * as D from "../types/diary-types";
import { computed, onMounted, ref, Ref } from "vue";
import { useStore } from "../store/store";
import { GetterTypes } from "@/store/getter-types";
import { sigShip } from '@/helpers'

import urbitAPI from "@/api/urbitAPI"
import * as ramaAPI from "@/api/ramaAPI"

interface Props {
  foundation: R.SubFoundation;
  host: R.Host;
}
const props = defineProps<Props>();
const store = useStore();
const posts: D.PostList = ref([])

const postsWithIDs = computed<Array<D.PostWithID>>(() => {
  const ids = Object.keys(posts.value)
  return ids.map((id: string) => {
    const post = posts.value[id]
    post.id = id
    return post
  })
})

// const theHost = computed(() =>
//   store.getters[GetterTypes.HOST_BY_HOST](props.host.host)
// );

const enter = () => {
  console.log('entering ', props.host, props.foundation.name)
  ramaAPI.joinFoundation({
    who: props.host,
    fond: props.foundation.name
  })
}
const leave = () => {
  console.log('leaving ', props.host, props.foundation.name)
  ramaAPI.leaveFoundation({
    who: props.host,
    fond: props.foundation.name
  })
}

const theFoundation = computed<R.SubFoundation | null>(() => {
  return store.getters[GetterTypes.HOSTED_FOUNDATION_BY_PROVIDER](`${ props.host }/${ props.foundation.name }`)
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

onMounted(() => {
  if (!props.foundation.subscribed) {
    console.log('not entered')
    return
  }
  // TODO: move to diaryAPI
  urbitAPI.scry({
    app: 'diary',
    // path: `/diary/${ theHost.host }/${ theHost.foundation.name }-paedia/notes/newest/10/outline`
    path: `/diary/${ props.host }/${ props.foundation.name }/notes/newest/10/outline`
  }).then((r) => {
    posts.value = r
  })

// The most likely thing to do here is to get the scry from diary of the resource in question of the most recent 10 posts in outline format to display, with a scry like this:
// 
// ```
// .^(* %gx /=diary=/diary/~zod/testing/notes/newest/10/outline/noun)
// ```
// 
// I'll have to ask Vinney how to do this in javascript again.
// 
// After that, you'll have all the metadata about folders, views, tags, and the IDs of those posts, which you can access with 
// 
// ```
// ^(* %gx /=diary=/diary/~zod/testing/notes/note/<id as 170.123.111.xxxx>/noun)
// ```
// 
// The user can then start browsing and viewing posts (which you can access with their full form using the second scry above, or you can call for more outlines using:
// 
// ```
// .^(* %gx /=diary=/diary/~zod/testing/notes/older/<170.111.xxx>/10/noun)
// ```
})

</script>
