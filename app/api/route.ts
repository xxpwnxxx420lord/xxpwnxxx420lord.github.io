// redirect.ts - Save as redirect.ts and serve via a web server (e.g., Node.js with ts-node or compile to JS)
import { createServer, IncomingMessage, ServerResponse } from 'http';

const server = createServer((req: IncomingMessage, res: ServerResponse) => {
  // Handle CORS for preflight
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };
  if (req.method === 'OPTIONS') {
    res.writeHead(204, headers);
    res.end();
    return;
  }

  if (req.url?.startsWith('/api/api/robloxredirect')) {
    const urlParams = new URLSearchParams(req.url.split('?')[1]);
    const placeId = urlParams.get('placeid');
    const gameId = urlParams.get('gameid');

    if (placeId) {
      // Standard Roblox deep link format for browser redirect [web:17][web:14]
      const robloxUrl = `roblox://experiences/start?placeId=${placeId}${gameId ? `&gameInstanceId=${gameId}` : ''}`;
      
      res.writeHead(302, {
        ...headers,
        Location: robloxUrl,
      });
      res.end();
      return;
    }
  }

  res.writeHead(400, { ...headers, 'Content-Type': 'text/plain' });
  res.end('Missing placeid parameter. Use: /api/api/robloxredirect?placeid=123456789&gameid=12345678');
});

const PORT = 3000;
server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
  console.log(`Test: http://localhost:${PORT}/api/api/robloxredirect?placeid=6403373529&gameid=your-game-id`); // Example with Adopt Me! placeId [web:23]
});
