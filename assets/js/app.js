/* App: load YAML and render sections */
(async function(){
  const state = { data: null };
  const el = (sel) => document.querySelector(sel);

  function markdownToHtml(md){
    // Minimal markdown: paragraphs and links
    const esc = (s)=>s.replace(/[&<>]/g, c=>({"&":"&amp;","<":"&lt;",">":"&gt;"}[c]));
    return md.split(/\n\n+/).map(p=>{
      const withLinks = p.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener">$1<\/a>');
      return `<p>${withLinks}<\/p>`;
    }).join("\n");
  }

  function card({ id, name, type, thumb, summary }){
    const safeThumb = thumb || 'assets/img/placeholder.svg';
    const url = `item.html?type=${encodeURIComponent(type)}&id=${encodeURIComponent(id)}`;
    return `
      <article class="card">
        <a class="stretched" href="${url}">
          <img class="thumb" src="${safeThumb}" alt="${name}" loading="lazy" />
        </a>
        <div class="content">
          <div class="badge">${type}</div>
          <h3><a class="stretched" href="${url}">${name}</a></h3>
          ${summary ? `<p>${summary}</p>` : ''}
        </div>
      </article>
    `;
  }

  function renderList(selector, items, type){
    const grid = el(selector);
    if(!grid) return;
    grid.innerHTML = items.filter(i=>i.type===type).map(card).join('');
  }

  function updateCounts(items){
    const counts = {
      total: items.length,
      artist: items.filter(i=>i.type==='artist').length,
      festival: items.filter(i=>i.type==='festival').length,
      merchant: items.filter(i=>i.type==='merchant').length,
    };
    const set = (id, val)=>{ const n = el(id); if(n) n.textContent = String(val); };
    set('#count-total', counts.total);
    set('#count-artists', counts.artist);
    set('#count-festivals', counts.festival);
    set('#count-merchants', counts.merchant);
    set('#hcount-artists', `(${counts.artist})`);
    set('#hcount-festivals', `(${counts.festival})`);
    set('#hcount-merchants', `(${counts.merchant})`);
  }

  function installSearch(items){
    const input = el('#search');
    if(!input) return;
    function matches(q, it){
      const hay = [it.name, it.type, ...(it.tags||[]), it.summary||''].join(' ').toLowerCase();
      return hay.includes(q);
    }
    const render = ()=>{
      const q = input.value.trim().toLowerCase();
      const list = q ? items.filter(it=>matches(q, it)) : items;
      renderList('#artists-grid', list, 'artist');
      renderList('#festivals-grid', list, 'festival');
      renderList('#merchants-grid', list, 'merchant');
      updateCounts(list);
    };
    input.addEventListener('input', render);
  }

  async function load(){
    try{
  const res = await fetch('data/list.yml', { cache: 'no-cache' });
      const text = await res.text();
      state.data = jsyaml.load(text);

      if(state.data?.why){
        el('#why-content').innerHTML = markdownToHtml(state.data.why.trim());
      }
      const items = state.data?.items || [];
      renderList('#artists-grid', items, 'artist');
      renderList('#festivals-grid', items, 'festival');
      renderList('#merchants-grid', items, 'merchant');
      updateCounts(items);
      installSearch(items);
    }catch(err){
      console.error('Failed to load data', err);
      const why = el('#why-content');
      if(why){ why.textContent = 'Failed to load data. Please try again later.' }
    }
  }

  await load();
})();
