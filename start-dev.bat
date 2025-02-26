@echo off
echo ===== Anonim Chat Geliştirme Modu =====
echo.

echo [1/4] Node.js süreçleri durduruldu 
taskkill /F /IM node.exe >nul 2>&1
ping 127.0.0.1 -n 2 > nul

echo [2/4] Eski bağlantı noktalarını temizleme
FOR /F "tokens=5" %%T IN ('netstat -a -n -o ^| findstr :3000') DO (
  echo PORT 3000 already in use with PID: %%T
  taskkill /F /PID %%T >nul 2>&1
)
ping 127.0.0.1 -n 2 > nul

echo [3/4] Next.js önbelleğini temizleme
if exist ".next" (
  rmdir /s /q .next
  echo .next klasörü temizlendi
)
ping 127.0.0.1 -n 2 > nul

echo [4/4] Geliştirme sunucusunu başlatma...
echo.
echo Sunucu başlatılıyor, lütfen bekleyin...
echo Bu konsolu açık tutun ve tarayıcıda http://localhost:3000 adresini açın
echo.
echo Çıkmak için Ctrl+C tuşlarına basın.
echo.

node dev.js

echo.
if %ERRORLEVEL% NEQ 0 (
  echo Sunucu başlatma hatası oluştu! Error code: %ERRORLEVEL%
  echo.
  echo Alternatif başlatma denenecek...
  echo.
  npm run dev
)

pause 