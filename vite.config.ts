import { defineConfig, Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

// Development API handler plugin
function devApiPlugin(): Plugin {
  return {
    name: 'dev-api',
    configureServer(server) {
      server.middlewares.use('/api/render', async (req, res) => {
        if (req.method !== 'POST') {
          res.statusCode = 405;
          res.end(JSON.stringify({ error: 'Method not allowed' }));
          return;
        }

        // Read request body
        let body = '';
        for await (const chunk of req) {
          body += chunk;
        }

        try {
          const resumeData = JSON.parse(body);
          
          // Use Vite's module loader to get the render function
          const mod = await server.ssrLoadModule('./src/latex/render-client.ts');
          const latexSource = mod.renderLatex(resumeData);

          // Compile via YtoTech LaTeX-on-HTTP API
          const response = await fetch('https://latex.ytotech.com/builds/sync', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              compiler: 'pdflatex',
              resources: [
                {
                  main: true,
                  content: latexSource,
                }
              ],
            }),
          });

          if (!response.ok) {
            const errorText = await response.text();
            console.error('LaTeX compilation error:', errorText);
            res.statusCode = 500;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ 
              error: 'Compilation failed',
              message: errorText.slice(0, 1000)
            }));
            return;
          }

          const pdfBuffer = await response.arrayBuffer();
          res.statusCode = 200;
          res.setHeader('Content-Type', 'application/pdf');
          res.setHeader('Cache-Control', 'no-store');
          res.end(Buffer.from(pdfBuffer));
        } catch (error) {
          console.error('API error:', error);
          res.statusCode = 500;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ 
            error: 'Internal error',
            message: error instanceof Error ? error.message : 'Unknown error'
          }));
        }
      });
    },
  };
}

export default defineConfig({
  plugins: [react(), devApiPlugin()],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
  build: {
    target: 'esnext',
  },
});
