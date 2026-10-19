(() => {
  const $ = (id) => document.getElementById(id);
  const content = $('content'), nameInput = $('name'), sendBtn = $('send'),
        sendArea = $('sendArea'), statusEl = $('status'), fx = $('fx'),
        ghost = $('ghost'), rules = $('rules'), sky = $('sky'), countEl = $('count');
  const API = '/api/wishes', MAX_WORDS = 100, CYCLE_MS = 30000, MAX_CLUSTERS = 6;

  // --- Con ma + modal hướng dẫn ---
  $('ghostBtn').addEventListener('click', () => ghost.classList.toggle('open'));
  $('ghostBar').addEventListener('click', () => rules.showModal());
  rules.addEventListener('click', (e) => { if (e.target === rules) rules.close(); });

  // --- Tiện ích ---
  const normalize = (s) => s.normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd').replace(/Đ/g, 'D').toLowerCase();
  const setStatus = (msg, isErr = false) => { statusEl.textContent = msg; statusEl.classList.toggle('err', isErr); };
  const words = (s) => s.match(/\S+/g) || [];

  // --- Giới hạn 100 từ ---
  function limitWords() {
    const m = [...content.value.matchAll(/\S+/g)];
    if (m.length > MAX_WORDS) content.value = content.value.slice(0, m[MAX_WORDS].index).trimEnd();
    countEl.textContent = Math.min(m.length, MAX_WORDS) + '/' + MAX_WORDS + ' từ';
  }
  content.addEventListener('input', limitWords);

  // --- Bong bóng khi gửi lời chúc (HeartEffect / FlowerEffect) ---
  function launchBubbles(effect) {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const icon = effect === 'FLOWER' ? '#i-flower' : '#i-heart';
    for (let i = 0; i < 30; i++) {
      const size = 20 + Math.random() * 36;
      const el = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      el.setAttribute('class', 'bubble');
      el.setAttribute('width', size);
      el.setAttribute('height', size);
      el.innerHTML = `<use href="${icon}"/>`;
      el.style.left = Math.random() * 100 + 'vw';
      el.style.setProperty('--t', (4 + Math.random() * 4) + 's');
      el.style.setProperty('--d', Math.random() * 1.6 + 's');
      el.style.setProperty('--dx', (Math.random() * 120 - 60) + 'px');
      el.addEventListener('animationend', () => el.remove());
      fx.appendChild(el);
    }
  }

  // --- Trái tim bay theo chu kỳ 30 giây ---
  const svgHeart = (cls, href) => {
    const s = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    s.setAttribute('class', cls);
    s.setAttribute('viewBox', '0 0 24 24');
    s.innerHTML = `<use href="${href}"/>`;
    return s;
  };
  const parseDate = (iso) => new Date(String(iso).replace(/(\.\d{3})\d+/, '$1'));
  const preview = (text) => {
    const w = words(text);
    return w.slice(0, 10).join(' ') + (w.length > 10 ? '...' : '');
  };

  function openWish(w) {
    $('wvName').textContent = w.senderName;
    $('wvTime').textContent = parseDate(w.createdAt).toLocaleString('vi-VN');
    $('wvBody').textContent = w.content;
    $('wishView').showModal();
    if (checkSpecialSender(w.senderName)) showSpecial();
  }

  function spawnCluster(w) {
    const c = document.createElement('div');
    c.className = 'cluster';
    c.style.setProperty('--x', (5 + Math.random() * 75) + 'vw');
    c.style.setProperty('--y', (8 + Math.random() * 40) + 'vh');

    const big = document.createElement('button');
    big.type = 'button';
    big.className = 'heart-big';
    big.setAttribute('aria-label', 'Xem lời chúc của ' + w.senderName);
    big.appendChild(svgHeart('heart-bg', '#i-heart-solid'));
    const txt = document.createElement('span');
    txt.className = 'heart-text';
    const nm = document.createElement('b');
    nm.textContent = w.senderName;
    txt.append(nm, document.createTextNode(preview(w.content)));
    big.appendChild(txt);
    big.addEventListener('click', () => openWish(w));

    const s1 = svgHeart('heart-small s1', '#i-heart'), s2 = svgHeart('heart-small s2', '#i-heart');
    c.append(big, s1, s2);
    // Hết hiệu ứng bay -> xóa khỏi DOM
    c.addEventListener('animationend', () => c.remove());
    sky.appendChild(c);
  }

  let wishes = [], cursor = 0;
  async function tick() {
    if (document.hidden || sky.children.length >= MAX_CLUSTERS) return;
    try {
      const res = await fetch(API);
      if (!res.ok) return;
      wishes = await res.json();
    } catch (_) { return; }
    if (!wishes.length) return;
    spawnCluster(wishes[cursor++ % wishes.length]);
  }
  tick();
  setInterval(tick, CYCLE_MS);

  // --- Gửi lời chúc ---
  async function submitWish() {
    const text = content.value.trim();
    const sender = nameInput.value.trim();

    if (!text) { setStatus('Hãy nhập lời chúc của bạn.', true); content.focus(); return; }
    if (normalize(text).includes('choi game')) { window.location.href = 'game.html'; return; }
    if (!sender) {
      sendArea.classList.add('show-name');
      nameInput.focus();
      setStatus('Nhập tên của bạn ở ô phía trên nút Send.', true);
      return;
    }
    if (words(text).length > MAX_WORDS) { setStatus('Lời chúc tối đa ' + MAX_WORDS + ' từ.', true); return; }

    sendBtn.disabled = true;
    setStatus('Đang gửi...');
    try {
      const res = await fetch(API, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ senderName: sender, content: text })
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.message || 'Không gửi được lời chúc.');
      if (data.redirect) { window.location.href = data.redirect; return; }

      setStatus('Đã gửi lời chúc.');
      try { localStorage.setItem('gw-name', sender); } catch (_) {}
      content.value = '';
      limitWords();
      sendArea.classList.remove('show-name');
      const logo = $('logo');
      logo.classList.remove('beat'); void logo.offsetWidth; logo.classList.add('beat');
      if (data.effect) launchBubbles(data.effect);
      if (checkSpecialSender(sender)) showSpecial();
    } catch (err) {
      setStatus(err.message || 'Có lỗi xảy ra, vui lòng thử lại.', true);
    } finally {
      sendBtn.disabled = false;
    }
  }

  sendBtn.addEventListener('click', submitWish);
  content.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey && !e.isComposing) { e.preventDefault(); submitWish(); }
  });
})();
