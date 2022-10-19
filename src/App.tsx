import './App.css'
import { useState, useEffect } from 'react'
import { urbitVisor } from '@dcspark/uv-core'
import LoginForm from './Login'
import sigilLogo from './assets/sarped-todler.svg'
import Notebook from './Notebook'
import Urbit from '@urbit/http-api'
import { connectUrbit } from './UrbitApi'
import { Row, Col, Text, Box,  Reset, _dark as dark } from "@tlon/indigo-react";
import light from '@tlon/indigo-light'
import { ThemeProvider } from "styled-components";

function App() {
  const [ship, setShip] = useState('');
  const [code, setCode] = useState('');
  const [url, setUrl] = useState('');
  const [api, setApi] = useState(null);
  const [loading, setLoading] = useState(true);
  const [registered, setRegistered] = useState(false);


  useEffect(() => {
    if (localStorage.getItem('ship')) {
      // const stored = JSON.parse(localStorage.getItem('api'));

      let ship = localStorage.getItem('ship');
      let code = localStorage.getItem('code');
      let url = localStorage.getItem('url');
      console.log(ship, code, url);
      setShip(ship);
      setCode(code);
      setUrl(url);
      connectUrbit(ship, url, code).then((res) => {
        setApi(res);
        console.log(res);
        // api.desk = "landscape";
        // set api in local storage
        localStorage.setItem('ship', res.ship);
        localStorage.setItem('url', res.url);
        localStorage.setItem('code', res.code);
        // localStorage.setItem('api', JSON.stringify(res));
        checkChannelExists(res);
      });

    };
    setUrbit();
  }, []);


  function setUrbit() {
    connectUrbit(ship, url, code).then((res) => {
      console.log('SET URBIT', res);
      setApi(res);
      // set api in local storage
      localStorage.setItem('ship', res.ship);
      localStorage.setItem('url', res.url);
      localStorage.setItem('code', res.code);
      // localStorage.setItem('api', JSON.stringify(res));
      checkChannelExists(res);
    });
  }

  // Check channels
  interface Key {
    name: string; // the name of the channel, in kebab-case.
    ship: string; // the ship that hosts the channel
  }


  function success() {
    console.log("Success!");
    console.log("")
  }

  async function checkChannelExists(api) {
    // const api = await connectUrbit(ship, url, code);
    // setUrbit();
    api.scry({ app: "graph-store", path: "/keys" }).then((res) => {
      console.log(res, "check channel exists");
      setLoading(false);
      const keys: Key[] = res["graph-update"].keys;
      // check if any key.name === "cyclopaedia"
      const cyclopaedia = keys.find((key) => key.name === "cyclopaedia");
      if (cyclopaedia) {
        // if so, setRegistered to true
        setRegistered(true);
      }
      else handleKeyScryError();
    });
  }

  const [error, setError] = useState("");
  function handleKeyScryError() {
    setError("Scry failed");
  }

  function handleThreadError() {
    setError("Thread failed");
    console.log(error);
  }

  // Create channel
  async function createChannel() {
    setLoading(true);
    api.desk = "landscape";
    const body = {
      create: {
        resource: {
          ship: `~${ship}`,
          name: "cyclopaedia",
        },
        title: "Cyclopaedia",
        description: "A literal but delinquent reprint of the Encyclopedia Schizophrenica",
        associated: {
          policy: {
            invite: { pending: [] },
          },
        },
        module: "publish",
        mark: "graph-validator-publish",
      },

    };
    api.thread({
      inputMark: "graph-view-action",
      outputMark: "json",
      threadName: "graph-create",
      body: body,
    }).then((res) => {
      checkChannelExists(api);
      console.log(res, "create channel res");
      if (res.status === "ok") checkChannelExists(api);
      else handleThreadError();

    });
}

  if (!registered)
    return (
      <ThemeProvider theme={dark}>
        <div className="App">
          <header className="App-header">
            {!api && (
              <LoginForm ship={ship} code={code} url={url} setShip={setShip} setUrl={setUrl} setCode={setCode} setUrbit={setUrbit} />
              )}
            {api && (
              <button className="create-button" onClick={createChannel}>
                Open your Cyclopaedia
              </button>
            )}
            {error && <p className="error-message">{error}</p>}
          </header>
        </div>
      </ThemeProvider>
    );
  else
    return (
      <div className="App">
      <ThemeProvider theme={dark}>
        <Notebook ship={ship} api={api} />
      </ThemeProvider>
      </div>
    );

}

export default App
