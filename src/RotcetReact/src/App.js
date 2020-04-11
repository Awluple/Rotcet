import React from 'react';
import './scss/App.scss';

import {BrowserRouter} from 'react-router-dom'

import Top from './components/top/top.jsx'
import Main from './components/main/main.jsx'
import Footer from './components/footer/footer.jsx'

function App() {
  return (
    <BrowserRouter>
    <div className="App">
        <Top />
        <Main />
        <Footer />
    </div>
    </BrowserRouter>
  );
}

export default App;
