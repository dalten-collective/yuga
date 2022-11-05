::  hari - psychohistory server
::  by quartus, for stp
::
::    notes:
::  1. formatting should liberally utilize and inject these:
::     https://github.com/tloncorp/landscape-apps/blob/baf391cb35d4581704024ee95a186dd40ca62a94/ui/src/types/content.ts
::  2. diaries must exist under groups
::  3. rough idea
::     - create a group, add a section called term-paedia (confirm it doesn't exist)
::     - create a diary, under the section in the group called term-paedia
::       `join=%.y`, need image, description
::     - create a chat, under discussion section, called general, open to all
::  4. metrics by opt in? using rama
::  5. poke to establish members, these are people who can post, anyone can join
::  6. maybe members need to be per group?
::  7. probably need sanity checker for incoming posts.
::  8. manage transition between earthweb and urbit connected (like visor)?
::  
::
/-  d=diary, g=groups, *foundation
/+  c-j=cyclo-json, dbug, default-agent, verb
|%
::  boilerplate
::
+$  card  card:agent:gall
::
+$  versioned-state  $%(state-0)
::
+$  state-0
  $:  %0
      foundations=(map term foundation:hari)
  ==
::
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
  ::
  ++  on-init
    ^-  (quip card _this)
    ~>  %bout.[0 '%hari +on-init']
    =^  cards  state
      abet:init:gen
    [cards this]
  ::
  ++  on-save
    ^-  vase
    ~>  %bout.[0 '%hari +on-save']
    !>(state)
  ::
  ++  on-load
    |=  ole=vase
    ~>  %bout.[0 '%hari +on-load']
    ^-  (quip card _this)
    =^  cards  state
      abet:(load:gen ole)
    [cards this]
  ::
  ++  on-poke
    |=  [mar=mark vaz=vase]
    ~>  %bout.[0 '%hari +on-poke']
    ^-  (quip card _this)
    =^  cards  state
      abet:(poke:gen mar vaz)
    [cards this]
  ::
  ++  on-peek
    |=  =path
    ~>  %bout.[0 '%hari +on-peek']
    ^-  (unit (unit cage))
    [~ ~]
  ::
  ++  on-arvo
    |=  [wir=wire sig=sign-arvo]
    ~>  %bout.[0 '%hari +on-arvo']
    ^-  (quip card _this)
    =^  cards  state
      abet:(arvo:gen wir sig)
    [cards this]
  ::
  ++  on-agent
    |=  [wir=wire sig=sign:agent:gall]
    ~>  %bout.[0 '%hari +on-agent']
    ^-  (quip card _this)
    =^  cards  state
      abet:(dude:gen wir sig)
    [cards this]
  ::
  ++  on-watch
  |=  pat=path
  ~>  %bout.[0 '%hari +on-watch']
  ^-  (quip card _this)
  =^  cards  state
    abet:(peer:gen pat)
  [cards this]
  ::
  ++  on-fail
    ~>  %bout.[0 '%hari +on-fail']
    on-fail:def
  ++  on-leave
    ~>  %bout.[0 '%hari +on-init']
    on-leave:def
  --
::  gen:
::
::    the somewhat terse engine pattern can
::    be hard to grasp at first. we suggest
::    paying careful attention to the casts
::    on each arm. many return the core gen
::    aliased as dat (reference: this/that)
::
|_  [bol=bowl:gall dek=(list card)]
+*  dat  .
    or   (scot %p our.bol)
    no   (scot %da now.bol)
    dok  [our.bol %groups]
    dia  [our.bol %diary]
    h-p  ~(. hari-poke:enjs:c-j [bol foundations])
::  +abet: flop the dek, produce [dek state]
::
++  abet  [(flop dek) state]
::  +emit: add a single card to the dek
::
++  emit  |=(=card dat(dek [card dek]))
::  +emil: add a list of cards to the dek
::
++  emil  |=(lac=(list card) dat(dek (welp lac dek)))
::  +show: forward to web-ui
::
++  show  |=(=cage (emit [%give %fact ~[/web-ui] cage]))
::  +dupe: forward to your subscribers
::
++  dupe
  |=  [=report:rama all=?]
  %-  emit
  [%give %fact ?.(all ~ ~[/relay]) rama-report+!>(report)]
::  +lupe: forward metadata to subscribers (loop them in)
::
++  lupe
  |=  [=report:^meta all=?]
  %-  emit
  [%give %fact ?.(all ~ ~[/metas]) meta-report+!>(report)]
::  +behn: a behn timer
::
++  behn
  ^+  dat
  =+  pat=[%seldon %catalogue no ~]
  %-  emit
  [%pass pat [%arvo %b [%wait (add now.bol ~h1)]]]
::  +init: initialization routine
::
++  init
  ^+  dat
  behn
::  +load: loading routine
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
  ++  group
    ^+  dat
    (emit %pass /groups %agent dok %watch /groups)
  --
::  +peer: handle being watched
::
++  peer
  |=  pol=(pole knot)
  ^+  dat
  ?+    pol  dat
      [%web-ui ~]
    ?>  =(our.bol src.bol)
    (show hari-state+!>(`state-0`state))
  ::
      [%relay ~]
    =;  backlog=(list [report:rama ?])
      |-  ?~  backlog  dat
      $(backlog t.backlog, dat (dupe i.backlog))
    %-  zing  %+  turn
      ~(tap by foundations)
    |=  [t=term f=foundation:hari]
    :~  [[provider.f %add-almoners t almoners.f] |]
        [[provider.f %add-janitors t janitors.f] |]
        [[provider.f %found t] |]
    ==
  ::
      [%metas ~]
    =;  backlog=(list [report:^meta ?])
      |-  ?~  backlog  dat
      $(backlog t.backlog, dat (lupe i.backlog))
    %+  turn
      ~(tap by foundations)
    |=  [t=term f=foundation:hari]
    ?>  ?=([%0 %hari *] metadata.f)
    [[provider.f [%result %all %rama public.metadata.f]] |]
  ==
::  +arvo: handle arvo responses
::
++  arvo
  |=  [pol=(pole knot) sig=sign-arvo]
  ^+  dat
  ?+    pol  ~|(bad-arvo-wire/pol !!)
      [%seldon %catalogue wen=@ ~]
    ?>  ?=([%behn %wake *] sig)
    %.  behn
    ?^  error.sig  (slog u.error.sig)
    (slog '%hari -behn-timer ~' ~)
  ::
      [%found wat=@ ~]
    =/  fon=@tas  (scot %tas wat.pol)
    ?>  ?=([%khan %arow *] sig)
    ?.  ?=(%& -.p.+.sig)  ((slog +.p.p.+.sig) dat)
    %.  hari-seldon+!>([%found fon])
    show:(dupe [[our.bol fon] [%found fon]] &)
  ==
::  +dude: handle incoming agent
::
++  dude
  |=  [pol=(pole knot) sig=sign:agent:gall]
  |^  ^+  dat
    ?+    pol  ~|(bad-dude-wire/pol !!)
        [%groups ~]
      ?+    -.sig  dat
        %fact  (check !<(action:g q.cage.sig))
        %kick  group:view
      ::
          %watch-ack
        %.  dat
        ?~  p.sig  same
        (slog leaf/"%hari cannot watch groups" u.p.sig)
      ==
    ::
        [%close wat=@ ~]
      =/  fon=@tas  (scot %tas wat.pol)
      ?+    -.sig  ~|(bad-dude-sign-on/pol !!)
          %poke-ack
        ?^  p.sig
          ((slog '%hari cannot close group' u.p.sig) dat)
        %.  hari-seldon+!>([%close fon])
        show:(dupe [[our.bol fon] %close fon] &)
      ==
    ::
        [%post who=@ wen=@ ~]
      ?+    -.sig  ~|(bad-dude-sign-on/pol !!)
          %poke-ack
        %.  dat
        ?~(p.sig same (slog '%hari cannot post' u.p.sig))
      ==
    ==
  ::  +check: maybe destroy foundation, imperial mandate
  ::
  ++  check
    |=  (pair flag update:g)
    ^+  dat
    ?.  ?=([%del ~] q.q)  dat
    ?~  (~(has by foundations) q.p)  dat
    %.  [[p %close q.p] &]
    dupe(foundations (~(del by foundations) q.p))
  --
::  +poke: handle incoming pokes
::
++  poke
  |=  [mar=mark vaz=vase]
  |^  ^+  dat
    ?+    mar  ~|(bad-poke-mark/mar !!)
        %rama-only
      =/  act  !<(action:rama vaz)
      ?>  ?=([%views *] act)
      ?>  (~(has by foundations) q.p.act)
      (~(view meta q.p.act) q.act)
    ::
        %meta-admin
      ~_  leaf+"bad-admin-meta!"
      ?>  =(our.bol src.bol)
      =/  act  !<(admin:^meta vaz)
      ?-    -.act
          %tag
        (~(tag meta fon.act) +>.act)
          %folder
        (~(folder meta fon.act) +>.act)
      ==
    ::
        %hari-seldon
      ~_  leaf+"bad-hari-seldon from {<src.bol>}"
      ?>  =(our.bol src.bol)
      =/  act  !<(admin:actions:hari vaz)
      ?-    -.act
        %found  ~(found land +.act)  ::  dupe and show after thread
        %close  ~(close land +.act)  ::  dupe and show after poke-ack
      ::
          %add-almoners
        =-  (show:- hari-seldon+!>(act))
        %-  dupe:(staff & %alm +.act)
        [[[our.bol (cat 3 fon.act '-paedia')] act] &]
      ::
          %del-almoners
        =-  (show:- hari-seldon+!>(act))
        %-  dupe:(staff | %alm +.act)
        [[[our.bol (cat 3 fon.act '-paedia')] act] &]
      ::
          %add-janitors
        =-  (show:- hari-seldon+!>(act))
        %-  dupe:(staff & %jan +.act)
        [[[our.bol (cat 3 fon.act '-paedia')] act] &]
      ::
          %del-janitors
        =-  (show:- hari-seldon+!>(act))
        %-  dupe:(staff | %jan +.act)
        [[[our.bol (cat 3 fon.act '-paedia')] act] &]
      ==
    ::
        %hari-schizo
      =/  act  !<(write:actions:hari vaz)
      ?>  ?=(%add-note -.act)
      ~_  leaf+"bad-hari-schizo to {<fon.act>} from {<src.bol>}"
      ?>  ?|  =(our.bol src.bol)
              =-  (~(has in almoners:-) src.bol)
              (~(got by foundations) fon.act)
          ==
      =~  :-  act=act
          =,  act
          (post:~(diary land fon) tit cov ver)
      ::
        (~(edit meta fon.act) `@ud`now.bol met.act)
      ==
    ::
        %hari-somber
      =/  act=clean:actions:hari  !<(clean:actions:hari vaz)
      ~_  leaf+"bad-hari-somber to {<fon.act>} from {<src.bol>}"
      =+  found=(~(got by foundations) fon.act)
      =+  lands=~(diary land fon.act)
      =+  edits=~(edit meta fon.act)
      ?:  ?=(%fix-note -.act)
        ?>  ?|  (~(has in janitors:found) src.bol)
            ::
              ?&  (~(has in almoners:found) src.bol)
                  =(author:(grab:lands item.act) src.bol)
              ==
            ==
        =~  :-  act=act
            %.  [item.act met.act]
            ~(edit meta:(edit:lands item.act ver.act) fon.act)
          ::
            (show hari-somber+!>(act))  ::  XX: maybe send metadata state
        ==
      ?>  ?|  =(our.bol src.bol)
              (~(has in janitors:found) src.bol)
          ::
          ==
      =-  (show:- hari-somber+!>(act))
      ?-    -.act
        %tag-note  (~(tags meta fon.act) item.act tag.act)
        %del-note  (wipe:lands item.act)
        %del-quip  (dust:lands item.act quip.act)
      ==
    ==
  ::  +staff: modifications to janitors, almoners
  ::
  ++  staff
    |=  [act=? wat=?(%alm %jan) fon=term who=(set ship)]
    ^+  dat
    ?~  fun=(~(get by foundations) fon)
      %.  dat
      (slog leaf+"%hari cannot find foundation {<fon>}" ~)
    =-  dat(foundations (~(put by foundations) fon -))
    ?-    wat
        %alm
      ?.  act
        u.fun(almoners (~(dif in almoners.u.fun) who))
      u.fun(almoners (~(uni in almoners.u.fun) who))
    ::
        %jan
      ?.  act
        u.fun(janitors (~(dif in janitors.u.fun) who))
      u.fun(janitors (~(uni in janitors.u.fun) who))
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
      tit  (cat 3 fon '-paedia')
  ::  +diary: relay messages for some almoner or janitor
  ::
  ++  diary
    |%
    ++  pat  /post/[hu]/[no]
    ::  +dust: delete comment
    ::
    ++  dust
      |=  (pair @ud @ud)
      %-  emit
      =-  [%pass pat %agent dia %poke %diary-action -]
      !>  ^-  action:d
      :-  [our.bol fon]
      [now.bol %notes `@da`p %quips `@da`q %del ~]
    ::  +wipe: delete note
    ::
    ++  wipe
      |=  p=@ud
      %-  emit
      =-  [%pass pat %agent dia %poke %diary-action -]
      !>  ^-  action:d
      [[our.bol fon] [now.bol %notes `@da`p %del ~]]
    ::  +post: add a note
    ::
    ++  post
      |=  [t=cord c=cord v=(list verse:d)]
      %-  emit
      =-  [%pass pat %agent dia %poke %diary-action -]
      !>  ^-  action:d
      :-  [our.bol fon]
      [now.bol %notes now.bol %add t c v src.bol now.bol]
    ::  +edit: change a note
    ::
    ++  edit
      |=  [d=@ud v=(list verse:d)]
      ~_  leaf+"%hari cannot edit post "
      =/  essay  +:(grab d)
      %-  emit 
      =-  [%pass pat %agent dia %poke %diary-action -]
      !>  ^-  action:^d
      :-  [our.bol fon]
      [now.bol %notes `@da`d %edit essay(content v)]
    ::  +grab: scry diary, get note
    ::
    ++  grab
      |=  w=@ud
      ^-  note:d
      .^  note:d
        %gx
        %+  welp
          /[or]/diary/[no]/diary
        /[or]/[fon]/notes/note/(scot %ud w)/noun
      ==
    --
  ::  +close: if check, perform shutdown
  ::
  ++  close
    ^+  dat
    ?.  (~(has by foundations) fon)
      dat  ::  no-op on bad foundation
      ::
    ender(foundations (~(del by foundations) fon))
  ::  +maker: sets up shop
  ::
  ++  maker
    ^+  dat
    =/  pat  /found/[fon]
    ~&  fon
    %-  emit
    =-  [%pass pat %arvo %k %fard -]
    [%cyclo %found %noun !>([bol fon])]
  ::  +ender: close up shop
  ::
  ++  ender
    ^+  dat
    =/  pat  /close/[fon]
    =-  (emit [%pass pat %agent dok %poke -])
    :-  %group-action
    !>(`action:g`[[our.bol fon] [now.bol [%del ~]]])
  ::  +found: if check, perform setup
  ::
  ++  found
    ^+  dat
    ?.  &(check ((sane %tas) fon))
      ::  XX: json to frontend, failure
      ::
      dat
    ::  XX: json to frontend, success
    =.  foundations
      %-  ~(put by foundations)
      [fon [our.bol fon] ~ ~ [%0 %hari [~ ~ ~ ~] [~ ~]]]
    ~&  >>>  foundations
    maker
  ::  +check: test for existence of group
  ::
  ++  check
    ^-  ?
    ?&  %+  levy
          %~  tap  by
          .^(shelf:d %gx /[or]/diary/[no]/shelf/noun)
        |=([=flag =diary:d] !=([our.bol fon] flag))
      ::
        %+  levy
          %~  tap  by
          .^(groups:g %gx /[or]/groups/[no]/groups/noun)
        |=([=flag =group:g] !=([our.bol fon] flag))
    ==
  --
::  +meta: "why did i name it this interrobang"
++  meta
  |_  fon=@t
  ::  +faun: get foundation from foundations
  ::
  ++  faun
    ^-  foundation:hari
    (~(got by foundations) fon)
  ::  +metas: sometimes the only way out is through
  ::
  ++  metas
    ^-  hari:states:^meta
    =/  sat-m=[%0 state:^meta]
      metadata:faun
    ?>  ?=([%0 %hari *] sat-m)
    [public:sat-m secret:sat-m]
  ::  +view: update view count
  ::
  ++  view
    |=  item=@ud
    =/  fun=foundation:hari    faun
    =/  met=hari:states:^meta  metas
    =/  hav=@ud
      ?~(h=(~(get by views.public.met) item) 1 +(u.h))
    =.  metadata.fun
      :+  %0  %hari
      %=    met
          unique-views.secret
        (~(put ju unique-views.secret.met) item src.bol)
      ::
          views.public
        (~(put by views.public.met) item hav)
      ==
    %-  lupe(foundations (~(put by foundations) fon fun))
    [[provider.fun [%result %set-views (my [item hav]~)]] &]
  ::  +tag: update allowed tags
  ::
  ++  tag
    |=  [wat=? tag=term]
    =/  fun=foundation:hari    faun
    =/  met=hari:states:^meta  metas
    =.  metadata.fun
      :+  %0  %hari
      %=    met
          tags.public
        ?:  wat
          (~(put by tags.public.met) tag ~)
        (~(del by tags.public.met) tag)
      ::
          proposed-tags.secret
        (~(del in proposed-tags.secret.met) tag)
      ==
    =+  dis=(show meta-admin+!>([%tag fon wat tag]))
    %.  [[provider.fun [%admin %tag fon wat tag]] &]
    lupe:dis(foundations (~(put by foundations) fon fun))
  ::  +folder: update allowed folders
  ::
  ++  folder
    |=  [wat=? fol=term]
    =/  fun=foundation:hari    faun
    =/  met=hari:states:^meta  metas
    =.  metadata.fun
      :+  %0  %hari
      %=    met
          folders.public
        ?:  wat
          (~(put by folders.public.met) fol ~)
        (~(del by folders.public.met) fol)
      ==
    =+  dis=(show meta-admin+!>([%folder fon wat fol]))
    %.  [[provider.fun [%admin %folder fon wat fol]] &]
    lupe:dis(foundations (~(put by foundations) fon fun))
  ::  +tags: add a tag to a post
  ::
  ++  tags
    |=  [i=@ud t=term]
    =/  fun=foundation:hari  faun
    =/  met=hari:states:^meta  metas
    =.  metadata.fun
      :+  %0  %hari
      %=    met
        tags.public  (~(put ju tags.public.met) t i)
      ==
    %.  [[provider.fun [%result %add-tag i t]] &]
    lupe(foundations (~(put by foundations) fon fun))
  ::  +edit: edit the folder, tags of a post (also in write)
  ::
  ++  edit
    |=  [i=@ud m=[%0 write:^meta]]
    =/  fun=foundation:hari  faun
    =/  met=hari:states:^meta
      =+  meat=metas
      %=    meat
          folders.public
        %.  [folder.m i]  %~  put  ju
        %-  ~(run by folders.public.meat)
        |=(t=(set @ud) (~(del in t) i))
      ::
          tags.public
        %-  ~(run by tags.public.meat)
        |=(t=(set @ud) (~(del in t) i))
      ::
          proposed-tags.secret
        (~(dif in tags.m) ~(key by tags.public.meat))
      ==
    ::
    =/  lag=(list term)
      %+  murn  ~(tap in tags.m)
      |=  t=@tas
      ?.((~(has in ~(key by tags.public.met)) t) ~ `t)
    ?>  ?=([%0 %hari *] metadata.fun)
    |-  ^+  dat
    ?^  lag
      %=  $
        lag  t.lag
      ::
          tags.public.metadata.fun
        (~(put ju tags.public.metadata.fun) i.lag i)
      ==
    =.  metadata.fun  [%0 %hari met]
    =~  :+  r1=[provider.fun [%result %set-tags i tags.m]]
          r2=[provider.fun [%result %set-folder i folder.m]]
        %=    dat
            foundations
          (~(put by foundations) fon fun)
        ==
    ::
      (lupe:(lupe r1 &) r2 &)
    ==
  --
--