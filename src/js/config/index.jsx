import React from "react";
import { createRoot } from "react-dom/client";
import Config from "./config";

import "../../css/config.scss";

((PLUGIN_ID) => {
  const root = createRoot(document.getElementById('root'));
  root.render(<Config pluginId={PLUGIN_ID} />);
})(kintone.$PLUGIN_ID);

