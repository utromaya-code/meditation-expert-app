const QRCode = require('qrcode');
const fs = require('fs');
const path = require('path');

const url = process.argv[2];
const outputPath = path.join(__dirname, 'qrcode.png');

QRCode.toFile(outputPath, url, {
  width: 500,
  margin: 2,
  color: {
    dark: '#000000',
    light: '#FFFFFF'
  }
}, function (err) {
  if (err) {
    console.error('Ошибка:', err);
    process.exit(1);
  }
  console.log('QR-код создан:', outputPath);
});
