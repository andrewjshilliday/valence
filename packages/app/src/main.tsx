import { createRoot } from 'react-dom/client';
import App from './App';
declare const MusicKit: any;

MusicKit.configure({
  developerToken: import.meta.env.VITE_ACCESS_TOKEN,
  app: {
    name: 'Valence',
    build: '0.1',
    version: '0.1'
  },
  sourceType: 24,
  suppressErrorDialog: true,
  /* features: {
    'seemless-audio-transitions': true,
    bookmarking: true
  } */
}).then(() => {
  createRoot(document.getElementById('root')!).render(
    <App />
  )
});
