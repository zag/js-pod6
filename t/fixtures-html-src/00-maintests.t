# test implicit para
#---
=begin pod
  =begin para
  sdsd
   sdasd
 
        ddsds
  d
  =end para
=end pod
#---

# test vmargin
#---
=begin pod
  twest
  =for para
  sdsdsdsd

  jjj
=end pod
#---

# test Named blocks
#---
=begin pod
=for Named
  text
=begin Named
sdsdsdsd ssd s
  asdasdasdasd

dd
=end Named

=end pod
#---

#---
=head1 Test

text

=head2 Testing
continue

test

#---


#  Value is...       Specify with...           Or with...            Or with...
#  ===============   =======================   =================   ===========
#  List              :key[$e1,$e2,...]         :key($e1,$e2,...)
#  Hash              :key{$k1=>$v1,$k2=>$v2}
#  Boolean (true)    :key                      :key(True)
#  Boolean (false)   :!key                     :key(False)
#  String            :key<str>                 :key('str')         :key("str")
#  Number            :key(42)                  :key(2.3)


#---
=begin pod
The seven suspects are:

=item  Happy
=item  Dopey
=item  Sleepy
=item  Bashful
=item  Sneezy
=item  Grumpy
=item  Keyser Soze
=end pod
#---


#---
=item # Happy
=item Sneezy
#---

#---
=comment Tesxt
=begin code 
Some code
=end code

#---

// Test defn lists
#---
=begin defn

I<T>erm

Some para
=end defn
=defn I<T>ERM
text
#---

#---
=begin defn

I<T>erm1

Some para
=end defn
=defn I<T>ERM
text
#---
