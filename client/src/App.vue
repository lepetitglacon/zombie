
<template>

	<ChatEngine ref="chatEngineRef"/>

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
import {onMounted, ref, watch} from "vue";
import GameEngine from "@/game/GameEngine";
import ChatEngine from "@/components/ChatEngine/ChatEngine.vue";

const canvas = ref()
const chatEngineRef = ref()
const playerPosition = ref()

onMounted(() => {
  GameEngine.setCanvas(canvas.value)
})

watch(GameEngine, () => {

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
