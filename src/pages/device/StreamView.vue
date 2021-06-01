<template>
  <q-dialog v-model="show" persistent transition-show="scale" transition-hide="scale">
    <q-card>
      <q-card-section class="row items-center q-pb-none">
        <div class="text-h6">预览</div>
        <q-space/>
        <q-btn icon="close" flat round dense v-close-popup @click="close"/>
      </q-card-section>
      <q-card-section>
        <video id="videoElement" controls="controls"
               style="width:100%;height:100%;object-fit: fill;margin:auto; left: 0; right: 0; bottom: 0; top: 0;"></video>
        <q-inner-loading :showing="loading">
          <q-spinner-gears size="50px" color="primary"/>
        </q-inner-loading>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script>
import flvjs from "flv.js";

export default {
  name: "StreamView",
  data() {
    return {
      show: true,
      loading: false,
      flvPlayer: null
    }
  },
  props: {
    deviceId: {
      type: String
    },
    channelId: {
      type: String
    }
  },
  mounted() {
    this.queryPlayUrl();
  },
  methods: {
    queryPlayUrl() {
      const app = this;
      app.loading = true;
      app.$axios.get('/api/v1/media/stream/play', {
        params: {
          deviceId: app.deviceId,
          channelId: app.channelId
        }
      })
        .then(res => {
          if (res.data.success) {
            app.loading = false;
            const flvUrl = res.data.data.flv;
            app.initPlayer(flvUrl);
          } else {
            app.loading = false;
            // todo 查询失败提示
          }
        })
        .catch(e => {
          // todo 查询失败提示
        })
    },
    initPlayer(flvUrl) {
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
          url: flvUrl
        });
        flvPlayer.attachMediaElement(videoElement);
        flvPlayer.load();
        flvPlayer.play();
        app.flvPlayer = flvPlayer;
      }
    },
    close() {
      if (this.flvPlayer) {
        this.flvPlayer.destroy();
      }
      this.$emit('close')
    }
  }
}
</script>

<style scoped>

</style>
