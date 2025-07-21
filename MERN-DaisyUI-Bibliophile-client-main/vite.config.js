import { defineConfig, loadEnv } from "vite"
import react from "@vitejs/plugin-react"
import tailwindcss from "@tailwindcss/vite"

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // Load environment variables based on the current mode
  const env = loadEnv(mode, process.cwd(), "")

  return {
    plugins: [react(), tailwindcss()],
    server: {
      proxy: {
        "/api": {
          target: env.VITE_API_URL,
          changeOrigin: true,
          secure: false,
          ws: true,
          rewrite: (path) => path.replace(/^\/api/, ""),
        },
      },
    },
  }
})

// import { defineConfig } from "vite"
// import react from "@vitejs/plugin-react"

// export default defineConfig({
//   plugins: [react()],
//   // server: {
//   //   proxy: {
//   //     "/api": {
//   //       // target: "http://localhost:3000",
//   //       target: "http://127.0.0.1:4002", // Use IPv4 address",
//   //       changeOrigin: true,
//   //       // secure: false,
//   //       // ws: true,
//   //       rewrite: (path) => path.replace(/^\/api/, ""),
//   //     },
//   //   },
//   // },
// })
