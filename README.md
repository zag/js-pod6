# pod6

Pod6 is an easy-to-use markup language.

## Usage

```
yarn add pod6
```
Export to *html*:

```
var toHtml = require('pod6').toHtml
toHtml().run(`=begin pod
 This is an ordinary paragraph
=end pod`)
```

Get parser's *tree*:

```
 var parse = require('pod6').parse
 var tree =  parse(`=begin pod
 This is an ordinary paragraph

    While this is not
    This is a code block
    
    =head1 Mumble mumble
    
    Suprisingly, this is not a code block
        (with fancy indentation too)

But this is just a text. Again

=end pod`)
```

Convert pod6 from cli:

```
npx -p pod6 pod6html < example.pod6 > example.html
```

Test [Pod6 online at https://pod6.in](https://pod6.in)


### Pod configuration

Example of configuration information for the block:

```
=begin pod
=for DESCRIPTION :title<presentation template>
=                :author<John Brown> :pubdate(2011)
=end pod
```

This information is used in different ways by different types of blocks,
but is always specified using Raku-ish option pairs [2]. That is, any of:


```
Value is...       Specify with...           Or with...            Or with...
===============   =======================   =================   ===========
List              :key[$e1,$e2,...]         :key($e1,$e2,...)
List              :key<1 2 3>                :key[1,2,3]       key => [1,2,3]
Hash              :key{$k1=>$v1,$k2=>$v2}
Boolean (true)    :key                      :key(True)
Boolean (false)   :!key                     :key(False)
String            :key<str>                 :key('str')         :key("str")
Number            :key(42)                  :key(2.3) 
```

For example:

```
=begin table :k1(2.3) :k2[-2.3] :k3[+1e4] :k4(3.1e+04) :k5[-3.1E-04]
foo
=end table
```
or 

```
=begin table :k1{a => 1, 2 => 'b', c => True, d => 2.3, e => False}
foo
=end table
```

### Tables

```
=begin table
        The Shoveller   Eddie Stevens     King Arthur's singing shovel
        Blue Raja       Geoffrey Smith    Master of cutlery
        Mr Furious      Roy Orson         Ticking time bomb of fury
        The Bowler      Carol Pinnsler    Haunted bowling ball
=end table
```

```
=table
    Constants           1
    Variables           10
    Subroutines         33
    Everything else     57
```

```
=for table
    mouse    | mice
    horse    | horses
    elephant | elephants
```

```
=table
    Animal | Legs |    Eats
    =======================
    Zebra  +   4  + Cookies
    Human  +   2  +   Pizza
    Shark  +   0  +    Fish
```

```
=table
        Superhero     | Secret          |
                      | Identity        | Superpower
        ==============|=================|================================
        The Shoveller | Eddie Stevens   | King Arthur's singing shovel
```

```
=begin table :caption('Super table')
                        Secret
        Superhero       Identity          Superpower
        =============   ===============   ===================
        The Shoveller   Eddie Stevens     King Arthur's
                                          singing shovel

        Blue Raja       Geoffrey Smith    Master of cutlery

        Mr Furious      Roy Orson         Ticking time bomb
                                          of fury

        The Bowler      Carol Pinnsler    Haunted bowling ball

=end table
```

```
=table
    X | O |
   ---+---+---
      | X | O
   ---+---+---
      |   | X
```

```
=table
    X   O
   ===========
        X   O
   ===========
            X
```
## Macro aliases

The `=alias` directive provides a way to define lexically scoped
synonyms for longer Pod sequences, (meta) object declarators from the
code, or even entire chunks of ambient source. These synonyms can then
be inserted into subsequent Pod using the `A<>`

For example:

    =alias PROGNAME    Earl Irradiatem Evermore
    =alias VENDOR      4D Kingdoms
    =alias TERMS_URLS  =item L<http://www.4dk.com/eie>
    =                  =item L<http://www.4dk.co.uk/eie.io/>
    =                  =item L<http://www.fordecay.ch/canttouchthis>
    
    The use of A<PROGNAME> is subject to the terms and conditions
    	laid out by A<VENDOR>, as specified at:
    
    A<TERMS_URLS>

## Try pod6 online

You can test pod6 at [pod6.in](https://pod6.in) site.
I'd appreciate it if you'd report any mistakes to the tracker[4]


## Authors

{js-pod6} was written by [Alexandr Zahatski](https://github.com/zag)

## Copyright

Copyright (C) 2019-2020 [Alexander Zahatski](https://zahatski.com).
Free use of this software is granted under the terms of the MIT License.

For the full text of the license, see the [LICENSE](https://github.com/zag/js-pod6/blob/master/LICENSE) file. 

## Links 

[1] Specification of pod6: [Synopsis 26](https://github.com/perl6/specs/blob/master/S26-documentation.pod) 

[2] Synopsis 2: [Bits and Pieces](https://github.com/Raku/old-design-docs/blob/master/S02-bits.pod)

[3] Pod6 online editor: [Pod6 to HTML online](https://pod6.in)

[4] pod6 issues tracker: [https://github.com/zag/js-pod6/issues](https://github.com/zag/js-pod6/issues) 


```

```