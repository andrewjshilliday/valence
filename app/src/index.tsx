import React from 'react';
import ReactDom from 'react-dom';
import { App } from './components';
import './index.css';
import './assets/styles/common.css';

ReactDom.render(<App />, document.getElementById('root'));

// Hot Module Replacement (HMR) - Remove this snippet to remove HMR.
// Learn more: https://snowpack.dev/concepts/hot-module-replacement
if (import.meta.hot) {
  import.meta.hot.accept();
}
