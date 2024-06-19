import {ref, computed, onMounted} from 'vue'
import * as BABYLON from '@babylonjs/core'
import useScene from "@/composables/scene";

const {scene, engine} = useScene()

const isLocked = ref(false)
const canvas = ref<HTMLCanvasElement>()
const camera = ref()

export default function useInputs() {

    function requestPointerLock(e) {
        console.log(e)
        if (!isLocked.value) {
            canvas.value.requestPointerLock = canvas.value.requestPointerLock || canvas.value.msRequestPointerLock || canvas.value.mozRequestPointerLock || canvas.value.webkitRequestPointerLock;
            console.log(canvas.value.requestPointerLock)
            if (canvas.value.requestPointerLock) {
                canvas.value.requestPointerLock();
            }
        }
    }
    
    onMounted(() => {
        canvas.value.addEventListener('click', requestPointerLock)
        console.log(scene.value)

    })

    return { canvas, isLocked, requestPointerLock, camera }
}