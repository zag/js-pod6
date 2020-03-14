Expression
= ( allowed_rules / code / text / raw_text )*
// = ( allowed_rules / code / (text / raw_text)+ {return {type:'text', value:text()}} )*

allowed_rules = code_C / code_S / code_V / code_Z
allowed_code = ('B' / 'C' / 'I' / 'S' / 'V' / 'Z')

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
     (!'<' .) '<' text_L '>'  &{ console.log({content:text()}); return true}
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
    name:start_code &{return name === "Z"}
    content: $(!end_code .)+
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
        )+ end_code  
{ return {content, type:'fcode', name}} 
text = text:$( '<' text '>' / looks_like_code / not_code )+ {return text}
not_code = text:$(!end_code !start_code !looks_like_code .)+ {return text}
looks_like_code =(!allowed_code .) '<' not_code '>' {return text()}
