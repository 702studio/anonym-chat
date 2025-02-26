/**
 * Geliştirilmiş Next.js geliştirme sunucusu başlatma scripti
 */

const { spawn } = require('child_process');
const { platform } = require('os');
const { resolve } = require('path');
const fs = require('fs');

console.log('🚀 Geliştirilmiş Next.js geliştirme sunucusu başlatılıyor...');
console.log('📊 Sistem bilgileri:');
console.log(`- Platform: ${platform()}`);
console.log(`- Çalışma dizini: ${process.cwd()}`);
console.log(`- Node sürümü: ${process.version}`);

// Next.js config dosyasını kontrol et
try {
  const configPath = resolve(process.cwd(), 'next.config.js');
  console.log(`- Next.js config dosyası: ${fs.existsSync(configPath) ? 'Mevcut ✅' : 'Bulunamadı ❌'}`);
} catch (error) {
  console.log('- Next.js config kontrolü başarısız oldu');
}

// Eski Node.js süreçlerini temizle (sadece Windows için)
if (platform() === 'win32') {
  try {
    console.log('🧹 Eski Node.js süreçleri temizleniyor...');
    const cleanup = spawn('taskkill', ['/F', '/IM', 'node.exe'], { 
      stdio: 'pipe',
      shell: true
    });
    
    cleanup.stdout.on('data', (data) => {
      console.log(`Temizleme çıktısı: ${data}`);
    });
    
    cleanup.stderr.on('data', (data) => {
      console.log(`Temizleme hatası: ${data}`);
    });
    
    cleanup.on('exit', (code) => {
      console.log(`Temizleme tamamlandı. Çıkış kodu: ${code}`);
      startServer();
    });
  } catch (error) {
    console.log('⚠️ Eski süreçleri temizlerken hata oluştu:', error);
    startServer();
  }
} else {
  startServer();
}

function startServer() {
  // Next.js geliştirme sunucusunu başlat
  console.log('🌐 Next.js geliştirme sunucusu başlatılıyor...');
  
  const env = { ...process.env };
  
  // Fast Refresh için NODE_ENV'i zorla
  env.NODE_ENV = 'development';
  
  // Daha az bellek tahsis et (Windows üzerindeki en yaygın RAM miktarına uygun)
  env.NODE_OPTIONS = '--max-old-space-size=4096';
  
  // Fast Refresh önbellek boyutunu artır
  env.NEXT_TELEMETRY_DISABLED = '1';
  
  // Webpack dosya izleme ayarları
  env.CHOKIDAR_USEPOLLING = 'true';
  env.WATCHPACK_POLLING = 'true';

  console.log('⚙️ Ortam değişkenleri ayarlandı:');
  console.log(`- NODE_ENV: ${env.NODE_ENV}`);
  console.log(`- NODE_OPTIONS: ${env.NODE_OPTIONS}`);
  console.log(`- CHOKIDAR_USEPOLLING: ${env.CHOKIDAR_USEPOLLING}`);
  console.log(`- WATCHPACK_POLLING: ${env.WATCHPACK_POLLING}`);

  try {
    console.log('▶️ Next.js başlatılıyor...');
    // Doğrudan next komutunu çalıştırmak yerine npx next kullan
    const nextDev = spawn('npx', ['next', 'dev'], {
      stdio: 'inherit',
      shell: true,
      env,
      windowsHide: false // Windows'ta konsol penceresini görünür yap
    });
    
    nextDev.on('error', (error) => {
      console.error('❌ Sunucu başlatma hatası:', error);
    });
    
    // Düzgün temizlik için kapanma işleyicileri
    ['SIGINT', 'SIGTERM'].forEach(signal => {
      process.on(signal, () => {
        console.log(`\n👋 ${signal} sinyali alındı, sunucuyu kapatılıyor...`);
        nextDev.kill(signal);
        process.exit(0);
      });
    });
    
    console.log('✅ Geliştirme sunucusu başlatıldı');
    console.log('🔗 Tarayıcıda http://localhost:3000 adresini açın');
    
  } catch (error) {
    console.error('❌❌ Kritik hata:', error);
  }
} 