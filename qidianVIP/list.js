
var superagent = require('superagent')
var cheerio = require('cheerio')
var async = require('async')
var fs = require('fs')
var path = require('path')

var urls = []
for (var page = 1;page < 897; page ++) {
  var url = `http://a.qidian.com/?size=-1&sign=-1&tag=-1&chanId=-1&subCateId=-1&orderId=&update=-1&page=${page}&month=-1&style=1&action=-1&vip=1`
  urls.push(url)
}

var data = []

var count = 0


function init(url, cb) {
  
  var start = +new Date()

  var list = []

  superagent.get(url).end((err, res) => {
    var $ = cheerio.load(res.text)
    $('.book-img-box a').each(function(){
      data.push(($(this).attr('data-bid')))
    })
  })

  setTimeout(()=> {
    console.log('OK', ++count);
    if (cb) {
      cb()
    }
  },+new Date() - start + 1000)
}


async.mapLimit(urls, 5, (url, cb) => {
  init(url, cb)
},(err)=> {
  console.log('ok????', data)
  fs.writeFileSync(path.join(__dirname, 'data', 'url-list.json'), JSON.stringify(data))
})

var superagent = require('superagent')
var cheerio = require('cheerio')
var fs = require('fs')
var path = require('path')
var async = require('async')

var url = 'http://book.qidian.com/info/2643379'

var count = 0

var st = +new Date()

function init(url, cb) {
  superagent.get(url).end((err,res)=> {
    var start = +new Date()
    var $ = cheerio.load(res.text)
    var book = {}
    book.id = url.split('info/')[1]
    book.title = $('.book-info h1 em').text()
    book.writer = $('.book-info .writer').text()
    book.tags = []
    $('.book-info .tag').children().each(function () {
      book.tags.push($(this).text())
    })
    book.info = $('.book-info .intro').next().text()
    fs.writeFileSync(path.join(__dirname, 'data','books' ,book.id+'.json'), JSON.stringify(book, null, 2))
    console.log(book.title, ++count, +new Date() - start)
    setTimeout(function(){
      if(cb)cb()
    }, +new Date() - start + 2000)
  })
}

