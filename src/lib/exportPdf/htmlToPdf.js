import html2Canvas from 'html2canvas'
import JsPDF from 'jspdf'
export default{
  install (Vue, options) {
    Vue.prototype.getPdf = function (pdfDom, pdfName, flag) {
      // pdfDom: 要导出的内容
      // pdfName: 导出的文件名
      // flag: true表示导出图片，false表示导出pdf
      var title = pdfName
      var isImg = flag
      html2Canvas(pdfDom, {
        allowTaint: true
      }).then(function (canvas) {
        if (isImg) {
          let images = canvas.toDataURL('image/jpeg')
          let $a = document.createElement('a')
          $a.setAttribute('href', images)
          $a.setAttribute('download', pdfName)
          $a.click()
        } else {
          let contentWidth = canvas.width
          let contentHeight = canvas.height
          let pageHeight = contentWidth / 592.28 * 841.89
          let leftHeight = contentHeight
          let position = 0
          let imgWidth = 595.28
          let imgHeight = 592.28 / contentWidth * contentHeight
          let pageData = canvas.toDataURL('image/jpeg', 1.0)
          let PDF = new JsPDF('', 'pt', 'a4')
          if (leftHeight < pageHeight) {
            PDF.addImage(pageData, 'JPEG', 0, 0, imgWidth, imgHeight)
          } else {
            while (leftHeight > 0) {
              PDF.addImage(pageData, 'JPEG', 0, position, imgWidth, imgHeight)
              leftHeight -= pageHeight
              position -= 841.89
              if (leftHeight > 0) {
                PDF.addPage()
              }
            }
          }
          PDF.save(title + '.pdf')
        }
      }
      )
    }
    Vue.prototype.exportPdf = function (pdfDom, pdfName, flag) {
      // pdfDom: 要导出的内容
      // pdfName: 导出的文件名
      var title = pdfName
      var isImg = flag
      // 解决下拉框箭头图标导出时位置异常的问题
      let suffixArr = pdfDom.getElementsByClassName('el-input__suffix')
      for (let i = 0; i < suffixArr.length; i++) {
        suffixArr[i].style.visibility = 'hidden'
      }
      html2Canvas(pdfDom, {
        useCORS: true,
        allowTaint: false
      }).then(function (canvas) {
        sessionStorage.setItem('getCanvas', '1')
        for (var j = 0; j < suffixArr.length; j++) {
          suffixArr[j].style.visibility = 'visible'
        }
        if (isImg) {
          let images = canvas.toDataURL('image/jpeg')
          let $a = document.createElement('a')
          $a.setAttribute('href', images)
          $a.setAttribute('download', pdfName)
          $a.click()
        } else {
          let orientation = 'p' // 纸张方向：p表示纵向portrait（默认），l表示横向landscape
          if (window.config.export.pdfDirection) {
            orientation = 'l'
          } else {
            orientation = 'p'
          }
          let padding = 10 // 页边距
          var pdf = new JsPDF(orientation, 'mm', 'a4') // A4纸，纵向
          var ctx = canvas.getContext('2d')
          var a4w = 0
          var a4h = 0
          if (orientation === 'l') {
            // 横向A4大小，297mm x 210mm，四边各保留padding的边距，显示区域(297-padding*2)x(210-padding*2)
            a4w = 297 - padding * 2
            a4h = 210 - padding * 2
          } else if (orientation === 'p') {
            // 纵向A4大小，210mm x 297mm，四边各保留padding的边距，显示区域(210-padding*2)x(297-padding*2)
            a4w = 210 - padding * 2
            a4h = 297 - padding * 2
          }
          // 按A4显示比例换算一页图像的像素高度
          var imgHeight = Math.floor(a4h * canvas.width / a4w)
          var renderedHeight = 0
          while (renderedHeight < canvas.height) {
            var page = document.createElement('canvas')
            page.width = canvas.width
            page.height = Math.min(imgHeight, canvas.height - renderedHeight) // 可能内容不足一页
            // 用getImageData剪裁指定区域，并画到前面创建的canvas对象中
            page.getContext('2d').putImageData(ctx.getImageData(0, renderedHeight, canvas.width, Math.min(imgHeight, canvas.height - renderedHeight)), 0, 0)
            // 添加图像到页面，保留padding边距
            pdf.addImage(page.toDataURL('image/jpeg', 1.0), 'JPEG', padding, padding, a4w, Math.min(a4h, a4w * page.height / page.width))
            renderedHeight += imgHeight
            if (renderedHeight < canvas.height) {
              // 如果后面还有内容，添加一个空页
              pdf.addPage()
            }
            page.remove()
          }
          pdf.save(title + '.pdf')
        }
      })
    }
  }
}
