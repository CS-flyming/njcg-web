function addStyles(win, styles) {
  styles.forEach(style => {
    let link = win.document.createElement("link");
    link.setAttribute("rel", "stylesheet");
    link.setAttribute("type", "text/css");
    link.setAttribute("href", style);
    win.document.getElementsByTagName("head")[0].appendChild(link);
  });
}

const VueHtmlToPaper = {
  install(Vue, options) {
    Vue.mixin({
      methods: {
        $htmlToPaper(el, opts = options) {
          let { name, specs, replace, styles } = opts;
          specs = !!specs.length ? specs.join(",") : "";

          const element = document.getElementById(el);

          if (!element) {
            alert(`Element to print #${el} not found!`);
            return;
          }

          const url = "";
          const win = window.open(url, name, specs, replace);

          win.document.write(`
            <html>
              <head>
                <title>${document.title}</title>
                <style type="text/css">*{box-sizing: border-box;}#printMe{width:595px;margin:0 auto;color:#333;font-family:Calibri,Candara,Segoe,"Segoe UI",Optima,Arial,sans-serif;}.print-content{width:100%;position:relative;border:1px solid #888}.print-header{font-size:20px;font-weight:600;text-align:center;padding:5px 0}.print-base-info,.print-order-content,.print-order-info{font-size:12px;border-top:1px solid #888}.print-flex{display:-ms-flexbox;display:flex}.print-flex-item{-ms-flex:1;flex:1;min-height:20px;padding:2px}.print-border-left{border-left:1px solid #888}.print-float-right{float:right}.mg-rt-8{margin-right:8px}.flex-1{-ms-flex:0 0 10%;flex:0 0 10%;word-break: break-all;}.flex-3{-ms-flex:0 0 30%;flex:0 0 30%;word-break: break-all;}.flex-7{-ms-flex:0 0 70%;flex:0 0 70%;word-break: break-all;}
</style>   
              </head>
              <body>
                <div id="printMe">
                ${element.innerHTML}
                </div>
              </body>
            </html>
          `);

          addStyles(win, styles);
          setTimeout(() => {
            win.document.close();
            win.focus();
            win.print();
            win.close();
          }, 1000);
          return true;
        }
      }
    });
  }
};

export default VueHtmlToPaper;
