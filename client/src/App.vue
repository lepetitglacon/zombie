
<template>

	<ChatEngine ref="chatEngineRef"/>

  <canvas
      ref="canvas"
      width="800"
      height="800"
  >
  </canvas>


<!--  <RouterView />-->
</template>

<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import {onMounted, ref} from "vue";
import GameEngine from "@/game/GameEngine";
import ChatEngine from "@/components/ChatEngine/ChatEngine.vue";

const canvas = ref()
const chatEngineRef = ref()

onMounted(() => {
  const gameEngine = new GameEngine({
	  canvas: canvas.value,
	  chatEngineRef: chatEngineRef,
  })
  gameEngine.init()
})
</script>

<style scoped>

</style>
