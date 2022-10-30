/-  f=foundation, d=diary
/+  d-j=diary-json
|%
+$  flag  (pair ship term)
++  enjs
  =,  enjs:format
  |%
  ++  ships  `$-(@p json)`|=(p=@p ((lead %s) (scot %p p)))
  ::
  ++  flap
    ^-  $-(flag json)
    |=  f=flag
    ^-  json
    s/(rap 3 (scot %p p.f) '/' q.f ~)
  ::
  ++  foundations
    |=  fons=(map term foundation:hari:f)
    ^-  json
    %+  frond  %foundations
    :-  %a
    %+  turn  ~(tap by fons)
    |=  (pair term foundation:hari:f)
    (pairs ~[name+s/p foundation+(foundation q)])
  ::
  ++  foundation
    |=  fon=foundation:hari:f
    ^-  json
    %-  pairs
    :~  provider+(flap provider.fon)
        almoners+a/(turn ~(tap in almoners.fon) ships)
        janitors+a/(turn ~(tap in janitors.fon) ships)
    ==
  ::  +rama: rama-enjs functions
  ::
  ++  rama
    |%
    ++  share  `$-(? json)`|=(a=? ((lead %b) a))
    ::
    ++  store-diff
      |=  [[wen=@da flg=flag wic=@da] wat=?]
      ?.  wat
        (frond del+(frond saved+(frond key+(numb `@ud`wen))))
      =-  (frond add+(frond saved+(pairs -)))
      :~  key+(numb `@ud`wen)
          added+(sect wen)
          provider+(flap flg)
          id+(numb `@ud`wic)
      ==
    ::
    ++  state-0
      |=  $:  %0
              hos=(jug @p [@t [? foundation:hari:f]])
              sav=((mop @da ,[flag @da]) gth)
              sha=?
          ==
      ^-  json
      %+  frond  %put
      %-  pairs
      ~[hosts+(hosts hos) saved+(saved sav) share+b/sha]
    ::
    ++  hosts
      |=  host=(jug @p [term [? foundation:hari:f]])
      ^-  json
      %+  frond  %hosts
      :-  %a
      %+  turn  ~(tap by host)
      |=  (pair @p (set [t=term [h=? f=foundation:hari:f]]))
      %-  pairs
      :~  host+(ships p)
      ::
        :+  %foundations  %a
        %+  turn  ~(tap in q)
        |=  (pair term [h=? f=foundation:hari:f])
        %-  pairs
        :~  name+s/p
            subscribed+b/h.q
            details+(foundation f.q)
        ==
      ==
    ::
    ++  saved
      |=  save=((mop @da ,[flag @da]) gth)
      ^-  json
      =-  (frond put+(frond saved+a/-))
      %+  turn
        (bap:((on @da ,[flag @da]) gth) save)
      |=  [wen=@da wer=flag wat=@da]
      %-  pairs                                         ::  XX: note we send key
      :~  key+(numb `@ud`wen)                           ::   because of bad time
          added+(sect wen)                              ::   conversion to unix.
          provider+(flap wer)
          id+(numb `@ud`wat)
      ==
    ::
    ++  rama-only
      |=  =action:rama:f
      ?-    -.action
        %watch  (frond add+(frond hosts+(ships who.action)))
      ::
          %enter
        =-  (frond put+(frond hosts+(pairs -)))
        :~  host+(ships who.action)
            name+s/fon.action
            subscribed+b/%.y
        ==
      ::
          %leave
        =-  (frond put+(frond hosts+(pairs -)))
        :~  host+(ships who.action)
            name+s/fon.action
            subscribed+b/%.y
        ==
      ::
          %share
        (frond put+(frond share+b/+.action))
      ::
          %store
        =-  (frond add+(frond saved+(pairs -)))
        :~  host+(ships who.action)
            name+s/fon.action
            post+(numb id.action)
        ==
      ::
          %trash
        (frond del+(frond saved+(frond key+(numb wen.action))))
      ==
    ::
    ++  rehydrate
      |=  [f=flag =admin:actions:hari:f]
      ^-  json
      ?-    -.admin
          %found
        =-  (frond put+(pairs -))
        :~  host+(ships p.f)
            name+s/q.f
            subscribed+b/%.n
            details+(foundation [f ~ ~ %$])
        ==
      ::
        %close
        =-  (frond del+(pairs -))
        :~  host+(ships p.f)
            name+s/q.f
        ==
      ::
        %add-almoners
        =-  (frond add+(pairs -))
        :~  host+(ships p.f)
            name+s/q.f
            almoners+a/(turn ~(tap in who.admin) ships)
        ==
        %del-almoners
        =-  (frond del+(pairs -))
        :~  host+(ships p.f)
            name+s/q.f
            almoners+a/(turn ~(tap in who.admin) ships)
        ==
        %add-janitors
        =-  (frond add+(pairs -))
        :~  host+(ships p.f)
            name+s/q.f
            janitors+a/(turn ~(tap in who.admin) ships)
        ==
        %del-janitors
        =-  (frond del+(pairs -))
        :~  host+(ships p.f)
            name+s/q.f
            janitors+a/(turn ~(tap in who.admin) ships)
        ==
      ==
    --
  ++  hari
    |%
    ++  state-0
      |=  [%0 fons=(map term foundation:hari:f)]
      (frond put+(foundations fons))
    ::
    ++  admin
      |=  =admin:actions:hari:f
      ^-  json
      ?-    -.admin
        %found  (frond add+(frond name+s/fon.admin))
        %close  (frond rem+(frond name+s/fon.admin))
      ::
          %add-almoners
        %+  frond  %add
        %-  pairs
        :~  name+s/fon.admin
            almoners+a/(turn ~(tap in who.admin) ships)
        ==
      ::
          %del-almoners
        %+  frond  %rem
        %-  pairs
        :~  name+s/fon.admin
            almoners+a/(turn ~(tap in who.admin) ships)
        ==
      ::
          %add-janitors
        %+  frond  %add
        %-  pairs
        :~  name+s/fon.admin
            janitors+a/(turn ~(tap in who.admin) ships)
        ==
      ::
          %del-janitors
        %+  frond  %rem
        %-  pairs
        :~  name+s/fon.admin
            janitors+a/(turn ~(tap in who.admin) ships)
        ==
      ==
    --
  --
