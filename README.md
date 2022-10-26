# Cyclopaedia / rama

# Urbit setup

- Have a fakezod running
- Install the `%rama` desk from this repo:
  - `|merge %rama our %base`
  - `|mount %rama`
  - copy contents of this repo's `urbit` directory into above-mounted desk
  - `|commit %rama`
  - `|install our %rama`

## Set up CORS (still investigating why this is needed for this app...)

After completing front-end setup below, add the resulting Vite dev URL to the
fakezod's CORs registry:

- See current items: `+cors-registry` (should be lacking the dev server)
- Add dev server: `|cors-approve 'http://localhost:3000` (or whatever your dev
server is from below. Mind the `http`).

# Front-End Setup

All interface code is found in the `front` directory.
A number of bash scripts are provided in `/bin` to help with setup and
  development.

## Install JS dependencies

Managed by npm. run `bin/install-js-dependencies.sh`

## Environment variables

- Create a file name `.env` (will not be checked into version control). Copy in
the contents of `env.example` and change the URL to your local fakeship
url/port.

## Running JS dev server

Managed by Vite. After setting up environment variables, run
`bin/serve-interface.sh`.

Visit the URL displayed by the above command. (This will be the app path. You
might need to log in with your `+code` to the ship itself, first - that is, trim
off the `/apps/cyclopaedia` bit from the URL Vite displays).

**Note:** You must append a `/` to the end of the URL you visit when running
through Vite. (`http://localhost:3000/apps/cyclopaedia/` not
`http://localhost:3000/apps/cyclopaedia`).

## Building the front end for deploy/glob

Run `bin/build-interface.sh`. Look for the `front/dist` folder.

# Recommendations for front end roadmap:

- Use a client-side store (like Redux) and handle UrbitAPI/Airlock there. Open/manage
authentication and subscription there. Handle Server-Sent Events on subscription
paths in same.

