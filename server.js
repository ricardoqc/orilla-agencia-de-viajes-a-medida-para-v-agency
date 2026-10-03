const express = require('express');
const path = require('path');
const fs = require('fs');
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const PORT = process.env.PORT || 3000;
const pub = path.join(__dirname, 'public');
const routes = ["/a-medida", "/colecciones", "/contacto", "/diario", "/sobre-nosotros"];
app.use(express.static(pub));
app.get('/api/health', (_req, res) => res.json({ ok: true, service: 'site-mvp' }));
for (const r of routes) {
  app.get(r, (req, res) => {
    const file = path.join(pub, req.path.replace(/^\//,'') + '.html');
    if (fs.existsSync(file)) return res.sendFile(file);
    res.status(404).send('Not found');
  });
}

app.get('/api/tours', (_req, res) => {
  const file = path.join(pub, 'data', 'tours.json');
  if (!fs.existsSync(file)) return res.json({ ok: true, tours: [] });
  res.json({ ok: true, tours: JSON.parse(fs.readFileSync(file, 'utf8')) });
});
app.get('/api/tours/:slug', (req, res) => {
  const file = path.join(pub, 'data', 'tours.json');
  if (!fs.existsSync(file)) return res.status(404).json({ ok: false });
  const tours = JSON.parse(fs.readFileSync(file, 'utf8'));
  const t = tours.find((x) => x.slug === req.params.slug);
  if (!t) return res.status(404).json({ ok: false });
  res.json({ ok: true, tour: t });
});
app.post('/api/reserva', (req, res) => {
  const body = req.body || {};
  const lead = {
    at: new Date().toISOString(),
    name: body.name || '',
    email: body.email || '',
    tour: body.tour || '',
    people: body.people || '',
    dates: body.dates || '',
    notes: body.notes || '',
  };
  const dir = path.join(__dirname, 'data');
  fs.mkdirSync(dir, { recursive: true });
  const log = path.join(dir, 'reservas.jsonl');
  fs.appendFileSync(log, JSON.stringify(lead) + String.fromCharCode(10));
  res.json({ ok: true, lead, whatsapp: 'https://wa.me/51999999999' });
});

app.get('/tours', (_req, res) => res.sendFile(path.join(pub, 'tours.html')));
app.get('/tours.html', (_req, res) => res.sendFile(path.join(pub, 'tours.html')));
app.get('/reserva', (_req, res) => res.sendFile(path.join(pub, 'reserva.html')));
app.get('/reserva.html', (_req, res) => res.sendFile(path.join(pub, 'reserva.html')));
app.get('/contacto', (_req, res) => res.sendFile(path.join(pub, 'contacto.html')));
app.get('/contacto.html', (_req, res) => res.sendFile(path.join(pub, 'contacto.html')));
app.get('/tours/:slug', (req, res) => {
  const slug = req.params.slug;
  const file = path.join(pub, 'tours-' + slug + '.html');
  if (fs.existsSync(file)) return res.sendFile(file);
  res.status(404).send('Tour no encontrado');
});
app.listen(PORT, () => console.log('site mvp on', PORT));
