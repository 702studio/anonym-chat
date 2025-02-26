/**
 * Otomatik kullanıcı adı oluşturma fonksiyonu
 * User- formatında 4 basamaklı random sayı ekleyerek kullanıcı adı oluşturur
 */
export function generateUsername(): string {
  return `User-${Math.floor(1000 + Math.random() * 9000)}`;
}

/**
 * Oda ID formatını temizleme fonksiyonu
 */
export function sanitizeRoomId(roomId: string): string {
  return roomId.trim().replace(/[^a-zA-Z0-9-]/g, "");
}

/**
 * Geçerli bir URL olup olmadığını kontrol etme
 */
export function isValidRoomId(roomId: string): boolean {
  return roomId.trim().length > 0;
} 