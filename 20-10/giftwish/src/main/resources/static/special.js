// Easter egg: hoạt ảnh đặc biệt khi tên người gửi chứa từ khóa (dùng chung cho index.html và game.html)
(() => {
  const KEYWORDS = [
  // Tên đầy đủ & biến thể viết liền/gạch nối
  'bùi như ngọc', 'bui nhu ngoc', 'buinhungoc', 'bùi_như_ngọc', 'bui_nhu_ngoc', 'bui-nhu-ngoc',

  // Viết tắt & Tên ghép ngắn
  'bnn', 'như ngọc', 'nhungoc', 'bùi ngọc', 'buingoc', 'ngọc bùi', 'ngocbui', 'bùi như', 'buinhu',

  // Tên riêng đơn lẻ (Có dấu & Không dấu)
  'ngọc', 'ngoc', 'như', 'nhu', 'bùi', 'bui',

  // Mối quan hệ với Tùng (Có dấu, Không dấu, Viết liền)
  'vợ tùng', 'vo tung', 'votung', 'vợ_tùng', 'vo_tung',
  'người yêu tùng', 'nguoi yeu tung', 'nguoiyeutung', 'nguoi_yeu_tung',
  'ny tùng', 'ny tung', 'nytung', 'ny_tùng', 'ny_tung',
  'ex tùng', 'ex tung', 'extung', 'ex_tùng', 'ex_tung',
  'bồ tùng', 'bo tung', 'botung', 'bồ_tùng', 'bo_tung',
  'vợ cũ tùng', 'vo cu tung', 'vocutung',

  // Tên ghép cặp Tùng & Ngọc
  'ngọc tùng', 'ngoc tung', 'ngoctung', 'ngọc_tùng', 'ngoc_tung',
  'tùng ngọc', 'tung ngoc', 'tungngoc', 'tùng_ngọc', 'tung_ngoc'
];
  const SHOW_MS = 4000;
  let timer;

  window.checkSpecialSender = (senderName) => {
    const name = String(senderName || '').toLowerCase();
    return KEYWORDS.some((k) => name.includes(k));
  };

  window.showSpecial = () => {
    const dlg = document.getElementById('special');
    if (!dlg) return;
    if (!dlg.open) dlg.showModal();
    clearTimeout(timer);
    timer = setTimeout(() => dlg.close(), SHOW_MS);
  };

  const dlg = document.getElementById('special');
  if (!dlg) return;
  dlg.querySelector('.sp-media').addEventListener('error', () => dlg.classList.add('no-video')); // thiếu file -> hiện bông hoa thay thế
  dlg.addEventListener('close', () => clearTimeout(timer));
  dlg.addEventListener('click', (e) => { if (e.target === dlg) dlg.close(); });
})();
