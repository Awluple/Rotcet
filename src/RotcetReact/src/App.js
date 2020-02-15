import React from 'react';
import './scss/App.scss';

import {BrowserRouter} from 'react-router-dom'

import Top from './components/top/top.jsx'

function App() {
  return (
    <BrowserRouter>
    <div className="App">
        <Top />
    </div>
    </BrowserRouter>
  );
}

export default App;
