
import React from "react";
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

import { Provider } from "react-redux";
import store from "./redux/store";
import ReactDOM from "react-dom/client";
import { Route, Router, RouterProvider, createRoutesFromElements } from "react-router";
import { createBrowserRouter } from "react-router-dom";
// import './index.css' remove thhis and delete file initially impp*  @import "tailwindcss";

import Login from "./pages/Auth/Login";

const router=createBrowserRouter(
  createRoutesFromElements(
  <Route path="/" element={<App/>}>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route index={true} path="/" element={<Home />} />
      <Route path="/favorite" element={<Favorites />} />
      
  </Route>)
);

ReactDOM.createRoot(document.getElementById('root')).render(
  <Provider store={store}>
  <RouterProvider router={router}/>
  </Provider>
)
