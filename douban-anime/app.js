var express = require('express')
var superagent = require('superagent')
var cheerio = require('cheerio')
var request = require('request')
var fs = require('fs')
var co = require('co')
var path = require('path')
var async = require('async')



var downloadImg = function(src, id){
  var filename = id + src.match(/.\w+$/)[0]
  superagent.get(src).pipe(fs.createWriteStream(__dirname + '/_images/id/' + filename))
};

var getReview = function(arr) {
  return arr.map(item => {
    var $ = cheerio.load(item.text)
    var review = {}
    review.title = $('#content h1 [property]').text()
    review.text = $('#link-report [property]').text()
    return review
  })
}

var getMovie = function(id, txt) {
  var $ = cheerio.load(txt);
  var movie = {}
  movie.id = id
  var titleArr = $('#content h1 span').eq(0).text().split(' ')
  if (titleArr.length < 3) {
    movie.title = titleArr[0]
    movie.jpTitle = titleArr[1]
  } else {
    movie.title = titleArr[0] + ' ' +titleArr[1]
    movie.jpTitle = titleArr.slice(2).join(' ')
  }

  movie.year = $('#content h1 span').eq(1).text().replace(/[\(\)]/g,'')
  movie.info = {}
  $('.subjectwrap #info').text().split('\n')
    .filter(item => !!item.trim())
    .map(item => item.trim())
    .map((item, index, arr) => /:/.test(arr[index+1]) || index == arr.length-1 ? item : item+ arr[index+1])
    .filter(item => /:/.test(item))
    .forEach(item => movie.info[item.split(':')[0]] = item.split(':')[1].trim())
  movie.rating = {}
    var rats = $('#interest_sectl').text().split(/\s{2,}/g)
    movie.rating['分数'] = rats[2]
    movie.rating['人数'] = rats[3].replace(/\D+/,'')
    movie.rating[rats[4]] = rats[5]
    movie.rating[rats[6]] = rats[7]
    movie.rating[rats[8]] = rats[9]
    movie.rating[rats[10]] = rats[11]
    movie.rating[rats[12]] = rats[13]
    movie.rating.txt = rats.slice(14)
  movie.summary = $('#link-report').text().trim()
  downloadImg($('.nbgnbg img').attr('src'), movie.id)
  movie.comments = []
  $('#comments-section #hot-comments p').each(function() {
    movie.comments.push($(this).text())
  })
  movie.reviews = []
  $('.review-hd-expand .a_unfolder').each(function(){
    var reviewId = $(this).attr('href').match(/\d+/)[0]
    movie.reviews.push(reviewId)
  })
  
  return movie
}

var count = 0

var init = function(id, cb) {

  var start = +new Date()

  url = `https://movie.douban.com/subject/${id}/`

  co(function* (){

    //发送get请求返回res
    var res = yield superagent.get(url)

    //获取movie对象数据
    var movie = yield getMovie(id, res.text)

    //movie.reviews每一个id发送get请求获得review的res
    var reviews = yield movie.reviews.map(reviewId => {
      var src = `https://movie.douban.com/review/${reviewId}/`
      return superagent.get(src)
    })

    //将review的res转化为movie.reviews
    movie.reviews = getReview(reviews)

    return movie
  }).then(val => {
    fs.writeFileSync(path.join(__dirname, '_data','id' ,val.id+'.json'), JSON.stringify(val, null, 2))
    setTimeout(()=> {
      console.log('OK', ++count ,'id=' + id , 'delay=' + (+new Date() - start));
      if (cb) cb()
    },+new Date() - start + 5000)
  },err => console.log('err',err))
}




var ids = JSON.parse(fs.readFileSync(path.join(__dirname, '_data', 'id-list.json'),'utf-8'))

var begin = +new Date()


// async.mapLimit(ids, 3, (id, cb) => {
//   init(id, cb)
// },err => {
//   if (err) console.error(err,+new Date()-begin)
//   console.log('OK async',+new Date()-begin)
// })