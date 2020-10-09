<template>
    <div stlye='counts'>
      <el-button @click="postfor" type="primary" :class="{default:sendMsgDisabled}" v-if="CountOptions.type == 'button'">
        <span v-if="sendMsgDisabled" style="cursor:default">{{CountOptions.time+CountOptions.text}}</span>
        <span v-if="!sendMsgDisabled">{{$t('vicenter.login.title')}}</span>
      </el-button>
      <el-tag v-if="CountOptions.type == 'text'">{{CountOptions.time+CountOptions.text}}</el-tag>
      <el-button @click.enter="postfor" type="primary" :class="{default:sendMsgDisabled}" v-if="CountOptions.type == 'submit'">
        <span v-if="sendMsgDisabled" style="cursor:default">{{$t('vicenter.login.title')}}</span>
        <span v-if="!sendMsgDisabled">{{$t('vicenter.login.title')}}</span>
      </el-button>
    </div>
</template>
<script>
export default {
  name: 'CountDown',
  data () {
    return {
      outThis: true, // 退出时销毁组件标志位
      sendMsgDisabled: false, // 按钮切换标志位
      startTime: this.$props.CountOptions.time, // 倒计时时间
      startFunc: this.$props.CountOptions.func // 倒计时开始函数
    }
  },
  mounted () {
    if (this.$props.CountOptions.type === 'text') { // 默认为文本参数,返回直接调用请求
      this.send()
    }
  },
  destroyed () {
    this.$data.outThis = false
  },
  methods: {
    send () {
      if (this.$data.sendMsgDisabled) {
        return false
      }
      let me = this
      me.$data.sendMsgDisabled = true
      me.$props.CountOptions.func = me.None
      let interval = window.setInterval(function () {
        if (me.$props.CountOptions.type === 'button' || me.$props.CountOptions.type === 'submit') {
          if (me.$props.CountOptions.time <= 1 || !me.$data.outThis) {
            me.$props.CountOptions.time = me.$data.startTime
            me.$props.CountOptions.func = me.$data.startFunc
            me.$data.sendMsgDisabled = false
            window.clearInterval(interval)
          } else {
            me.$props.CountOptions.time--
            me.$props.CountOptions.func = me.None
          }
        } else if (me.$props.CountOptions.type === 'text') {
          if (me.$props.CountOptions.time <= 0) {
            me.$props.CountOptions.time = me.$data.startTime
            me.sendMsgDisabled = false
            me.$props.CountOptions.func()
          } else {
            me.$props.CountOptions.time--
          }
          if (!me.$data.outThis) {
            me.$props.CountOptions.time = me.$data.startTime
            me.sendMsgDisabled = false
            window.clearInterval(interval)
          }
        }
      }, 1000)
    },
    postfor () {
      this.$props.CountOptions.func(this.send())
    },
    None () {
      return false
    }
  },
  props: ['CountOptions']
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
  .counts {
    width:100%;
  }
  .default{
    cursor: not-allowed;
  }
</style>
