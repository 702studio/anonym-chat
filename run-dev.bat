@echo off
echo ===== Basit Next.js Başlatıcı =====
echo.

echo [1] Temizlik yapılıyor...
taskkill /F /IM node.exe > nul 2>&1

echo [2] Next.js geliştirme sunucusu başlatılıyor...
echo.
echo Lütfen bekleyin, tarayıcınızda 10-15 saniye içinde http://localhost:3000 açılabilir.
echo Eğer bağlantı kurulamazsa, port bilgileri için aşağıdaki mesajlara bakın.
echo.

start "" http://localhost:3000

npm run dev

pause 