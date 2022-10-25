::  foundation - psychohistory server/client sur file
::  by quartus, for stp
::
/-  diary, groups
::
|%
+$  flag  (pair ship term)
::  +rama: client structure
::
++  rama
  |%
  ::  $report: incoming data from hari
  ::
  +$  report  (pair flag admin:actions:hari)
  ::  $action: pure rama actions, %rama-only
  ::
  +$  action
    $%  [%enter fon=term who=ship]
        [%leave fon=term who=ship]
        [%watch who=ship]
    ==
  ::  $parcel: hari rama actions, %hari-rama
  ::
  +$  parcel
    %+  pair
      ship
    $%(write:actions:hari clean:actions:hari)
  ::  +metadata: placeholder
  ::
  ++  metadata
    |%
    +$  diff  ~
    --
  --
::  +hari: server structure
::∂
++  hari
  |%
  ::  $foundation:
  ::
  ::    psychohistoric foundation interface
  ::    provider: hosts enclave on terminus
  ::    almoners: some enabled contributors
  ::    janitors: provider trash collectors
  ::    metadata: opt-in user psychohistory
  ::
  +$  foundation
    $:  provider=flag
        almoners=(set ship)
        janitors=(set ship)
        metadata=%$
    ==
  ::
  +$  poke  poke:actions
  ::
  ++  metadata
    |%
    +$  meta  ~
    --
  ::
  ++  actions
    |%
    ::  $poke - pokes to hari
    ::
    +$  poke
      $%  admin
          write
          clean
      ==
    ::  $admin - &hari-seldon mark
    ::
    +$  admin
      $%  [%found fon=term]
          [%close fon=term]
        ::
          [%add-almoners fon=term who=(set ship)]
          [%del-almoners fon=term who=(set ship)]
        ::
          [%add-janitors fon=term who=(set ship)]
          [%del-janitors fon=term who=(set ship)]
      ==
    ::  $write - &hari-schizo mark
    ::
    +$  write
      $:  %add-note
          fon=term
          tit=cord
          cov=cord
          ver=(list verse:diary)
          met=%$
      ==
    ::  $clean - &hari-somber mark
    ::
    +$  clean
      $%  [%del-note fon=term item=@ud]
          [%tag-note fon=term item=@ud tag=term]
          [%fix-note fon=term item=@ud ver=(list verse:diary) met=%$]
          [%del-quip fon=term item=@ud quip=@ud]
      ==
    --
  --
--