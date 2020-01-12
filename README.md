# pod6

Pod6 is an easy-to-use markup language.

## Usage

```
 var parse = require('pod6').parse
 parse(`=begin pod
 This is an ordinary paragraph

    While this is not
    This is a code block

    =head1 Mumble mumble

    Suprisingly, this is not a code block
        (with fancy indentation too)

But this is just a text. Again

=end pod`)
```

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

## Links 

[1] Specification of pod6: [Synopsis 26](https://github.com/perl6/specs/blob/master/S26-documentation.pod) 

[2] Synopsis 2: [Bits and Pieces](https://github.com/Raku/old-design-docs/blob/master/S02-bits.pod)

