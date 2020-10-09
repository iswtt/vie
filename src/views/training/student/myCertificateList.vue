<template>
  <div class='myCertificateList-bar' v-bar>
    <div class="myCertificateList-M">
      <div class="breadCrumb">
        <bread :breadcrumb="titleBread"></bread>
      </div>
      <div class="infolist">
        <div class="panel">
          <panelTitle :panelTitleInit="panelTitle.listTitle"></panelTitle>
          <ul class="myCertificateList-ul" data-id="myCertificateList-ul">
            <li v-for="(tmp,index) in list" :key="index">
              <div class="myCertificateList-li-cont">
                <div class="myCertificateList-li-top">
                  <img :src="tmp.thumb" alt="">
                </div>
                <div class="myCertificateList-li-bottom">
                  <a @click="download(index)" data-id="download-a">{{$t('vicenter.training.common.download')}}</a>
                  <a @click="print(index)" data-id="print-a">{{$t('vicenter.training.common.print')}}</a>
                </div>
              </div>
            </li>
          </ul>
          <div v-show="list.length === 0" class="chartNoData">{{$t('vicenter.common.nodata')}}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import bread from '@/components/breadCrumb'
import panelTitle from '@/components/title'
import Dialog from '@/components/dialog'
import viProbe from '@/lib/viprobe/viProbeForTra.js'
import ajax from '@/api/training/student.js'
import printJS from 'print-js'
export default {
  name: 'demo',
  data () {
    const config = window.config
    return {
      titleBread: {},
      panelTitle: {},
      list: [],
      tempIndex: 0 // 解决查询条件和列表项重复的问题
    }
  },
  created () {
    this.tempIndex = 1
    this.setI18n()
  },
  mounted () {},
  activated () {
    if (this.tempIndex !== 1) {
      this.setI18n()
    }
  },
  methods: {
    setI18n () {
      // 面包屑导航
      this.titleBread = {
        data: [
          {
            label: this.$t(this.$route.matched[0].meta.title),
            // path: '/Training/student/index' // 跳转路径
            path: '/Training/index' // 跳转路径
          },
          {
            label: this.$t(this.$route.name)
          }
        ]
      }
      // 查询条件和列表title
      this.panelTitle = {
        queryTitle: {
          title: this.$t('vicenter.common.query')
        },
        listTitle: {
          title: this.$t('vicenter.common.list')
        }
      }
      this.query()
    },
    query () {
      let params = {}
      params.pcUserId = sessionStorage.getItem('userId')
      this.getList(params)
    },
    getList (params) {
      this.openLoading()
      ajax.getCertificateByUser(params).then((res) => {
        console.log(res)
        this.closeLoading()
        if (res.data.flag) {
          for (let tmp of res.data.result) {
            tmp.thumb = config.trainingUI.fileUrl + tmp.credFileOne
            if (tmp.credFileOne) {
              tmp.show = true
            } else {
              tmp.show = false
            }
          }
          this.list = res.data.result.filter(tmp => tmp.show)
        }
      })
    },
    // 下载
    download (i) {
      console.log(this.list[i])
      var url = config.trainingUI.baseUrl + `/api/downFile?fileName=${this.list[i].credFileTwo}&type=attachment`
      console.log(url)
      window.open(url)
    },
    // 打印
    print (i) {
      let imgUrl = config.trainingUI.fileUrl + this.list[i].credFileOne
      printJS(imgUrl, 'image')
    },
    // 打开loading
    openLoading () {
      this.$initLoading()
    },
    // 关闭loading
    closeLoading () {
      this.$initLoading().close()
    }
  },
  components: { bread, panelTitle, Dialog }
}
</script>

<style lang="scss">
@import'@/styles/index.scss';
.myCertificateList-bar {
  @extend .extend-bar;
  .myCertificateList-M {
    padding: $margin;
    @include box-sizing;
    .infolist {
      display: block !important;
      .panel {
        @extend .extend-panel;
        width: 100%;
      }
      .chartNoData {
        width: $all;
        height: calc(100% - 40px);
        @include flex(row, center, center);
        color: #909399;
        font-size: 14px;
      }
      .myCertificateList-ul{
        width: 99%;
        margin: 0 auto;
        padding-bottom: $margin;
        li{
          width: 33.3%;
          margin-top: $margin;
          float: left;
          .myCertificateList-li-cont{
            width: 90%;
            margin: 0 auto;
            box-shadow:0 0 10px #d2d2d2;
            .myCertificateList-li-top{
              padding: $dis10 0;
              img{
                width: 55%;
                margin: 0 auto;
              }
            }
            .myCertificateList-li-bottom{
              @include flex(row, space-around, center);
              background: #f2f2f2;
              height: 50px;
              line-height: 50px;
              a{
                color: #3697fd;
                cursor: pointer;
                text-decoration: none;
              }
            }
          }
        }
        &:after{
          display: block;
          content: "clear";
          clear: both;
          height: 0;
          overflow: hidden;
        }
      }
    }
  }

}
</style>
