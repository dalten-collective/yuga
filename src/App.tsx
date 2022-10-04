import './App.css'
import { useState, useEffect } from 'react'
import { urbitVisor } from '@dcspark/uv-core'
import LoginForm from './Login'
import sigilLogo from './assets/sarped-todler.svg'
import Notebook from './Notebook'
import Spinner from './Spinner'
import Urbit from '@urbit/http-api'
import { connectUrbit } from './UrbitApi'
import { extract } from 'article-parser'
import TurndownService from 'turndown'

function App() {
  // const [ship, setShip] = useState('bolfep-lopdep-daptev-dolfyr--polbet-rocseg-bismyl-litzod');
  // const [code, setCode] = useState('pasfep-tormur-tapmug-narper');
  // const [url, setUrl] = useState('http://localhost:80');
  const [ship, setShip] = useState('');
  const [code, setCode] = useState('');
  const [url, setUrl] = useState('');
  const [api, setApi] = useState(null);
  const [loading, setLoading] = useState(true);
  const [registered, setRegistered] = useState(false);

  const spinner = (
    <Spinner width={100} height={100} innerColor="white" outerColor="black" />
  );

  useEffect(() => {
    if (localStorage.getItem('api')) {
      // const stored = JSON.parse(localStorage.getItem('api'));

      let ship = localStorage.getItem('ship');
      let code = localStorage.getItem('code');
      let url = localStorage.getItem('url');
      setShip(ship);
      setCode(code);
      setUrl(url);
      connectUrbit(ship, url, code).then((res) => {
        setApi(res);
        // api.desk = "landscape";
        // set api in local storage
        localStorage.setItem('ship', res.ship);
        localStorage.setItem('url', res.url);
        localStorage.setItem('code', res.code);
        // localStorage.setItem('api', JSON.stringify(res));
        checkChannelExists(res);
      });

    };
    setUrbit
  }, []);


  function setUrbit() {
    connectUrbit(ship, url, code).then((res) => {
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

  function checkExtractedData() {
    var td = new TurndownService();
    const input = "https://urbit.org/blog/august-2022-grants-program";
    extract(input)
      .then((article) => {
        // var content = turndown(article.content);
        console.log(td.turndown(article.content), "content")
        document.body.innerHTML = article.content;
      })
      .catch((err) => console.error(err));
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
          {!api && (
            <LoginForm ship={ship} code={code} url={url} setShip={setShip} setUrl={setUrl} setCode={setCode} setUrbit={setUrbit} />
          )}
          <button className="create-button" onClick={checkExtractedData}>
            extract
          </button>
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
        <Notebook ship={ship} api={api} />
      </div>
    );

}

export default App
