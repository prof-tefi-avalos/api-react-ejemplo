import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [react()],

  // ──────────────────────────────────────────────────────────────────────────
  // PROXY DE DESARROLLO (para evitar errores de CORS)
  //
  // Se lee así: "todo pedido que empiece con /api-votos, reenvialo a
  // https://jsonplaceholder.typicode.com, sacándole el /api-votos".
  //
  //   El navegador pide:   http://localhost:5173/api-votos/posts   (MISMO origen → no hay CORS)
  //   Vite lo reenvía a:   https://jsonplaceholder.typicode.com/posts
  //
  // El segundo pedido lo hace Vite (Node), no el navegador, y CORS lo aplica
  // solo el navegador. Por eso el error no se "arregla": se EVITA.
  //
  // ⚠️ Tres cosas para recordar:
  //   1. Después de tocar este archivo hay que REINICIAR Vite (Ctrl+C y npm run dev).
  //   2. En el fetch hay que usar la URL RELATIVA (/api-votos/posts), sin el dominio.
  //   3. El proxy existe SOLO con `npm run dev`. Con `npm run build` no hay servidor
  //      de Vite, y por lo tanto no hay proxy.
  //
  // Nota: JSONPlaceholder ya permite CORS, así que funcionaría también sin proxy.
  // Lo usamos acá para ver cómo se configura con una API real.
  // ──────────────────────────────────────────────────────────────────────────
  server: {
    proxy: {
      '/api-votos': {
        target: 'https://jsonplaceholder.typicode.com', // a dónde reenviar
        changeOrigin: true, // cambia el header Host para que coincida con el destino (necesario con APIs externas)
        rewrite: (ruta) => ruta.replace(/^\/api-votos/, ''), // le saca el prefijo antes de reenviar
      },
    },
  },
})
