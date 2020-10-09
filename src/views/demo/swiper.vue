<template>
  <div class="swipers">
    <div class="first">
      <p>一.正常</p>
      <c-swiper :propOption='options.swipeBoxNormal' :listData='listData'></c-swiper>
      <hr>
      <p>二.响应式</p>
      <c-swiper :propOption='options.swipeBoxFit' :listData='listData'></c-swiper>
      <hr>
      <p>三.自动播放</p>
      <c-swiper :propOption='options.swipeBoxAuto' :listData='listData'></c-swiper>
      <hr>
      <p>四.分页器</p>
      <c-swiper :propOption='options.swipeBoxPage' :listData='listData'></c-swiper>
      <hr>
      <p>五.分页器颜色</p>
      <c-swiper :propOption='options.swipeBoxPageColor' :listData='listData'></c-swiper>
      <hr>
      <p>六.分页器样式</p>
      <c-swiper :propOption='options.swipeBoxPageType' :listData='listData'></c-swiper>
      <hr>
      <p>七.前进后退</p>
      <c-swiper :propOption='options.swipeBoxNavi' :listData='listData'></c-swiper>
      <hr>
      <p>八.前进后退外置</p>
      <c-swiper :propOption='options.swipeBoxNaviOut' :listData='listData'></c-swiper>
      <hr>
      <p>九.前进后退样式</p>
      <c-swiper :propOption='options.swipeBoxNaviOutExp' :listData='listData'></c-swiper>
      <hr>
      <p>十.环路</p>
      <c-swiper :propOption='options.swipeBoxLoop' :listData='listData'></c-swiper>
      <hr>
      <p>十一.lazy</p>
      <c-swiper :propOption='options.swipeBoxLazy' :listData='listData'></c-swiper>
      <hr>
      <p>十二.三栏显示</p>
      <c-swiper :propOption='options.swipeBoxPre' :listData='listData'></c-swiper>
      <hr>
      <p>十三.三栏分隔显示</p>
      <c-swiper :propOption='options.swipeBoxSpace' :listData='listData'></c-swiper>
      <hr>
      <p>十四.垂直滚动</p>
      <c-swiper :propOption='options.swipeBoxVertical' :listData='listData'></c-swiper>
      <hr>
      <p>十五.卡片化</p>
      <c-swiper :propOption='options.swipeBoxCard' :listData='listData'></c-swiper>
      <hr>
      <p>十八.可动态删除</p>
      <c-swiper :propOption='options.swipeBoxObserver' :listData='listData'></c-swiper>
      <button @click='observer'>删除第一个</button>
      <hr>
      <p>十九.文件</p>
      <c-swiper :propOption='options.swipeBoxMix' :listData='listDataMix'></c-swiper>
      <hr>
      <p>二十.加载更多</p>
      <c-swiper :propOption='options.swipeBoxMore' @last='loadmore' :listData='listDataMore'></c-swiper>
      <hr>
    </div>
  </div>
