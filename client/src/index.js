import React from 'react';
import ReactDOM from 'react-dom/client';
import './modules/app/index.css';
import App from './modules/app/components/App.js';
import { store } from './modules/app/store.js';
import { Provider } from 'react-redux';
const root = ReactDOM.createRoot(document.getElementById('root'));


root.render(
    <Provider store={store}>
        <App />
    </Provider>
);

