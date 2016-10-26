var fs = require('fs')
var path = require('path')

var filenames = fs.readdirSync(path.join(__dirname, '_data','id'))

var dirs = filenames.map( name => {
  return path.join(__dirname, '_data','id', name)
})

var count = 0

function changeMoive(dir) {
  var movie = JSON.parse(fs.readFileSync(dir,'utf-8'))
  delete movie.info['官方网站']
  delete movie.info['制片国家/地区']
  delete movie.info['语言']
  delete movie.info['IMDb链接']
  delete movie.rating['txt']

  movie.title = movie.title.trim()
  movie.jpTitle ? movie.jpTitle = movie.jpTitle.trim() : movie.jpTitle = movie.title
  if (movie.info['单集片长']) movie.info['单集片长'] = movie.info['单集片长'].match(/\d+/)[0]
  if (movie.info['首播']) movie.info['首播'] = movie.info['首播'].match(/[\d-]+/)[0]

  if (movie.info['导演']) movie.info['导演'] = movie.info['导演'].split(' / ')
  if (movie.info['编剧']) movie.info['编剧'] = movie.info['编剧'].split(' / ')
  if (movie.info['主演']) movie.info['主演'] = movie.info['主演'].split(' / ')
  if (movie.info['类型']) movie.info['类型'] = movie.info['类型'].split(' / ')
  if (movie.info['又名']) movie.info['又名'] = movie.info['又名'].split(' / ')

  fs.writeFileSync(path.join(__dirname, 'data','id' ,movie.id+'.json'), JSON.stringify(movie, null, 2))
  console.log('ok', ++count, movie.id);
}

dirs.forEach( dir => {
  changeMoive(dir)
})