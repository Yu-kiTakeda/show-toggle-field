import React from "react";
import { createRoot } from "react-dom/client";
import Config from "./config";

import "../../css/config.scss";

((PLUGIN_ID) => {
  const root = createRoot(document.getElementById('root'));
  root.render(<React.StrictMode><Config pluginId={PLUGIN_ID} /></React.StrictMode>);
})(kintone.$PLUGIN_ID);

