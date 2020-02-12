import React from 'react';
import './scss/App.scss';

import {BrowserRouter} from 'react-router-dom'

import Top from './components/top/top.jsx'
import Main from './components/main/main.jsx'

function App() {
  return (
    <BrowserRouter>
    <div className="App">
        <Top />
        <Main />
    </div>
    </BrowserRouter>
  );
}

export default App;
