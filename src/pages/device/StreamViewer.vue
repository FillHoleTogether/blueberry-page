<template>
  <q-dialog v-model="show" persistent transition-show="scale" transition-hide="scale">
    <q-card>
      <q-card-section class="row items-center q-pb-none">
        <div class="text-h6">预览</div>
        <q-space/>
        <q-btn icon="close" flat round dense v-close-popup @click="close"/>
      </q-card-section>
      <q-card-section>
        <flv-player v-if="flvUrl" :flv-url="flvUrl"></flv-player>
        <q-inner-loading :showing="loading">
          <q-spinner-gears size="50px" color="primary"/>
        </q-inner-loading>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script>
import FlvPlayer from "components/FlvPlayer";

export default {
  name: "StreamViewer",
  components: {FlvPlayer},
  data() {
    return {
      show: true,
      loading: false,
      flvUrl: null
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
            app.flvUrl = res.data.data.flv;
          } else {
            app.loading = false;
            // todo 查询失败提示
          }
        })
        .catch(e => {
          // todo 查询失败提示
        })
    },
    close() {
      this.flvUrl = null;
      this.$emit('close')
    }
  }
}
</script>

<style scoped>

</style>
