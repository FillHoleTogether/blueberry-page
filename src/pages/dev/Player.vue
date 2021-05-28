<template>
  <q-page class="flex flex-left">
    <div style="margin: 10px 10px 0 10px;width: 100%">
      <q-input v-model="mediaUrl" label="视频地址" stack-label dense style="width: 500px"/>
      <q-btn color="primary" label="加载" style="margin-top: 10px" @click="loadMedia"/>
    </div>
    <div>
      <video id="videoElement"></video>
    </div>
  </q-page>
</template>

<script>
import flvjs from 'flv.js'
export default {
  name: 'Player',
  data() {
    return {
      mediaUrl: '',
      flvPlayer: null
    }
  },
  methods: {
    loadMedia() {
      const app = this;
      if (flvjs.isSupported()) {
        const videoElement = document.getElementById('videoElement');
        if (app.flvPlayer) {
          app.flvPlayer.destroy();
          app.flvPlayer = null;
        }
        const flvPlayer = flvjs.createPlayer({
          type: 'flv',
          isLive: true,
          url: app.mediaUrl
        });
        flvPlayer.attachMediaElement(videoElement);
        flvPlayer.load();
        flvPlayer.play();
        app.flvPlayer = flvPlayer;
      }
    }
  }
}
</script>
