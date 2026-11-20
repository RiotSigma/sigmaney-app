import fs from 'node:fs';
import path from 'node:path';

const manifestPath = path.resolve('android/app/src/main/AndroidManifest.xml');
const mainActivityDest = path.resolve('android/app/src/main/java/com/sigmaney/app/MainActivity.java');
const mainActivitySrc = path.resolve('android-overrides/MainActivity.java');
const iconSrc = path.resolve('assets/icon-512.png');

if (fs.existsSync(manifestPath)) {
  let manifest = fs.readFileSync(manifestPath, 'utf8');
  const perms = [
    '<uses-permission android:name="android.permission.CAMERA" />',
    '<uses-feature android:name="android.hardware.camera" android:required="false" />',
    '<uses-feature android:name="android.hardware.camera.autofocus" android:required="false" />'
  ];
  for (const tag of perms) {
    if (!manifest.includes(tag)) {
      manifest = manifest.replace('<application', `    ${tag}\n    <application`);
    }
  }
  fs.writeFileSync(manifestPath, manifest, 'utf8');
  console.log('Patched AndroidManifest.xml with CAMERA permissions.');
}

if (fs.existsSync(mainActivitySrc)) {
  fs.mkdirSync(path.dirname(mainActivityDest), { recursive: true });
  fs.copyFileSync(mainActivitySrc, mainActivityDest);
  console.log('Installed custom MainActivity.java for WebView camera support.');
}

if (fs.existsSync(iconSrc)) {
  const resDir = path.resolve('android/app/src/main/res');
  const anydpi = path.join(resDir, 'mipmap-anydpi-v26');
  if (fs.existsSync(anydpi)) {
    fs.rmSync(anydpi, { recursive: true, force: true });
  }
  const buckets = ['mipmap-mdpi', 'mipmap-hdpi', 'mipmap-xhdpi', 'mipmap-xxhdpi', 'mipmap-xxxhdpi'];
  for (const b of buckets) {
    const dir = path.join(resDir, b);
    if (fs.existsSync(dir)) {
      fs.copyFileSync(iconSrc, path.join(dir, 'ic_launcher.png'));
      fs.copyFileSync(iconSrc, path.join(dir, 'ic_launcher_round.png'));
      fs.copyFileSync(iconSrc, path.join(dir, 'ic_launcher_foreground.png'));
    }
  }
  console.log('Applied Sigmaney Σ₽ launcher icons.');
}
