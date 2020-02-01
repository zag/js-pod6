Expression
 = ( code_S / code_C / code_V / code_L / code_Z / code / text / raw_text )*
raw_text= $(.) // { return {raw: text()}}
code_V = 
    name:start_code &{return name === "V"}
    content: $( code / text )+
    end_code
     {
         return  { 
                content,
                'type':"fcode",
                name,
             }
    }
code_C = 
    name:start_code &{return name === "C"}
    content: ( code / text )+
    end_code
     {
         return  { 
                content,
                'type':"fcode",
                name,
             }
    }
separator = '|'
text_L = $( '<' text_L '>' / !separator !end_code !start_code !looks_like_code . )+
code_L = 
    name:start_code &{return name === "L"}
    content: (
                code / text_L 
             ) 
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
code_S = 
    name:start_code &{return name === "S"}
    content: $(!end_code .)+
    end_code
     {
         return  { 
                content,
                'type':"fcode",
                name,
             }
    }

code_Z = 
    name:start_code &{return name === "S"}
    content: $(!end_code .)+
    end_code
     {
         return  { 
                content,
                'type':"fcode",
                name,
             }
    }

allowed_code = ( 'V' / 'R' / 'B' / 'I' / 'C' / 'L' / 'S' / 'Z')
start_code = name:$(allowed_code) '<' { return name }
end_code = '>'
code =  name:start_code content:(  
          code / text
        )+ end_code  
{ return {content, type:'fcode', name}} 
text = text:$( '<' text '>' / looks_like_code / not_code )+ {return text}
not_code = text:$(!end_code !start_code !looks_like_code .)+ {return text}
looks_like_code =(!allowed_code .) '<' not_code '>' {return text()}
