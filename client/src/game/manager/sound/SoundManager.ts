import GameEngine from "@/game/GameEngine";
import * as BABYLON from '@babylonjs/core'

// assets
import  "@/assets/sound/gunshot.wav?url"
import "../../client/assets/sound/gunreload.mp3"
import "../../client/assets/sound/knife.wav"
import "../../client/assets/sound/wave/start.wav"
import "../../client/assets/sound/wave/end.wav"

export default class SoundManager {
    private sounds: Map<string, BABYLON.Sound>;

    constructor() {
        this.sounds = new Map()
        this.loadSounds()
    }

    async loadSounds() {
        this.loadSound('weapon_pistol_shot', 'assets/sound/gunshot.wav')
        this.loadSound('weapon_pistol_reload', 'assets/sound/gunreload.mp3')
        this.loadSound('weapon_knife_slash', 'assets/sound/knife.wav')
        this.loadSound('wave_start', 'assets/sound/wave/start.wav')
        this.loadSound('wave_end', 'assets/sound/wave/end.wav')
    }

    loadSound(name: string, path: string) {
        const sound = new BABYLON.Sound(
            name,
            path,
            GameEngine.world.scene,
            null,
            {
                loop: true,
                autoplay: true,
            }
        );
        this.loader.load( SERVER_HOST + path, ( buffer ) => {
                sound.setBuffer( buffer );
                sound.setLoop( false );
                sound.setVolume( .5 );
            },
            () => {},
            (error) => {
                console.error(error)
            });
        this.sounds.set(name, sound)
        console.log(`[ASSETS][SOUND] sound ${name} loaded`)
    }

    play(name) {
        if (this.sounds.has(name)) {
            this.sounds.get(name).play()
            this.sounds.get(name).onEnded()
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