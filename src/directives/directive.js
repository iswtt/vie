import Vue from 'vue'

Vue.directive('drag', function (el, binding) {
  el.onmousedown = function (e) {
    let disX = e.clientX - el.offsetLeft
    let disY = e.clientY - el.offsetTop
    document.onmousemove = function (e) {
      var width = e.target.parentNode.offsetWidth - 2
      var height = e.target.parentNode.offsetHeight - 2
      if (el.offsetWidth > width) {
        var l = e.clientX - disX
      }
      if (el.offsetHeight > height) {
        var t = e.clientY - disY
      }
      if (l < 0 && l > -el.offsetWidth + width) {
        el.style.left = l + 'px'
      }
      if (t < 0 && t > -el.offsetHeight + height) {
        el.style.top = t + 'px'
      }
    }
    document.onmouseup = function (e) {
      document.onmousemove = null
      document.onmouseup = null
    }
  }
})

Vue.directive('focus', function (el, binding) {
  console.log(el)
})

// training系统新增的指令放到下面
