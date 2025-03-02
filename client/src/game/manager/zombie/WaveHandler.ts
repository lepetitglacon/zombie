import ZombieFactory from "@/game/entity/zombie/ZombieFactory";
import GameEngine from "@/game/GameEngine";

export default class WaveHandler {
    wave: number;
    waveStarted: boolean;
    private killedZombies: number;
    private spawnedZombies: number;
    private maxZombiesAlive: number;
    private zombieSpawnRate: number;
    private zombieSpawnRateTime: number;
    private pauseBetweenWaveTime: number;
    private pauseBetweenWaveStartTime: number;
    private baseNumberOfZombies: number;
    private maxZombiesForWave: () => (number | any);

    constructor() {
        this.wave = 0
        this.waveStarted = false

        this.killedZombies = 0
        this.spawnedZombies = 0
        this.maxZombiesAlive = 24
        this.baseNumberOfZombies = 6

        this.zombieSpawnRate = 5000
        this.zombieSpawnRateTime = Date.now();

        this.pauseBetweenWaveTime = 1000;
        this.pauseBetweenWaveStartTime = Date.now();

        this.maxZombiesForWave = () => {
            if (this.wave === 0) return 0
            return this.baseNumberOfZombies + this.wave * 2
        }

        GameEngine.eventManager.onZombieKillCall.add(e => this.killedZombies++)
    }

    update() {
        if (this.shouldGoToNextWave()) {
            this.goToNextWave()
        }
        if (!this.isPausedBetweenWave()) {
            if (!this.waveStarted) {
                GameEngine.soundManager.play('wave_start')
                GameEngine.eventManager.onWaveStart.notifyObservers({})
                this.waveStarted = true
            }
            if (this.shouldSpawnZombie()) {
                this.spawnZombie()
            }
        }
    }

    shouldGoToNextWave() {
        return this.killedZombies >= this.maxZombiesForWave()
            || this.wave === 0
    }

    goToNextWave() {
        this.wave++
        this.waveStarted = false

        this.killedZombies = 0
        this.spawnedZombies = 0

        this.pauseBetweenWaveStartTime = Date.now()

        if (this.wave !== 1) { GameEngine.soundManager.play('wave_end') }
        GameEngine.eventManager.onWaveEnd.notifyObservers({})
        console.debug('wave update')
    }

    isPausedBetweenWave() {
        return this.pauseBetweenWaveStartTime + this.pauseBetweenWaveTime > Date.now()
    }

    getRandomNumberBetween(min, max) {
        return Math.random() * (max - min) + min;
    }

    shouldSpawnZombie() {
        return this.zombieSpawnRateTime + this.zombieSpawnRate < Date.now()
            && GameEngine.zombieManager.zombies.size < this.maxZombiesAlive
            && this.spawnedZombies < this.maxZombiesForWave()
    }

    spawnZombie() {
        GameEngine.eventManager.onZombieSpawnCall.notifyObservers({})
        this.spawnedZombies++
        this.zombieSpawnRate = this.getRandomNumberBetween(500, 5000)
        this.zombieSpawnRateTime = Date.now()
    }
}