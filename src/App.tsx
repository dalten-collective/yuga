import './App.css'
import { useState, useEffect } from 'react'
import { urbitVisor } from '@dcspark/uv-core'
import sigilLogo from './assets/sarped-todler.svg'
import Notebook from './Notebook'
import Spinner from './Spinner'
import Urbit from '@urbit/http-api'
// import { extract } from 'article-parser'
import { connectUrbit } from './UrbitApi'


function App() {
  const [ship, setShip] = useState('');
  const [code, setCode] = useState('');
  const [url, setUrl] = useState('http://localhost:80');
  const [api, setApi] = useState(null);
  const [loading, setLoading] = useState(true);
  const spinner = (
    <Spinner width={100} height={100} innerColor="white" outerColor="black" />
  );

  useEffect(() => {
    setUrbit
    // urbitVisor.require(
    //   ["shipName", "scry", "subscribe", "poke", "thread"],
    //   setData
    //   );
  }, []);

  function setData() {
    urbitVisor.getShip().then((res) => {
      setShip(res.response);
      console.log(res.response, "ship")
      checkChannelExists();
    });
  }

  function setUrbit() {
    connectUrbit(ship, url, code).then((res) => {
      setApi(res);
    });
  }

  // Check channels
  interface Key {
    name: string; // the name of the channel, in kebab-case.
    ship: string; // the ship that hosts the channel
  }

  // function checkExtractedData() {
  //   const input = "https://compactmag.com/article/the-dream-of-digital-homesteading";
  //   extract(input)
  //     .then((article) => document.body.innerHTML = article.content)
  //     .catch((err) => console.error(err));
  // }



  async function runThread() {
    // const api = await connectUrbit(ship, url, code);
    api.desk = "landscape";
    console.log('Connected!');
    console.log(api);

    const body = {
      create: {
        resource: {
          ship: `~${ship}`,
          name: "cyclopaedia",
        },
        title: "Cyclopaedia",
        description: "A literal but delinquent reprint of the Encyclopedia Schizophrenica",        associated: {
          policy: {
            invite: { pending: [] },
          },
        },
        module: "publish",
        mark: "graph-validator-publish",
      },
    };
    var thread = await api.thread({
      inputMark: "graph-view-action",
      outputMark: "json",
      threadName: "graph-create",
      body: body,
    });
    console.log(thread);

  };
  
  function success() {
    console.log("Success!");
    console.log("")
  }

  const [registered, setRegistered] = useState(false);
  function checkChannelExists() {
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
    console.log(error);
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
        inputMark: "graph-view-action",
        outputMark: "json",
        threadName: "graph-create",
        body: body,
      })
      .then((res) => {
        checkChannelExists();
        // if (res.status === "ok") checkChannelExists();
        // else handleThreadError();
      });
}

  const [count, setCount] = useState(0)
  // if (loading)
  //   return (
  //     <div className="App">
  //       <div className="loading">{spinner}</div>
  //     </div>
  //   );
  if (!registered)
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
          {/* Login form with url, ship name, and code */}
          <div className="composer">
            <div className="row-1">
              <input
                type="text"
                value={ship}
                placeholder="Ship name"
                onChange={(e) => setShip(e.target.value)}
              />
              <br />
              <input
                type="text"
                value={url}
                placeholder="Ship URL"
                onChange={(e) => setUrl(e.target.value)}
              />
              <br />
              <input
                type="text"
                value={code}
                placeholder="+code"
                onChange={(e) => setCode(e.target.value)}
              />
              <br />
              <br />
              <button className="create-button" onClick={setUrbit}>Connect Urbit</button>
            </div>
          </div>
          {/* {!ship && (
            <button className="create-button" onClick={createChannel}>
              Connect your Urbit Visor
            </button>
          )} */}
          {/* {ship && (
            <button className="create-button" onClick={checkExtractedData}>
              extract
            </button>
          )} */}
          {/* Input to set code for ship: */}
          {/* <input
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value)}
          /> */}
          {ship && (
            <button className="create-button" onClick={runThread}>
              Thread
            </button>
          )}
          {api && (
            <button className="create-button" onClick={runThread}>
              HIIII 
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
