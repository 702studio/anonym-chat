@echo off
echo ===== Eski Node.js süreçleri temizleniyor =====
taskkill /F /IM node.exe
echo.
echo İşlem tamamlandı! Şimdi "npm run fast-dev" komutunu çalıştırabilirsiniz.
echo. 