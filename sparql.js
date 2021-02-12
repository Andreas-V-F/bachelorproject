const fs = require('fs')
const rdf = require('rdf-ext')
const N3Parser = require('rdf-parser-n3')

// create N3 parser instance
const parser = new N3Parser({factory: rdf})

// Read a Turtle file and stream it to the parser
const quadStream = parser.import(fs.createReadStream('./test.ttl'))

;(async function () {
  // create a new dataset and import the quad stream into it (reverse pipe) with Promise API
  const dataset = await rdf.dataset().import(quadStream)
  dataset.forEach(({ object }) => {
    console.log(object)
  })
  /*
  console.log(`Dataset contains ${dataset.size} quads`)

  const jobTitles = dataset.match(null, rdf.namedNode('http://schema.org/jobTitle')).toArray()
  jobTitles.forEach(({ object }) => {
    console.log(`Sheldon's jobTitle is ${object.value}`)
  })

  const relations = dataset.match(null, rdf.namedNode('http://schema.org/knows')).toArray()
  console.log(`Sheldon knows ${relations.map(({ object }) => object.value).join(', ')}`)*/
})()
