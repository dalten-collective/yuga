import './App.css'
import { useState, useEffect } from 'react'
import { urbitVisor } from '@dcspark/uv-core'
import sigilLogo from './assets/sarped-todler.svg'
import Notebook from './Notebook'
import Spinner from './Spinner'


function App() {
  const [ship, setShip] = useState('');
  const [loading, setLoading] = useState(true);
  const spinner = (
    <Spinner width={100} height={100} innerColor="white" outerColor="black" />
  );

  useEffect(() => {
    urbitVisor.require(
      ["shipName", "scry", "subscribe", "poke", "thread"],
      setData
      );
  }, []);

  function setData() {
    urbitVisor.getShip().then((res) => {
      setShip(res.response);
      checkChannelExists(res.response);
    });
  }

  // Check channels
  interface Key {
    name: string; // the name of the channel, in kebab-case.
    ship: string; // the ship that hosts the channel
  }
  

  const [registered, setRegistered] = useState(false);
  function checkChannelExists(ship: string) {
    urbitVisor.scry({ app: "graph-store", path: "/keys" }).then((res) => {
      setLoading(false);
      if (res.status === "ok") {
        const keys: Key[] = res.response["graph-update"].keys;
        console.log(keys);
        if (
          keys.find(
            (key: Key) => key.ship === ship && key.name === "cyclopaedia"
          )
        )
          setRegistered(true);
      } else handleKeyScryError();
    });
  }

  const [error, setError] = useState("");
  function handleKeyScryError() {
    setError("Scry failed");
  }

  function handleThreadError() {
    setError("Thread failed");
  }

  interface Thread {
    threadName: string; // name of the channel
    inputMark: string; // json to hoon conversion mark for the thread request body
    outputMark: string; // hoon to json conversion mark for the thread response body
    body: any; // request body
  }

  // Create channel
  async function createChannel() {
    setLoading(true);
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
  urbitVisor
    .thread({
      threadName: "graph-create",
      inputMark: "graph-view-action",
      outputMark: "json",
      body: body,
    })
    .then((res) => {
      if (res.status === "ok") {
        checkChannelExists(ship);
      } else handleThreadError();
    });
  }

  const [count, setCount] = useState(0)
  if (loading)
    return (
      <div className="App">
        <div className="loading">{spinner}</div>
      </div>
    );
  else if (!registered)
    return (
      <div className="App">
        <header className="App-header">
          <div>
            <a href="https://reactjs.org" target="_blank">
              <img src={sigilLogo} className="logo react" alt="React logo" />
            </a>
          </div>
          <div>
            {ship && <p>Welcome, <code>~{ship}</code></p>}
          </div>
          {!ship && (
            <button className="create-button" onClick={createChannel}>
              Connect your Urbit Visor
            </button>
          )}
          {ship && (
            <button className="create-button" onClick={createChannel}>
              Open your Cyclopaedia
            </button>
          )}
          {error && <p className="error-message">{error}</p>}
        </header>
      </div>
    );
  else
    return (
      <div className="App">
        <Notebook ship={ship} />
      </div>
    );

}

export default App
