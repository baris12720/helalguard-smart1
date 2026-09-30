# HelalGuard (Smart) — native Android project

This is HelalGuard rebuilt as a real native Android app (Kotlin), so it can
use the phone's camera for barcode scanning and photo-based ingredient
reading — something a plain WebView APK cannot do.

## What's inside

- **`app/`** — the Android app.
  - `MainActivity.kt` — hosts the same HelalGuard web UI you already had
    (`app/src/main/assets/`) inside a WebView, and exposes one small bridge
    (`Native.scan(mode)`) so the web UI can ask for a camera scan.
  - `ScannerActivity.kt` — full-screen camera (CameraX). In barcode mode it
    uses **on-device** ML Kit barcode scanning; in photo mode it takes a
    picture and reads the text with **on-device** ML Kit text recognition.
    No image ever leaves the phone.
  - `assets/` — the same `index.html` / `app.js` / `rules.js` / `engine.js`
    from the web version, plus the camera buttons and AI-cleanup wiring.
- **`backend/`** — a small optional server that cleans up OCR text with an
  AI model before it's checked against the rules (see `backend/README.md`).
  It never makes a halal/haram decision — only the offline rule engine does.
- **`.github/workflows/build.yml`** — builds a debug APK automatically.

## Why AI here, and only here

- **Camera → text**: fully on-device (ML Kit). No AI model, no network, no cost.
- **Barcode → product info**: Open Food Facts, same as before — a plain
  public database, not an AI call.
- **Messy OCR text → clean ingredient list**: *optional* AI cleanup step,
  only if you deploy `backend/` and enter its address in Settings.
- **Halal / haram verdict**: always the transparent rule engine
  (`assets/rules.js`), never the AI. This matches the principle already in
  the original project — the AI reads, it does not rule.

## Get the APK (no Android Studio needed)

1. Create a new GitHub repository and push this folder's contents to it.
2. Open the repo's **Actions** tab → run **"Build APK"** (or just push — it
   runs automatically).
3. When it finishes, download the **`HelalGuard-Smart-debug-apk`** artifact
   and install it on your phone.

This produces a **debug** build, installable and fully functional, signed
with a temporary debug key. That's fine for personal use and testing. If you
later want to publish it, that build needs a proper release signing key —
ask and I can add that step too.

## Important — I could not compile this myself

I don't have the Android SDK or internet access in the environment I build
in, so I wrote this Kotlin/CameraX/ML Kit code carefully against the
documented APIs, but I was **not able to compile it myself**. The web UI,
the rule engine, and the optional AI backend I *did* run through real
automated tests (see below) and they pass. The first GitHub Actions run is
the real compile check for the native part — if it reports an error, send
me the log and I'll fix it.

## What I did test here, automatically

- `rules.js` + `engine.js`: 27/27 test cases (the project's original 16 plus
  11 new ones for the ingredients I added). Run with `bash tools/run_all_tests.sh`.
- The full web UI (`assets/`) in a real headless browser: analysis, the
  ingredient guide search/filter, history, language switch, settings, and
  the barcode-lookup screen's offline fallback.
- The native camera bridge and AI-cleanup flow, using a simulated
  `window.Native` bridge standing in for the real Android side, plus a fake
  AI server standing in for `backend/`: scanning a barcode, photographing
  text, sending it for AI cleanup, and falling back to the raw on-device
  text when no AI server is configured or it's unreachable.
