import fs from 'fs';
import path from 'path';

const manifestPath = path.resolve('android/app/src/main/AndroidManifest.xml');
if (fs.existsSync(manifestPath)) {
  let xml = fs.readFileSync(manifestPath, 'utf8');
  const perms = [
    '<uses-permission android:name="android.permission.INTERNET" />',
    '<uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />',
    '<uses-permission android:name="android.permission.CAMERA" />',
    '<uses-feature android:name="android.hardware.camera" android:required="false" />'
  ];
  perms.forEach(p => {
    if (!xml.includes(p)) {
      xml = xml.replace('<application', p + '\n    <application');
    }
  });
  if (!xml.includes('android:usesCleartextTraffic')) {
    xml = xml.replace('<application', '<application android:usesCleartextTraffic="true"');
  }
  fs.writeFileSync(manifestPath, xml, 'utf8');
  console.log('Updated AndroidManifest.xml with CAMERA, INTERNET & cleartext permissions.');
}

const mainActSrc = path.resolve('android-overrides/MainActivity.java');
const mainActDst = path.resolve('android/app/src/main/java/com/sigmaney/app/MainActivity.java');
if (fs.existsSync(mainActSrc) && fs.existsSync(path.dirname(mainActDst))) {
  fs.copyFileSync(mainActSrc, mainActDst);
  console.log('Copied custom MainActivity.java.');
}

const iconSrc = path.resolve('assets/icon-512.png');
const resDirs = ['mipmap-mdpi', 'mipmap-hdpi', 'mipmap-xhdpi', 'mipmap-xxhdpi', 'mipmap-xxxhdpi'];
if (fs.existsSync(iconSrc)) {
  resDirs.forEach(d => {
    const dir = path.resolve('android/app/src/main/res', d);
    if (fs.existsSync(dir)) {
      fs.copyFileSync(iconSrc, path.join(dir, 'ic_launcher.png'));
      fs.copyFileSync(iconSrc, path.join(dir, 'ic_launcher_round.png'));
    }
  });
  console.log('Applied Sigmaney icon across mipmap folders.');
}
