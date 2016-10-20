var superagent = require('superagent')
var cheerio = require('cheerio')
var async = require('async')
var fs = require('fs')
var path = require('path')

var data = []


function getUrls(num) {
  var urlLeft = 'https://movie.douban.com/j/search_subjects?type=tv&tag=%E6%97%A5%E6%9C%AC%E5%8A%A8%E7%94%BB&sort=recommend&page_limit=20&page_start='
  var arr = []
  for (let i = 0; i < num; i++) {
    arr.push(urlLeft + (i)*20)
  }
  return arr
}


var count = 0

function fetchUrl(url, cb) {
  count++
  var start = +new Date()
  var result 
  superagent
    .get(url)
    .end((err, res) => {
      if (err) console.error('end superagent',err)
        res.body.subjects.forEach(item=>{
          data.push(item.url.split('/subject/')[1].replace('/',''))
        });
        setTimeout(function(){
          console.log('Fetch', url.match(/\d+$/)[0], count, +new Date()-start);
          count--
          cb(null)
        },+new Date()-start+100)
    })e
}

var urls = getUrls(50)

async.mapLimit(urls, 10, (dtUrl, cb)=>{
  fetchUrl(dtUrl, cb)
},(err,result)=>{
  console.log('OK async')
  fs.writeFileSync(path.join(__dirname, 'data', 'id-list1.json'), JSON.stringify(data))
  console.log(data.length);
})
