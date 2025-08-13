/* Item page: load YAML and render one item by id */
(async function(){
  const el = (sel)=>document.querySelector(sel);
  const params = new URLSearchParams(location.search);
  const type = params.get('type');
  const id = params.get('id');

  if(!type || !id){
    el('#item-detail').textContent = 'Missing parameters.';
    return;
  }

  function markdownToHtml(md){
    const esc = (s)=>s.replace(/[&<>]/g, c=>({"&":"&amp;","<":"&lt;",">":"&gt;"}[c]));
    // Basic support for headings, paragraphs, links, and line breaks
    let html = md.trim();
    html = html.replace(/^# (.*)$/gm, '<h2>$1</h2>');
    html = html.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
    html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>');
    html = html.split(/\n\n+/).map(p=>`<p>${p}</p>`).join('');
    return html;
  }

  function renderBreadcrumbs(item){
    el('#item-breadcrumbs').innerHTML = `
      <a href="index.html">Home</a> / <a href="index.html#${item.type}s">${item.type.charAt(0).toUpperCase()+item.type.slice(1)}s</a> / ${item.name}
    `;
  }

  function renderItem(item){
    renderBreadcrumbs(item);
    const tags = (item.tags||[]).map(t=>`<span class="badge">${t}</span>`).join(' ');
    el('#item-detail').innerHTML = `
      <header class="item-header">
  <img src="${item.thumb || 'assets/img/placeholder.svg'}" alt="${item.name}">
        <div class="meta">
          <h1>${item.name}</h1>
          <div class="tags">${tags}</div>
          ${item.links?.website ? `<a class="btn" href="${item.links.website}" target="_blank" rel="noopener">Website</a>` : ''}
        </div>
      </header>
      <section class="item-body">${item.description ? markdownToHtml(item.description) : '<p>No description provided.</p>'}</section>
    `;
    document.title = `${item.name} • No AI In My Metal`;
  }

  try{
  const res = await fetch('data/list.yml', { cache: 'no-cache' });
    const text = await res.text();
    const data = jsyaml.load(text);
    const items = data?.items || [];
    const item = items.find(i=>String(i.id)===String(id) && i.type===type);
    if(!item){
      el('#item-detail').textContent = 'Item not found.';
      return;
    }
    renderItem(item);
  }catch(err){
    console.error(err);
    el('#item-detail').textContent = 'Failed to load item.';
  }
})();
