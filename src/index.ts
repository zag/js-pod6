// @ts-ignore
import * as parser from './grammar'
import vmargin_plug from './plugin-vmargin'
import formattingCodes_plug  from  './plugin-formatting-codes'
import itemsNumbering_plug from './plugin-items' 
import heading_plug from './plugin-heading'
import defnGroup_plug from  './plugin-group-defn'
import itemsGroup_plug from './plugin-group-items'
import defnTerms_plug from './plugin-defn-fill-term'
import table_plug from './plugin-tables'

export interface nBlock {
    "type":"block",
     name: "pod",
     content:AST,
     margin: string,
    // [name : string]:string,
}
export interface  nCode   {
    "type": "code",
    "content": [],
    "name": string,
    "margin": string,
    "config": [],
    "text": string
}

export interface  nText   {
    "type": "text",
    "content": [],
    "name": string,
    "margin": string,
    "config": [],
    'value':string,
}

export interface  nPara   {
    "type": "para",
    "content": [],
    "name": string,
    "margin": string,
    "config": []
}

export interface nVerbatim  { type:'verbatim', value:string }
export type Node = nBlock| nCode | nText| nPara | nVerbatim;
export type AST = Array<Node>
export type Plugin = ( opt : {
    skipChain: number;
    podMode: number;
} ) => ( param:AST ) => AST
function makeTree () {
    var plugins:Array<Plugin> = []
    chain.use = use
    chain.parse = parse
    chain.use( vmargin_plug )
    chain.use( itemsNumbering_plug )
    chain.use( heading_plug )
    chain.use( defnTerms_plug )
    chain.use(table_plug)
    chain.use( formattingCodes_plug )
    
    // save order for the next two plugins
    chain.use( itemsGroup_plug )
    chain.use( defnGroup_plug )
    return chain

    function chain() {
        return 
    }

    function use( plugin :Plugin ) {
        if ( ! ["function"].includes(typeof plugin) ) {
            throw(plugin)
            }

        plugins.push( plugin )
        return chain
    }
    
    function parse ( src:string , opt = {skipChain:0, podMode:1} ) {
        let tree : AST = parser.parse( src ,{podMode:opt.podMode})
        if ( !opt.skipChain ) {
           
            for ( let i = 0 ; i < plugins.length; i++ ) {
                const plugin = plugins[i]
                // init
                const visitor = plugin( opt )
                // process tree
                tree = visitor( tree )
            }
        }
        return tree
    }
}

export {makeTree as toTree}
const parse: Function = makeTree().parse
export { parse as parse } 
export { default as toHtml } from './exportHtml'
// Cannot be `import` as it's not under TS root dir
// https://stackoverflow.com/questions/51070138/how-to-import-package-json-into-typescript-file-without-including-it-in-the-comp

const {version: VERSION} = require('../package.json');
export { VERSION as version} 