</template>
<script>
/* eslint-disable */
  import Swiper from '@/components/swipe'
  import img1 from '@/assets/swiper/1.png'
  import img2 from '@/assets/swiper/2.png'
  import img3 from '@/assets/swiper/3.png'
  import img4 from '@/assets/swiper/4.png'
  import img5 from '@/assets/swiper/5.png'
  export default {
    name: 'index',
    data () {
      return {
        options: {
          swipeBoxNormal: {
            propId: 'swipeBoxNormal',
            height: '300px',
            width: '900px'
          },
          swipeBoxFit: {
            propId: 'swipeBoxFit',
            height: '300px',
            width: '80%'
          },
          swipeBoxAuto: {
            propId: 'swipeBoxAuto',
            height: '300px',
            width: '900px',
            autoplay: true,
            delay: 1000
          },
          swipeBoxPage: {
            propId: 'swipeBoxPage',
            height: '300px',
            width: '900px',
            pagination: {
              type: 'bullets',
              dynamicBullets: false,
              clickable: true
            }
          },
          swipeBoxPageType: {
            propId: 'swipeBoxPageType',
            height: '300px',
            width: '900px',
            pagination: {
              type: 'fraction',
              dynamicBullets: false,
              clickable: true
            }
          },
          swipeBoxPageColor: {
            propId: 'swipeBoxPageColor',
            height: '300px',
            width: '900px',
            pagination: {
              type: 'bullets',
              dynamicBullets: false,
              clickable: true
            },
            bulletsColor: '#000'
          },
          swipeBoxNavi: {
            propId: 'swipeBoxNavi',
            height: '300px',
            width: '900px',
            navigate: {}
          },
          swipeBoxNaviOut: {
            propId: 'swipeBoxNaviOut',
            height: '300px',
            width: '900px',
            navigate: {
              position: 'outside',
              type: 'default'
            }
          },
          swipeBoxNaviOutExp: {
            propId: 'swipeBoxNaviOutExp',
            height: '300px',
            width: '900px',
            navigate: {
              position: 'outside',
              type: 'shadow'
            }
          },
          swipeBoxLoop: {
            propId: 'swipeBoxLoop',
            height: '300px',
            width: '900px',
            loop: true
          },
          swipeBoxLazy: {
            propId: 'swipeBoxLazy',
            height: '300px',
            width: '900px',
            lazy: true
          },
          swipeBoxPre: {
            propId: 'swipeBoxPre',
            height: '300px',
            width: '900px',
            slidesPerView: 3
          },
          swipeBoxSpace: {
            propId: 'swipeBoxSpace',
            height: '300px',
            width: '900px',
            slidesPerView: 3,
            spaceBetween: 20
          },
          swipeBoxVertical: {
            propId: 'swipeBoxVertical',
            height: '300px',
            width: '900px',
            direction: 'vertical'
          },
          swipeBoxCard: {
            propId: 'swipeBoxCard',
            height: '300px',
            width: '900px',
            slidesPerView: 3,
            effect: 'coverflow'
          },
          swipeBoxObserver: {
            propId: 'swipeBoxObserver',
            height: '300px',
            width: '900px',
            observer: true
          },
          swipeBoxMix: {
            propId: 'swipeBoxMix',
            height: '300px',
            width: '900px',
            hasFile: true
          },
          swipeBoxMore: {
            propId: 'swipeBoxMore',
            height: '300px',
            width: '900px',
            pagination: {
              type: 'bullets',
              dynamicBullets: false,
              clickable: true
            }
          }
        },
        groupOptions: {
          swipeGroupArd: {
            option: {
              height: '600px',
              width: '700px',
              direction: 'vertical'
            },
            items: [
              {
                option: {
                  propId: 'swipeBoxLinkedArd',
                  height: '40%',
                  width: '100%'
                },
                listData: [
                  {
                    type: 'img',
                    src: img1
                  },
                  {
                    type: 'img',
                    src: img2
                  },
                  {
                    type: 'img',
                    src: img3
                  },
                  {
                    type: 'img',
                    src: img4
                  },
                  {
                    type: 'img',
                    src: img5
                  }
                ]
              },
              {
                option: {
                  propId: 'swipeBoxLinkArd',
                  height: '40%',
                  width: '100%'
                },
                listData: [
                  {
                    type: 'img',
                    src: img1
                  },
                  {
                    type: 'img',
                    src: img2
                  },
                  {
                    type: 'img',
                    src: img3
                  },
                  {
                    type: 'img',
                    src: img4
                  },
                  {
                    type: 'img',
                    src: img5
                  }
                ]
              }
            ]
          },
          swipeGroupHon: {
            option: {
              height: '280px',
              width: '900px',
              align: 'between'
            },
            items: [
              {
                option: {
                  propId: 'swipeBoxLinkedVer',
                  loop: true,
                  height: '100%',
                  width: '40%'
                },
                listData: [
                  {
                    type: 'img',
                    src: img1
                  },
                  {
                    type: 'img',
                    src: img2
                  },
                  {
                    type: 'img',
                    src: img3
                  },
                  {
                    type: 'img',
                    src: img4
                  },
                  {
                    type: 'img',
                    src: img5
                  }
                ]
              },
              {
                option: {
                  propId: 'swipeBoxLinkVer',
                  loop: true,
                  height: '100%',
                  width: '40%'
                },
                listData: [
                  {
                    type: 'img',
                    src: img1
                  },
                  {
                    type: 'img',
                    src: img2
                  },
                  {
                    type: 'img',
                    src: img3
                  },
                  {
                    type: 'img',
                    src: img4
                  },
                  {
                    type: 'img',
                    src: img5
                  }
                ]
              }
            ]
          }
        },
        listData: [
          {
            type: 'img',
            src: img1
          },
          {
            type: 'img',
            src: img2
          },
          {
            type: 'img',
            src: img3
          },
          {
            type: 'img',
            src: img4
          },
          {
            type: 'img',
            src: img5
          }
        ],
        listDataMix: [
          {
            type: 'img',
            src: img1
          },
          {
            type: 'video',
            src: 'http://www.w3school.com.cn/i/movie.ogg'
          },
          {
            type: 'pdf',
            src: '@/static/helloworld.pdf'
          },
          {
            type: 'txt',
            src: '@/static/swiper.txt'
          }
        ],
        listDataMore: [
          {
            type: 'img',
            src: img1
          },
          {
            type: 'img',
            src: img2
          },
          {
            type: 'img',
            src: img3
          },
          {
            type: 'img',
            src: img4
          },
          {
            type: 'img',
            src: img5
          }
        ]
      }
    },
    methods: {
      loadmore () {
        this.listDataMore = [...this.listDataMore, ...this.listData]
      },
      observer () {
        document.getElementById('swipeBoxObserver').getElementsByClassName('swiper-slide')[0].remove()
      }
    },
    components: {
      'c-swiper': Swiper,
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .swipers{
    width: 100%;
    height: 100%;
    overflow: auto;
    overflow-x: hidden;
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
  }
  .swipers .first{
    width:calc(100% - 30px);
    height:auto;
    padding:20px;
  }
  .swipers p{
    font-size: 20px;
    margin-bottom: 22px;
    font-weight: bold;
  }
  button {
    width: 200px;
    height: 40px;
    border: 0;
    background: lightblue;
    font-size: 20px;
    border-radius: 4px;
    margin: 10px auto;
  }
  .hello>div{
    margin: 0 auto;
  }
</style>
