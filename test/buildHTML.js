const fs = require('fs')
const Mustache = require('mustache')

const template = fs.readFileSync('./test/index.mustache').toString()
const html = Mustache.render(template, {}, {
  section: fs.readFileSync('./test/section.html').toString(),
})
fs.writeFileSync('./test/index.html', html)
