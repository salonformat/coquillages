import http from 'node:http';
import {readFile, stat} from 'node:fs/promises';
import path from 'node:path';
const root = path.resolve('dist');
const types = {'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.jpg':'image/jpeg','.png':'image/png','.gif':'image/gif','.webp':'image/webp','.woff2':'font/woff2','.json':'application/json'};
const port = Number(process.env.PORT || 4173);
http.createServer(async (req,res) => {
  try {
    let pathname = decodeURIComponent(new URL(req.url,'http://localhost').pathname);
    const candidate = path.resolve(root,'.'+pathname);
    if (candidate !== root && !candidate.startsWith(root+path.sep)) {res.writeHead(403);res.end();return;}
    let file = candidate;
    try {if ((await stat(file)).isDirectory()) file=path.join(file,'index.html');} catch {file=path.join(root,'index.html');}
    const data=await readFile(file);
    res.writeHead(200,{'Content-Type':types[path.extname(file)]||'application/octet-stream','Cache-Control':'no-cache','X-Content-Type-Options':'nosniff'});
    res.end(data);
  } catch {res.writeHead(404);res.end('Not found');}
}).listen(port,'127.0.0.1',()=>console.log(`Local: http://127.0.0.1:${port}`));