::
++  dejs
  =,  dejs:format
  |%
  :: ++  ship  (su ;~(pfix sig fed:ag))
  :: ++  flag  `$-(json ^^flag)`(su flag-rule)
  :: ++  flag-rule  ;~((glue fas) ;~(pfix sig fed:ag) sym)
  ++  verses  (ar verse:dejs:d-j)
  ++  rama-only
    %-  of
    :~  enter+(ot ~[who+(se %p) fon+so])
        leave+(ot ~[who+(se %p) fon+so])
        watch+(se %p)
        share+bo
        store+(ot ~[who+(se %p) fon+so id+ni])
        trash+ni
    ==
  ++  schizo
    ^-  $-(json write:actions:hari:f)
    %+  cu
      |=  [f=@t t=@t c=@t v=(list verse:d) m=_%$]
      [%add-note f t c v m]
    add-note
  ++  somber
    ^-  $-(json clean:actions:hari:f)
    %-  of
    :~  fix-note+fix-note
        del-note+del-note
        tag-note+tag-note
    ==
  ++  seldon
    ^-  $-(json admin:actions:hari:f)
    %-  of
    :~  found+(ot ~[fon+so])
        close+(ot ~[fon+so])
      ::
        add-almoners+(ot ~[fon+so who+(as (se %p))])
        del-almoners+(ot ~[fon+so who+(as (se %p))])
      ::
        add-janitors+(ot ~[fon+so who+(as (se %p))])
        del-janitors+(ot ~[fon+so who+(as (se %p))])
    ==
  ++  parcel
    ^-  $-(json parcel:rama:f)
    %+  cu
      |=  $:  who=@p
              wat=$%(clean:actions:hari:f write:actions:hari:f)
          ==
      [who wat]
    %-  ot
    :~  who+(se %p)
    ::
      :-  %wat
      %-  of
      :~  del-note+del-note
          tag-note+tag-note
          fix-note+fix-note
          add-note+add-note
      ==
    ==
  ++  tag-note  (ot ~[fon+so item+ni tag+so])
  ++  del-note  (ot ~[fon+so item+ni])
  ++  fix-note
      %+  cu
        |=([f=@t i=@ud v=(list verse:d)] [f i v %$])
      (ot ~[fon+so item+ni ver+verses])
  ++  add-note
    %+  cu
      |=([f=@t t=@t c=@t v=(list verse:d)] [f t c v %$])
    (ot ~[fon+so tit+so cov+so ver+verses])
    
  --
--
