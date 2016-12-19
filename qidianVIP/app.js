var superagent = require('superagent')
var cheerio = require('cheerio')
var fs = require('fs')
var path = require('path')
var async = require('async')



var count = 0

var st = +new Date()

function init(id, cb) {
  var url = `http://book.qidian.com/info/${id}`
  superagent.get(url).end((err,res)=> {
    var start = +new Date()
    var $ = cheerio.load(res.text)
    var book = {}
    book.id = id
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
    }, +new Date() - start + 1000)
  })
}

var urls = JSON.parse(fs.readFileSync(path.join(__dirname, 'data', 'url-list.json'),'utf-8'))

urls = urls.filter((url, index) => {
  return index > 12673
})


async.mapLimit(urls, 3, (id, cb) => {
  init(id, cb)
},(err)=> {
  console.log('ok????', +new Date() - st)
})