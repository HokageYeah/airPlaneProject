import { _decorator, AudioClip, AudioSource, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

interface IAudioMap {
    [name: string] : AudioClip
}

@ccclass('AudioManager')
export class AudioManager extends Component {

    // 建立宿主
    @property([AudioClip])
    public audioList: AudioClip[] = [];

    private _dict: IAudioMap = {};
    private _audioSource: AudioSource = null;

    start() {
        for (let i = 0; i < this.audioList.length; i++) {
            const element = this.audioList[i];
            this._dict[element.name] = element;
        }
        this._audioSource = this.getComponent(AudioSource);
    }

    public play(name: string) {
        const audioClip = this._dict[name];
        if(audioClip !== undefined) {
            this._audioSource.playOneShot(audioClip);
        }
    }

    update(deltaTime: number) {
        
    }
}


