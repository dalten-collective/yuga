::  rama - rendezvous with rama
::
/-  d=diary, g=groups, *foundation
/+  dbug, default-agent, verb, c-j=cyclo-json
|%
::
+$  versioned-state  $%(state-0)
::
+$  state-0
  $:  %0
      hosts=(jug ship [term [hav=? fon=foundation:hari]])
  ==
::
::  boilerplate
::
+$  card  card:agent:gall
+$  flag  (pair ship term)
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
  |=  =path
  ~>  %bout.[0 '%rama +on-watch']
  ^-  (quip card _this)
  `this
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
::  +view: handle watching things
::
++  view
  |%
  ::  +relay: watch hari on some ship
  ::
  ++  relay
    |=  p=@p
    ^+  dat
    =/  wire  /relay/(scot %p p)
    (emit %pass wire %agent [p %hari] %watch /relay)
  --
::  +look: handle being watched
::
++  look
  |=  pol=(pole knot)
  ^+  dat
  ?+    pol  dat
      [%web-ui ~]
    (show json+!>(`json`(hosts:enjs:c-j hosts)))
  ==
::
++  poke
  |=  [mar=mark vaz=vase]
  |^  ^+  dat
  ?+    mar  ~|(bad-poke-mark/mar !!)
      %rama-only
    =/  act=action:rama  !<(action:rama vaz)
    ~_  leaf+"bad-rama-only - not an allowed action"
    ?:  ?=(%watch -.act)  (relay:view who.act)
    %-  ~(host land fon.act)
    ?-    -.act
      %enter  [who.act %.y]
      %leave  [who.act %.n]
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
      ~&  >  (reverse provider.u.dat item.q.pak)
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
    =-  =(our.bol author.-)
    =/  der  (scot %p p.f)
    =/  nam  (scot %tas q.f)
    .^  note:d
      %gx
      %+  welp
        /[or]/diary/[no]/diary
      /[der]/[nam]/notes/note/(scot %ud i)/noun
    ==
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
      [%relay who=@ ~]
    =/  frm=@p  (slav %p who.pol)
    ?+  -.sig  dat
      %kick  (relay:view frm)
      %fact  (rehydrate frm !<(report:rama q.cage.sig))
        %watch-ack
      %.  dat
      ?~  p.sig  same
      %-  slog                                          :: XX: and clean groups?
      :_  u.p.sig
      leaf/"%rama cannot watch {(scow %p who.pol)}'s relay"
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
      =-  (show json+!>(-))
      ?:  =(0 wic)
        (rama-only:rama-poke:enjs:c-j [%enter wat who])
      (rama-only:rama-poke:enjs:c-j [%leave wat who])
    =.  hosts
      ?:  =(0 wic)
        %.  [who wat [%.n fon.old]]
        ~(put ju (~(del ju hosts) who [wat old]))
      %.  [who wat [%.y fon.old]]
      ~(put ju (~(del ju hosts) who [wat old]))
    ::
    =;  act=tape
      ((slog leaf/"%rama can't {act}" u.p.sig) dat)
    %-  welp
    :-  ?:(=(0 wic) "join " "leave ")
    "[{(scow %p who)} {(scow %tas (cat 3 wat '-paedia'))}]"
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
    =*  h-p
      ~(. rama-poke:enjs:c-j [bol (~(got by hosts) w)])
    ^+  dat
    ?>  =(p.f w)                                        :: XX: and clean groups?
    =/  fon  (cut 3 [0 (sub (met 3 q.f) 7)] q.f)        :: group subject
    =/  foundations=(map term [? foundation:hari])
      (malt ~(tap in (~(gut by hosts) w ~)))
    ?-    -.a
        %found
      ?^  hav=(~(get by foundations) fon)  dat
      =.  foundations
        (~(put by foundations) fon [%.n f ~ ~ %$])
      =+  do=dat(hosts (~(put by hosts) w foundations))
      (show:do json+!>((rehydrate:h-p w f a)))
    ::
        %close
      =.  foundations
        (~(del by foundations) fon)
      =/  do
        ?~  foundations
          dat(hosts (~(del by hosts) w))
        dat(hosts (~(put by hosts) w foundations))
      (show:do json+!>((rehydrate:h-p w f a)))
    ::
        %add-almoners
      ?~  f=(~(get by foundations) fon)  dat
      =+  do=(show json+!>((rehydrate:h-p w ^f a)))
      %=  do
          hosts
        %+  ~(put by hosts)  w
        %+  ~(put by foundations)  fon
        [-.u.f (staff +>.a +.u.f & %alm)]
      ==
    ::
        %del-almoners
      ?~  f=(~(get by foundations) fon)  dat
      =+  do=(show json+!>((rehydrate:h-p w ^f a)))
      %=  do
          hosts
        %+  ~(put by hosts)  w
        %+  ~(put by foundations)  fon
        [-.u.f (staff +>.a +.u.f | %alm)]
      ==
    ::
        %add-janitors
      ?~  f=(~(get by foundations) fon)  dat
      =+  do=(show json+!>((rehydrate:h-p w ^f a)))
      %=  do
          hosts
        %+  ~(put by hosts)  w
        %+  ~(put by foundations)  fon
        [-.u.f (staff +>.a +.u.f & %jan)]
      ==
    ::
        %del-janitors
      ?~  f=(~(get by foundations) fon)  dat
      =+  do=(show json+!>((rehydrate:h-p w ^f a)))
      %=  do
          hosts
        %+  ~(put by hosts)  w
        %+  ~(put by foundations)  fon
        [-.u.f (staff +>.a +.u.f | %jan)]
      ==
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
  --
::  +land:
::
::    land manages interactions with groups
::    this naming convention is a result of
::    a long standing misnaming of desks in
::    a prior version of the tlon app suite
::
++  land
  |_  fon=term
  +*  hu   (scot %p src.bol)
      nam  (cat 3 fon '-paedia')
      tit  nam
  ::  +host: handle leave/join
  ::
  ++  host
    |=  [p=@p q=?]
    ^+  dat
    ~_  leaf+"bad-rama-action - cannot find {<nam>}"
    =|  emt=(set [term [? foundation:hari]])
    =/  old=[hav=? fon=foundation:hari]
      %.  fon
      %~  got  by
      (malt ~(tap in (~(gut by hosts) p emt)))
    =.  hosts
      %.  [p fon q fon.old]
      ~(put ju (~(del ju hosts) p [fon old]))
    ::
    =/  pat  /hosts/(scot %p p)/[fon]/(scot %ud q)
    =-  (emit %pass pat %agent dok %poke -)
    ?.  q
      [%group-leave !>([p nam])]
    [%group-join !>([[p nam] %.n])]
  --
--