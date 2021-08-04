import logo from "./logo.svg";
import "./App.css";
import { Link, Route, Switch } from "react-router-dom";

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <div>
          <h1>Hello World!</h1>
          We are using Node.js <span id="node-version"></span>, Chromium
          <span id="chrome-version"></span>, and Electron
          <span id="electron-version"></span>.
        </div>
        <p>Test Routing</p>
        <div>
          <Link style={{ marginRight: 20 }} to="">
            home
          </Link>
          <Link to="test">test</Link>
        </div>
        <Switch>
          <Route
            path="/"
            exact
            render={() => (
              <>
                <p>you're in home</p>
              </>
            )}
          />
          <Route
            path="/test"
            render={() => (
              <>
                <p>this is test route</p>
              </>
            )}
          />
        </Switch>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
