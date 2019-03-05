
var dateList = [
  [ {
 content: "<p><b>习近平总书记今年两会首场重要讲话原声来了！</b></p><p>【编者按】中共中央总书记、国家主席、中央军委主席习近平3月4日下午看望了参加全国政协十三届二次会议的文化艺术界、社会科学界委员，并参加联组会，听取意见和建议。文化文艺工作、哲学社会科学工作，属于“培根铸魂”的工作，习近平总书记对此高度重视。在这次联组会上，习近平提出了哪些要求？“学习有声”带您聆听现场。</p>",
 img: "/NMediaFile/2019/0305/MAIN201903051420104879200107509.jpg"
 },
 {
 content: '<p>中国特色社会主义进入了新时代。希望大家承担记录新时代、书写新时代、讴歌新时代的使命，勇于回答时代课题，从当代中国的伟大创造中发现创作的主题、捕捉创新的灵感，深刻反映我们这个时代的历史巨变，描绘我们这个时代的精神图谱，为时代画像、为时代立传、为时代明德。</p>',
 music: "http://flv4.people.com.cn/videofile6//pvmsvideo/2019/3/5/RenJiaHui_a2511becdec35dcc5efaffabcab9b0c0.mp3"
 },
 {
 content: '<p>希望大家立足中国现实，植根中国大地，把当代中国发展进步和当代中国人精彩生活表现好展示好，把中国精神、中国价值、中国力量阐释好。</p>',
 music: "http://flv4.people.com.cn/videofile6/pvmsvideo/2019/3/5/RenJiaHui_a12ef5d03444b5df5f5713e17370a43c.mp3"
 },
{
 content: '<p>文艺创作要以扎根本土、深植时代为基础，提高作品的精神高度、文化内涵、艺术价值。哲学社会科学研究要立足中国特色社会主义伟大实践，提出具有自主性、独创性的理论观点。</p>',
 music: "http://flv4.people.com.cn/videofile6/pvmsvideo/2019/3/5/RenJiaHui_2088246a3ec08aa0e9b190c42b363860.mp3"
 },
{
 content: '<p>希望大家深刻反映70年来党和人民的奋斗实践，深刻解读新中国70年历史性变革中所蕴藏的内在逻辑，讲清楚历史性成就背后的中国特色社会主义道路、理论、制度、文化优势，更好用中国理论解读中国实践，为党和人民继续前进提供强大精神激励。</p>',
 music: "http://flv4.people.com.cn/videofile6/pvmsvideo/2019/3/5/RenJiaHui_a7ed827b92a43fc5d9e425d235d44b2e.mp3"
 },],
]

var dateName = [
{stage: "1",
    name: "第一期"},
]

// 禁止微信上下拖动
document.body.addEventListener("touchmove",function(event) {
  // console.log(event)
  if (!event.target.classList.contains('content')) { 
    event.preventDefault(); 
  } 
}, {passive: false})

window.addEventListener("orientationchange", function() {
  // Announce the new orientation number
  if (window.orientation && window.orientation !== 0) {
    document.getElementById('alert').style.display = "block"
  }
}, false)

if (window.orientation && window.orientation !== 0) {
  document.getElementById('alert').style.display = "block"
}

function showToast (text) {
  var toast = document.createElement("a")
  toast.setAttribute("id", "toast")
  toast.setAttribute("class", "toast")
  toast.innerHTML = text
  document.body.append(toast)
  function hideToast () {
    document.getElementById('toast').remove()
  }
  setTimeout(hideToast, 2000)
}

if (dateList.length != dateName.length) {
  alert('需要填写的字段数量不一致！')
}

