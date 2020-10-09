<template>
<div v-if='data.length > 0' class="fileNames">
  <!-- <div class="delButton">
     <el-button type="primary" size="mini" @click='deleteFiles' data-id="delete-btn">{{$t('vicenter.common.delete')}}</el-button>
  </div> -->
  <div class="fileList">
    <ul>
      <li v-for="(e, index) in fileArr" :key="index">
        <span :data-id="'file' + index + '-span'">{{e.name}}</span>
      </li>
    </ul>
  </div>
</div>
</template>
<script>
export default {
  data () {
    return {
      fileArr: []
    }
  },
  mounted () {
  },
  methods: {
    deleteFiles () {
      this.$emit('deleteThen')
    }
  },
  watch: {
    'data': {
      handler (newValue, oldValue) {
        let arr = this.$props.data
        let source = this.$props.source
        if (arr.length > 0) {
          this.fileArr = []
          if (source === 'local') {
            this.fileArr = this.$props.data
          } else if (source === 'ins' || source === 'imageLibrary') {
            if (this.$props.isManualAdd) {
              this.fileArr = this.$props.data
            } else {
              arr.forEach(e => {
                if (e['high']) {
                  this.fileArr.push(e['high'])
                }
                if (e['low']) {
                  this.fileArr.push(e['low'])
                }
                if (e['hemd']) {
                  this.fileArr.push(e['hemd'])
                }
              })
            }
          }
        }
      },
      immediate: true,
      deep: true
    }
  },
  components: {},
  props: {
    'data': {
      type: Array,
      default: []
    },
    'source': {
      type: String,
      default: ''
    },
    'isManualAdd': {
      type: Boolean,
      default: false
    }
  }
}
</script>
<style lang="scss">
@import "@/styles/index.scss";
.fileNames{
  width: 50%;
}
</style>
