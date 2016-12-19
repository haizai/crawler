var path = require('path')
var fs = require('graceful-fs')
var co = require('co')

var dir = path.join(__dirname,'data','books')
var files = fs.readdirSync(dir)

co(function* () {
  return yield files.map(file => {
    var filedir = path.join(dir,file)
    var book = JSON.parse(fs.readFileSync(filedir,{encoding: 'utf-8'}))
    delete book.tags
    delete book.info
    book.id = +book.id
    return book
  })
}).then(val => {
  fs.writeFile(path.join(__dirname,'qidianVIP.json'),JSON.stringify(val,null,2),err=>{if(err)console.log(err)})
}, err => {
  if (err) console.log(err)
})