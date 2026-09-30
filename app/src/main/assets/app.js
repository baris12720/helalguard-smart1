// HELALGUARD SMART - ANA SCRIPT
const eCodeDb = {
  "E120": { name: "Karmin / Koşineal", status: "red", desc: "Böcekten elde edilen kırmızı renklendirici (Haram/Şüpheli)" },
  "E441": { name: "Jelatin", status: "red", desc: "Sığır veya Domuz kaynaklı (Şüpheli/Haram)" },
  "E471": { name: "Yağ Asitlerinin Mono ve Digliseritleri", status: "yellow", desc: "Bitkisel veya Hayvansal kaynaklı olabilir (Şüpheli)" },
  "E472": { name: "Yağ Asitlerinin Esterleri", status: "yellow", desc: "Hayvansal yağ riski var (Şüpheli)" },
  "E100": { name: "Kurkumin", status: "green", desc: "Bitkisel Kökenli (Helal)" },
  "E300": { name: "Askorbik Asit", status: "green", desc: "Güvenli / Bitkisel (Helal)" },
  "E322": { name: "Lesitin", status: "green", desc: "Bitkisel / Soya (Helal)" }
};

const boycottBrands = {
  "COCA-COLA": "İsrail bağlantılı/destekçi marka",
  "COCA COLA": "İsrail bağlantılı/destekçi marka",
  "FANTA": "Coca-Cola Company",
  "SPRITE": "Coca-Cola Company",
  "PEPSI": "İsrail bağlantılı/destekçi marka",
  "LAYS": "PepsiCo",
  "DORITOS": "PepsiCo",
  "NESTLE": "İsrail bağlantılı marka",
  "DANONE": "İsrail bağlantılı marka"
};

function checkBoycott(brand, name) {
  let text = ((brand || "") + " " + (name || "")).toUpperCase();
  for (let b in boycottBrands) {
    if (text.includes(b)) {
      return '<div style="background:#eb4d4b; color:#fff; padding:10px; border-radius:8px; margin:10px 0; font-weight:bold; text-align:center;">🚫 BOYKOTLU MARKA: ' + boycottBrands[b] + '</div>';
    }
  }
  return '';
}

function getEBadges(text) {
  if (!text) return '';
  let html = '<div style="display:flex; flex-wrap:wrap; gap:5px; margin-top:8px;">';
  let count = 0;
  for (let code in eCodeDb) {
    if (text.toUpperCase().includes(code)) {
      count++;
      let item = eCodeDb[code];
      let bg = item.status === 'red' ? '#e74c3c' : item.status === 'yellow' ? '#f1c40f' : '#2ecc71';
      let color = item.status === 'yellow' ? '#000' : '#fff';
      html += '<span style="background:' + bg + '; color:' + color + '; padding:4px 8px; border-radius:12px; font-size:11px; font-weight:bold;">' + code + ': ' + item.name + '</span>';
    }
  }
  html += '</div>';
  return count > 0 ? html : '';
}

async function scanBarcode(code) {
  try {
    const resp = await fetch("https://world.openfoodfacts.org/api/v0/product/" + encodeURIComponent(code) + ".json", {
      method: "GET",
      headers: { "User-Agent": "HelalGuard-SmartApp/2.0" }
    });
    if (!resp.ok) throw new Error("HTTP " + resp.status);
    const data = await resp.json();
    return data;
  } catch (err) {
    console.error(err);
    return null;
  }
}
