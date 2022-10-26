import "./App.css";
import UrbitInterface from '@urbit/http-api'
import { useState, useEffect } from 'react'
import {StatelessTextInput} from "@tlon/indigo-react";
// import { useState, useEffect, useReducer } from "react";

const ADMIN_MARK = 'hari-seldon'

const Debug = (props: { ship: String; api: UrbitInterface }) => {
  const [haveSub, setHaveSub] = useState(0)
  const [lastSubData, setLastSubData] = useState({})
  const [foundationPrefix, setFoundationPrefix] = useState('')

  const [foundations, setFoundations] = useState([])

  const handleSetFoundations = (collection) => {
    setFoundations(collection)
  }
  const handleRemoveFoundationPrefix = (name) => {
    setFoundations(foundations.filter(f => f.name !== name))
  }
  const handleAddFoundation = (item) => {
    setFoundations([...foundations, item])
  }

  useEffect(() => {
    // TODO: this would all be much simpler with Redux
    if ('foundations' in lastSubData) {
      handleSetFoundations(lastSubData.foundations)
    }

    if ('add' in lastSubData) {
      handleAddFoundation(lastSubData.add)
    }

    if ('rem' in lastSubData) {
      handleRemoveFoundationPrefix(lastSubData.rem.name)
    }
  }, [lastSubData])

  function handleSubscriptionData(data) {
    console.log('got sub update data ', data)
    setLastSubData(data)
  }

  function openSubscription() {
    const api = props.api
    api.subscribe({
      app: 'hari',
      path: '/web-ui',
      event: handleSubscriptionData
    })
    .then((sub: number) => {
      setHaveSub(sub)
    })
  }

  function createFoundation() {
    const api = props.api
    api.poke({
      app: 'hari',
      mark: ADMIN_MARK,
      json: {
        found: {
          fon: foundationPrefix
        },
      },
    }).finally(() => {
      setFoundationPrefix('')
    })
  }

  function closeFoundation(prefix) {
    const api = props.api
    api.poke({
      app: 'hari',
      mark: ADMIN_MARK,
      json: {
        close: {
          fon: prefix
        },
      },
    }).finally(() => {
      setFoundationPrefix('')
    })
  }

	return (
    <div>
      <h1>Debug</h1>
      <div>
        <button className="create-button" onClick={openSubscription}>
          Open Subscription
        </button>
      </div>

      { haveSub && (
        <div>
          <div>
            Subscription Number: { haveSub }
          </div>
          <div>
            {
              foundations.map((f) => {
                return (
                  <div>
                    <div>
                    { JSON.stringify(f) }
                    </div>
                    <div>
                      <button onClick={() => closeFoundation(f.name)}>Remove</button>
                    </div>
                  </div>
                )
              })
            }
          </div>
          <div>
            <StatelessTextInput
              className="input"
              placeholder="Foundation name prefix"
              backgroundColor="rgba(0, 0, 0, 0.04)"
              borderColor={"#c3bdbda5"}
              borderRadius="8px"
              fontWeight={400}
              height={40}
              width={256}
              onChange={(e) => setFoundationPrefix(e.target.value)}
            />
            <button className="create-button" onClick={createFoundation}>
              Create Foundation
            </button>
          </div>
        </div>
      )}

      <div>
        <div>
          Last Subscription Data: { JSON.stringify(lastSubData) }
        </div>
      </div>
    </div>
  );
}

export default Debug;
