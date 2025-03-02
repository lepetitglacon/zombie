import GameEngine from "@/game/GameEngine";
import * as BABYLON from '@babylonjs/core'

// assets
import mainLobby from "@/assets/sound/lobby/mainlobby.mp3"
import waveStart from "@/assets/sound/wave/start.wav?url"
import waveEnd from "@/assets/sound/wave/end.wav?url"

export default class SoundManager {
    private sounds: Map<string, BABYLON.Sound>;

    constructor() {
        BABYLON.Engine.audioEngine.useCustomUnlockedButton = true;
        window.addEventListener(
            "click",
            () => {
                if (!BABYLON.Engine.audioEngine.unlocked) {
                    BABYLON.Engine.audioEngine.unlock();
                }
            },
            { once: true },
        );

        this.sounds = new Map()
        this.loadSounds()
    }

    async loadSounds() {
        // this.loadSound('weapon_pistol_shot', 'assets/sound/gunshot.wav')
        // this.loadSound('weapon_pistol_reload', 'assets/sound/gunreload.mp3')
        // this.loadSound('weapon_knife_slash', 'assets/sound/knife.wav')
        this.loadSound('wave_start', waveStart)
        this.loadSound('wave_end', waveEnd)
    }

    loadSound(name: string, path: string) {
        const sound = new BABYLON.Sound(
            name,
            path,
            GameEngine.world.scene,
            null,
            {
                // loop: true,
                // autoplay: true,
            }
        );
        this.sounds.set(name, sound)
        console.log(`[ASSETS][SOUND] sound ${name} loaded`)
    }

    play(name) {
        if (this.sounds.has(name)) {
            this.sounds.get(name).play()
        }
    }

    get(name) {
        if (this.sounds.has(name)) {
            return this.sounds.get(name)
        }
    }

    getPositional(name) {
        if (this.positionalSounds.has(name)) {
            return this.positionalSounds.get(name)
        }
    }

    // bind() {
    //     this.soundInput = document.getElementById('sound-input')
    //
    //     this.soundInput.value = 0.1
    //     this.soundInput.addEventListener('input', (e) => {
    //         for (const [name, sound] of this.sounds) {
    //             sound.setVolume(parseFloat(e.target.value))
    //         }
    //     })
    // }

}