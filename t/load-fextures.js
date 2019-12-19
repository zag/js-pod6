const fs = require('fs')
const glob = require('glob') 
const allFixures = glob.sync('t/fixtures/*.txt').map( f => {
    const testData = fs.readFileSync(f)
    testData
    const [ text, json ] = `${testData}`.split('~~~~~~~\n')
    text
    const tree = JSON.parse(json)
    return { text, tree, file: f}
})
module.exports = {
    allFixures  
}


