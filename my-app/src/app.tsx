import 'bootstrap/dist/css/bootstrap.min.css';
import React from 'react';
import {BrowserRouter as Router, Route, Routes} from "react-router-dom";
import {AppEdit} from "./app-edit";
import {observer} from "mobx-react-lite";
import {AppNav} from "./components/app-nav";

const App = observer(() => {
  return (
    <Router>
      <div className="row">
        <div className="col-2">
          <AppNav/>
        </div>

        <div className="col-10">
          <Routes>
            <Route path="/edit/:uuid" element={<AppEdit/>}/>
            <Route path="/create" element={<AppEdit/>}/>
          </Routes>
        </div>

      </div>
    </Router>
  );
})

export default App;
