# Cyclopaedia / hari rama / yuga

# Urbit setup

- Have a fake zod running
- Have New Groups installed on it
- Install the `%cyclo` desk from this repo:
  - `|merge %cyclo our %base`
  - `|mount %cyclo`
  - Copy contents of this repo's `urbit` directory into above-mounted desk
  - `|commit %cyclo`
  - `|install our %cyclo`
  - Start `%hari`: `|rein %cyclo [%.y %hari]`

You're now ready to run the front end. See **Front-End Setup** below.

# Front-End Setup

All interface code is found in the `front` directory.

A number of bash scripts are provided in `/bin` to help with setup and
development. These scripts should be run from the root of this repo (not from
within `front`).

## Install JS dependencies

Managed by npm. run `bin/install-js-dependencies.sh`

## Environment variables

- Create a new file in `front` named `.env` - you'll see a `front/env.example`
template file, your `.env` should be adjacent to that. (`.env` will not be checked into version control).  
Copy in the contents of `env.example` and change the URL to your local fakeship url/port.

## Running JS dev server

Managed by Vite. After setting up environment variables, run
`bin/serve-interface.sh`.

Visit the URL displayed by the above command. (This will be the app path. You
might need to log in with your `+code` to the base URL of the ship itself, first - that is, trim
off the `/apps/cyclo` bit from the URL Vite displays).

**Note:** You must append a `/` to the end of the cyclo URL you visit when running
through Vite. (so, `http://localhost:3000/apps/cyclo/`, not
`http://localhost:3000/apps/cyclo`).

## Building the front end for deploy/glob

Run `bin/build-interface.sh`. After it completes, look for the `front/dist`
folder. This is the directory you glob.

---


# Poke documentation (WARNING: some bits here may be deprecated)

##  Hari Administration

Subscribe on the `/web-ui` path to get state updates from pokes.

1. Create a Foundation
  ```json
     {
       found: {
         fon: <prefix string>
       }
     }
  ```

Note that `prefix` will become `prefix-paedia` when made into a group.

2. Close a Foundation

```
  {
    close: {
      fon: <prefix string>
    }
  }
```

Note that we're only using `prefix` supposing we want to close `prefix-pedia`.

3. Add Almoners (Writers)
  ```
  {
    'add-almoners': {
      fon: <prefix string>,
      who: [ <an array of ships, each prefixed with a sig> ]
     }
  }
   ```

4. Delete Almoners (Writers)
  ```
  {
    'del-almoners': {
      fon : <prefix string>,
      who: [ <an array of ships, each prefixed with a sig> ]
    }
  }
   ```


5. Add Janitors (Admins)
  ```
  {
    'add-janitors': {
      fon : <prefix string>,
      who: [ <an array of ships, each prefixed with a sig> ]
    }
  }
   ```

6. Delete Janitors (Admins)
  ```
  {
    'del-janitors': {
      fon : <prefix string>,
      who: [ <an array of ships, each prefixed with a sig> ]
    }
  }
```

##  Rama Administration

Subscribe on `/web-ui` path to get state updates from pokes.

1. Watch a hari provider
  ```
  {
    watch: <ship>
  }
  ```
2. Join a Foundation
  ```
  {
    enter: { fon: <prefix string> , who: <host ship> }
  }
  ```
3. Leave a Foundation
   ```
   {
     leave: { fon: <prefix string>, who: <host ship> }
   }
   ```

## Future Work

For current use, scries from Groups2 should be employed to retrieve content. Once we've determined a good pattern for how to scry that information out, we will reproduce those scries in Rama, but w/ overlay data, affording us both use metrics and metadata enrichment before presenting to the user.
