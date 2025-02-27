
<template>

	<ChatEngine ref="chatEngineRef"/>

  <div style="position: absolute; color: white">{{playerPosition}}</div>
	<div style="position:absolute; color: white">Nombre de zombar : {{ GameEngine.zombieManager?.crowd?.getAgents().length }}</div>
	<div style="position:absolute; top: 15px; color: white">Nombre de spawner : {{ GameEngine.zombieManager?.spawners.length }}</div>

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
  GameEngine.setCanvas(canvas.value)
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
