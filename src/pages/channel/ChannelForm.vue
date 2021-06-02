<template>
  <q-dialog v-model="show" persistent transition-show="scale" transition-hide="scale">
    <q-card>
      <q-card-section class="row items-center q-pb-none">
        <div class="text-h6">{{ title }}</div>
        <q-space/>
        <q-btn icon="close" flat round dense v-close-popup @click="close"/>
      </q-card-section>
      <q-card-section>
        <q-form
          @submit="onSubmit"
          @reset="onReset"
          class="q-gutter-md"
          style="width: 500px"
        >
          <q-input
            filled
            v-model="fromData_.id"
            label="通道ID *"
            lazy-rules
            :readonly="formData !== null"
            :rules="[ val => val && val.length > 0 || '请输入通道ID']"
          />
          <q-input
            filled
            v-model="fromData_.name"
            label="通道名称 *"
            lazy-rules
            :rules="[ val => val && val.length > 0 || '请输入通道名称']"
          />
          <q-input
            filled
            v-model="fromData_.rtsp"
            label="rtsp *"
            v-if="deviceType === 'RTSP'"
            lazy-rules
            :rules="[ val => val && val.length > 0 || '请输入rtsp']"
          />
          <div style="text-align: right">
            <q-btn label="提交" type="submit" color="primary"/>
            <q-btn label="重置" type="reset" color="primary" flat class="q-ml-sm"/>
          </div>
        </q-form>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script>

export default {
  name: "ChannelForm",
  data() {
    return {
      show: true,
      fromData_: null
    }
  },
  props: {
    formData: {
      type: Object
    }
  },
  computed: {
    deviceId() {
      return this.$route.params.deviceId
    },
    deviceType() {
      return this.$route.params.deviceType
    },
    title() {
      const formData = this.formData;
      return formData ? '编辑通道' : '新建通道';
    }
  },
  created() {
    const formData = this.formData;
    this.fromData_ = formData ? {...formData} : {}
  },
  mounted() {
  },
  methods: {
    close() {
      this.$emit('close')
    },
    onSubmit() {
      const app = this;
      const url = this.formData ? '/api/v1/channel/update' : '/api/v1/channel/add';
      app.$axios.post(url, {
        ...app.fromData_,
        deviceId: app.deviceId
      })
        .then(res => {
          if (res.data.success) {
            app.$emit('success');
            // todo 成功提示
          } else {
            // todo 错误提示
          }
        })
        .catch(e => {
          // todo 错误提示
        })
    },
    onReset() {
      this.fromData_ = {}
    }
  }
}
</script>

<style scoped>

</style>
