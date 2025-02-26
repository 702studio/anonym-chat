@echo off
echo ===== Port Sorunlarını Düzeltme Aracı =====
echo.

echo [1] Port 3000 kontrol ediliyor...
netstat -ano | findstr :3000 > port-info.txt
if %ERRORLEVEL% EQU 0 (
  echo Port 3000 kullanımda! Süreci sonlandırmaya çalışılıyor...
  for /f "tokens=5" %%i in (port-info.txt) do (
    echo PID: %%i sonlandırılıyor...
    taskkill /F /PID %%i
  )
) else (
  echo Port 3000 kullanılabilir durumda.
)

echo [2] Port 3001 kontrol ediliyor...
netstat -ano | findstr :3001 > port-info.txt
if %ERRORLEVEL% EQU 0 (
  echo Port 3001 kullanımda! Süreci sonlandırmaya çalışılıyor...
  for /f "tokens=5" %%i in (port-info.txt) do (
    echo PID: %%i sonlandırılıyor...
    taskkill /F /PID %%i
  )
) else (
  echo Port 3001 kullanılabilir durumda.
)

if exist port-info.txt del port-info.txt

echo [3] Node süreçleri kontrol ediliyor ve temizleniyor...
taskkill /F /IM node.exe > nul 2>&1

echo [4] Ağ sıfırlanıyor...
ipconfig /flushdns > nul 2>&1
netsh winsock reset > nul 2>&1

echo.
echo ===== İşlem tamamlandı! =====
echo Şimdi "npm run dev" komutuyla sunucuyu başlatabilirsiniz.
echo.
pause 