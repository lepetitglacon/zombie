
<template>
  <p>TEST</p>
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

const canvas = ref()

onMounted(() => {
  const gameEngine = new GameEngine(canvas.value)
  gameEngine.init()
})
</script>

<style scoped>

</style>
