'use strict'

module.exports = () =>( tree )=>{
    const isNodesEqual = (n1, n2) => (
        // if nodes items 
        ( n1.name === 'item' ||  n1.name === 'defn' )&&  
        n2.name === n1.name &&
        n1['level'] === n2.level && 
        isNumbered(n1) === isNumbered(n2)
     ) 

const isNumbered = (node) => Boolean( node.config  && node.config.numbered )

const group = ( a ) => {
    let lastItem = {}
    let result =  a.reduce((
      a, i
    ) => {
      if (i.name === 'defn') {
        if ( isNodesEqual( lastItem, i ) ) {
              // group items into arrays
               a[a.length-1].push(i)
        } else {
         // group items into arrays
          a.push([i])
        }
      } else {
        // save not 'item' elements as is
        a.push(i) 
      }
      lastItem = i
      return a
    }, [])
    // convert grouped items into object 'itemlist'
    /**
     * { type = 'list',
     *   ordered = [true, false]
     *   content = [ .... ]
     *   list = ['ordered', 'variable', 'itemized']
     */
    return result.map(item => { 
        if ( item instanceof Array) {
            // get type of list
            const list = item[0].name === 'defn' ? 'variable' : 
                                 isNumbered( item[0] ) ? 'ordered' : 'itemized'
            // create items container
            return { 
                type: 'list',
                list,
                level: 1, // defn always have level 1
                content: [ ...item ]
            }
        }
        return item
    })
  }
  const visit = ( node )=>{
    if ( Array.isArray( node ) ) {
        node.forEach( i => { visit(i) } )
    } else {
      if (node.type === 'block') {
        // visit(node.content)
        node.content = group( node.content )
      }
    }
  }
 visit(tree)
 return tree
}

