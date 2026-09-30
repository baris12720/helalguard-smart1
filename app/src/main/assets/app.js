function switchTab(tabName, element) {
  document.querySelectorAll('.tab-content').forEach(el => el.classList.remove('active'));
  document.querySelectorAll('.nav-item').forEach(el => el.classList.remove('active'));
  
  const target = document.getElementById('tab-' + tabName);
  if (target) target.classList.add('active');
  if (element) element.classList.add('active');
  
  if (tabName === 'history') showHistory();
}

function openCameraScanner() {
  if (window.Android && window.Android.openScanner) {
    window.Android.openScanner();
  } else if (window.AndroidScanner) {
    window.AndroidScanner.startScan();
  } else {
    alert("Kamera başlatılıyor...");
  }
}

async function searchBarcodeManual() {
  const code = document.getElementById('manualBarcode').value.trim();
  if (!code) { alert("Lütfen bir barkod girin."); return; }
  
  const box = document.getElementById('barcodeResultBox');
  box.innerHTML = "<p>Sorgulanıyor...</p>";
  
  const res = await scanBarcode(code);
  if (res && res.status === 1 && res.product) {
    const p = res.product;
    const boycott = checkBoycott(p.brands, p.product_name);
    const eBadges = getEBadges(p.ingredients_text);
    
    box.innerHTML = `
      <div class="card">
        <h4>${p.product_name || 'İsimsiz Ürün'}</h4>
        <p><b>Marka:</b> ${p.brands || 'Bilinmiyor'}</p>
        ${boycott}
        ${eBadges}
        <p style="margin-top:10px; font-size:12px;"><b>İçindekiler:</b> ${p.ingredients_text || 'İçindekiler bilgisi bulunamadı.'}</p>
      </div>
    `;
    saveHistory(p.product_name || code);
  } else {
    box.innerHTML = `<div class="card"><p>❌ Ürün veritabanında bulunamadı (Barkod: ${code}).</p></div>`;
  }
}

function analyzeText() {
  const txt = document.getElementById('txtIngredients').value.trim();
  if (!txt) { alert("Lütfen içindekiler metni girin."); return; }
  
  const box = document.getElementById('resultBox');
  const eBadges = getEBadges(txt);
  
  box.innerHTML = `
    <div class="card">
      <h4>Analiz Sonucu</h4>
      ${eBadges || '<p style="color:green;">🟢 Riskli E-kodu tespit edilmedi.</p>'}
    </div>
  `;
}

function saveHistory(item) {
  try {
    let h = JSON.parse(localStorage.getItem('hg_hist') || '[]');
    h.unshift(item + " - " + new Date().toLocaleTimeString());
    if (h.length > 20) h.pop();
    localStorage.setItem('hg_hist', JSON.stringify(h));
  } catch(e){}
}

function showHistory() {
  const list = document.getElementById('historyList');
  try {
    let h = JSON.parse(localStorage.getItem('hg_hist') || '[]');
    if (h.length === 0) { list.innerHTML = "Henüz taranmış ürün yok."; return; }
    list.innerHTML = h.map(i => `<div style="padding:6px 0; border-bottom:1px solid #eee;">${i}</div>`).join('');
  } catch(e){}
}
