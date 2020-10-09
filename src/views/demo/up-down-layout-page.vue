<template>
  <div>
<div class="material-scroll" ref="material-scroll">
<div class="material-left" id="material-scroll">
<div class="material-box" v-for="(item,index) in materialList" :key="index" @click="materialKeyEdit(index)" :class="{'blue':index==materialKey}">
<div v-if="item.match(/((http|https):\/\/)/ig) && item.match(/((.jpg|.png|.gif))/ig)"><img style="max-width:100%;max-height:100%" class="" :src="item" alt=""> </div>
<div v-else-if="item.match(/((http|https):\/\/)/ig) && item.match(/((.mp4|.rmvb|.rm|.3gp|.mov|.avi))/ig)"><video style="max-width:100%;max-height:100%" :src="item" alt=""></video> </div>
<div style="width:80%" v-else>{{item}}</div>
</div>
</div>
</div>
<div class="material-right" style="" v-for="(item,index) in materialList" :key="index" v-show="index==materialKey">
<div class="arrow-left" @click="materialKeyAdd(-1)"><i class="el-icon-arrow-up"></i></div>
<div v-if="item.match(/((http|https):\/\/)/ig) && item.match(/((.jpg|.png|.gif))/ig)"><img class="" :src="item" alt="" style="max-height:45vh"> </div>
<div v-else-if="item.match(/((http|https):\/\/)/ig) && item.match(/((.mp4|.rmvb|.rm|.3gp|.mov|.avi))/ig)"><video style="max-height:45vh" :src="item" alt="" controls="controls"></video> </div>
<div v-else>{{item}}</div>
<div class="arrow-right" @click="materialKeyAdd(1)"><i class="el-icon-arrow-down"></i></div>
<p style="text-align:center">{{index+1}} / {{materialList.length}}</p>
</div>
  </div>
</template>
<script>
/* eslint-disable */
import img1 from '@/assets/swiper/1.png'
import img2 from '@/assets/swiper/2.png'
import img3 from '@/assets/swiper/3.png'
import img4 from '@/assets/swiper/4.png'
import img5 from '@/assets/swiper/5.png'
export default {
  props: {
    height: {
      default: 40,
      type: Number
    },
    lineNum: {
      default: 2,
      type: Number
    }
  },
  data: function () {
    return {
      contentArr: ['内容1', '内容2', '内容3', '内容4', '内容5', '内容6', '内容7'],
      num: 0,
      materialList: [
        img1, img2
      ]
    }
  },
  computed: {
    transform: function () {
      return 'translateY(-' + this.num * this.height + 'px)'
    }
  },
  created: function () {
    let _this = this
    setInterval(function () {
      if (_this.num !== _this.contentArr.length) {
        _this.num++
      } else {
        _this.num = 0
      }
    }, 3000)
  },
  methods: {
    openMaterial(list, item, index) {
      this.materialList = list;
      this.showMaterial = true;
      this.materialKey = index;
      setTimeout(()=> { //初始化滚动高度，带定时器获取元素
      let box = this.$refs['material-scroll']
      box.scrollTop = 0
      }, 50 )
    },
    materialKeyEdit(num) {
      this.materialKey = num
    },
    materialKeyAdd(num){ //上下键函数
      let box = this.$refs['material-scroll']
      // console.log(this.$refs['material-scroll'])
      console.log(window.getComputedStyle(box).height)
      let px = window.getComputedStyle(box).height  //可视范围的高度
      let height = Number(px.substring(0,px.length-2)) //截取字符串，移除px
      console.log(height)
      let number = Math.round(height/150) //一个图片75px,获取高度一半需要多少图片，让其居中
      console.log(number)
      // box.scrollTop = 500
      if(this.materialList.length>1){
        if (
          (this.materialKey == 0 && num > 0) ||
          (this.materialKey == this.materialList.length - 1 && this.materialList.length - 1>0 && num < 0) ||
          (this.materialKey > 0 &&
            this.materialKey < this.materialList.length - 1)
        ) {
          this.materialKey += num;
          if(this.materialKey<number || this.materialKey+(number +1) > this.materialList.length){  //开始或结尾不滚动
            if(this.materialKey<number){
              box.scrollTop = 0
            }
            if(this.materialKey+(number +1) > this.materialList.length){
              box.scrollTop = (this.materialList.length)*75
            }
            
          } else {
              box.scrollTop += 75*num  //一次滚动一个图片的高度
          }
        }
      }
    },
  }
}
</script>
 
<style lang="scss">
  .material-row {
  display: inline-block;
  width: 55px;
  max-height: 60px;
//   float: left;
  margin-left: 3px;
  cursor: pointer;
//   vertical-align: center;
}
 
 
.material-scroll{ //滚动div
  display:flex;
  height:70vh;
  justify-content: center;
  align-items: center;float: left;
  width: 25%;
  overflow-y: auto;
  // background: #ddd;
}
 
.material-left{
   width: 80%;
   max-height: 70vh;
  //  overflow-y: auto;
  //  display:flex;
  //  justify-content: center;
  //  align-items: center;
    
  //  float: left;
  //  max-height: 300px;
  .material-box{
    margin-bottom: 5px;
     
    >div{
      cursor: pointer;
      display: flex;
      justify-content: center;
      align-items: center;  
      height: 70px;
      width:95%;
      border: 1px solid #ddd;
      background: #fff;
      overflow: hidden;
    }
  }
  .material-box:hover{
    border: 2px solid blue;
  }
  .blue{
    border: 2px solid blue;
  }
}
.material-right{
  height:70vh;
  text-align:center;
  margin-left: 26%;
  position: relative;
  margin-right:10px;
  /* display: flex;
  justify-content: center;
  align-items: center;   */
 
  >div{
    height: 66vh;
    display: flex;
    justify-content: center;
    align-items: center;
  }
   
    .arrow-left {
      position: absolute;
      top: -0%;
      left: 2%;
      cursor: pointer;
      /* background: #dcdfe6; */
      width:95%;
      height: 6vh;
      font-size: 50px;
      font-weight: bold;
    }
    .arrow-right {
      position: absolute;
      bottom: 5%;
      left: 2%;
      cursor: pointer;
      /* background: #dcdfe6; */
      width:95%;
      height: 6vh;
      font-size: 50px;
      font-weight: bold;
    }
    .arrow-left:hover{
      background: #dcdfe6;
      opacity: 0.5;
      color: #fff;
    }
    .arrow-right:hover{
      background: #dcdfe6;
      opacity: 0.5;
      color: #fff;
    }
}
</style>