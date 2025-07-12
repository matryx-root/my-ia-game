import React from "react";
import { createRoot } from "react-dom/client";
import "./i18n";

import './index.css'; 
import "bootstrap-icons/font/bootstrap-icons.css";
import App from "./App";


const root = createRoot(document.getElementById("root"));
root.render(<App />);

