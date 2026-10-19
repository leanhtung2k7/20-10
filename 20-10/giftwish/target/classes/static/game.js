(() => {
  const $ = (id) => document.getElementById(id);
  const wheel = $('wheel'), spinBtn = $('spin'), statusEl = $('status'), dlg = $('prize');
  const SEG = 8, ANG = 360 / SEG, R = 190, C = 200, DUR = 4500;
  const NS = 'http://www.w3.org/2000/svg';
  const MAX_WORDS = 100;
  const PRIZES = {
    FLOWER: { name: 'Bông hoa may mắn', icon: '#i-flower' },
    GIFTBOX: { name: 'Hộp quà bí mật', icon: '#i-gift' },
    MONEY: { name: 'Tiền lì xì', icon: '#i-money' }
  };
  let rot = 0, reward = null;
  const countWords = (s) => (s.match(/\S+/g) || []).length;
  function limitWords(el, out) {
    const m = [...el.value.matchAll(/\S+/g)];
    if (m.length > MAX_WORDS) el.value = el.value.slice(0, m[MAX_WORDS].index).trimEnd();
    out.textContent = Math.min(m.length, MAX_WORDS) + '/' + MAX_WORDS + ' từ';
  }
  $('gContent').addEventListener('input', () => limitWords($('gContent'), $('gCount')));

  // Ô chẵn = bông hoa (thay đồng xu), ô lẻ = hộp quà (thay bao lì xì)
  const pt = (deg, r) => { const a = deg * Math.PI / 180; return [C + r * Math.sin(a), C - r * Math.cos(a)]; };
  for (let i = 0; i < SEG; i++) {
    const [x1, y1] = pt(i * ANG - ANG / 2, R), [x2, y2] = pt(i * ANG + ANG / 2, R);
    const p = document.createElementNS(NS, 'path');
    p.setAttribute('d', `M${C} ${C}L${x1} ${y1}A${R} ${R} 0 0 1 ${x2} ${y2}Z`);
    p.setAttribute('fill', i % 2 ? '#ffd9e2' : '#fff4f6');
    p.setAttribute('stroke', '#d6336c');
    p.setAttribute('stroke-width', '3');
    wheel.appendChild(p);
    const [ix, iy] = pt(i * ANG, 128);
    const g = document.createElementNS(NS, 'g');
    g.setAttribute('transform', `translate(${ix} ${iy}) rotate(${i * ANG})`);
    g.innerHTML = `<use href="${i % 2 ? '#i-gift' : '#i-flower'}" x="-28" y="-28" width="56" height="56"/>`;
    wheel.appendChild(g);
  }

  const setStatus = (m, err) => { statusEl.textContent = m; statusEl.classList.toggle('err', !!err); };

  async function spin() {
    spinBtn.disabled = true;
    setStatus('');
    try {
      const res = await fetch('/api/game/spin');
      if (!res.ok) throw new Error('Không quay được, vui lòng thử lại.');
      reward = await res.json();
    } catch (e) {
      setStatus(e.message, true);
      spinBtn.disabled = false;
      return;
    }
    // FLOWER -> ô bông hoa (chẵn); MONEY / GIFTBOX -> ô hộp quà (lẻ)
    const wantFlower = reward.type === 'FLOWER';
    const choices = [...Array(SEG).keys()].filter((i) => (i % 2 === 0) === wantFlower);
    const idx = choices[Math.floor(Math.random() * choices.length)];
    const jitter = Math.random() * 20 - 10;
    rot = Math.ceil(rot / 360) * 360 + 360 * 5 + (360 - idx * ANG) + jitter;
    wheel.style.transform = `rotate(${rot}deg)`;
    setTimeout(showPrize, DUR + 150);
  }

  function showPrize() {
    const prize = PRIZES[reward.type] || PRIZES.MONEY;
    $('prizeUse').setAttribute('href', prize.icon);
    $('prizeTitle').textContent = '🎉 Chúc mừng bạn đã trúng: ' + prize.name + '!';
    $('gSendArea').classList.remove('show-name');
    $('prizeMsg').textContent = reward.message;
    $('gName').value = localStorage.getItem('gw-name') || $('gName').value;
    $('prizeErr').textContent = '';
    dlg.showModal();
    $('gContent').focus();
    spinBtn.disabled = false;
  }

  async function sendWish() {
    const senderName = $('gName').value.trim(), content = $('gContent').value.trim();
    const err = $('prizeErr'), btn = $('prizeSend');
    if (!content) { err.textContent = 'Hãy ghi lời chúc của bạn.'; $('gContent').focus(); return; }
    if (!senderName) {
      $('gSendArea').classList.add('show-name');
      $('gName').focus();
      err.textContent = 'Nhập tên của bạn ở ô phía trên nút Send.';
      return;
    }
    if (countWords(content) > MAX_WORDS) { err.textContent = 'Lời chúc tối đa ' + MAX_WORDS + ' từ.'; return; }
    btn.disabled = true;
    err.textContent = '';
    try {
      const res = await fetch('/api/wishes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ senderName, content })
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.message || 'Không gửi được lời chúc.');
      localStorage.setItem('gw-name', senderName);
      err.classList.remove('err');
      err.textContent = 'Đã gửi lời chúc!';
      const special = checkSpecialSender(senderName);
      if (special) showSpecial();
      setTimeout(() => { window.location.href = 'index.html'; }, special ? 4200 : 1200);
    } catch (e) {
      err.textContent = e.message;
      btn.disabled = false;
    }
  }

  // --- Con ma + modal hướng dẫn ---
  const ghost = $('ghost'), rules = $('rules');
  $('ghostBtn').addEventListener('click', () => ghost.classList.toggle('open'));
  $('ghostBar').addEventListener('click', () => rules.showModal());
  rules.addEventListener('click', (e) => { if (e.target === rules) rules.close(); });

  spinBtn.addEventListener('click', spin);
  $('prizeSend').addEventListener('click', sendWish);
})();
