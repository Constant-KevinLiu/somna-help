// app.config.ts
import { defineConfig as defineConfig2 } from "@tanstack/react-start/config";

// vite.config.ts
import { defineConfig } from "@lovable.dev/vite-tanstack-config";
var vite_config_default = defineConfig({
  tanstackStart: {
    server: { entry: "server" },
  },
});

// app.config.ts
var app_config_default = defineConfig2({
  vite: vite_config_default,
  routers: [
    {
      name: "public",
      type: "static",
      dir: "./public",
    },
    {
      name: "app",
      type: "spa",
      handler: "./src/server.ts",
      routes: "./src/routes",
    },
  ],
});
export { app_config_default as default };
