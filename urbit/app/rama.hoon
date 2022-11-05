::  rama - rendezvous with rama
::
::  - metadata - view count, likes
::  - add to hari a (jug term tags) for tag unification
::  - jug tag id for proposed tags
::  - 
::
/-  d=diary, g=groups, *foundation
/+  dbug, default-agent, verb, c-j=cyclo-json
|%
::  boilerplate
::
+$  card  card:agent:gall
::
+$  versioned-state  $%(state-0)
::  +state-0:
::
::    hosts:  your hosts and foundations
::    saved:  saved posts from your rama
::    share:  turns on/off usage metrics
::
+$  state-0
  $:  %0
      hosts=(jug ship [term [? foundation:hari]])
      saved=((mop @da ,[flag @ud]) gth)
      share=?
  ==
::
--
::
%+  verb  &
%-  agent:dbug
=|  state-0
=*  state  -
::
^-  agent:gall
::
=<
  |_  =bowl:gall
  +*  this  .
      def   ~(. (default-agent this %|) bowl)
      gen   ~(. +> [bowl ~])
  ++  on-init
    ^-  (quip card _this)
    ~>  %bout.[0 '%rama +on-init']
    =^  cards  state
      abet:init:gen
    [cards this]
      
  ::
  ++  on-save
    ^-  vase
    ~>  %bout.[0 '%rama +on-save']
    !>(state)
  ::
  ++  on-load
    |=  ole=vase
    ~>  %bout.[0 '%rama +on-load']
    ^-  (quip card _this)
    =^  cards  state
      abet:(load:gen ole)
    [cards this]
  ::
  ++  on-poke
    |=  cag=cage
    ~>  %bout.[0 '%rama +on-poke']
    ^-  (quip card _this)
    =^  cards  state
      abet:(poke:gen cag)
    [cards this]
  ::
  ++  on-peek
    |=  =path
    ~>  %bout.[0 '%rama +on-peek']
    ^-  (unit (unit cage))
    [~ ~]
  ::
  ++  on-arvo
    |=  [wir=wire sig=sign-arvo]
    ~>  %bout.[0 '%rama +on-arvo']
    ^-  (quip card _this)
    `this
  ::
  ++  on-agent
    |=  [wir=wire sig=sign:agent:gall]
    ~>  %bout.[0 '%rama +on-agent']
    ^-  (quip card _this)
    =^  cards  state
      abet:(dude wir sig)
    [cards this]
  ::
  ++  on-watch
  |=  pat=path
  ~>  %bout.[0 '%rama +on-watch']
  =^  cards  state
    abet:(peer pat)
  [cards this]
  ::
  ++  on-fail
    ~>  %bout.[0 '%rama +on-fail']
    on-fail:def
  ++  on-leave
    ~>  %bout.[0 '%rama +on-init']
    on-leave:def
  --
|_  [bol=bowl:gall dek=(list card)]
+*  dat  .
    or   (scot %p our.bol)
    no   (scot %da now.bol)
    dok  [our.bol %groups]
    dia  [our.bol %diary]
++  emit  |=(=card dat(dek [card dek]))
++  emil  |=(lac=(list card) dat(dek (welp lac dek)))
++  abet
  ^-  (quip card _state)
  [(flop dek) state]
::  +show: forward to web-ui
::
++  show  |=(=cage (emit [%give %fact ~[/web-ui] cage]))
::
++  init
  ^+  dat
  ::  XX: maybe provide a default server
  ::  (relay:view ~zod)
  dat
::
++  load
  |=  vaz=vase
  ^+  dat
  ?>  ?=([%0 *] q.vaz)
  =.  state  !<(state-0 vaz)
  dat
::  +peer: handle being watched
::
++  peer
  |=  pol=(pole knot)
  ^+  dat
  ?+    pol  dat
      [%web-ui ~]
    ?>  =(our.bol src.bol)
    (show rama-state+!>(`state-0`state))
  ==
::  +view: handle watching things
::
++  view
  |%
  ::  +relay: watch hari on some ship
  ::
  ++  relay
    |=  p=@p
    ^+  dat
    =/  wir  /relay/(scot %p p)
    (emit [%pass wir %agent [p %hari] %watch /relay])
  ::  +metas: watch hari on some ship, metadata
  ++  metas
    |=  p=@p
    ^+  dat
    =/  wir  /metas/(scot %p p)
    (emit [%pass wir %agent [p %hari] %watch /metas])
  --
::  +meat: metadata handling
::
++  meat
  |=  [w=@p report:meta]
  ?>  =(w p.p)
  |^  ^+  dat
    ?-  -.q
      %result  (results +.q)
      %admin   (admins +.q)
    ==
  ++  fauna
    ^-  (map term [? foundation:hari])
    (~(got by hosts) p.p)
  ++  faun
    ^-  [? foundation:hari]
    (~(got by fauna) q.p)
  ++  metas
    ^-  rama:states:meta
    =/  sat-m=[%0 state:meta]
      metadata:faun
    ?>(?=([%0 %rama *] sat-m) +>.sat-m)
  ++  admins
    |=  a=admin:meta
    =/  fun=[hav=? foundation:hari]  faun
    =/  met=rama:states:meta  metas
    ?-    -.a
        %tag
      =.  metadata.fun
        :+  %0
          %rama
        %=    met
            tags
          ?.  wat.a
            (~(del by tags.met) tag.a)
          (~(put by tags.met) tag.a ~)
        ==
      %.  meta-admin+!>([%tag fon.a wat.a tag.a])
      %=    show
          hosts
        (~(put by hosts) p.p (~(put by fauna) fon.a fun))
      ==
    ::
        %folder
      =.  metadata.fun
        :+  %0
          %rama
        %=    met
            folders
          ?.  wat.a
            (~(del by folders.met) fol.a)
          (~(put by folders.met) fol.a ~)
        ==
      %.  meta-admin+!>([%folder fon.a wat.a fol.a])
      %=    show
          hosts
        (~(put by hosts) p.p (~(put by fauna) fon.a fun))
      ==
    ==
  ++  results
    |=  r=result:meta
    =/  fun=[hav=? foundation:hari]  faun
    =/  met=rama:states:meta  metas
    ?-    r
        [%set-views *]
      =.  metadata.fun
        :+  %0  %rama
        met(views (~(uni by views.met) views.r))
      %=    dat
          hosts
        (~(put by hosts) p.p (~(put by fauna) q.p fun))
      ==
    ::
        [%add-tag *]
      =.  metadata.fun
        :+  %0  %rama
        met(tags (~(put ju tags.met) it.r item.r))
      %=   dat
          hosts
        (~(put by hosts) p.p (~(put by fauna) q.p fun))
      ==
    ::
        [%set-tags *]
      =.  tags.met
        =/  tug=(jug term @ud)
          %-  ~(run by tags.met)
          |=(t=(set @ud) (~(del in t) item.r))
        =+  lem=~(tap in them.r)
        |-  ?~  lem  tug
        $(lem t.lem, tug (~(put ju tug) i.lem item.r))
      =.  metadata.fun  [%0 %rama met]
      %=    dat
          hosts
        (~(put by hosts) p.p (~(put by fauna) q.p fun))
      ==
    ::
        [%set-folder *]
      =.  folders.met
        %.  [dest.r item.r]  %~  put  ju
        %-  ~(run by folders.met)
        |=(t=(set @ud) (~(del in t) item.r))
      =.  metadata.fun  [%0 %rama met]
      %=    dat
          hosts
        (~(put by hosts) p.p (~(put by fauna) q.p fun))
      ==
    ::
        [%all %rama *]
      %=    dat
          hosts
        %+  ~(put by hosts)  p.p
        (~(put by fauna) q.p fun(metadata [%0 %rama +>.r]))
      ==
    ==
  --
::  +land:
::
::    land manages interactions with groups
::    this naming convention is a result of
::    a long standing misnaming of desks in
::    a prior version of the tlon app suite
::
++  land
  |_  =flag
  +*  der  (scot %p p.flag)
      nam  (scot %tas q.flag)
  ::  +reverse: lookup a note by id, see if we're author
  ::
  ++  note
    |=  i=@ud
    ^-  note:d
    .^  note:d
      %gx
      %+  welp
        /[or]/diary/[no]/diary
      /[der]/[nam]/notes/note/(scot %ud i)/noun
    ==
  ::  +host: handle leave/join
  ::
  ++  host
    |=  wat=?
    ^+  dat
    ~_  leaf+"bad-rama-action - cannot find {<q.flag>}"
    =|  emt=(set [term [? foundation:hari]])
    =/  old=[hav=? fon=foundation:hari]
      %.  q.flag
      %~  got  by
      (malt ~(tap in (~(gut by hosts) p.flag emt)))
    =.  hosts
      %.  [p.flag q.flag wat fon.old]
      ~(put ju (~(del ju hosts) p.flag [q.flag old]))
    ::
    =/  pat
      /hosts/(scot %p p.flag)/[q.flag]/(scot %ud wat)
    =-  (emit %pass pat %agent dok %poke -)
    ?.  wat
      [%group-leave !>(flag)]
    [%group-join !>([flag %.n])]
  --
::
++  poke
  |=  [mar=mark vaz=vase]
  |^  ^+  dat
  ?+    mar  ~|(bad-poke-mark/mar !!)
      %rama-only
    =/  act=action:rama  !<(action:rama vaz)
    ~_  leaf+"bad-rama-only - not an allowed action"
    =*  pon  ((on @da ,[flag @ud]) gth)
    ?+    -.act
      %-  ~(host land +.act)
      ?-(-.act %enter %.y, %leave %.n)
    ::
      %share  (show(share +.act) share+!>(+.act))
    ::
      %watch  (relay:view who.act)
    ::
        %views
      ?.  share  dat
      %-  emit
      [%pass / %agent [p.p.act %hari] %poke [mar vaz]]
    ::
        %store
      =+  flag=[who.act fon.act]
      =+  hav=(~(note land flag) id.act)                ::  XX: need exists scry
      =+  new=[now.bol flag id.act]
      %.  store-diff+!>([new %.y])
      show(saved (put:pon saved new))
    ::
        %trash
      =+  wen=`@da`wen.act
      =+  old=[wen (got:pon saved wen)]
      %.  store-diff+!>([old %.n])
      show(saved +:(del:pon saved wen))
    ==
  ::
      %hari-rama
    ~_  leaf+"bad-hari-rama - not an allowed action"
    =/  pak=parcel:rama  !<(parcel:rama vaz)
    =/  foundations=(map term [? foundation:hari])
      (malt ~(tap in (~(gut by hosts) p.pak ~)))
    ?~  dat=(~(get by foundations) fon.q.pak)
      ~|(bad-foundation/fon.q.pak !!)
    =/  perms=(pair ? ?)                                :: [p=almoner q=janitor]
      :-  (~(has in almoners.u.dat) our.bol)
      (~(has in janitors.u.dat) our.bol)
    ?+  -.q.pak
      ?>(q.perms (forward p.pak hari-somber+!>(q.pak)))
    ::
        %add-note
      ?>(p.perms (forward p.pak hari-schizo+!>(q.pak)))
    ::
        %fix-note
      ?>  |(q.perms (reverse provider.u.dat item.q.pak))
      (forward p.pak hari-somber+!>(q.pak))
    ==
  ==
  ::  +forward: send from rama to hari
  ::
  ++  forward
    |=  [p=@p q=cage]
    =/  pat  /fwd/(scot %p p)
    (emit %pass pat %agent [p %hari] %poke q)
  ::  +reverse: lookup a note by id, see if we're author
  ::
  ++  reverse
    |=  [f=flag i=@ud]
    =(our.bol author:(~(note land f) i))
  --
::  +dude: handle incoming agent
::
++  dude
  |=  [pol=(pole knot) sig=sign:agent:gall]
  |^  ^+  dat
    ?+    pol  ~|(bad-dude-wire/pol !!)
        [%fwd who=@ ~]
      =/  frm=@p  (slav %p who.pol)
      ?.  ?=(%poke-ack -.sig)  ~|(strange-sign-on/pol !!)
      ~_  leaf+"%rama cannot send to {<frm>}"
      %.  dat
      ?~(p.sig same (slog leaf/"%rama trouble" u.p.sig))
    ::
        [%relay who=@ ~]
      =/  frm=@p  (slav %p who.pol)
      ?+  -.sig  dat
        %kick  (relay:view frm)
        %fact  (rehydrate frm !<(report:rama q.cage.sig))
          %watch-ack
        %.  dat
        ?~  p.sig  same
        %-  slog                                        :: XX: and clean groups?
        :_  u.p.sig
        leaf/"%rama cannot watch {(scow %p who.pol)}'s relay"
      ==
    ::
        [%metas who=@ ~]
      =/  frm=@p  (slav %p who.pol)
      ?+  -.sig  dat
        %kick  (metas:view frm)
        %fact  (meat frm !<(report:meta q.cage.sig))
          %watch-ack
        %.  dat
        ?~  p.sig  same
        %-  slog                                        :: XX: and clean groups?
        :_  u.p.sig
        leaf/"%rama cannot watch {(scow %p who.pol)}'s metas"
      ==
    ::
        [%hosts who=@ wat=@ wic=@ ~]
      ?.  ?=(%poke-ack -.sig)  ~|(strange-sign-on/pol !!)
      ~_  leaf+"%rama bad groups - strange result"
      =/  wic=@ud   (slav %ud wic.pol)
      =/  who=@p    (slav %p who.pol)
      =/  wat=@tas  (slav %tas wat.pol)
      =|  emt=(set [term [? foundation:hari]])
      =/  old=[hav=? fon=foundation:hari]
        %.  wat  %~  got  by
        (malt ~(tap in (~(gut by hosts) who emt)))
      ?~  p.sig
        ?:  =(0 wic)
          (show rama-only+!>([%enter who wat]))
        (show rama-only+!>([%leave who wat]))
      =.  hosts
        ?:  =(0 wic)
          %.  [who wat [%.n fon.old]]
          ~(put ju (~(del ju hosts) who [wat old]))
        %.  [who wat [%.y fon.old]]
        ~(put ju (~(del ju hosts) who [wat old]))
      ::
      =;  act=tape
        %.  (show hosts+!>(hosts))
        (slog leaf/"%rama can't {act}" u.p.sig)
      %-  welp
      :-  ?:(=(0 wic) "join " "leave ")
      "[{(scow %p who)} {(scow %tas wat)}]"
    ==
  ++  staff
    |=  $:  who=(set ship)
            faun=foundation:hari
            act=?
            wat=?(%alm %jan)
        ==
    ^-  _faun
    =*  del
      |=(a=(set ship) (~(dif in a) who))
    =*  uni
      |=(a=(set ship) (~(uni in a) who))
    %=    faun
        almoners
      ?.  ?=(%alm wat)  almoners.faun
      ?:(act (uni almoners.faun) (del almoners.faun))
    ::
        janitors
      ?.  ?=(%jan wat)  janitors.faun
      ?:(act (uni janitors.faun) (del janitors.faun))
    ==
  ::  +rehydrate:
  ::
  ::    rehydrate takes pokes that hari got
  ::    and interprets them for rama's use.
  ::    this revivification of a stale poke
  ::    reminds us of the re/dehydration of
  ::    players in the game three body from
  ::    the three body problem by cixin liu
  ::
  ::
  ++  rehydrate
    |=  [w=@p f=flag a=admin:actions:hari]
    ?>  =(w p.f)
    =*  h-p
      ~(. rama-poke:enjs:c-j [bol (~(got by hosts) p.f)])
    ^+  dat
    =/  foundations=(map term [? foundation:hari])
      (malt ~(tap in (~(gut by hosts) p.f ~)))
    ?-    -.a
        %found
      ?^  hav=(~(get by foundations) q.f)  dat
      =-  (metas:view:(show(hosts -) rama-report+!>([f a])) w)
      %+  ~(put by hosts)  p.f
      %+  ~(put by foundations)  q.f
      [%.n f ~ ~ [%0 [%rama ~ ~ ~ ~]]]
    ::
        %close
      =-  (show(hosts -) rama-report+!>([f a]))
      =.    foundations
        (~(del by foundations) q.f)
      ?~  foundations  (~(del by hosts) p.f)
      (~(put by hosts) p.f foundations)
    ::
        %add-almoners
      ?~  hav=(~(get by foundations) q.f)  dat
      =-  (show(hosts -) rama-report+!>([f a]))
      %+  ~(put by hosts)  p.f
      %+  ~(put by foundations)  q.f
      [-.u.hav (staff +>.a +.u.hav & %alm)]
    ::
        %del-almoners
      ?~  hav=(~(get by foundations) q.f)  dat
      =-  (show(hosts -) rama-report+!>([f a]))
      %+  ~(put by hosts)  p.f
      %+  ~(put by foundations)  q.f
      [-.u.hav (staff +>.a +.u.hav | %alm)]
    ::
        %add-janitors
      ?~  hav=(~(get by foundations) q.f)  dat
      =-  (show(hosts -) rama-report+!>([f a]))
      %+  ~(put by hosts)  p.f
      %+  ~(put by foundations)  q.f
      [-.u.hav (staff +>.a +.u.hav & %jan)]
    ::
        %del-janitors
      ?~  hav=(~(get by foundations) q.f)  dat
      =-  (show(hosts -) rama-report+!>([f a]))
      %+  ~(put by hosts)  p.f
      %+  ~(put by foundations)  q.f
      [-.u.hav (staff +>.a +.u.hav | %jan)]
    ==
  --
--