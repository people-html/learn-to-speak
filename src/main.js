var dateList = [
  [
    {content: "<p>党的十八大以来，习近平总书记围绕社会主义政治建设、经济建设、文化建设、生态文明建设、全面深化改革等方面发表了系列重要论述，立意高远、内涵丰富、思想深刻。</p><p>为持续深入学习贯彻习近平新时代中国特色社会主义思想，全面贯彻落实党的十九大精神，新时代学习工作室精心为您从习近平总书记系列重要讲话中选取掷地有声、耳目一新、言近旨远的精彩话语制作系列“金句”摘编，以期通过宣传这些发</p>", img: "./images/1.jpg"},
    {content: '<p>党的十八大以来，习近平总书记围绕社会主义政治建设、经济建设、文化建设、生态文明建设、全面深化改革等方面发表了系列重要论述，立意高远、内涵丰富、思想深刻。</p><p>为持续深入学习贯彻习近平新时代中国特色社会主义思想，全面贯彻落实党的十九大精神，新时代学习工作室精心为您从习近平总书记系列重要讲话中选取掷地有声、耳目一新、言近旨远的精彩话语制作系列“金句”摘编，以期通过宣传这些发</p><p>为持续深入学习贯彻习近平新时代中国特色社会主义思想，全面贯彻落实党的十九大精神，新时代学习工作室精心为您从习近平总书记系列重要讲话中选取掷地有声、耳目一新、言近旨远的精彩话语制作系列“金句”摘编，以期通过宣传这些发</p><p>为持续深入学习贯彻习近平新时代中国特色社会主义思想，全面贯彻落实党的十九大精神，新时代学习工作室精心为您从习近平总书记系列重要讲话中选取掷地有声、耳目一新、言近旨远的精彩话语制作系列“金句”摘编，以期通过宣传这些发</p>', title: "习近平总书记系列重要讲话", music: "http://cunchu.site/resource/bgm.mp3"},
    {content: "<p>党的十八大以来，习近平总书记围绕社会主义政治建设、经济建设、文化建设、生态文明建设、全面深化改革等方面发表了系列重要论述，立意高远、内涵丰富、思想深刻。</p><p>为持续深入学习贯彻习近平新时代中国特色社会主义思想，全面贯彻落实党的十九大精神，新时代学习工作室精心为您从习近平总书记系列重要讲话中选取掷地有声、耳目一新、言近旨远的精彩话语制作系列“金句”摘编，以期通过宣传这些发</p><p>为持续深入学习贯彻习近平新时代中国特色社会主义思想，全面贯彻落实党的十九大精神，新时代学习工作室精心为您从习近平总书记系列重要讲话中选取掷地有声、耳目一新、言近旨远的精彩话语制作系列“金句”摘编，以期通过宣传这些发</p><p>为持续深入学习贯彻习近平新时代中国特色社会主义思想，全面贯彻落实党的十九大精神，新时代学习工作室精心为您从习近平总书记系列重要讲话中选取掷地有声、耳目一新、言近旨远的精彩话语制作系列“金句”摘编，以期通过宣传这些发</p>", title: "习近平总书记系列重要讲话"},
  ],
  [{content: "4"}, {content: "正文内容", title: "主标题"},  {content: "正文内容3", title: "主标题"}],
  [{content: "3", title: "dsdsddddd"},{content: "3"}, {content: "3", title: "dsdsddddd"},{content: "3"}, {content: "3", title: "dsdsddddd"},{content: "3"}, {content: "3", title: "dsdsddddd"}],
  [{content: "3", title: "dsdsddddd"},{content: "3"}, {content: "3", title: "dsdsddddd"},{content: "3"}, {content: "3", title: "dsdsddddd"},{content: "3"}, {content: "3", title: "dsdsddddd"}],
  [{content: "3", title: "dsdsddddd"},{content: "3"}, {content: "3", title: "dsdsddddd"},{content: "3"}, {content: "3", title: "dsdsddddd"},{content: "3"}, {content: "3", title: "dsdsddddd"}],
  [{content: "3", title: "dsdsddddd"},{content: "3"}, {content: "3", title: "dsdsddddd"},{content: "3"}, {content: "3", title: "dsdsddddd"},{content: "3"}, {content: "3", title: "dsdsddddd"}],
  [{content: "3", title: "dsdsddddd"},{content: "3"}, {content: "3", title: "dsdsddddd"},{content: "3"}, {content: "3", title: "dsdsddddd"},{content: "3"}, {content: "3", title: "dsdsddddd"}],
]

var dateName = [
  {
    stage: "7",
    name: "学习有声"
  },
  {
    stage: "2",
    name: "学习有声"
  },
  {
    stage: "322",
    name: "超长超长"
  },
  {
    stage: "31",
    name: "发到饭否"
  },
  {
    stage: "23",
    name: "vv信息擦"
  },
  {
    stage: "测",
    name: "斑斑驳驳"
  },
  {
    stage: "11111111",
    name: "斑斑驳驳"
  }
]

// 禁止微信上下拖动
document.body.addEventListener("touchmove",function(event) {
  if(!event.target.classList.contains('content')){ 
    event.preventDefault(); 
  } 
}, {passive: false})
