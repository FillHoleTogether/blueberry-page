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
            label="设备ID *"
            lazy-rules
            :readonly="formData !== null"
            :rules="[ val => val && val.length > 0 || '请输入设备ID']"
          />
          <q-select
            filled
            v-model="fromData_.type"
            :options="types"
            option-value="value"
            option-label="label"
            label="设备类型 *"
            emit-value
            map-options
            lazy-rules
            :rules="[val => val !== null && val !== '' || '请选择设备类型']"
          />
          <q-input
            filled
            v-model="fromData_.name"
            label="设备名称 *"
            lazy-rules
            :rules="[ val => val && val.length > 0 || '请输入设备名称']"
          />
          <q-input
            filled
            v-model="fromData_.remoteIp"
            label="remoteIp *"
            lazy-rules
            :rules="[ val => val && val.length > 0 || '请输入remoteIp']"
          />
          <q-input
            filled
            type="number"
            v-model="fromData_.remotePort"
            label="remotePort *"
            lazy-rules
            :rules="[ val => val !== null && val !== '' || '请输入remotePort']"
          />
          <q-input
            filled
            v-model="fromData_.manufacturer"
            label="生产商"
          />
          <q-input
            filled
            v-model="fromData_.model"
            label="型号"
          />
          <q-input
            filled
            v-model="fromData_.firmware"
            label="固件版本"
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
  name: "DeviceForm",
  data() {
    return {
      show: true,
      loading: false,
      types: [
        {label: 'RTSP', value: 'RTSP'}
      ],
      fromData_: null
    }
  },
  props: {
    formData: {
      type: Object
    }
  },
  computed: {
    title() {
      const formData = this.formData;
      return formData ? '编辑设备' : '新建设备';
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
      const url = this.formData ? '/api/v1/device/update' : '/api/v1/device/add';
      app.$axios.post(url, app.fromData_)
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
