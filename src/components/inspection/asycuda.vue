<template>
  <div class='asycuda'>
    <!-- <el-tabs type="border-card" v-model="activeName" @tab-click="tabClick">
      <el-tab-pane v-for="(item,key) in asycuda.paneTitle" :key="'dec' + key" :label="item.label" :name="item.key">
      </el-tab-pane>
      <div class="con-bar">
        <div style="overflow: hidden;">
          <p class="image-info-group group-list" v-for='(item,key) in asycuda.upList' :key='key'>
            <span class="list-title">{{item.label}}：</span>
            <span class="list-info">{{item.value}}</span>
          </p>
        </div>
        <div style="overflow: hidden;">
          <el-tabs type="border-card" v-model="tabActiveName" @tab-click="itemTabClick">
            <el-tab-pane v-for="(item, key) in asycuda.downList.panelTitle" :key="'item' + key" :label="item.label" :name="item.key">
            </el-tab-pane>
            <p class="image-info-group group-list" v-for='(item, key) in asycuda.downList.infoData' :key='key' style="overflow: hidden;">
              <span class="list-title">{{item.label}}：</span>
              <span class="list-info">{{item.value}}</span>
            </p>
          </el-tabs>
        </div>
      </div>
    </el-tabs> -->
  </div>
</template>
<script>
export default {
  name: 'asycuda',
  data () {
    return {
      activeName: 'dec0',
      tabActiveName: 'item0'
    }
  },
  props: ['asycuda'],
  methods: {
    tabClick () {
      this.$emit('currentDecNo', this.activeName)
    },
    itemTabClick () {
      this.$emit('currentDecItemNo', this.tabActiveName)
    }
  }
}
</script>
<style lang="scss">
  @import "@/styles/index.scss";
  .asycuda {
    height: 341px;
    width: 100%;
    .item-title {
      border-bottom:1px solid #dcdfe6;
      margin: $margin 0 10px;
      padding: $margin 0 $margin/2;
      font-size: 15px;
      font-weight: bold;
      text-align: left;
      margin-top: 0;
    }
    .list-info{
      height: 20px;
      margin-bottom: 10px;
    }
  }
</style>
