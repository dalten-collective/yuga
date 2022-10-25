/-  spider, g=groups, d=diary
/+  *strandio
=,  strand=strand:spider
=>
|%
++  make
  |_  [bol=bowl:gall fon=term]
  +*  nam  (cat 3 fon '-paedia')
      des  (cat 3 nam ' Foundation')
      flg  [our.bol nam]
      cul  (scot %ux `@ux`(shaw our.bol 24 fon))
  ::  +col: a random color generator
  ::
  ++  col
    ^-  cord
    =-  (crip ['#' (welp -)])
    %+  rash
      cul
    ;~((glue dot) ;~(pfix (jest '0x') (star aln)) (star aln))
  ::
  ++  group
    ^-  cage
    :-  %group-create
    !>  ^-  create:g
    [nam des '' col col [%open ~ ~] ~]
  ::
  ++  zone
    ^-  cage
    :-  %group-action
    !>  ^-  action:g
    [flg now.bol %zone nam %add nam des col col]
  ::
  ++  diary
    ^-  cage
    :-  %diary-create
    !>  ^-  create:d
    :-  flg
    [nam nam nam ~ (sy [%admin]~)]
  ::
  ++  section
    ^-  cage
    :-  %group-action
    !>  ^-  action:g
    [flg now.bol %channel [%diary flg] [%zone nam]]
  ::
  ++  default
    ^-  cage
    :-  %group-action
    !>  ^-  action:g
    [flg now.bol %channel [%diary flg] [%join &]]
  --
--
::
^-  thread:spider
|=  mission=vase
=/  m  (strand ,vase)
^-  form:m
::
=/  details  !<([dish=bowl:gall name=term] mission)
::
=*  gro  (cury poke [our.dish.details %groups])
=*  not  (cury poke [our.dish.details %diary])
=*  mak  ~(. make [dish.details name.details])
::
;<  ~  bind:m  (gro group:mak)
;<  ~  bind:m  (gro zone:mak)
;<  ~  bind:m  (not diary:mak)
::
;<  ~  bind:m  (sleep ~s5)
;<  ~  bind:m  (gro section:mak)
;<  ~  bind:m  (gro default:mak)
(pure:m !>(~))