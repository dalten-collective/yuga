# Cyclopaedia / rama

# Urbit setup

- Have a fake zod running
- Have New Groups installed on it ([Tlon instructions
here](https://github.com/tloncorp/landscape-apps/blob/master/DEVELOPMENT.md)]
- Install the `%cyclo` desk from this repo:
  - `|merge %cyclo our %base`
  - `|mount %cyclo`
  - Copy contents of this repo's `urbit` directory into above-mounted desk
  - `|commit %cyclo`
  - `|install our %cyclo`
  - Start `%hari`: `|rein %cyclo [%.y %hari]`

You're now ready to run the front end. See **Front-End Setup** below.

## Set up CORS (still investigating why this is needed for this app...)

After completing front-end setup below, add the resulting Vite dev URL to the
fakezod's CORs registry:

- See current items: `+cors-registry` (should be lacking the dev server)
- Add dev server: `|cors-approve 'http://localhost:3000` (or whatever your dev
server is from below. Mind the `http`).

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
off the `/apps/cyclopaedia` bit from the URL Vite displays).

**Note:** You must append a `/` to the end of the cyclo URL you visit when running
through Vite. (so, `http://localhost:3000/apps/cyclopaedia/`, not
`http://localhost:3000/apps/cyclopaedia`).

**Visit the `/debug` page and click "Open Subscription" to start testing.** All
state management should be moved to Redux (see recommendations below).

## Building the front end for deploy/glob

Run `bin/build-interface.sh`. After it completes, look for the `front/dist`
folder. This is the directory you glob.

---


# Recommendations for front end roadmap:

- Use a client-side store (like Redux) and handle UrbitAPI/Airlock there. Open/manage
authentication and subscription there. Handle Server-Sent Events on subscription
paths and their resultant changes to the front end state in Redux.
- Use Typescript to define the interface for poke structures as well as
responses from the gall agent (both initial states and diffs). Then use these
types at all seams where an API call or response leaves or hits the React
application. When/if the Hoon changes, update the types first - then follow them
through the rest of the application.
- Use loading states on all buttons - based off the poke promise.
- Extend the stub client-side routing present here so far.
- Rama administration pokes/responses have not been handled thus far. Follow the
examples set here for Hari pokes.

---

# Poke documentation

##  Hari Administration (all these pokes are demoed on `/debug`)

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

##  Rama Administration (not demoed in `/debug`)

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
