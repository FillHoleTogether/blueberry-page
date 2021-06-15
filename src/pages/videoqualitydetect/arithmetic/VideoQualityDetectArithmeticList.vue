<template>
  <div class="main_content">
    <q-table
      :data="data"
      :columns="columns"
      row-key="field"
      hide-bottom
      :pagination="pagination"
    >
      <template v-slot:top-left>
        <span>算法列表</span>
      </template>
      <template v-slot:top-right>
        <q-btn
          color="primary"
          size="xs"
          label="新建"
          @click="addClick"
        />
        <q-btn flat color="primary" label="" icon="refresh" @click="refreshClick"/>
      </template>
      <template v-slot:body-cell-operations="props">
        <q-td :props="props">
          <q-btn
            color="secondary"
            size="xs"
            label="启用"
            v-if="props.row.enable === 0"
            @click="resumeClick(props.row)"
            style="margin-right: 5px"
          />
          <q-btn
            color="orange"
            size="xs"
            label="停用"
            v-if="props.row.enable === 1"
            @click="pauseClick(props.row)"
            style="margin-right: 5px"
          />
          <q-btn
            color="brown-5"
            size="xs"
            label="编辑"
            @click="editClick(props.row)"
            style="margin-right: 5px"
          />
          <q-btn
            color="red"
            size="xs"
            label="删除"
            @click="removeClick(props.row)"
            style="margin-right: 5px"
          />
        </q-td>
      </template>
    </q-table>
    <video-quality-detect-arithmetic-form v-if="showForm" :form-data="formData" @close="formClose" @success="formSuccess"></video-quality-detect-arithmetic-form>
    <video-quality-detect-arithmetic-remove-confirm v-if="showConfirm" :data="removeData" @close="removeClose"
                           @success="removeSuccess"></video-quality-detect-arithmetic-remove-confirm>
    <video-quality-detect-arithmetic-pause-confirm v-if="showPause" :data="pauseData" @close="pauseClose" @success="pauseSuccess"></video-quality-detect-arithmetic-pause-confirm>
    <video-quality-detect-arithmetic-resume-confirm v-if="showResume" :data="resumeData" @close="resumeClose" @success="resumeSuccess"></video-quality-detect-arithmetic-resume-confirm>
  </div>
</template>

<script>
import VideoQualityDetectArithmeticForm from "pages/videoqualitydetect/arithmetic/VideoQualityDetectArithmeticForm";
import VideoQualityDetectArithmeticRemoveConfirm
  from "pages/videoqualitydetect/arithmetic/VideoQualityDetectArithmeticRemoveConfirm";
import VideoQualityDetectArithmeticPauseConfirm
  from "pages/videoqualitydetect/arithmetic/VideoQualityDetectArithmeticPauseConfirm";
import VideoQualityDetectArithmeticResumeConfirm
  from "pages/videoqualitydetect/arithmetic/VideoQualityDetectArithmeticResumeConfirm";

export default {
  name: "VideoQualityDetectArithmeticList",
  components: {
    VideoQualityDetectArithmeticResumeConfirm,
    VideoQualityDetectArithmeticPauseConfirm,
    VideoQualityDetectArithmeticRemoveConfirm,
    VideoQualityDetectArithmeticForm},
  data() {
    return {
      data: [],
      columns: [
        {name: 'index', field: 'index', label: '#', align: 'left'},
        {name: 'code', field: 'code', label: '编码', align: 'left'},
        {name: 'name', field: 'name', label: '名称', align: 'left'},
        {name: 'priority', field: 'priority', label: '优先级', align: 'left'},
        {name: 'settings', field: 'settings', label: '参数设置', align: 'left'},
        {name: 'enable', field: 'enable', label: '启用状态', align: 'left', format: (val, row) => val === 1 ? '启用' : '停用'},
        {name: 'applyAll', field: 'applyAll', label: '应用设备', align: 'left', format: (val, row) => val === 1 ? '所有设备' : '指定设备'},
        {name: 'operations', field: 'operations', label: '操作', align: 'left'}
      ],
      pagination: {
        rowsPerPage: 0
      },
      refreshInterval: null,
      showForm: false,
      formData: null,
      showConfirm: false,
      removeData: null,
      showPause: false,
      pauseData: null,
      showResume: false,
      resumeData: null
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
      app.$axios.get('/api/v1/video-quality-detect/arithmetic/list', {
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
              message: '算法列表加载失败: ' + res.data.message
            });
          }
        })
        .catch(e => {
          app.$q.notify({
            type: 'negative',
            position: 'top',
            message: '算法列表加载异常. ' + e
          });
        })
    },
    refreshClick() {
      this.queryList();
    },
    addClick() {
      this.formData = null;
      this.showForm = true;
    },
    editClick(data) {
      this.formData = data;
      this.showForm = true;
    },
    formClose() {
      this.formData = null;
      this.showForm = false;
    },
    formSuccess() {
      this.formClose();
      this.queryList();
    },
    removeClose() {
      this.removeData = null;
      this.showConfirm = false;
    },
    removeClick(data) {
      this.removeData = data;
      this.showConfirm = true;
    },
    removeSuccess() {
      this.removeClose();
      this.queryList();
    },
    pauseClose() {
      this.pauseData = null;
      this.showPause = false;
    },
    pauseClick(data) {
      this.pauseData = data;
      this.showPause = true;
    },
    pauseSuccess() {
      this.pauseClose();
      this.queryList();
    },
    resumeClose() {
      this.resumeData = null;
      this.showResume = false;
    },
    resumeClick(data) {
      this.resumeData = data;
      this.showResume = true;
    },
    resumeSuccess() {
      this.resumeClose();
      this.queryList();
    }
  }
}
</script>

<style scoped>

</style>
