import "./App.css";
import UrbitInterface from '@urbit/http-api'
import { useState, useEffect } from 'react'
import {StatelessTextInput} from "@tlon/indigo-react";
// import { useState, useEffect, useReducer } from "react";
import { sigShip } from "./Helpers"

const ADMIN_MARK = 'hari-seldon'

const Debug = (props: { ship: String; api: UrbitInterface }) => {
  const [haveSub, setHaveSub] = useState(0)
  const [lastSubData, setLastSubData] = useState({})
  const [foundationPrefix, setFoundationPrefix] = useState('')
  const [newAlmoner, setNewAlmoner] = useState('')
  const [delAlmoner, setDelAlmoner] = useState('')
  const [newJanitor, setNewJanitor] = useState('')
  const [delJanitor, setDelJanitor] = useState('')

  const [foundations, setFoundations] = useState([])

  const handleSetFoundations = (collection) => {
    setFoundations(collection)
  }

  const handleRemDiff = (item) => {
    const haveFoundation = foundations.find(f => f.name == item.name)
    if (haveFoundation) {

      // The 'name' key is present in { rem: {...} } and ONLY the name key.
      // This means close/remove the foundation altegether
      if ('name' in item && Object.keys(item).length === 1) {
        setFoundations(foundations.filter(f => f.name !== item.name))

      // Otherwise, we're removing something FROM a key in the foundation
      } else {
        if ('almoners' in item) { // removing an almoner
          const updatedAlmoners = haveFoundation.foundation.almoners.filter((a) => {
            return !item.almoners.map(ship => sigShip(ship)).includes(sigShip(a))
          })
          haveFoundation.foundation.almoners = updatedAlmoners
        }
        if ('janitors' in item) { // removing an almoner
          const updatedJanitors = haveFoundation.foundation.janitors.filter((j) => {
            return !item.janitors.map(ship => sigShip(ship)).includes(sigShip(j))
          })
          haveFoundation.foundation.janitors = updatedJanitors
        }

        // update items in state
        const newState = foundations.map(f => {
          if (f.name === item.name) {
            return haveFoundation
          }
          return f
        })
        setFoundations(newState)
      }
    }
  }

  const handleAddDiff = (item) => {
    // if already have by name, only update the item
    const haveFoundation = foundations.find(f => f.name == item.name)
    if (haveFoundation) {
      if ('almoners' in item) { // Adding an almoner
        haveFoundation.foundation.almoners.push(...item.almoners.map(ship => sigShip(ship)))
      }
      if ('janitors' in item) { // Adding a janitor
        haveFoundation.foundation.janitors.push(...item.janitors.map(ship => sigShip(ship)))
      }

      // update state
      const newState = foundations.map(f => {
        if (f.name === item.name) {
          return haveFoundation
        }
        return f
      })
      setFoundations(newState)

    } else { // Adding new foundation altogether
      setFoundations([...foundations, item])
    }
  }

  useEffect(() => {
    // TODO: this would all be much simpler with Redux
    if ('foundations' in lastSubData) {
      handleSetFoundations(lastSubData.foundations)
    }

    if ('add' in lastSubData) {
      handleAddDiff(lastSubData.add)
    }

    if ('rem' in lastSubData) {
      handleRemDiff(lastSubData.rem)
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

  // TODO: this should be made to take an array
  function addAlmoners(prefix) {
    const api = props.api
    api.poke({
      app: 'hari',
      mark: ADMIN_MARK,
      json: {
        'add-almoners': {
          fon: prefix,
          who: [newAlmoner]
        },
      },
    }).finally(() => {
      setNewAlmoner('')
    })
  }

  // TODO: this should be made to take an array
  function delAlmoners(prefix, almoner) {
    const api = props.api
    api.poke({
      app: 'hari',
      mark: ADMIN_MARK,
      json: {
        'del-almoners': {
          fon: prefix,
          who: [almoner]
        },
      },
    })
  }

  // TODO: this should be made to take an array
  function addJanitors(prefix) {
    const api = props.api
    api.poke({
      app: 'hari',
      mark: ADMIN_MARK,
      json: {
        'add-janitors': {
          fon: prefix,
          who: [newJanitor]
        },
      },
    }).finally(() => {
      setNewJanitor('')
    })
  }

  // TODO: this should be made to take an array
  function delJanitors(prefix, janitor) {
    const api = props.api
    api.poke({
      app: 'hari',
      mark: ADMIN_MARK,
      json: {
        'del-janitors': {
          fon: prefix,
          who: [janitor]
        },
      },
    })
  }

  ////

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
            Last Subscription Response: { JSON.stringify(lastSubData) }
          </div>

          <div style={{ marginTop: '4em', marginBottom: '4em' }}>
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
              Create New Foundation
            </button>
          </div>

          <hr />

          <div>
            {
              foundations.map((f) => {
                return (
                  <div key={f.name}>
                    <div>
                      <div style={{ display: 'flex' }}>
                        <h2 style={{ marginRight: '2em' }}>
                          { f.name }
                        </h2>
                        <button onClick={() => closeFoundation(f.name)}>Close Foundation</button>
                      </div>
                      <h3>Provider: { f.foundation.provider }</h3>
                      { false && JSON.stringify(f) }
                      <div>
                        <h4>Almoners</h4>
                        <ul>
                          {
                            f.foundation.almoners.map((almoner) => {
                              return (
                                <li key={almoner}>
                                  { almoner }
                                <button onClick={() => delAlmoners(f.name, almoner)}>Remove</button>
                                </li>
                              )
                            })
                          }
                        </ul>
                        <div>
                          <StatelessTextInput
                            className="input"
                            placeholder="New Almoner"
                            backgroundColor="rgba(0, 0, 0, 0.04)"
                            borderColor={"#c3bdbda5"}
                            borderRadius="8px"
                            fontWeight={400}
                            height={40}
                            width={256}
                            onChange={(e) => setNewAlmoner(e.target.value)}
                          />
                          <button onClick={() => addAlmoners(f.name)}>Add Almoner</button>
                        </div>
                      </div>
                      <div>
                        <h4>Janitors</h4>
                        <ul>
                          {
                            f.foundation.janitors.map((janitor) => {
                              return (
                                <li key={janitor}>
                                  { janitor }
                                  <button onClick={() => delJanitors(f.name, janitor)}>Remove</button>
                                </li>
                              )
                            })
                          }
                        </ul>
                        <div>
                          <StatelessTextInput
                            className="input"
                            placeholder="New Janitor"
                            backgroundColor="rgba(0, 0, 0, 0.04)"
                            borderColor={"#c3bdbda5"}
                            borderRadius="8px"
                            fontWeight={400}
                            height={40}
                            width={256}
                            onChange={(e) => setNewJanitor(e.target.value)}
                          />
                          <button onClick={() => addJanitors(f.name)}>Add Janitor</button>
                        </div>
                      </div>
                    </div>

                  <hr style={{ marginTop: '2em', marginBottom: '2em' }}/>

                </div>
                )
              })
            }
          </div>
        </div>
      )}

    </div>
  );
}

export default Debug;
