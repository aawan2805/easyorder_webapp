import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import Scan from './Scan'
import Summary from './Summary';
import SummaryStatus from './SummaryStatus';
import reportWebVitals from './reportWebVitals';
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import { Provider } from 'react-redux'
import { configureStore } from "@reduxjs/toolkit";
import orderSlice from "./orderSlice";
import store2 from './store'

const store = configureStore({
  reducer: orderSlice
});

const router = createBrowserRouter([
  {
    path: "/",
    element: <Scan />,
  },
  {
    path: "/home",
    element: <App />
  },
  {
    path: "/summary",
    element: <Summary />,
  },
  {
    path: "/orderStatus",
    element: <SummaryStatus />
  }
]);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Provider store={store2}>
      <RouterProvider router={router} />
    </Provider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
