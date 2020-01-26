'use strict'
const toAny = require('./exportAny')
const {wrapContent, emptyContent, content, setFn, setContext } = require('../src/helpers/handlers')

    
const toHtml = ( opt ) => toAny( opt ).use(
    '*', ( writer, processor ) => ( node, ctx, interator ) => {
            console.warn("Unhandled node" + JSON.stringify( node, null, 2))
            if ( node.hasOwnProperty('content')) {
                interator(node.content, ctx)
            }
        }
    ).use({
        ':text': ( writer, processor )=>( node, ctx, interator )=>{
            // handle text with content
            if (node.value) {
                writer.write( node.value )
            } else { interator( node.content, ctx ) }
        },
            
        // Formatting codes
        'C<>': wrapContent('<pre><code>','</code></pre>'),
        'B<>': wrapContent('<strong>','</strong>'),
        'I<>': wrapContent('<em>','</em>'),

        'para': wrapContent('<p>','</p>'),
        'para': content,
        'pod': content,
        ':code': wrapContent('<code><pre>', '</pre></code>'),
        'code:': wrapContent('<code><pre>', '</pre></code>'),
        ':verbatim': ( writer, processor ) => ( node, ctx, interator ) => { interator( node.value ) },
        ':blankline': emptyContent,
        ':para':wrapContent('<p>', '</p>'),
        //Named blocks for which no explicit class has been defined or loaded are
        //usually not rendered by the standard renderers.
         ':namedBlock':emptyContent,
         'head:block': setFn(( node, ctx ) => {
            const parents = ( ctx.parents || [] )
            parents.push('head')
            const {level} = node
            return setContext( { ...ctx, parents }, wrapContent( `<h${level}>`, `</h${level}>` ))
        }),
        // inside head dont' wrap into <p>
        ':para':setFn(( node, ctx ) => ( ctx.parents || [] ).includes('head') ? content : wrapContent('<p>', '</p>')),
        ':list': setFn(( node, ctx ) => node.list === 'ordered' ? wrapContent('<ol>', '</ol>') : wrapContent('<ul>', '</ul>')), 
        'item:block':  ( writer, processor ) => ( node, ctx, interator ) => {
            // make text from first para
            if (! (node instanceof Array)) {
                console.log(node)
            }
            const [ firstPara, ...other ] = node.content
            writer.write('<li>')
            interator([...firstPara.content, ...other], ctx)
            writer.write('</li>')
        },
        'comment:block': emptyContent, 

        })

module.exports = toHtml