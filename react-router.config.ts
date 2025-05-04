import type { Config } from "@react-router/dev/config";

export default {
  ssr: false, // Disable SSR to ensure BrowserRouter runs only in the browser
} satisfies Config;
