<template>
  <div class='timeSteps'>
    <insTitle :title='title'></insTitle>
    <el-steps :active="stepCurrent" align-center data-id="timeSteps">
      <el-step v-for='(item,index) in steps' :key="index" :title="item.title">
        <template slot="description">
          <div class="timeBox">
            <!-- 只有一个时间的 -->
            <div v-if="item.dateTimeShow.length === 1">
              <span v-for="(e, ind) in item.dateTimeShow" :key="ind">
                <span class="date">{{e.date}}</span>
                <span class="time">{{e.time}}</span>
              </span>
            </div>
            <!-- 有时间范围的 -->
            <div v-if="item.dateTimeShow.length === 2">
              <!-- 同一天 -->
              <span v-if="item.dateTimeShow[0].isSameDay">
                <span class="date">{{item.dateTimeShow[0].date}}</span>
                <span class="time">{{item.dateTimeShow[0].time}}~{{item.dateTimeShow[1].time}}</span>
              </span>
              <!-- 不是同一天 -->
              <span v-else class="notSameDay">
                <span>
                  <i class="date">{{item.dateTimeShow[0].date}}</i>
                  <i class="time">{{item.dateTimeShow[0].time}}</i>
                </span>
                <span class="timelink">~</span>
                <span>
                  <i class="date">{{item.dateTimeShow[1].date}}</i>
                  <i class="time">{{item.dateTimeShow[1].time}}</i>
                </span>
              </span>
            </div>
          </div>
        </template>
      </el-step>
    </el-steps>
    <div class="noData" v-if="stepCurrent === 0">{{$t('vicenter.inspection.common.noData')}}</div>
  </div>
</template>
<script>
import insTitle from '@/components/inspection/title'
export default {
  data () {
    return {
      stepCurrent: 0
    }
  },
  props: {
    'title': {
      type: String,
      default: ''
    },
    'steps': {
      type: Array,
      default: () => []
    }
  },
  created () {
    if (this.$props.steps && this.$props.steps.length > 0) {
      let _time = ''
      this.$props.steps.forEach((e, index) => {
        if (e.time) {
          if (e.time.split('-').length === 1) {
            // 只有一个时间的
            _time = this.$options.filters['formatDate'](e.time)
            e.dateTimeShow = [
              {
                date: _time.split(' ')[0],
                time: _time.split(' ')[1]
              }
            ]
          } else if (e.time.split('-').length === 2) {
            // 有时间范围的
            e.dateTimeShow = []
            e.time.split('-').forEach(item => {
              _time = this.$options.filters['formatDate'](item)
              e.dateTimeShow.push({
                date: _time.split(' ')[0],
                time: _time.split(' ')[1],
                isSameDay: true
              })
            })
            if (e.dateTimeShow[0].date === e.dateTimeShow[1].date) {
              // 同一天
              e.dateTimeShow[0].isSameDay = true
              e.dateTimeShow[1].isSameDay = true
            } else {
              // 不同天
              e.dateTimeShow[0].isSameDay = false
              e.dateTimeShow[1].isSameDay = false
            }
          } else if (e.time.split('-').length === 0) {
            e.dateTimeShow = []
          }
        } else {
          e.dateTimeShow = []
        }
      })
    }
  },
  mounted () {
    if (this.$props.steps) {
      this.stepCurrent = this.$props.steps.length
    }
  },
  components: {insTitle}
}
</script>
<style lang="scss">
  @import "@/styles/index.scss";
  .timeSteps {
    width: $all;
      @include flex(row, flex-start, flex-start);
      flex-wrap: wrap;
      margin-bottom: 10px;
      text-align: center;
      .timeBox {
        .date {
          display: block;
          font-style: normal;
        }
        .time {
          display: block;
          font-style: normal;
        }
        .notSameDay {
          @include flex(row, center, center);
          .timelink {
            margin: 0 5px;
          }
        }
      }
      .el-steps--horizontal{
        width: $all
      }
      .noData {
        width: 100%;
      }
  }
</style>
