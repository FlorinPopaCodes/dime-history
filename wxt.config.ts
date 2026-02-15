import { defineConfig } from "wxt";

export default defineConfig({
  manifestVersion: 3,
  manifest: {
    version: "0.0.8",
    name: "Dime History",
    description: "Automatically deletes history older than 14 days.",
    homepage_url: "https://github.com/FlorinPopaCodes/dime-history",
    permissions: ["history", "idle", "storage"],
    icons: {
      48: "icon.svg",
      96: "icon.svg",
    },
    browser_specific_settings: {
      gecko: {
        id: "{f2c0d4a2-85ae-4eb5-a5a2-f340d4de6b25}",
        data_collection_permissions: {
          required: ["none"],
          optional: [],
        },
      },
    },
  },
});
