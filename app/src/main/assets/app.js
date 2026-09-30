function startNativeScan(mode) {
    if (window.Native && typeof window.Native.scan === "function") {
        window.Native.scan(mode);
    } else {
        alert("Kamera köprüsü bulunamadı! Lütfen uygulamayı mobil cihazda çalıştırın.");
    }
}

document.addEventListener("DOMContentLoaded", () => {
    const scanBtn = document.getElementById("scanBtn");
    if (scanBtn) {
        scanBtn.addEventListener("click", () => {
            startNativeScan("barcode");
        });
    }
});
