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
      methods: newPageFunction.methods,
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
        methods: templateScript.methods,
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
              parameterArr[i] = parameterValue.substring(1, parameterValue.length - 2);
            }

            if (parameterValue.charAt(0) === "'" && parameterValue.charAt(parameterValue.length - 1) === "'") {
              parameterArr[i] = parameterValue.substring(1, parameterValue.length - 2);
            } // console.log(parameterArr[i])

          }

          clickFor = clickFor.replace('(' + parameterList + ')', '');
        } // console.log(newPageFunction)
        // 如果有方法,则运行它


        if (newPageFunction.methods[clickFor]) {
          // 绑定window.ozzx对象
          // console.log(tempDom)
          newPageFunction.methods[clickFor].apply({
            $el: this,
            activePage: window.ozzx.activePage,
            domList: window.ozzx.domList,
            data: newPageFunction.data,
            methods: newPageFunction.methods
          }, parameterArr);
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
  "entry": "main",
  "title": "页面",
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
    "name": "swiper2.0",
    "src": "http://tools.people.com.cn/libs/swiper/2.0/idangerous.swiper.min.js"
  }],
  "styleList": [{
    "name": "swiper2.0",
    "src": "http://tools.people.com.cn/libs/swiper/2.0/idangerous.swiper.css"
  }],
  "pageList": [{
    "main": true,
    "isPage": true,
    "name": "main",
    "src": "./src/page/main.page",
    "temple": "<temple name=\"main\" src=\"./src/page/main.page\" isPage=\"true\"></temple>"
  }],
  "isOnePage": true
};
window.ozzx.script = {
  "main": {
    "data": {
      "nameList": {
        "rank1": {
          "name": "lis",
          "like": "orange"
        },
        "rank2": {
          "name": "kim",
          "like": "yellow"
        },
        "rank3": {
          "name": "tony",
          "like": "white"
        }
      }
    },
    "created": function created() {
      console.log('hellow word!');
    },
    "methods": {
      "showAlert": function showAlert(othersName, myName) {
        console.log('可以传递参数:', othersName, myName);
        console.log('方便的获取到可能会用到的信息!');
        console.log(this);
        this.$el.innerText = "Hellow ".concat(othersName, ", My name is ").concat(myName);
      }
    }
  }
};