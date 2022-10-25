/-  *foundation, dia=diary
/+  d=diary-json
|_  almo=write:actions:hari
++  grad  %noun
++  grow
  |%
  ++  noun  almo
  --
++  grab
  |%
  ++  noun  write:actions:hari
  ++  json
    %-  write:actions:hari
    =,  dejs:format
    %+  cu
      |=([f=@t c=@t v=(list verse:dia)] [%add-note f c v %$])
    (ot ~[fon+so cov+so ver+(ar verse:dejs:d)])
  --
--