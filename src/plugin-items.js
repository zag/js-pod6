'use strict'
module.exports = () =>( tree )=>{
        const visit = (node)=>{
            if ( Array.isArray(node) ) {
                node.forEach( i => { visit(i)})
            } else {
              if (node && node.type === 'block' ) {
                  const matchItem =/^item(\d+)?/.exec(node.name) 
                  if (matchItem) {
                    node.name = 'item'
                    node.level = matchItem[1] || 1
                    if( node.content[0] ) {
                        const startText = node.content[0]
                        if ( startText.text ) {
                            let re = /(\s*#\s*)/
                            const match = re.exec(startText.text)
                            if (match){
                                startText.text = startText.text.replace(re, '')
                                node.attr = { ...node.attr, ...{ numbered: true }}
                            }
                        }
                    }
                   }
                    visit(node.content)
              }
            }
          }
        visit(tree)
        return tree
}
