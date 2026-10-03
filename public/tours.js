async function load() {
  const res = await fetch('/api/tours');
  const data = await res.json();
  const tours = data.tours || [];
  const dest = document.getElementById('f-dest');
  const style = document.getElementById('f-style');
  const days = document.getElementById('f-days');
  const price = document.getElementById('f-price');
  const grid = document.getElementById('tour-grid');
  const empty = document.getElementById('empty');

  [...new Set(tours.map(t => t.destination))].sort().forEach(d => {
    const o = document.createElement('option'); o.value = d; o.textContent = d; dest.appendChild(o);
  });
  [...new Set(tours.map(t => t.style))].sort().forEach(s => {
    const o = document.createElement('option'); o.value = s; o.textContent = s; style.appendChild(o);
  });

  function render() {
    const fd = dest.value;
    const fs = style.value;
    const fdays = Number(days.value || 0);
    const fprice = Number(price.value || 0);
    const list = tours.filter(t => {
      if (fd && t.destination !== fd) return false;
      if (fs && t.style !== fs) return false;
      if (fdays && t.days > fdays) return false;
      if (fprice && t.price > fprice) return false;
      return true;
    });
    grid.innerHTML = list.map(t => `
      <article class="tour-card" data-slug="${t.slug}">
        <div class="thumb"></div>
        <div class="body">
          <h3>${t.title}</h3>
          <div class="meta">${t.destination} · ${t.days} días · ${t.style}</div>
          <div>${(t.tags||[]).map(x => `<span class="chip">${x}</span>`).join('')}</div>
          <p class="muted">${t.summary||''}</p>
          <div class="price">USD ${t.price}</div>
          <a class="more" href="/tours/${t.slug}">Ver ficha</a>
        </div>
      </article>`).join('');
    empty.classList.toggle('hidden', list.length > 0);
  }
  [dest, style, days, price].forEach(el => el.addEventListener('input', render));
  render();
}
load().catch(err => {
  document.getElementById('tour-grid').innerHTML = '<p class="muted">Error cargando tours</p>';
  console.error(err);
});
