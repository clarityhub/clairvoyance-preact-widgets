import {Howl} from 'howler';
import pingAiff from '../../../assets/sounds/ping.aiff';
import pingMp3 from '../../../assets/sounds/ping.mp3';
import pingOgg from '../../../assets/sounds/ping.ogg';
import pingWav from '../../../assets/sounds/ping.wav';

const ping = new Howl({
  src: [
    pingAiff,
    pingMp3,
    pingOgg,
    pingWav,
  ],
});

export default {
  ping,
};
