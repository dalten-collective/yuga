/-  f=foundation, d=diary
/+  d-j=diary-json
|%
+$  flag  (pair ship term)
++  enjs
  =,  enjs:format
  |%
  ++  ships  `$-(@p json)`|=(p=@p ((lead %s) (scot %p p)))
  ++  flap
    ^-  $-(flag json)
    |=  f=flag
    ^-  json
    s/(rap 3 (scot %p p.f) '/' q.f ~)
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
  ++  foundations
    |=  fons=(map term foundation:hari:f)
    ^-  json
    %+  frond  %foundations
    :-  %a
    %+  turn  ~(tap by fons)
    |=  (pair term foundation:hari:f)
    (pairs ~[name+s/p foundation+(foundation q)])
  ++  foundation
    |=  fon=foundation:hari:f
    ^-  json
    %-  pairs
    :~  provider+(flap provider.fon)
        almoners+a/(turn ~(tap in almoners.fon) ships)
        janitors+a/(turn ~(tap in janitors.fon) ships)
    ==
  ++  rama-poke
    |_  [bol=bowl:gall foundations=(map term [? foundation:hari:f])]
    ++  rama-only
      |=  =action:rama:f
      ?-    -.action
        %watch  (frond add+(frond host+(ships who.action)))
      ::
          %enter
        =-  (frond put+(pairs -))
        :~  host+(ships who.action)
            name+s/fon.action
            subscribed+b/%.y
        ==
      ::
          %leave
        =-  (frond put+(pairs -))
        :~  host+(ships who.action)
            name+s/fon.action
            subscribed+b/%.y
        ==
      ==
    ++  rehydrate
      |=  [w=@p f=flag =admin:actions:hari:f]
      ^-  json
      ?-    -.admin
          %found
        =-  (frond put+(pairs -))
        :~  host+(ships w)
            name+s/q.f
            subscribed+b/%.n
            details+(foundation [f ~ ~ %$])
        ==
      ::
        %close
        =-  (frond del+(pairs -))
        :~  host+(ships w)
            name+s/q.f
        ==
      ::
        %add-almoners
        =-  (frond add+(pairs -))
        :~  host+(ships w)
            name+s/q.f
            almoners+a/(turn ~(tap in who.admin) ships)
        ==
        %del-almoners
        =-  (frond del+(pairs -))
        :~  host+(ships w)
            name+s/q.f
            almoners+a/(turn ~(tap in who.admin) ships)
        ==
        %add-janitors
        =-  (frond add+(pairs -))
        :~  host+(ships w)
            name+s/q.f
            janitors+a/(turn ~(tap in who.admin) ships)
        ==
        %del-janitors
        =-  (frond del+(pairs -))
        :~  host+(ships w)
            name+s/q.f
            janitors+a/(turn ~(tap in who.admin) ships)
        ==
      ==
    --
  ++  hari-poke
    |_  [bol=bowl:gall fon=(map term foundation:hari:f)]
    ++  admin
      |=  =admin:actions:hari:f
      ^-  json
      ?-    -.admin
          %found
        =+  nam=(cat 3 fon.admin '-paedia')
        =;  faun=json
          %+  frond  %add
          (pairs ~[name+s/fon.admin foundation+faun])
        %-  pairs
        :~  provider+(flap [our.bol nam])
            almoners+a/~
            janitors+a/~
        ==
      ::
          %close
        (frond rem+(frond name+s/fon.admin))
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
    :~  enter+(ot ~[fon+so who+(se %p)])
        leave+(ot ~[fon+so who+(se %p)])
        watch+(se %p)
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
