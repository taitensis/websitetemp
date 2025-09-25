// .tina/config.ts
import { defineConfig } from "tinacms";
var config_default = defineConfig({
  branch: "main",
  clientId: process.env.TINA_CLIENT_ID,
  // from tina.io
  token: process.env.TINA_TOKEN,
  // from tina.io
  build: {
    outputFolder: "admin",
    publicFolder: "public"
  },
  media: {
    tina: {
      mediaRoot: "",
      publicFolder: "public"
    }
  },
  schema: {
    collections: [
      {
        name: "pages",
        label: "Pages",
        path: "src/pages",
        fields: [
          { name: "title", label: "Title", type: "string" },
          { name: "body", label: "Body", type: "rich-text" }
          // Add other fields as needed (e.g. locale)
        ]
      }
      // Add more collections for translations, posts, etc.
    ]
  }
});
export {
  config_default as default
};
