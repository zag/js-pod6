
{
  // the following names: MyBlock, myBlock are use for extending pod6
  function isNamedBlock(name) {
    return (
        name !== name.toLowerCase() 
            && 
        name !== name.toUpperCase() 
      )
  }
}

Document = nodes:Element*  { return  nodes }

Element =  delimitedBlockRaw
         / delimitedBlockTable
         / delimitedBlock
         / paragraphBlockRaw 
         / paragraphBlockTable
         / paragraphBlock
         / abbreviatedBlockRaw
         / abbreviatedBlockTable
         / abbreviatedBlock
         / configDirective
         / textBlock
         / blankline
         / error_para

/**
U+0020 SPACE
U+00A0 NO-BREAK SPACE
U+0009 CHARACTER TABULATION
U+2001 EM QUAD
U+2008 PUNCTUATION SPACE
*/


hs = [ \u00a0\u2001\t\u000C\u2008]
_ = [ \t\u000C]*
Endline = $(hs* [\n\r])
 
LineOfText = text:$(char+) EOL
   { return text }

//  char =  [a-z =0-9.<>]
char = [^\n\r]
newline = '\n' / '\r' '\n'?
EOL = newline / !.
emptyline = $(hs* [\n\r])
blankline = $( hs* [\n\r]) { return { type:'blankline'}}
markerBegin = '=begin '
markerEnd = '=end '
markerFor = '=for '
markerConfig = '=config'
markerAbbreviatedBlock = '=' name:identifier  { return name }
markers = markerBegin / markerEnd / markerFor / markerConfig
Text "text" = $(c:char+)
text_content =  !( _ ( markers / markerAbbreviatedBlock ) / blankline ) $(Text)+ EOL {return text()}
error_para = $(!EOL .)+ EOL
            { return { type:"verbatim", value:text(), error:true, location:location()}}
/** 
#  Value is...       Specify with...           Or with...            Or with...
#  ===============   =======================   =================   ===========
#  List              :key[$e1,$e2,...]         :key($e1,$e2,...)
#  List              :key<1 2 3>                :key[1,2,3]       key => [1,2,3]
#  Hash              :key{$k1=>$v1,$k2=>$v2}
#  Boolean (true)    :key                      :key(True)
#  Boolean (false)   :!key                     :key(False)
#  String            :key<str>                 :key('str')         :key("str")
#  Number            :key(42)                  :key(2.3)
*/

array_codes = code:FCode hs+ codes:array_codes {return [code,codes].flat()}/ code:FCode { return [code] }
FCode = $(char)

// Define array: '1 2 3' or '1,2,3'
array_items = 
          code:item (hs+ / ', ') codes:array_items 
                            { return [ code, codes ].flat() }
          / code:item { return [code] }

identifierKey = $([a-zA-Z0-9]+[a-zA-Z0-9_-]*)

// $k1=>$v1,$k2=>$v2
pair_item =  name:identifierKey _( ',' / '=>')_ value:item { return { [name]: value } }

array_pairs = 
              pair:pair_item  _','_  pairs:array_pairs 
                    { return { ...pair, ...pairs } }
              / code:pair_item { return code }

allow_attribute = _ ':' key:'allow' value:(
  
  '<' _ array:array_codes _ '>'  { return { value:array, type:"array"}}
) _  {return { name:'allow', ...value}}

array_sp = all:( _ i:item _ {return i})* { return all }/ res:item {return  [res]} / _ {return []}

attributes =  allow_attribute / _ ':' isFalse:[!]? key:identifier value:(
  
  '{' _  hash:array_pairs '}' { return { value:hash } } 
  /
   '['  _ array:(  
              array:array_items  { return array }  
              /     
              $(!(']'/'[') .)+ {return [text()]}     
              ) _ ']'  
    { return   { 
                value:array,
                type:"array"
              }  
    } 
  /
  '<' _ array:array_items _ '>'  { return { value:array, type:"array" } }
  /
  '<' _ array: $(!('<'/'>') .)+ _ '>'  { return { value:array, type:"string" } }
  / 
  '(' _ res:(array:array_items {
                                // if one element (23) set type to 'value' 
                                 return  (array.length > 1)
                                        ? { type:'array', value:array}
                                        : { type:'value', value:array[0]};
                               } 
        / 
        $(!(')'/'(') .)+ {return { value:text() } }) _ ')' 
        {
            return { 
                    type:"value", 
                    ...res
                  }
        }
  / _ 
  { return { 
            value:!isFalse,
            type:"boolean"
          }
  }
)  _  {return { name:key, ...value}}

