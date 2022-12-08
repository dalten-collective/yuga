/-  spider, g=groups, d=diary
/+  *strandio, c=color
=,  strand=strand:spider
=>
|%
++  make
  |_  [bol=bowl:gall fon=term]
  +*  nam  `@t`(cat 3 fon '-paedia')
      des  `@t`(cat 3 nam ' Foundation')
      flg  [our.bol fon]
      cul  `@ux`(shaw our.bol 25 fon)
  ::  +lor: a random color generator
  ::
  ++  lor
    ^-  [hot=cord not=cord]
    =+  hsl=`get:c`lo-abet:(lo-abed:color:c hex+cul %hsl)
    =;  [a=get:c b=get:c]
      ?>(&(?=(%web -.a) ?=(%web -.b)) [+.a +.b])
    :-  lo-abet:(lo-abed:color:c hsl %web)
    ?>  ?=([%hsl [h=@rd s=@rd l=@rd]] hsl)
    ?:  (gth:rd .~0.5 s.hsl)
      =+  sat=`@rd`(add:rd .~0.3 s.hsl)
      lo-abet:(lo-sats:(lo-abed:color:c hsl %web) sat)
    ~&  >  [s.hsl hsl(s .~10.1)]
    =+  sat=`@rd`(sub s.hsl .~0.3)
    lo-abet:(lo-sats:(lo-abed:color:c hsl %web) sat)
  ::
  ++  group
    ~&  >>  now.bol
    ^-  cage
    :-  %group-create
    !>  ^-  create:g
    [fon nam des hot:lor not:lor [%open ~ ~] ~ %|]
  ::
  ++  zone
    ^-  cage
    :-  %group-action-0
    !>  ^-  action:g
    [flg now.bol %zone nam %add nam des hot:lor not:lor]
  ::
  ++  diary
    ^-  cage
    :-  %diary-create
    !>  ^-  create:d
    :-  flg
    [fon nam nam ~ (sy [%admin]~)]
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
;<  ~       bind:m  (sleep ~s1)
;<  nu=@da  bind:m  get-time
=.  now.dish.details  nu
;<  ~       bind:m  (gro section:mak)
;<  ~       bind:m  (gro default:mak)
(pure:m !>(~))