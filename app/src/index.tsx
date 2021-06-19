import React from 'react';
import ReactDom from 'react-dom';
import { App } from './components';
import './index.css';
import './assets/styles/common.css';
declare const MusicKit: any;

(async () => {
  await MusicKit.configure({
    developerToken: import.meta.env.SNOWPACK_PUBLIC_MUSICKIT_TOKEN,
    app: {
      name: 'Valence',
      build: '0.1',
      version: '0.1'
    }
  });

  ReactDom.render(<App />, document.getElementById('root'));
})();

// Hot Module Replacement (HMR) - Remove this snippet to remove HMR.
// Learn more: https://snowpack.dev/concepts/hot-module-replacement
if (import.meta.hot) {
  import.meta.hot.accept();
}
