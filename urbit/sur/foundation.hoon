::  foundation - psychohistory server/client sur file
::  by quartus, for stp
::
/-  diary, groups
::
|%
+$  flag  (pair ship term)
::  +meta: metadata structure
::
++  meta
  |%
  ::  $admin:meta: allow, disallow tags and folders
  ::
  +$  admin
    $%  [%tag fon=term wat=? tag=term]
        [%folder fon=term wat=? fol=term]
    ==
  ::
  +$  report
    (pair flag $%([%result result] [%admin admin]))
  ::
  +$  result
    $%  [%set-views views=(map @ud @ud)]
        [%set-folder item=@ud dest=term]
        [%set-tags item=@ud them=(set term)]
        [%add-tag item=@ud it=term]
        [%all %rama rama:states]
    ==
  ::
  +$  share
    $%  [%saw @ud]
    ==
  ::
  +$  write
    [folder=term tags=(set term)]
  ::
  +$  state
    $%  [%rama rama:states]
        [%hari hari:states]
    ==
  ++  states
    |%
    +$  rama
      $:  folders=(jug term @ud)
          authors=(jug @p @ud)
          views=(map @ud @ud)
          tags=(jug term @ud)
      ==
    +$  hari
      $:  public=rama
        $=  secret
        $:  proposed-tags=(set term)
            unique-views=(jug @ud @p)
        ==
      ==
    --
  --
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
    $%  [%enter who=ship fon=term]
        [%leave who=ship fon=term]
        [%watch who=ship]
        [%share ?]
        [%store who=ship fon=term id=@ud]
        [%trash wen=@ud]
        [%views (pair flag @ud)]
    ==
  ::

  ::  $parcel: hari rama actions, %hari-rama
  ::
  +$  parcel
    %+  pair
      ship
    $%(write:actions:hari clean:actions:hari)
  --
::  +hari: server structure
::
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
        metadata=$%([%0 state:meta])
    ==
  ::
  +$  poke  poke:actions
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
          ver=(list verse:diary)    :::  [%inline [<my-cord> ~]]~
          met=[%0 write:meta]
      ==
    ::  $clean - &hari-somber mark
    ::
    +$  clean
      $%  [%del-note fon=term item=@ud]
          [%tag-note fon=term item=@ud tag=term]
          [%del-quip fon=term item=@ud quip=@ud]
      ::
        $:  %fix-note
            fon=term
            item=@ud
            ver=(list verse:diary)
            met=[%0 write:meta]
        ==
      ==
    --
  --
--