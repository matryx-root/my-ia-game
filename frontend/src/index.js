import React from "react";
import { createRoot } from "react-dom/client";


import './index.css'; 
import './App.css';
import "bootstrap-icons/font/bootstrap-icons.css";
import App from "./App";


const root = createRoot(document.getElementById("root"));
root.render(<App />);

