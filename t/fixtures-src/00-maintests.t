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

# item block
#

=begin pod
  =for item 
   Test message
=end pod


=begin pod
    =head1 This is a heading block

    This is an ordinary paragraph.
    Its text  will   be     squeezed     and
    short lines filled. It is terminated by
    the first blank line.

    This is another ordinary paragraph.
    Its     text    will  also be squeezed and
    short lines filled. It is terminated by
    the trailing directive on the next line.
        =head2 This is another heading block

        This is yet another ordinary paragraph,
        at the first virtual column set by the
        previous directive
=end pod
