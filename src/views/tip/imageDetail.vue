<template>
  <div class='image-detail-bar'>
    <div class="image-detail-M">
      <div class="breadCrumb">
        <bread :breadcrumb="titleBread"></bread>
      </div>
      <div class="operation-group">
        <el-button v-if="printButton" data-id="print-btn" @click="handlePrint" type="primary" size="mini" >{{$t('vicenter.common.print')}}</el-button>
        <el-button v-if="exportButton" data-id="export-btn" @click="handleExport" type="primary" size="mini" >{{$t('vicenter.common.export', {msg: ''})}}</el-button>
        <el-button type="white" size="mini" @click='goBack' data-id="back-btn">{{$t('vicenter.common.back')}}</el-button>
      </div>
      <div class="info-group">
        <!-- 查看图像 -->
        <div class="panel panel-up">
          <panelTitle :panelTitleInit="panelTitle.queryTitle"></panelTitle>
           <div class="containerBox">
            <div class="dataBox">
              <div class="imgSelect">
                <detailList :formData="imgFrom.data" :isEdit="isEdit" :formRule="imgFrom.formRule"></detailList>
              </div>
              <div class="imgShow">
                <img v-if="imageData.imageSrc" :src="imageData.imageSrc">
                <img v-else :src="defaultImg">
              </div>
            </div>
          </div>
        </div>
        <!-- 图像详情 -->
        <div class="panel panel-down">
          <panelTitle :panelTitleInit="panelTitle.listTitle"></panelTitle>
          <div class="form-bar" v-bar>
            <detailList :formData="imageFormData" :isEdit="isEdit" :formRule="formRule"></detailList>
          </div>
        </div>
      </div>
    </div>
    <printTable ref="printTableRef" :printTable="printTable"></printTable>
  </div>
</template>

<script>
import ajax from '@/api/tip/Image-Manage.js'
import bread from '@/components/breadCrumb'
import ComForm from '@/components/form'
import panelTitle from '@/components/title'
import detailList from './common/detailList'
export default {
  name: 'imageDetails',
  data () {
    return {
      printButton: false,
      exportButton: false,
      printTable: {
        allColsNum: 6,
        title: this.$t('vicenter.tip.imageManagement.threatImageManagementDetail'),
        printer: sessionStorage.userName || '',
        imgUrl: '',
        infoData: [
          {
            type: 'title',
            colspan: 6,
            infoType: 'imageInfo',
            label: this.$t('vicenter.ImageLibrary.common.imageInfo')
          },
          {
            type: 'content',
            infoType: 'imageInfo',
            data: [
              {
                type: 'label',
                value: this.$t('vicenter.tip.imageManagement.imageName'),
                ruleProp: 'name'
              },
              {
                type: 'text',
                value: '',
                ruleProp: 'name'
              },
              {
                type: 'label',
                value: this.$t('vicenter.tip.imageManagement.imageType'),
                ruleProp: 'imageEnergyType'
              },
              {
                type: 'text',
                value: '',
                ruleProp: 'imageEnergyType'
              },
              {
                type: 'label',
                value: this.$t('vicenter.tip.imageManagement.imageCategory'),
                ruleProp: 'imageCategory'
              },
              {
                type: 'text',
                value: '',
                ruleProp: 'imageCategory'
              }
            ]
          },
          {
            type: 'content',
            infoType: 'imageInfo',
            data: [
              {
                type: 'label',
                value: this.$t('vicenter.tip.imageManagement.imageStatus'),
                ruleProp: 'status'
              },
              {
                type: 'text',
                value: '',
                ruleProp: 'status'
              },
              {
                type: 'label',
                value: this.$t('vicenter.tip.imageManagement.lastEditor'),
                ruleProp: 'lastEditor'
              },
              {
                type: 'text',
                value: '',
                ruleProp: 'lastEditor'
              },
              {
                type: 'label',
                value: this.$t('vicenter.tip.imageManagement.lastEditTime'),
                ruleProp: 'lastEditTime'
              },
              {
                type: 'text',
                value: '',
                ruleProp: 'lastEditTime'
              }
            ]
          },
          {
            type: 'content',
            infoType: 'imageInfo',
            data: [
              {
                type: 'label',
                value: this.$t('vicenter.tip.imageManagement.describe'),
                ruleProp: 'describe'
              },
              {
                type: 'text',
                value: '',
                ruleProp: 'describe'
              },
              {
                type: 'label',
                value: '',
                ruleProp: 'empty'
              },
              {
                type: 'text',
                value: '',
                ruleProp: 'empty'
              },
              {
                type: 'label',
                value: '',
                ruleProp: 'empty'
              },
              {
                type: 'text',
                value: '',
                ruleProp: 'empty'
              }
            ]
          }
        ]
      },
      defaultImg: require('@/assets/img/common/ViCenter.png'),
      id: '',
      isEdit: false,
      imageData: {
        imageSrc: ''
      },
      titleBread: { // 面包屑导航组件初始化
        font: '/', // 中间分隔字符，可以是文字，也可以是符号
        data: [
          {
            label: this.$t(this.$route.matched[0].meta.title),
            path: '/Tip/index' // 跳转路径
          },
          {
            label: this.$t(this.$route.name)
          }
        ]
      },
      panelTitle: {
        queryTitle: {
          title: this.$t('vicenter.tip.imageManagement.tipImage')
        },
        listTitle: {
          title: this.$t('vicenter.tip.imageManagement.imageProperties')
        }
      },
      imgFrom: {
        formRule: {
          refName: 'imgFrom',
          rule: {
          },
          model: {
            imgFrom: ''
          }
        },
        data: [
          {
            label: this.$t('vicenter.tip.imageManagement.imageSource'),
            type: 'text',
            value: '',
            ruleProp: 'imgFrom' // 图像名称
          }
        ]
      },
      imageFormData: [
        {
          label: this.$t('vicenter.tip.imageManagement.imageName'),
          type: 'text',
          value: '',
          ruleProp: 'name' // 图像名称
        },
        {
          label: this.$t('vicenter.tip.imageManagement.imageStatus'),
          type: 'text',
          value: '',
          ruleProp: 'status'
        },
        {
          label: this.$t('vicenter.tip.imageManagement.imageType'),
          type: 'text',
          value: '',
          ruleProp: 'imageEnergyType'
        },
        {
          label: this.$t('vicenter.tip.imageManagement.imageCategory'),
          type: 'text',
          value: '',
          ruleProp: 'imageCategory'
        },
        {
          label: this.$t('vicenter.tip.imageManagement.describe'),
          type: 'textarea',
          value: '',
          ruleProp: 'describe'
        },
        {
          label: this.$t('vicenter.tip.imageManagement.lastEditor'),
          type: 'text',
          value: '',
          ruleProp: 'lastEditor'
        },
        {
          label: this.$t('vicenter.tip.imageManagement.lastEditTime'),
          type: 'text',
          value: '',
          ruleProp: 'lastEditTime'
        }
      ],
      formRule: {
        refName: 'imageForm',
        rule: {},
        model: {}
      }
    }
  },
  created () {
    this.printButton = this.$getSystemConfig('printEnable')
    this.exportButton = this.$getSystemConfig('exportEnable')
    let {id} = JSON.parse(sessionStorage.details)
    this.id = id
  },
  mounted () {
    this.getDetailInfo()
  },
  methods: {
    handlePrint () {
      this.$refs.printTableRef.handlePrint()
    },
    handleExport () {
      this.$refs.printTableRef.handleExport()
    },
    getDetailInfo () {
      ajax.getImgDetail({id: this.id}).then(res => {
        if (res.data.flag) {
          let detailsData = res.data.result
          let {tipImagePath, source, tipPosition, picNo, originalFiles, path} = res.data.result
          if (tipImagePath !== '') {
            // 需要viprobe打开的文件
            this.imageData.imageSrc = tipImagePath
          }
          this.imgFrom.data[0].value = this.$options.filters['tipImgManageSource'](source)
          this.imageFormData.forEach(item => {
            item.value = detailsData[item.ruleProp]
            if (item.ruleProp === 'lastEditTime') {
              item.value = this.$options.filters['formatDate'](detailsData[item.ruleProp], this.$t('vicenter.common.formatDate'))
            } else if (item.ruleProp === 'imageEnergyType') {
              item.value = this.$options.filters['tipImgManageType'](detailsData[item.ruleProp])
            } else if (item.ruleProp === 'status') {
              item.value = this.$options.filters['tipImgManageStatus'](detailsData[item.ruleProp])
            } else if (item.ruleProp === 'imageCategory') {
              item.value = item.value ? this.$t('vicenter.DIC.T_TIP_IMAGE_CATEGORY.C_' + item.value) : ''
            }
          })
          // 打印信息处理
          this.printTable.imgUrl = this.imageData.imageSrc
          this.printTable.infoData.forEach(i => {
            if (i.type === 'content') {
              i.data.forEach(item => {
                this.imageFormData.forEach(e => {
                  if (item.type !== 'label' && item.ruleProp === e.ruleProp) {
                    item.value = e.value
                  }
                })
              })
            }
          })
        }
      }).catch(() => {})
    },
    goBack () {
      this.$router.push({ path: '/Tip/imageManagement' })
    }
  },
  components: {bread, panelTitle, detailList}
}
</script>

