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
    ::
        :-  %metadata
        %-  hari-state:meta
        ?>(?=([%0 %hari *] metadata.fon) metadata.fon)
    ==
  ::  +meta: meta-enjs functions
  ::
  ++  meta
    |%
    ++  admin
      |=  =admin:meta:f
      %+  frond  ?:(wat.admin %add %rem)
      ?-  -.admin
          %tag
        (pairs ~[foundation+s/fon.admin tag+s/tag.admin])
      ::
          %folder
        (pairs ~[foundation+s/fon.admin folder+s/fol.admin])
      ==
    ++  hari-state
      |=  [%0 %hari hari:states:meta:f]
      %-  pairs
      :~  public+(rama-state [%0 %rama public])
      ::
        :-  %secret
        %-  pairs
        :~
          :-  %proposed-tags
          a/(turn ~(tap in proposed-tags.secret) (lead %s))
        ::
          :+  %unique-views  %a
          %+  turn  ~(tap by unique-views.secret)
          |=  [id=@ud who=(set @p)]
          %-  pairs
          :~  id+s/(scot %ud id)
              post-time+(sect `@da`id)
              who+a/(turn ~(tap in who) ships)
          ==
        ==
      ==
    ++  rama-state
      |=  [%0 %rama rama:states:meta:f]
      %-  pairs
      :~
        :+  %views  %a
        %+  turn  ~(tap by views)
        |=  [post=@ud views=@ud]
        %-  pairs
        :~  id+s/(scot %ud post)
            post-time+(sect `@da`post)
            views+(numb views)
        ==
      ::
        :+  %folders  %a
        %+  turn  ~(tap by folders)
        |=  [fol=term wic=(set @ud)]
        %-  pairs
        :~  folder+s/fol
        ::
          :+  %posts  %a
          %+  turn  ~(tap in wic)
          |=  id=@ud
          (pairs ~[id+s/(scot %ud id) post-time+(sect `@da`id)])
        ==
      ::
        :+  %tags  %a
        %+  turn  ~(tap by tags)
        |=  [tag=term wic=(set @ud)]
        %-  pairs
        :~  tag+s/tag
        ::
          :+  %posts  %a
          %+  turn  ~(tap in wic)
          |=  id=@ud
          (pairs ~[id+s/(scot %ud id) post-time+(sect `@da`id)])
        ==
      ::
        :+  %authors  %a
        %+  turn  ~(tap by authors)
        |=  [who=@p wic=(set @ud)]
        %-  pairs
        :~  author+(ships who)
        ::
          :+  %posts  %a
          %+  turn  ~(tap in wic)
          |=  id=@ud
          (pairs ~[id+s/(scot %ud id) post-time+(sect `@da`id)])
        ==
      ==
    --
  ::  +rama: rama-enjs functions
  ::
  ++  rama
    |%
    ++  share  `$-(? json)`|=(a=? ((lead %b) a))
    ::
    ++  store-diff
      |=  [[wen=@da flg=flag wic=@da] wat=?]
      ?.  wat
        (frond del+(frond saved+(frond key+s/(scot %ud wen))))
      =-  (frond add+(frond saved+(pairs -)))
      :~  key+s/(scot %ud wen)
          added+(sect wen)
          provider+(flap flg)
          id+s/(scot %ud wic)
          post-time+(sect wic)
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
      =-  a/-
      %+  turn
        (bap:((on @da ,[flag @da]) gth) save)
      |=  [wen=@da wer=flag wat=@da]
      %-  pairs                                         ::  XX: note we send key
      :~  key+s/(scot %ud wen)                          ::   because of bad time
          added+(sect wen)                              ::   conversion to unix.
          provider+(flap wer)
          id+s/(scot %ud wat)
          post-time+(sect wat)
      ==
    ::
    ++  rama-only
      |=  =action:rama:f
      ?+    -.action  !!
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
            id+s/(scot %ud id.action)
            post-time+(sect `@da`id.action)
        ==
      ::
          %trash
        (frond del+(frond saved+(frond key+s/(scot %ud wen.action))))
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
            details+(foundation [f ~ ~ [%0 [%rama ~ ~ ~ ~]]])
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
          %found
        %+  frond  %add
        %-  pairs
        :~  name+s/fon.admin
            almoners+a/~
            janitors+a/~
        ::
            :-  %metadata
            %-  hari-state:meta
            [%0 %hari [~ ~ ~ ~] ~ ~]
        ==
      ::
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
  ++  time  (cu |=(i=@t (rash i dem)) so)
  ++  verses  (ar verse:dejs:d-j)
  ++  admin-meta
    ^-  $-(json admin:meta:f)
    %-  of
    :~  tag+(ot ~[fon+so wat+bo tag+so])
        folder+(ot ~[fon+so wat+bo folder+so])
    ==
  ++  rama-only
    ^-  $-(json action:rama:f)
    %-  of
    :~  enter+(ot ~[who+(se %p) fon+so])
        leave+(ot ~[who+(se %p) fon+so])
        watch+(se %p)
        share+bo
        store+(ot ~[who+(se %p) fon+so id+time])
        trash+time
    ::
      :-  %views
      %+  cu
        |=([p=@p q=@t r=@ud] [p q]^r)
      (ot ~[who+(se %p) fon+so wat+time])
    ==
  ++  schizo
    ^-  $-(json write:actions:hari:f)
    %+  cu
      |=  [f=@t t=@t c=@t v=(list verse:d) m=[%0 write:meta:f]]
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
  ++  tag-note  (ot ~[fon+so item+time tag+so])
  ++  del-note  (ot ~[fon+so item+time])
  ++  fix-note
      %+  cu
        |=  [f=@t i=@ud v=(list verse:d) m=[@t (set @t)]]
        [f i v [%0 m]]
      %-  ot
      :~  fon+so
          item+time
          ver+verses
          met+(ot ~[fol+so tag+(as so)])
      ==
  ++  add-note
    %+  cu
      |=  [f=@t t=@t c=@t v=(list verse:d) m=[@t (set @t)]]
      [f t c v [%0 m]]
    %-  ot
    :~  fon+so
        tit+so
        cov+so
        ver+verses
        met+(ot ~[fol+so tag+(as so)])
    ==
  --
--
