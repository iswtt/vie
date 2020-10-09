<template>
  <div class="text-statistic">
    <div v-for="(item, index) in statisticData" :key="index" :style="{backgroundColor: item.bgColor, width: item.width}" class="color-block">
      <span class="iconfont" v-html="item.icon"></span>
      <ul :data-id="item.model + '-ul'">
        <li class="label-text">{{item.label}}</li>
        <li class="value-text">{{item.value}}</li>
      </ul>
    </div>
  </div>
</template>
<script>
export default {
  data () {
    return {
      statisticData: []
    }
  },
  created () {
    this.statisticData = this.$props.textStatisticData
  },
  mounted () {
  },
  methods: {
  },
  watch: {
    'textStatisticData' (newVal, oldVal) {
      this.statisticData = this.$props.textStatisticData
    }
  },
  components: {},
  props: {
    'textStatisticData': {
      type: Array,
      default: []
    }
  }
}
</script>
<style lang="scss">
@import "@/styles/index.scss";
.text-statistic {
  width: $all;
  height: 120px;
  @include flex(row, flex-start, center);
  .color-block {
    height: $all;
    @include box-sizing();
    border: 10px solid $white;
    border-radius: 16px;
    @include flex(row, flex-start, center);
    color: $white;
    .iconfont {
      font-size: 40px;
      margin-left: 15%;
      margin-right: 20px;
    }
    ul {
      li {
        text-align: left;
        font-size: 18px;
        &:last-child {
          margin-top: 5px;
          font-size: 22px;
          font-weight: bold;
        }
      }
    }
  }
}
</style>
