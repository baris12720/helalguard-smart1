package com.helalguard.app

import android.content.Intent
import android.os.Bundle
import android.webkit.JavascriptInterface
import android.webkit.WebView
import androidx.appcompat.app.AppCompatActivity
import com.helalguard.smart.R

class MainActivity : AppCompatActivity() {

    private lateinit var webView: WebView

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)

        webView = findViewById(R.id.webView)
        webView.settings.javaScriptEnabled = true

        // Web arayüzünü Android yerel koduna bağlar
        webView.addJavascriptInterface(WebAppInterface(), "Native")

        webView.loadUrl("file:///android_asset/index.html")
    }

    inner class WebAppInterface {
        @JavascriptInterface
        fun scan(mode: String) {
            val intent = Intent(this@MainActivity, ScannerActivity::class.java).apply {
                putExtra("SCAN_MODE", mode)
            }
            startActivity(intent)
        }
    }
}
