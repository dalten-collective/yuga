# Metadata and Reporting for Hari and Rama

Hari and Rama now have a partially shared, versionable metadata state object. This object and the actions one can take against it are defined in `+meta` of `/sur/foundation/hoon` - a portion of this, below:

```
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
        $:  sharing=(set ship)
            proposed-tags=(set term)
            unique-views=(jug @ud @p)
        ==
      ==
    --
```

When the server receives valid, well-permissioned commands to update metadata about a foundation, it will report this out to subscribers who will update their view of the same metadata. Some changes remain hidden, only for administrators.

In order to facilitate this and the changing to a versioned state from a bunted object for metadata, previous installations must be `|nuke %rama` and `|nuke %hari`'d before installing this version.

In the following document, I hope to provide a spec for interfacing with Hari and Rama by describing a testing loop for using the product; this follows:

## Installing

Prerequisites include 1-2 fake ships, running `Groups` by Tlon Corp. A desk named `cyclo` created using the [`new-desk` generator found here](https://github.com/urbit/urbit/pull/5360/commits).

After `|commit %cyclo` and `|install our %cyclo`, also perform `:treaty|publish %cyclo` and `|rein %cyclo [%.y %hari]` (at least on your lead ship, to turn on the server functionality.

## Hari - Form a group, set some metadata parameters

First, subscribe to Hari on `/web-ui` to receive updates on data and your initial state object, which should look like this:

```
{
  "put": { "foundations" : null}
}
```

This is less than informative. Below, I provide a more informative fake state in json:

```
{
  "put": { 
    "foundations" : [
      // a map of the names of groups to details about them
      {
        // the name of your group
        "name" : "testing",
        "foundation" : {
          // your group
          "provider" : "~zod/testing",
          // writers, contributors
          "almoners" : ["~zod", "~wet"],
          // editors, clean up team
          "janitors" : ["~wet"],
          "metadata" : {
            "secret" : {
              "unique-views" : [
                {
                  // a map of posts to unique views
                  "id" : "170.123.111.111......",
                  "post-time" : "<unix time in seconds>",
                  "who" : ["~zod", "~wet"]
                }
              ],
              // tags that contributors have tried to use, but weren't allowed to use
              "proposed-tags" : ["cool-shit", "so-lame"]
            },
            "public" : {
              // a map of authors to posts they've written
              "authors" : [
                {
                  "author" : "~zod",
                  "posts" : [{"id":"170.123.111.111......","post-time":"<unix time>"}]
                }
              ],
              // a map of folders to posts in them
              "folders" : [
                {
                  "folder" : "horse-ebooks",
                  "posts" : [{"id":"170.123.111.111......","post-time":"<unix time>"}]
                }
              ],
              // a map of tags to posts with that tag
              "tags" : [
                {
                  "tag" : "on-feeling-good",
                  "posts" : [{"id":"170.123.111.111......","post-time":"<unix time>"}]
                }
              ],
              // a map of posts to the number of views they've had (reported)
              "views" : [
                {
                  "id" : "170.123.111.111......",
                  "post-time" : "<unix time>",
                  "views" : 25
                }
              ]
            }
          }
        }
      }
    ]
  }
}
```

### Founding

Form a group poking Hari with a `%hari-seldon` mark, and a poke of:

```
{
  "found": { "fon" : "name-of-foundation" }
}
```

In this case, I called our group `testing`, instead of "name-of-foundation". This poke, its hoon equivalent being `[%found %testing]`, should result in the following being sent on `/web-ui`:

```
{
  "add" : { "name" : "testing" }
}
```

You'll note here that you're going to have to reproduce some front-end side logic for each poke u get reported back to you. This is obnoxious but liberates you to grab the data as you see fit. If you find that replicating the logic is infeasible for any reason, we can implement helper scries that you can use to pull the data from the backend that could deliver the post-logic state on command. The logic, as it is, should really be fairly trivial - you're implementing the blank slate of the key value pair displayed above in the "fake state".

### Establish Metadata

> Note: for the pokes to create tags and folders, switching `wat` to false will delete the tag or folder and untag/remove from the folder all documents currently in that folder - a best practice is to remove all documents first by editing them into other folders.

To create a tag, send a poke with a mark of `%admin-meta` and a json object of (assuming you called your `fon` foundation "testing" as I did):

```
{
  "tag" : {
    "tag" : "new-tag",
    "fon" : "testing",
    "wat" : TRUE
  }
}
```

You should receive back the following:

```
{
  "add" : {
    "tag" : "new-tag",
    "foundation" : "testing"
  }
}
```

Adding a folder is much the same:

```
// adding
{
  "folder" : {
    "folder" : "new-folder",
    "fon" : "testing",
    "wat" : TRUE
  }
}

// returns
{
  "add" : {
    "folder" : "new-folder",
    "foundation" : "testing"
  }
}
```

If you were to resubscribe now, you should see the following initial state:

```
{
  "put": { 
    "foundations" : [
      // a map of the names of groups to details about them
      {
        // the name of your group
        "name" : "testing",
        "foundation" : {
          // your group
          "provider" : "~zod/testing",
          // writers, contributors
          "almoners" : [ ],
          // editors, clean up team
          "janitors" : [ ],
          "metadata" : {
            "secret" : {
              "unique-views" : [ ],
              // tags that contributors have tried to use, but weren't allowed to use
              "proposed-tags" : ["cool-shit", "so-lame"]
            },
            "public" : {
              // a map of authors to posts they've written
              "authors" : [ ],
              // a map of folders to posts in them
              "folders" : [
                {
                  "folder" : "new-folder",
                  "posts" : [ ]
                }
              ],
              // a map of tags to posts with that tag
              "tags" : [
                {
                  "tag" : "new-tag",
                  "posts" : [ ]
                }
              ],
              // a map of posts to the number of views they've had (reported)
              "views" : [ ]
            }
          }
        }
      }
    ]
  }
}
```

## Rama, Watch a Host, Join a Foundation.

Now you'll want to subscribe to Rama's agent on `/web-ui` as well (probably separate routes in your application, but idk maybe do both and just modify the experience based on whether ur also running a server?). The state for rama will be delivered as a (this is faked out a little as if you're already subscribed):

```
{
  "put" : {
    "hosts" : [
      {
        "host" : "~zod",
        "foundations" : [
          {
            "name" : "testing",
            "subscribed" : TRUE,
            "details" : <a foundation's details as in hari, excepting metadata, see below>
          }
        ]
      }
    ],
    "saved" : [
      {
        "key" : "170.123.111.xxxxx",
        "added" : <unix time>,
        "provider" : "~zod/testing",
        "id" : "172.111.111.xxxxx",
        "post-time" : <unix time>
      }
    ],
    "share" : TRUE
  }
}

// metadata shape for rama
{
  // a map of authors to posts they've written
  "authors" : [ ],
  // a map of folders to posts in them
  "folders" : [
    {
      "folder" : "new-folder",
      "posts" : [ ]
    }
  ],
  // a map of tags to posts with that tag
  "tags" : [
    {
      "tag" : "new-tag",
      "posts" : [ ]
    }
  ],
  // a map of posts to the number of views they've had (reported)
  "views" : [ ]
}
```

### Watch

On a ship running rama, either your host or another, tell the client (rama) to watch the host (zod, in my case). Send a poke of %rama-only mark w/ the following payload:

```
{ "watch" : "~zod" }
```

which will send a fact on the `/web-ui` sub of:

```
{
  "add" : { "hosts" : "~zod" }
}
```

The front end should prepare a new bunted item in the map of hosts for that provider, because, shortly after watching, you're going to get a lot of metadata from that provider about its various offerings.

First, you'll get, for each foundation, the following facts in succession, that will be pushed to the front end:

#### Found

```
{
  "put" : {
    "host" : "~zod",
    "name" : "testing",
    "subscribed" : FALSE,
    "details" : <a blank foundation>
  }
}
```

#### Writers (Almoners)

```
{
  "add" : {
    "host" : "~zod",
    "name" : "testing",
    "almoners" : [
      "~zod",
      "~wet"
    ]
  }
}
```

#### Janitors (Staff - can delete, retag things)

```
{
  "add" : {
    "host" : "~zod",
    "name" : "testing",
    "janitors" : [
      "~zod",
      "~wet"
    ]
  }
}
```

#### Metadata (whole metadata package)

```
<an object like rama's metadata state described above>
```

### Join

You can then join one of the host's foundations by poking with a %rama-only mark, the following payload:

```
{
  "enter" : {
    "who" : "~zod",
    "fon" : "testing"
  }
}
```

This will send, to the front end, upon successfully joining the group (not immediately after poking), the following on `/web-ui`:

```
{
  "put" : {
    "hosts" : {
      "host" : "~zod",
      "name" : "testing",
      "subscribed" : TRUE
    }
  }
}
```

## Rama's User Experience

The most likely thing to do here is to get the scry from diary of the resource in question of the most recent 10 posts in outline format to display, with a scry like this:

```
.^(* %gx /=diary=/diary/~zod/testing/notes/newest/10/outline/noun)
```

I'll have to ask Vinney how to do this in javascript again.

After that, you'll have all the metadata about folders, views, tags, and the IDs of those posts, which you can access with 

```
^(* %gx /=diary=/diary/~zod/testing/notes/note/<id as 170.123.111.xxxx>/noun)
```

The user can then start browsing and viewing posts (which you can access with their full form using the second scry above, or you can call for more outlines using:

```
.^(* %gx /=diary=/diary/~zod/testing/notes/older/<170.111.xxx>/10/noun)
```
