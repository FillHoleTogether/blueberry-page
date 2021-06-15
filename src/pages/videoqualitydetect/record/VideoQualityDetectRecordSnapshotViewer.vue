<template>
  <q-dialog v-model="show" persistent transition-show="scale" transition-hide="scale">
    <q-card style="min-width: 800px;">
      <q-card-section class="row items-center q-pb-none">
        <div class="text-h6">视频快照</div>
        <q-space/>
        <q-btn icon="close" flat round dense v-close-popup @click="close"/>
      </q-card-section>
      <q-card-section class="row items-center q-pb-none">
        <q-img
          :src="getImgUrl()"
          basic
          :ratio="4/3"
        >
        </q-img>
      </q-card-section>
      <q-card-section class="row items-center q-pb-none">
        <pre style="overflow-x: auto">{{JSON.stringify(JSON.parse(record.detail),null,2)}}</pre>
      </q-card-section>
      <q-card-section class="row items-center q-pb-none">
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script>

export default {
  name: "VideoQualityDetectRecordSnapshotViewer",
  components: {},
  data() {
    return {
      show: true,
    }
  },
  props: {
    record: {
      type: Object
    }
  },
  mounted() {
  },
  methods: {
    close() {
      this.$emit('close')
    },
    getImgUrl() {
      return this.$baseUrl + "/api/v1/video-quality-detect/arithmetic/record/snap?id=" + this.record.id + "&st=" + Date.parse(new Date());
    }
  }
}
</script>

<style scoped>

</style>