<style lang="scss">
@import'@/styles/index.scss';
.image-detail-bar {
  @extend .extend-bar;
  .image-detail-M {
    height: $all;
    padding:$margin;
    @include box-sizing;
    .operation-group {
        @include flex(row, flex-end, center);
        margin-bottom: $dis10;
    }
    .form-bar {
      width: $all;
      @media screen and (min-width: 1640px) {
        height: $all;
        overflow: hidden;
      }
    }
    .info-group {
      @include flex(column, flex-start, flex-start);
      height: calc(100% - 65px);
      .panel-up {
        width: $all;
        height: 40%;
        margin-bottom: 10px;
        border-radius: 4px;
        border: 1px solid #ddd;
        @include box-sizing;
        .containerBox {
          width: $all;
          height: calc(100% - 35px);
          @include flex(row, space-between, flex-start);
          .dataBox {
            width: $all;
            height: $all;
            @include flex(column, flex-start, flex-start);
            .imgSelect{
              width: $all
            }
            .imgShow {
              width: $all;
              height: calc(100% - 35px);
              position: relative;
              overflow: hidden;
              img {
                margin: 0 auto;
                height: $all;
              }
            }
          }
        }
      }
      .panel-down {
        width: $all;
        height: calc(60% - 10px);
        border-radius: 4px;
        border: 1px solid #ddd;
        @include box-sizing;
        .form-bar {
          height: calc(100% - 35px);
        }
      }
      #panelTitle {
        .panel-title {
          border-radius: 4px;
        }
      }
    }
    @media screen and (max-width: 1640px) {
      .info-group {
        @include flex(row, space-between, flex-start);
        .panel-up {
          width: 50%;
          height: $all;
        }
        .panel-down {
          width: calc(50% - 10px);
          height: $all;
        }
      }
    }
  }
}
</style>