pod_configuration = 
  first:attributes* newline 
  cont:("=" _ rest:attributes+ _ newline {return rest })*  {return [...first, ...cont].flat()}

string = text:$([^'"]+){ return text}

digits = $([0-9]+)

number = $([-+]?[0-9]+)

Boolean = 'True' {return true} / 'False' {return false}

floatNumber = $(number ('.' digits)? [eE] number ) / $( number '.' digits )

item =  // quoted strings
        ["] text:$([^"]*) ["] { return text} /
        ['] text:$([^']*) ['] { return text} /
        // boolean
        Boolean /
        // float number
        numberFloat:floatNumber { return parseFloat(numberFloat) } /
        // number
        number:number { return parseInt(number,10) } 


delimitedBlockRaw = 
    vmargin:$(_) 
    markerBegin name:identifier _ config:pod_configuration 
    &{ 
     return ( 
       (name.match(/code|comment/))
        || 
        isNamedBlock(name)
      )
     }
content:$( 
         !markers t:Text Endline? 
          / !markerEnd $(.)
          )+ 
vmargin2:$(_) res:( 
                    markerEnd ename:identifier &{ return name === ename } Endline? 
                    { 
                      const type = isNamedBlock(name) ? 'namedBlock' : 'block'
                      return {
                              type:type,
                              content: content === "" ? [] : [{ type:'verbatim', value:content}],
                              // content: content === "" ? [] : [content],
                              name,
                              margin:vmargin
                             }
                    } 
              ) &{return  true || vmargin === vmargin2} 
                { return {
                          ...res,
                          text:text(),
                          config
                          }}
tableHeadSeparator = !( _ ( markers / markerAbbreviatedBlock ) / blankline ) hs* $([+-=_|] hs*)+ EOL
                    { return { type: 'separator', text:text() } }
tableBodyRowSeparator  =  $( tableHeadSeparator / blankline ) { return { type:'separator', text:text() } }
tableRow = t:text_content { return { name:'row', type:'text', value:t } }
tableContents =
    blankline*
    head:$( !tableHeadSeparator tableRow )+
    separator:tableHeadSeparator
    rest:(
       rowtext:$( !tableBodyRowSeparator tableRow )+  
       bseparator:tableBodyRowSeparator
       {
          return [ 
                  { 
                    name:'row',
                    type:'text',
                    value:rowtext
                  },
                  bseparator 
                ] 
        }
       / !tableBodyRowSeparator singleRow:tableRow { return [singleRow] }
      )+
      blankline*
      { return [
                  {
                    name:'head',
                    type:'text',
                    value:head
                  },
                  separator,
                  ...rest.flat() 
                ]
      } 
    / tableRow+

delimitedBlockTable = 
    vmargin:$(_) 
    markerBegin name:identifier _ config:pod_configuration 
    &{ return name === 'table' }
content:tableContents
vmargin2:$(_) res:( 
                    markerEnd ename:identifier &{ return name === ename } Endline? 
                    { 
                      return {
                              type:'block',
                              content:content,
                              name,
                              margin:vmargin
                             }
                    } 
              ) &{return  true || vmargin === vmargin2} 
                { return {
                          ...res,
                          text:text(),
                          config
                          }}

delimitedBlock = 
  vmargin:$(_) markerBegin name:identifier  _ config:pod_configuration
  content:( nodes:(
          blankline
          / delimitedBlockRaw
          / delimitedBlockTable
          / delimitedBlock
          / paragraphBlockRaw
          / paragraphBlockTable 
          / paragraphBlock
          / abbreviatedBlockRaw
          / abbreviatedBlockTable
          / abbreviatedBlock 
          / configDirective
          ) & { return true || name == name.toUpperCase() } { return nodes} 
  / tvmargin:$( hs* ) 
    text:$(text_content+)
    {
      const type = name.match(/pod|nested|item|code|defn/) 
                  && 
                  (tvmargin.length - vmargin.length) > 0 ? 'code' : 'para'
      return {
              text, 
              margin:tvmargin,
              type,
              content: [
                        {
                          type: type === 'code' ? 'verbatim' : 'text',
                          value:text
                        }
                       ],
              }
    }
  )* 
  vmargin2:$(_) res:(
          markerEnd ename:identifier &{ return name === ename } Endline? 
          { 
            return { 
                    type:'block',
                    content,
                    name,
                    margin:vmargin
                  }
          } 
          ) 
          // TODO: fix this 
          &{return  true || vmargin === vmargin2} 
          { 
            return { 
                    ...res,
                    text:text(),
                    config
                    }
          }

textBlock = ( text_content )+ 
            {
              return { 
                      text: text(),
                      type:'para',
                      margin: '',
                      content:[ 
                                {
                                  type:'text',
                                  value:text()
                                }
                              ] 
                    }
            }
ambientBlock = line:(emptyline { return  {empty:1}}/ [\s]+ / text_content )+ { return { text: text(), type: "ambient1"}}

abbreviatedBlockRaw = 
  vmargin:$(_) !markers
  name:markerAbbreviatedBlock _ emptyline* 
    &{  
     return ( 
       (name.match(/code|comment/))
        || 
        isNamedBlock(name)
      )
     }
  content:$(!emptyline text:text_content )*
  { 
    return {
            margin:vmargin,
            type: isNamedBlock(name) ? 'namedBlock' : 'block',
            content: content === "" ? [] : [{ type:'verbatim', value:content}],
            name,
            config:[]
          }
  }

abbreviatedBlockTable = 
  vmargin:$(_) !markers
  name:markerAbbreviatedBlock _ emptyline* 
    &{ return name === 'table' }
  content:tableContents
  { 
    return {
            margin:vmargin,
            type: 'block',
            content: content === "" ? [] 
                                    : content,
            name,
            config:[]
          }
  }

abbreviatedBlock = 
  vmargin:$(_) !markers
  name:markerAbbreviatedBlock _ emptyline* 
  content:$(!emptyline text:text_content )*
  { 
    return {
            margin:vmargin,
            type:'block',
            content: content === "" ? [] 
                                    : [
                                        {
                                          type:'para',
                                          text:content,
                                          margin: '',
                                          content:[ 
                                                    {
                                                      type:'text',
                                                      value:content
                                                    }
                                                  ],
                                        }
                                      ],
            name
          }
  }
configDirective = 
  vmargin:$(_) 
  marker:'=config' _  name:$(identifier / [A-Z]'<>') _ config:pod_configuration
  {
      return {
          name,
          type:'config',
          config,
          margin:vmargin
      }
  }

paragraphBlockRaw = 
  vmargin:$(_)
  marker:markerFor  name:identifier _ config:pod_configuration 
      &{  
     return ( 
       (name.match(/code|comment/))
        || 
        isNamedBlock(name)
      )
     }
  content:$(!emptyline text_content)*
  { 
      return { 
              type: isNamedBlock(name) ? 'namedBlock' : 'block',
              content: content === "" ? [] : [{ type:'verbatim', value:content}],
              //content: content === "" ? [] : [content],
              name,
              margin:vmargin,
              config
            }
  } 

paragraphBlockTable = 
  vmargin:$(_)
  marker:markerFor  name:identifier _ config:pod_configuration 
  &{ return name === 'table' }
  content:tableContents
  { 
      return { 
              type: 'block',
              content: content === "" ? [] : content,
              name,
              margin:vmargin,
              config
            }
  } 

paragraphBlock = 
  vmargin:$(_) 
  marker:markerFor  name:identifier _ config:pod_configuration
  content:$(!emptyline text_content)*
  { 
      return { 
              type:'block',
              content: content === "" ? [] 
                                    : [
                                        {
                                          type:'para',
                                          content:[ 
                                                    {
                                                      type:'text',
                                                      value:content
                                                    }
                                                  ],
                                          margin:vmargin,
                                          text:content
                                        }
                                      ],
              name,
              margin:vmargin,
              config
            }
  } 

identifier = $([a-zA-Z][a-zA-Z0-9_-]+)

___ "whitespace"
  = [\r\n \t\u000C]*

__ "space characters"
  = [\r\n \t\u000C]*



