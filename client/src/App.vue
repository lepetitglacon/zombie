
<template>
  <p>TEST</p>
  <canvas
      ref="canvas"
      width="800"
      height="800"
  >
  </canvas>


  <RouterView />
</template>

<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import * as BABYLON from '@babylonjs/core'
import * as Colyseus from "colyseus.js";
import {onMounted, ref} from "vue";

const canvas = ref(null)

onMounted(() => {

  const client = new Colyseus.Client("ws://localhost:2567");
  client
      .joinOrCreate("my_room")
      .then(function (room) {
        console.log("Connected to roomId: " + room.roomId);
      })
      .catch(function (error) {
        console.log("Couldn't connect.");
      });

  const engine = new BABYLON.Engine(canvas.value, true);
  const createScene = function () {
    const scene = new BABYLON.Scene(engine);
    const camera = new BABYLON.FreeCamera(
        "camera1",
        new BABYLON.Vector3(0, 5, -10),
        scene
    );
    camera.setTarget(BABYLON.Vector3.Zero());
    camera.attachControl(canvas, true);
    const light = new BABYLON.HemisphericLight(
        "light",
        new BABYLON.Vector3(0, 1, 0),
        scene
    );
    light.intensity = 0.7;
    const sphere = BABYLON.MeshBuilder.CreateSphere(
        "sphere",
        {diameter: 2, segments: 32},
        scene
    );
    sphere.position.y = 1;
    const ground = BABYLON.MeshBuilder.CreateGround(
        "ground",
        {width: 6, height: 6},
        scene
    );
    return scene;
  };
  const scene = createScene()
//
  engine.runRenderLoop(function () {
    scene.render();
  });
// Watch for browser/canvas resize events
  window.addEventListener("resize", function () {
    engine.resize();
  });
})


</script>

<style scoped>

</style>
