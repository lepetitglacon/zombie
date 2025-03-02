import GameEngine from "@/game/GameEngine";
import * as BABYLON from '@babylonjs/core'

import zombieGltf from '@/assets/gltf/zombie/walking.glb?url'
import {AssetContainer, InstantiatedEntries} from "@babylonjs/core";

export default class ModelManager {
    models: Map<string, BABYLON.AssetContainer>;

    constructor() {
        this.models = new Map()
    }

    async init() {
        const container = await BABYLON.LoadAssetContainerAsync(zombieGltf, GameEngine.world.scene);
        // let rootNode = container.meshes[0]
        // console.log(rootNode)
        // rootNode.setParent(null)
        // rootNode.isVisible = false
        for (const mesh of container.meshes) {
            mesh.isVisible = false
            mesh.isPickable = false
        }
        this.models.set('zombie', container)

        this.getNewInstance('')

    }

    getNewInstance(name: string) {
        if (this.models.has(name)) {
            const container = this.models.get(name) as AssetContainer
            const instance = container?.instantiateModelsToScene()
            for (const node of instance?.rootNodes) {
                node.isVisible = true
                node.isPickable = true

                for (const mesh of node.getChildMeshes()) {
                    mesh.isVisible = true
                    mesh.isPickable = true
                }
            }
            for (const group of instance?.animationGroups) {
                group.play(true);
            }
            return instance
        }
    }
}