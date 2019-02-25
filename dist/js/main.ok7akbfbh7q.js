"use strict";

// 对象合并方法
function assign(a, b) {
  var newObj = {};

  for (var key in a) {
    newObj[key] = a[key];
  }

  for (var key in b) {
    newObj[key] = b[key];
  }

  return newObj;
} // 运行页面所属的方法


function runPageFunction(pageName, entryDom) {
  // ozzx-name处理
  window.ozzx.domList = {};
  pgNameHandler(entryDom); // 判断页面是否有自己的方法

  var newPageFunction = window.ozzx.script[pageName];
  if (!newPageFunction) return; // console.log(newPageFunction)
  // 如果有created方法则执行

  if (newPageFunction.created) {
    // 注入运行环境
    newPageFunction.created.apply(assign(newPageFunction, {
      $el: entryDom,
      data: newPageFunction.data,
      activePage: window.ozzx.activePage,
      domList: window.ozzx.domList
    }));
  } // 判断页面是否有下属模板,如果有运行所有模板的初始化方法


  for (var key in newPageFunction.template) {
    var templateScript = newPageFunction.template[key];

    if (templateScript.created) {
      // 获取到当前配置页的DOM
      // 待修复,临时获取方式,这种方式获取到的dom不准确
      var domList = entryDom.getElementsByClassName('ox-' + key);

      if (domList.length !== 1) {
        console.error('我就说会有问题吧!');
        console.log(domList);
      } // 为模板注入运行环境


      templateScript.created.apply(assign(newPageFunction.template[key], {
        $el: domList[0].children[0],
        data: templateScript.data,
        activePage: window.ozzx.activePage,
        domList: window.ozzx.domList
      }));
    }
  }
} // ozzx-name处理


function pgNameHandler(dom) {
  // 遍历每一个DOM节点
  for (var i = 0; i < dom.children.length; i++) {
    var tempDom = dom.children[i]; // 判断是否存在@name属性

    var pgName = tempDom.attributes['@name'];

    if (pgName) {
      // console.log(pgName.textContent)
      // 隐藏元素
      tempDom.hide = function () {
        this.style.display = 'none';
      };

      window.ozzx.domList[pgName.textContent] = tempDom;
    } // 判断是否有点击事件


    var clickFunc = tempDom.attributes['@click'];

    if (clickFunc) {
      tempDom.onclick = function () {
        var clickFor = this.attributes['@click'].textContent; // 判断页面是否有自己的方法

        var newPageFunction = window.ozzx.script[window.ozzx.activePage]; // console.log(this.attributes)
        // 判断是否为模板

        var templateName = this.attributes['template']; // console.log(templateName)

        if (templateName) {
          newPageFunction = newPageFunction.template[templateName.textContent];
        } // console.log(newPageFunction)
        // 取出参数


        var parameterArr = [];
        var parameterList = clickFor.match(/[^\(\)]+(?=\))/g);

        if (parameterList && parameterList.length > 0) {
          // 参数列表
          parameterArr = parameterList[0].split(','); // 进一步处理参数

          for (var i = 0; i < parameterArr.length; i++) {
            var parameterValue = parameterArr[i].replace(/(^\s*)|(\s*$)/g, ""); // console.log(parameterValue)
            // 判断参数是否为一个字符串

            if (parameterValue.charAt(0) === '"' && parameterValue.charAt(parameterValue.length - 1) === '"') {
              parameterArr[i] = parameterValue.substring(1, parameterValue.length - 1);
            }

            if (parameterValue.charAt(0) === "'" && parameterValue.charAt(parameterValue.length - 1) === "'") {
              parameterArr[i] = parameterValue.substring(1, parameterValue.length - 1);
            }

            console.log(parameterArr[i]); // console.log(parameterArr[i])
          }

          clickFor = clickFor.replace('(' + parameterList + ')', '');
        } // console.log(newPageFunction)
        // 如果有方法,则运行它


        if (newPageFunction[clickFor]) {
          // 绑定window.ozzx对象
          // console.log(tempDom)
          newPageFunction[clickFor].apply(newPageFunction, parameterArr);
        }
      };
    } // 递归处理所有子Dom结点


    if (tempDom.children.length > 0) {
      pgNameHandler(tempDom);
    }
  }
} // 页面资源加载完毕事件


window.onload = function () {
  var page = globalConfig.entry;
  window.ozzx.activePage = page;
  var entryDom = document.getElementById('ox-' + page);

  if (entryDom) {
    runPageFunction(page, entryDom);
  } else {
    console.error('找不到页面入口!');
  }
};

