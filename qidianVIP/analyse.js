var path = require('path')
var fs = require('graceful-fs')
var fse = require('fs-extra')


var dir = path.join(__dirname,'data','books')
var files = fs.readdirSync(dir)


files.forEach( file => {

  var filedir = path.join(dir,file)

  fs.readFile(filedir,{encoding: 'utf-8'}, (err,doc)=>{
    if(err) console.log(err)

    var book = JSON.parse(doc)

    var word = book.info.split('|')[0].replace('字','')
    var wordCount = /万/.test(word) ? parseFloat(word) : parseInt(word)/10000;

    var allClick = book.info.split('|')[1].split('·')[0].replace('总点击','')
    var allClickCount = /万/.test(allClick) ? parseFloat(allClick) : parseInt(allClick)/10000

    var weekClick = book.info.split('|')[1].split('·')[1].replace('会员周点击','')
    var weekClickCount = /万/.test(weekClick) ? parseFloat(weekClick) : parseInt(weekClick)/10000

    var allCommend = book.info.split('|')[2].split('·')[0].replace('总推荐','')
    var allCommendCount = /万/.test(allCommend) ? parseFloat(allCommend) : parseInt(allCommend)/10000

    var weekCommend = book.info.split('|')[2].split('·')[1].replace('周','')
    var weekCommendCount = /万/.test(weekCommend) ? parseFloat(weekCommend) : parseInt(weekCommend)/10000

    book.wordCount = wordCount
    book.allClickCount = allClickCount
    book.weekClickCount = weekClickCount
    book.allCommendCount = allCommendCount
    book.weekCommendCount = weekCommendCount

    book.state = book.tags[0]
    book.type = book.tags[3]
    book.secondType = book.tags[4]


    fs.writeFile(filedir, JSON.stringify(book,null,2), err2=> {
      if(err2) console.log(err2)
    })

    // 17906 -> 17805 unlink 101 无效数据
    // 
    // if(!book.title) {
    //   console.log(file)
    //   fs.unlink(filedir, err=>{
    //     if (err) console.log(err)
    //       console.log('unlink, ', filedir)
    //   })
    // }

    // 17805 -> 17793手动检查字数少于2万字的小说
    // 
    // if (wordCount < 2) {
    //   console.log(wordCount, file)
    // }

    // 17793 -> 17501 移除【今古传奇·武侠版】
    // 
    // if (/今古传奇·武侠版/.test(book.title)) {
    //   fse.move(filedir, path.join(__dirname,'data','非正常小说','今古传奇·武侠版',file),err=> {
    //     if(err) console.log(err)
    //       console.log('move', file)
    //   })
    // }


  })
})