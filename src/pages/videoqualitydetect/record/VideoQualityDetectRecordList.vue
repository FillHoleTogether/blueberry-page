<template>
  <div class="main_content">
    <q-table
      :data="data"
      :columns="columns"
      row-key="field"
      hide-bottom
      style="height: 100%"
      virtual-scroll
      :pagination="pagination"
    >
      <template v-slot:top-left>
        <span>检测记录列表</span>
      </template>
      <template v-slot:top-right>
        <q-btn flat color="primary" label="" icon="refresh" @click="refreshClick"/>
      </template>
      <template v-slot:body-cell-operations="props">
        <q-td :props="props">
          <q-btn
            color="primary"
            size="xs"
            label="查看快照"
            style="margin-right: 5px"
            @click="onSnapshotClick(props.row)"
          />
        </q-td>
      </template>
    </q-table>
    <video-quality-detect-record-snapshot-viewer v-if="showSnapshotView" :record="currentRecord"
                                                 @close="onSnapshotViewClose"></video-quality-detect-record-snapshot-viewer>
  </div>
</template>

<script>

import VideoQualityDetectRecordSnapshotViewer
  from "pages/videoqualitydetect/record/VideoQualityDetectRecordSnapshotViewer";

export default {
  name: "VideoQualityDetectRecordList",
  components: {VideoQualityDetectRecordSnapshotViewer},
  data() {
    return {
      data: [],
      columns: [
        {name: 'index', field: 'index', label: '#', align: 'left'},
        {name: 'deviceId', field: 'deviceId', label: '设备ID', align: 'left'},
        {name: 'channelId', field: 'channelId', label: '通道ID', align: 'left'},
        {
          name: 'hasError',
          field: 'hasError',
          label: '检测是否成功',
          align: 'left',
          format: (val, row) => val === 0 ? '是' : '否'
        },
        {
          name: 'hasQualityError',
          field: 'hasQualityError',
          label: '是否质量异常',
          align: 'left',
          format: (val, row) => val === 1 ? '是' : '否'
        },
        {name: 'qualityError', field: 'qualityError', label: '质量异常', align: 'left', format: this.renderQualityError},
        // {name: 'createdAt', field: 'createdAt', label: '注册时间', align: 'left'},
        {name: 'createdAt', field: 'createdAt', label: '创建时间', align: 'left'},
        {name: 'operations', field: 'operations', label: '操作', align: 'left'}
      ],
      pagination: {
        rowsPerPage: 0
      },
      refreshInterval: null,
      currentRecord: null,
      showSnapshotView: false,

    }
  },
  mounted() {
    const app = this;
    app.queryList();
    if (app.refreshInterval) {
      clearInterval(app.refreshInterval);
    }
    app.refreshInterval = setInterval(() => app.queryList(), 10000);
  },
  destroyed() {
    const app = this;
    if (app.refreshInterval) {
      clearInterval(app.refreshInterval);
    }
  },
  methods: {
    queryList() {
      const app = this;
      app.$axios.get('/api/v1/video-quality-detect/arithmetic/record/list', {
        params: {}
      })
        .then(res => {
          if (res.data.success) {
            app.data = res.data.data;
            for (let i = 0; i < app.data.length; i++) {
              app.data[i].index = i + 1;
            }
          } else {
            app.$q.notify({
              type: 'warning',
              position: 'top',
              message: '检测记录列表加载失败: ' + res.data.message
            });
          }
        })
        .catch(e => {
          app.$q.notify({
            type: 'negative',
            position: 'top',
            message: '检测记录列表加载异常. ' + e
          });
        })
    },
    refreshClick() {
      this.queryList();
    },
    renderQualityError(val, row) {
      let res = '';
      switch (val) {
        case 'ERROR_NOISE':
          res = '噪声异常';
          break;
        case 'ERROR_STRIPE':
          res = '条纹异常';
          break;
        case 'ERROR_SHARPNESS':
          res = '清晰度异常';
          break;
        case 'ERROR_BRIGHTNESS_OVER_LIGHT':
          res = '亮度异常[过亮]';
          break;
        case 'ERROR_BRIGHTNESS_OVER_DARK':
          res = '亮度异常[过暗]';
          break;
        case 'ERROR_COLOR_CAST_OVER_BLUE':
          res = '偏色异常[蓝]';
          break;
        case 'ERROR_COLOR_CAST_OVER_RED':
          res = '偏色异常[红]';
          break;
        case 'ERROR_COLOR_CAST_OVER_GREEN':
          res = '偏色异常[绿]';
          break;
        case 'ERROR_COLOR_CAST_OVER_YELLOW':
          res = '偏色异常[黄]';
          break;
        default:
          break;
      }
      return res;
    },
    onSnapshotClick(data) {
      this.currentRecord = data;
      this.showSnapshotView = true;
    },
    onSnapshotViewClose() {
      this.showSnapshotView = false;
      this.currentRecord = null;
    }
  }
}
</script>

<style scoped>

</style>
