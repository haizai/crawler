var fs = require('fs')
var path = require('path')

var filenames = fs.readdirSync(path.join(__dirname, 'data','id'))

var dirs = filenames.map( name => {
  return path.join(__dirname, 'data','id', name)
})

var count = 0

var movies = []

function changeMoive(dir) {
  var movie = JSON.parse(fs.readFileSync(dir,'utf-8'))

  delete movie.summary
  delete movie.comments
  delete movie.reviews

  console.log('ok', ++count, movie.id);
  movies.push(movie)
}

dirs.forEach( dir => {
  changeMoive(dir)
})

fs.writeFileSync(path.join(__dirname, 'data','movies.json'), JSON.stringify(movies).replace(/},{/g,'},\n{'))