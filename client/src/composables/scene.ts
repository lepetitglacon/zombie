import {onMounted, ref} from "vue";
import * as BABYLON from '@babylonjs/core'

export default function useScene() {

    const scene = ref<BABYLON.Scene|null>(null)
    const engine = ref<BABYLON.Engine|null>(null)

    onMounted(() => {

    })

    return { scene, engine }
}