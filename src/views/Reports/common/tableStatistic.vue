<template>
  <div class="table-statistic">
    <table v-if="showTable">
      <tr v-for="(item, index) in statisticData" :key="index" :data-id="item.model + '-tr'">
        <td>{{item.label}}</td>
        <td>{{item.value}}</td>
        <td>{{item.compareValue}}</td>
      </tr>
    </table>
    <div v-else class="noData">{{$t('vicenter.common.nodata')}}</div>
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
    this.statisticData = this.$props.tableStatisticData
  },
  mounted () {
  },
  methods: {
  },
  watch: {
    'tableStatisticData' (newVal, oldVal) {
      this.statisticData = this.$props.tableStatisticData
    }
  },
  components: {},
  props: {
    'tableStatisticData': {
      type: Array,
      default: []
    },
    'showTable': {
      type: Boolean,
      default: false
    }
  }
}
</script>
<style lang="scss">
@import "@/styles/index.scss";
.table-statistic {
  width: $all;
  padding: 15px;
  @include box-sizing();
  min-height: 300px;
  table {
    width: $all;
    border: 1px solid #ebeef5;
    tr {
      td {
        font-size: 14px;
        line-height: 42px;
        border: 1px solid #ebeef5;
        &:first-child {
          width: 33%;
          color: #2a2a2a;
          font-weight: bold;
          // background: #e7e7e7;
        }
      }
    }
  }
  .noData {
    line-height: 300px;
    text-align: center;
    color: #909399;
    font-size: 14px;
  }
}
</style>
