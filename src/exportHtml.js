'use strict'
const toAny = require('./exportAny')
const { subUse, wrapContent, emptyContent, content, setFn, setContext } = require('../src/helpers/handlers')
const makeAttrs = require('./helpers/config').makeAttrs
const htmlWriter = require('./writerHtml')
    
const toHtml = ( opt ) => toAny( { writer:htmlWriter, ...opt } ).use(
    '*', ( writer, processor ) => ( node, ctx, interator ) => {
            const nodeName = node.name || ''
            // skip warnings for semantic blocks
            const isSemanticBlock = ( node ) => { 
                const name = node.name || ''
                const isTypeBlock = ( node.type || '') === 'block'
                return isTypeBlock && name === name.toUpperCase()
            }

            if ( isSemanticBlock(node) ) {
                const name  = node.name
                const { write : w, writeRaw : raw } = writer
                raw('<h1 class="')
                       w( name )
                raw('">')
                       w( name )
                raw('</h1>')
            } else {
                 console.warn("Unhandled node" + JSON.stringify( node, null, 2))
                }
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
        'C<>': wrapContent('<code>','</code>'),
        'B<>': wrapContent('<strong>','</strong>'),
        'I<>': wrapContent('<em>','</em>'),
        'R<>': wrapContent('<var>','</var>'),
        "L<>": setFn(( node, ctx ) => {
            let { meta } = node
            if ( meta === null) {
                meta = node.content
            }
            return  wrapContent( `<a href="${meta}">`, `</a>` )
        }),

        /**
         * CSS rules for footnotes
         
        .footnote a {
            text-decoration: none;
        }
        .footnotes {
        border-top-style: solid;
        border-top-width: 1px;
        border-top-color: #eee;
        }
         */
        'N<>' : ( writer, processor ) => {
            writer.addListener('end', ()=>{
                if ( !writer.hasOwnProperty('FOOTNOTES') ) { return }
                const footnotes = writer.FOOTNOTES
                if ( footnotes.length < 1 ) { return } // if empty footnotes
                writer.writeRaw(`<div class="footnotes">`)
                footnotes.map((footnote) =>{
                   writer.writeRaw(`<p><sup id="${footnote.fnId}" class="footnote"><a href="#${footnote.fnRefId}">[${footnote.gid}]</a></sup> `)
                   footnote.make()
                   writer.writeRaw(`</p>`)
                })
               writer.writeRaw(`</div>`)
               
            })
            return ( node, ctx, interator ) => {
                // skip empty notes
                if ( node.content.length < 1 ) { return }
                if ( !writer.hasOwnProperty('gid') ) { writer.gid = 1}
                // get foot note id
                const gid = writer.gid++
                const fnRefId = `fnref:${gid}`
                const fnId = `fn:${gid}`
                writer.writeRaw(`<sup id="${fnRefId}" class="footnote"><a href="#${fnId}">[${gid}]</a></sup>`)
                if ( !writer.hasOwnProperty('FOOTNOTES') ) { writer.FOOTNOTES = []}
                writer.FOOTNOTES.push({
                    gid,
                    fnRefId,
                    fnId,
                    make: ( )=>{ interator(node.content, ctx) }
                })
            }
        },
        'S<>':( writer, processor ) => ( node, ctx, interator ) => {
            const content = node.content || ''
            const spaces = content.replace(/ /g, '&nbsp;')
            const newFeed = spaces.replace(/\n/g, '</br>')
            writer.writeRaw(newFeed)
        },
        'V<>': content,
        'Z<>': emptyContent,
        'pod': content,
        ':code': wrapContent('<pre><code>', '</code></pre>'),
        'code': wrapContent('<pre><code>', '</code></pre>'),
        ':verbatim': ( writer, processor ) => ( node, ctx, interator ) => { 
            if (node.error) {
                console.log('err')
                writer.emit("errors", node.location )
            }
            interator( node.value ) 
        },
        ':blankline': emptyContent,
        ':config': setFn(( node, ctx ) => {
            // setup context
            if ( ! ctx.hasOwnProperty('config') ) ctx.config = {}
            //collect configs in context
            ctx.config[node.name] = node.config
            return emptyContent}),
        // block =para
        'para': content,
        ':para':wrapContent('<p>', '</p>'),
        //Named blocks for which no explicit class has been defined or loaded are
        //usually not rendered by the standard renderers.
        ':namedBlock':emptyContent,
        'head:block': subUse({
                           // inside head don't wrap into <p>
                                ':para' : content,
                            },
                            setFn(( node, ctx ) => {
                                const {level} = node
                                return wrapContent( `<h${level}>`, `</h${level}>` )
                            })
                        ),
        ':list': setFn(( node, ctx ) => 
                        node.list === 'ordered' ? wrapContent('<ol>', '</ol>') 
                                                : node.list ===  'variable' ? wrapContent('<dl>', '</dl>') 
                                                                            : wrapContent('<ul>', '</ul>')
                        ), 
        'item:block':  ( writer, processor ) => ( node, ctx, interator ) => {
            // make text from first para
            if (! (node.content instanceof Array)) {
                console.log(node)
            }
            const [ firstPara, ...other ] = node.content
            writer.writeRaw('<li>')
            // TODO: get cases for handle first para in items
            // interator([...firstPara.content, ...other], ctx)
            interator(node.content, ctx)
            writer.writeRaw('</li>')
        },
        'comment:block': emptyContent,
        'defn':wrapContent('','</dd>'),
        'term:para': wrapContent('<dt>','</dt><dd>'),
        // TODO: handle levels of nesting
        'nested':wrapContent('<blockquote>', '</blockquote>'),
        // table section
        'table:block' : 
              subUse({
                        // TODO: rename table's 'head' to table-head
                        'head': subUse({
                                            'column': wrapContent('<th>','</th>')
                                        },
                                        wrapContent('<tr>','</tr>')
                                        )},
                         ( writer, processor ) => ( node, ctx, interator ) => {
                                const conf = makeAttrs(node, ctx)
                                writer.writeRaw('<table>')
                                if ( conf.exists('caption') ) {
                                    writer.writeRaw('<caption>')
                                    writer.write(conf.getFirstValue('caption'))
                                    writer.writeRaw('</caption>')
                                }
                                interator(node.content, ctx)
                                writer.writeRaw('</table>')
                        }
                    ),
        ':separator' : emptyContent,

         'row':wrapContent('<tr>','</tr>'),
         'column':wrapContent('<td>','</td>'),
 
        })

module.exports = toHtml