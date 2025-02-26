
<template>

	<ChatEngine ref="chatEngineRef"/>

  <div style="position: absolute; color: white">{{playerPosition}}</div>

	<div class="debug-pointer" ref="">{{ pointer }}</div>

  <canvas
      ref="canvas"
      class="canvas"
      width="800"
      height="800"
  >
  </canvas>

</template>

<script setup lang="ts">
import './assets/css/reset.css'

import { RouterLink, RouterView } from 'vue-router'
import {onMounted, ref} from "vue";
import GameEngine from "@/game/GameEngine";
import ChatEngine from "@/components/ChatEngine/ChatEngine.vue";

const canvas = ref()
const chatEngineRef = ref()
const playerPosition = ref()

onMounted(() => {
  const gameEngine = new GameEngine({
	  canvas: canvas.value,
	  chatEngineRef: chatEngineRef,
    playerPosition: playerPosition,
  })
  gameEngine.init()
})
</script>

<style scoped>
.canvas {
  width: 100vw;
  height: 100vh;
}
.debug-pointer {
	position: absolute;
	color: white;
}
</style>
