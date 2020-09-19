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

export interface  RuleHandler {
    (writer, processor) : (node, ctx, interator) =>void
}
export type RuleObject = {
    [name:string]:RuleHandler
}
export type Filter = { name:string, type?:string}  | { name?:any, type: 'block' | any } | {}

export interface GetQuery {
    (k:string) : Filter
}

const getQuery:GetQuery = function(k) {
    if (k === '*:*' || k === '*') {
        return {}
    }
    if (k === '<>') {
       return { type:'fcode' }
   }
   // try to split 'name:type'
   let [name,type] = k.split(':')
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
   return { name, type }
}

export const  makePlug = (k:string) => {
   const res = getQuery(k)
   // @ts-ignores
   let { name , type } = res
   if ( type && type === '*') { return { name } }
   if ( name && name === '*') { return { type } }
   return res
}

// is - check if node have handler
export function is( query, node ) {
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

export interface Rule {
    ():{},
    isFor(): void,
    fn():void,
}
export const makeRule = ( query, fn ) => {
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

interface makeRulesArray {
     (key:Array<any>, fn?:Function):Array<any>
    (key:RuleObject, fn?:Function):Array<any>
    // (key:any, fn:Function):Array<any>
}
export const makeRulesArray:makeRulesArray = ( key, fn ) => {
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
