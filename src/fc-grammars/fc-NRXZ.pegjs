Expression
= ( allowed_rules / code / text / raw_text )*
// = ( allowed_rules / code / (text / raw_text)+ {return {type:'text', value:text()}} )*

allowed_rules = code_X / code_Z
allowed_code = ('N' / 'R' / 'X' / 'Z')

raw_text= $(.)

code_V = 
    name:start_code &{return name === "V"}
    content: $( text_C )+ 
    end_code
     {  
         return  { 
                content,
                'type':"fcode",
                name,
             }
    }
allowed_code_C =('B')
looks_like_code_C =(!allowed_code_C .) '<' not_code '>' {return text()}
text_C = text:$( (!'<' .)? '<' text_C? '>' / looks_like_code_C / not_code )+ {return text}
code_C = 
    name:start_code &{return name === "C"}
    content:( text_C )+
    end_code
     {
         return  { 
                content,
                'type':"fcode",
                name,
             }
    }
separator = '|'
text_L = $(
     (!'<' .) '<' text_L '>'
    / 
    !separator !end_code !start_code !looks_like_code . )+ 
code_L = 
    name:start_code &{return name === "L"}
            
    content: (
               code_C  /  text_L 
             )+ 
     
     meta:(
            separator t:$(!end_code .)*  { return t }
           )?
     end_code
     {
         return  { 
                content,
                'type':"fcode",
                name,
                meta
             }
    }
item = $(!';' !end_code .)+
hs = [ \u00a0\u2001\t\u000C\u2008]
array_items = 
          code:item hs*  ';' hs* codes:array_items 
                            { return [ code, codes ].flat() }
          / code:item { return [code] }

code_X = 
    name:start_code &{return name === "X"}
            
    content: ( text_L )*
     
     entry:(
           separator t:array_items*  { return t.flat() }
           )?
     end_code
     {
         return  { 
                content,
                'type':"fcode",
                name,
                entry
             }
    }
code_S = 
    name:start_code &{return name === "S"}
    content: $(!end_code .)*
    end_code
     {
         return  { 
                content,
                'type':"fcode",
                name,
             }
    }

code_Z = 
    name:start_code &{return name === "Z"}
    content: $(!end_code .)*
    end_code
     {
         return  { 
                content,
                'type':"fcode",
                name,
             }
    }


start_code = name:$(allowed_code) '<' { return name }
end_code = '>'
code =  name:start_code &{ return name !== 'C' } content:(  
          allowed_rules / code / text 
        )* end_code  
{ return {content, type:'fcode', name}}
empty =  $(!end_code .)*
text = text:$( '<' text '>' / looks_like_code / not_code )+ {return text}
not_code = text:$(!end_code !start_code !looks_like_code .)+ {return text}
looks_like_code =(!allowed_code .) '<' not_code '>' {return text()}
