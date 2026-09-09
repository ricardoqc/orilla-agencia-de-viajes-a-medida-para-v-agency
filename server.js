const express = require('express');
const path = require('path');
const fs = require('fs');
const app = express();
const PORT = process.env.PORT || 3000;
const pub = path.join(__dirname, 'public');
app.use(express.static(pub));
app.get('/api/health', (_req, res) => res.json({ ok: true, service: 'site-mvp' }));
// pretty routes → html
app.get(['/servicios','/equipo','/primera-visita','/blog','/contacto','/nosotros','/tratamientos','/citas'], (req, res) => {
  const file = path.join(pub, req.path.replace(/^\//,'') + '.html');
  if (fs.existsSync(file)) return res.sendFile(file);
  res.status(404).send('Not found');
});
app.listen(PORT, () => console.log('site mvp on', PORT));
