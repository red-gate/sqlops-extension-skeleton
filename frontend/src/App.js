import React, { Component } from 'react'
import './App.css'
import { getQueryStringParameter } from './http/queryStringParameters'

class App extends Component {
  constructor(props) {
    super(props)
    const message = getQueryStringParameter('message');
    this.state = {
      message,
      extensionVersion: undefined,
      connections: [],
    }

    this.fetchVersion = this.fetchVersion.bind(this)
    this.fetchBackendVersion = this.fetchBackendVersion.bind(this)
    this.fetchActiveConnections = this.fetchActiveConnections.bind(this)
  }

  fetchVersion() {
    fetch('/api/versions/extension')
      .then(response => {
        if (response.ok) {
          return response.json()
        }
        const error = new Error(response.statusText)
        throw error
      })
      .then(json => {
        this.setState({ extensionVersion: json.version })
      })
      .catch(e => {
        console.error(e)
      })
  }

  fetchBackendVersion() {
    fetch('/api/versions/backend')
      .then(response => {
        if (response.ok) {
          return response.json()
        }
        const error = new Error(response.statusText)
        throw error
      })
      .then(json => {
        this.setState({ backendVersion: json.version })
      })
      .catch(e => {
        console.error(e);
      })
  }

  fetchActiveConnections() {
    fetch('/api/connections')
      .then(response => {
        if (response.ok) {
          return response.json()
        }
        const error = new Error(response.statusText)
        throw error
      })
      .then(json => {
        this.setState({ connections: json.connections })
      })
      .catch(e => {
        console.error(e);
      })
  }

  render() {
    return <div className="App">
      <header className="App-header">
        <h1 className="App-title">Welcome to SQL Operations Studio skeleton extension</h1>
        <small>{this.props.extensionVersion}</small>
      </header>
      <p className="App-intro">
        Message from extension: <code>{this.state.message}</code>.
      </p>
      <div className='App-content'>
        <div className='App-controls'>
          <button onClick={this.fetchVersion}>
            fetch extension version
        </button>
          <button onClick={this.fetchBackendVersion}>
            fetch backend version
        </button>
          <button onClick={this.fetchActiveConnections}>
            fetch active connections
        </button>
        </div>
        <div className='App-container'>
          <p>extension version: <code>{this.state.extensionVersion}</code></p>
          <p>backend version: <code>{this.state.backendVersion}</code></p>
          <div>active connections:
          <ul>{this.state.connections.map((c, i) => <li key={'c-' + i}>{c.connectionId} | {c.label}</li>)}
            </ul>
          </div>
        </div>
      </div>
    </div>
  }
}

export default App