window.ozzx = {
  script: {},
  tool: {}
};
var globalConfig = {
  "root": "/src",
  "entry": "card",
  "title": "学习有声",
  "outFolder": "./dist",
  "watcher": {
    "enable": true,
    "folder": "./src",
    "ignored": "./dist/*",
    "depth": 99
  },
  "outPut": {
    "minifyCss": false,
    "minifyJs": false,
    "choiceAnimation": false,
    "globalStyle": "./src/main.css",
    "globalScript": "./src/main.js",
    "outFileAddVersion": true
  },
  "serverPort": 8000,
  "server": true,
  "autoReload": true,
  "headList": [{
    "http-equiv": "content-type",
    "content": "text/html; charset=UTF-8"
  }, {
    "name": "viewport",
    "content": "initial-scale=1,user-scalable=no,maximum-scale=1"
  }],
  "scriptList": [{
    "name": "jquery-3.3.1",
    "src": "https://code.jquery.com/jquery-3.3.1.min.js"
  }, {
    "name": "modernizr",
    "src": "./src/modernizr.custom.js"
  }, {
    "name": "draggabilly",
    "src": "./src/draggabilly.pkgd.min.js"
  }, {
    "name": "elastiStack",
    "src": "./src/elastiStack.js"
  }],
  "styleList": [{
    "name": "component",
    "src": "./src/component.css"
  }, {
    "name": "normalize",
    "src": "./src/normalize.css"
  }],
  "pageList": [{
    "main": true,
    "isPage": true,
    "name": "card",
    "src": "./src/page/card.page",
    "temple": "<temple name=\"card\" src=\"./src/page/card.page\" isPage=\"true\"></temple>"
  }],
  "isOnePage": true
};
window.ozzx.script = {
  "card": {
    "data": {
      "audio": null,
      "control": null,
      "ElastiStack": null
    },
    "created": function created() {
      document.addEventListener('touchmove', function (e) {
        e.preventDefault();
      }, false); // 生成dom

      var dataBoxTemple = '';
      var isFirst = true;

      for (var key in dateList) {
        var element = dateList[key];

        if (isFirst) {
          this.changeCard(element);
          isFirst = false;
        }

        dataBoxTemple += "<div class=\"date-item\" @click=\"changeDete('".concat(key, "')\">").concat(key, "</div>");
      }

      document.getElementById('dataBox').innerHTML = dataBoxTemple; // 刷新dom节点

      pgNameHandler(document.getElementById('dataBox')); // this.calculation()
    },
    "changeCard": function changeCard(cardList) {
      // console.log(cardList)
      var domTemple = '';
      var ind = 0;

      for (var key in cardList) {
        var element = cardList[key];
        domTemple += "<li id=\"slideItem".concat(ind++, "\"><div class=\"content\">").concat(element.content, "</div>");

        if (element.music) {
          domTemple += "<audio src=\"".concat(element.music, "\" controls=\"controls\"></audio>");
        }

        if (element.share) {
          domTemple += "<div class=\"share-bar\"><div class=\"share-bar-item left\">\u70B9\u8D5E</div><div class=\"share-bar-item right\">\u5206\u4EAB</div></div>";
        }

        domTemple += "</li>";
      }

      document.getElementById('elasticstack').style.display = 'none';
      document.getElementById('elasticstack').innerHTML = domTemple;
      this.calculation();
    },
    "changeDete": function changeDete(dete) {
      // console.log(dateList, $.trim(dete))
      // console.log(`change dete to ${dete}`)
      this.changeCard(dateList[$.trim(dete)]);
    },
    "calculation": function calculation() {
      var _this = this;

      setTimeout(function () {
        new ElastiStack(document.getElementById('elasticstack'), {
          loop: false,
          distDragBack: 100,
          distDragMax: 200,
          onUpdateStack: function onUpdateStack(activeIndex) {
            // 停止当前播放的音乐
            if (_this.data.audio !== null) {
              _this.data.audio.pause();

              _this.data.audio.src = '';
            } // 停止上一个动画


            if (_this.data.control !== null) {
              _this.data.control.next = false;
            } // 查找文字区域


            var textBox = $("#slideItem".concat(activeIndex, " .content")); // 查找音频区域

            var audio = $("#slideItem".concat(activeIndex, " audio")); // console.log(textBox)
            // console.log(audio)

            if (audio.length > 0) {
              // 播放音乐
              _this.data.audio = audio[0];
              _this.data.audio.src = 'http://cunchu.site/resource/bgm.mp3';

              _this.data.audio.play();

              if (textBox.length > 0) {
                // 滚动条长度
                var scrollHeight = textBox[0].scrollHeight; // 超出长度

                var overflow = scrollHeight - textBox[0].clientHeight;

                _this.data.audio.ontimeupdate = function (e) {
                  textBox.scrollTop(_this.data.audio.currentTime / _this.data.audio.duration * overflow);
                };
              }
            }
          }
        });
        document.getElementById('elasticstack').style.display = 'block';
      }, 0);
    }
  }
};