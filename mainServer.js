const WebSocket = require('ws');

const PORT = 9999;
const wss = new WebSocket.Server({ port: PORT });

/**
 * sessionMap
 * key   -> 6 digit code
 * value -> { url, clients:Set<WebSocket> }
 */
const sessionMap = new Map();

/**
 * Generate UNIQUE 6 digit code
 */
function generateUniqueCode() {
  let code;
  do {
    code = Math.floor(100000 + Math.random() * 900000).toString();
  } while (sessionMap.has(code));
  return code;
}

wss.on('connection', (ws) => {
  console.log('🔗 Client connected');

  ws.on('message', (message) => {
    try {
      const data = JSON.parse(message.toString());

      /* ---------------- CREATE SESSION ---------------- */
      if (data.type === 'CREATE_SESSION') {
        const { url } = data;

        if (!url) {
          return ws.send(JSON.stringify({
            type: 'ERROR',
            message: 'URL required'
          }));
        }

        const code = generateUniqueCode();

        sessionMap.set(code, {
          url,
          clients: new Set([ws])
        });

        ws.sessionCode = code;

        ws.send(JSON.stringify({
          type: 'SESSION_CREATED',
          code
        }));

        console.log(`✅ Session created | Code: ${code} | URL: ${url}`);
      }

      /* ---------------- JOIN SESSION ---------------- */
      if (data.type === 'JOIN_SESSION') {
        const { code } = data;

        if (!sessionMap.has(code)) {
          return ws.send(JSON.stringify({
            type: 'ERROR',
            message: 'Invalid session code'
          }));
        }

        const session = sessionMap.get(code);
        session.clients.add(ws);
        ws.sessionCode = code;

        ws.send(JSON.stringify({
          type: 'JOINED_SESSION',
          url: session.url
        }));

        console.log(`👥 Client joined session ${code}`);
      }

    } catch (err) {
      ws.send(JSON.stringify({
        type: 'ERROR',
        message: 'Invalid JSON'
      }));
    }
  });

  ws.on('close', () => {
    const code = ws.sessionCode;
    if (!code || !sessionMap.has(code)) return;

    const session = sessionMap.get(code);
    session.clients.delete(ws);

    // Remove session if empty
    if (session.clients.size === 0) {
      sessionMap.delete(code);
      console.log(`🗑 Session ${code} removed`);
    }
  });
});

console.log(`🚀 WebSocket server running on ws://localhost:${PORT}`);
