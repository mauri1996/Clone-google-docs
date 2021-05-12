import TextEditor from "./TextEditor"
import Login from "./Login"
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom"

function App() {
  //<Redirect to={`/documents/${uuidV4()}`} />
  return (
    <Router>
      <Switch>
        <Route path="/" exact>
          <Login />          
        </Route>
        <Route path="/documents/:id/:name">
          <TextEditor />
        </Route>
        <Route path="/documents/:id">
          <TextEditor />
        </Route>
      </Switch>
    </Router>
  )
}

export default App
