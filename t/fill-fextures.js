const fs = require('fs')
const glob = require('glob') 
const path = require('path')
var peg = require("pegjs");
var parser = require('../src/pod6.js')
const files = glob.sync('t/fixtures-src/*.t')
const loaded = files.map( file => {
    const d = fs.readFileSync(file)
    const  s = `${d}`.split(/#---+\n/)
            .filter( t => t.match(/^=/))
            .map( (text,i) => {
                const { dir, name } =  path.parse(file)
                const testFile = `t/fixtures/${name}_${i}.txt`
                return {file,
                id:i,
                text,
                testFile,
            }});
    return s
    }
).flat()
const test = loaded.filter( r => !fs.existsSync(r.testFile))
// const ok = loaded.filter( r => fs.existsSync(r.testFile))
// ok.map(t => {
//     const testData = fs.readFileSync(t.testFile)
//     const [ text, json ] = `${testData}`.split('~~~~~~~\n')
//     text
//     const tree = JSON.parse(json)
//     tree
// })

const t = test[0]   
t
const tree = JSON.stringify(parser.parse( t.text ),null, 2)
t
tree
const f = t.testFile 
f 
const s = JSON.stringify(tree ,null, 2)
s
//    if ( t.testFile =='t/fixtures/03-abbreviated_7.txt') {
//     fs.writeFileSync( t.testFile, [t.text, tree ].join('~~~~~~~\n'))
//    }
// const allFixures = glob.sync('t/fixtures/*.txt').map( f => {
//     const testData = fs.readFileSync(f)
//     testData
//     const [ text, json ] = `${testData}`.split('~~~~~~~\n')
//     text
//     const tree = JSON.parse(json)
//     return { text, tree, file: f}
// })
// module.exports = {
//     allFixures  
// }


