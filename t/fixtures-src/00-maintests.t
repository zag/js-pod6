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
=begin table :k1<str> :k2('str') :k3("str") :k4["str"] :k5(Q[str])

=end table
#---

#---
=config table :k1<very long string, comma> :k2<2 23  23 > :k3<'23', 23233, 333>
#---

#---
=code
  sdkljsalkdjlsd
  asdasdasdasdsad
=for code
  sdkljsalkdjlsd
  asdasdasdasdsad
=begin code
  sdkljsalkdjlsd
  asdasdasdasdsad
=end code
#---

#---
=config C<>  :allow<B>
#---

#---
=item # Happy
=item Sneezy
#---

#---
=begin table :k1<str> :k2('str') :k3("str") :k4["str"] :k5(Q[str])
sdsds
=end table
#---


#---
=begin table
asdasdsad   asdasdsdsd    asdasdasdasd
--------------------------------------
asdasdasd   ssadasdasdsd   1sdsdsssdsd
                          2sdsdsdsdsd

asdasdasda       s             \| sss     
=end table
#---
