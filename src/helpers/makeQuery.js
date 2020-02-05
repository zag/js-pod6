/**
sample      |  type        | name
----------------------------------
'C<>', 
'C:fcode'       fcode           C
'<>'            fcode           any name, or /.+/
'name'          block           'name'
'Name'          namedBlock      'Name'
':blankline'    blankline       any name, or /.+/
'C:fcode'       fcode           C
'*:*', '*'      any type        any name

*/

const getQuery = function(k) {
    if (k === '*:*' || k === '*') {
        return {}
    }
    if (k === '<>') {
       return { type:'fcode' }
   }
   // try to split 'name:type'
   [name,type] = k.split(':')
   if ( name && type) { return { name, type } }
   if ( !name ) { 
       return { type }
   }
   if ( !type ) {
       // check C<>
       const re = name.match(/(.)\<\>/)
       if (re) {
           return { type:'fcode', name:re[1] }
       }
       return { name , type: 'block'}
   }
   return [ name, type ]
}

const  makePlug = (k) => {
   const res = getQuery(k)
   const { name, type } = res
   if ( type && type === '*') { return { name } }
   if ( name && name === '*') { return { type } }
   return res
}

// is - check if node have handler
function is( query, node ) {
    function isEmpty( obj ) {
        for( var prop in obj ) {
            if( obj.hasOwnProperty(prop) )
                return false
        }
        return true;
    }  
    // check if query empty
    if ( isEmpty(query) ) return true
    for( var prop in query ) { 
        if (query === undefined) {
            console.log('key!!!')
        }
        if( query.hasOwnProperty(prop) ) {
            if (node === undefined) {
                console.log('node!!!')
            }
            if ( node.hasOwnProperty(prop) ) {
                if ( query[prop] !== node[prop] ) {
                    return false
                }
            } else { return false }
        }
    }
    return true
}

const makeRule = ( query, fn ) => {
    rule.rule = query
    rule.isFor = isFor
    rule.fn = fn
    return rule

    function rule () {}

    function isFor (node) {
            if ( 'string' === typeof node) return false
            return is(query,node)
    }
}


function makeRulesArray( key, fn ) {
    if ( key instanceof Array ) {
       // TODO handle arrays
    }
  
    if ( key instanceof Object ) {
      let rules = []
      for ( var prop in key ) {
          if ( key.hasOwnProperty(prop) ) {
            rules.push( makeRule( makePlug(prop), key[prop] ) )
          }
      }
      return rules
    }
    return [ makeRule( makePlug(key), fn ) ]
  }


module.exports.makePlug = makePlug
module.exports.is = is
module.exports.makeRule = makeRule
module.exports.makeRulesArray = makeRulesArray
