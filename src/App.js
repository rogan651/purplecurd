import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Slider from './Components/Slider';
import Navbar from './Components/Navbar';
import Master from './Components/Master';
import Customermaster from './Components/Customermaster';
import Suppliermaster from './Components/Suppliermaster';
import Login from './Components/Login';

const App = () => {
  return (
  <Router>
    <Route>
      <Navbar/>
      <Slider/>
      <Switch>
      <Route path='/' component={Master} exact />
      <Route path='/custom' component={Customermaster} exact />
      <Route path='/Suppliermaster' component={Suppliermaster} exact />
      <Route path='/Login' component={Login} exact />
      </Switch>
    </Route>
  </Router>
  );
}

export default App;
