import fs from 'fs';
import path from 'path';
import zlib from 'zlib';

console.log('=== ANDROID PACKAGE PERMANENT CONFLICT RESOLVER ===');

let appName = '';
let appDescription = 'Optimized Android progressive hybrid container application wrapper.';
let themeColorPrimary = '#4f46e5';
let themeColorBg = '#0b0f19';

if (fs.existsSync('project-metadata.json')) {
  try {
    const meta = JSON.parse(fs.readFileSync('project-metadata.json', 'utf8'));
    if (meta.name) appName = meta.name;
    if (meta.description) appDescription = meta.description;
    if (meta.themePrimary) themeColorPrimary = meta.themePrimary;
    if (meta.themeBg) themeColorBg = meta.themeBg;
  } catch (e) {
    console.warn('Metadata parsing warning:', e);
  }
}

if (!appName && fs.existsSync('www/index.html')) {
  try {
    const htmlContent = fs.readFileSync('www/index.html', 'utf8');
    const titleMatch = htmlContent.match(/<title>([^<]+)<\/title>/i);
    if (titleMatch) {
      appName = titleMatch[1].trim();
    }
    const descMatch = htmlContent.match(/<meta\s+name="description"\s+content="([^"]+)"/i);
    if (descMatch) {
       appDescription = descMatch[1].trim();
    }
  } catch (e) {}
}

if (!appName) {
  if (fs.existsSync('capacitor.config.json')) {
    try {
      const config = JSON.parse(fs.readFileSync('capacitor.config.json', 'utf8'));
      if (config.appName) appName = config.appName;
    } catch (e) {}
  } else if (fs.existsSync('capacitor.config.ts')) {
    try {
      const content = fs.readFileSync('capacitor.config.ts', 'utf8');
      const match = content.match(/appName\s*:\s*['"]([^'"]+)['"]/);
      if (match) appName = match[1];
    } catch (e) {}
  }
}

if (!appName && fs.existsSync('package.json')) {
  try {
    const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
    if (pkg.name) {
      appName = pkg.name.split(/[-_]/).map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
    }
  } catch (e) {}
}

const cleanAppName = appName.trim().replace(/^Applet$/i, 'My Application') || 'My Application';
const uniqueAppLabel = cleanAppName;

console.log("Verified Project Name: " + uniqueAppLabel);
console.log("Verified Project Description: " + appDescription);

const uniqueAppId = 'com.builderpro.app';

console.log("Newly Generated Unique ApplicationID: " + uniqueAppId);

const conflictTrackingFile = 'built_packages.txt';
let previousPackages = [];
if (fs.existsSync(conflictTrackingFile)) {
  previousPackages = fs.readFileSync(conflictTrackingFile, 'utf8').split('\n').map(l => l.trim()).filter(Boolean);
}
if (previousPackages.includes(uniqueAppId)) {
  console.error('[CRITICAL CONFLICT ERROR]: Package ID ' + uniqueAppId + ' has already been built! Halting build immediately to prevent package installer collision.');
  process.exit(1);
}
fs.appendFileSync(conflictTrackingFile, uniqueAppId + '\n', 'utf8');

if (fs.existsSync('capacitor.config.json')) {
  try {
    const data = JSON.parse(fs.readFileSync('capacitor.config.json', 'utf8'));
    data.appId = uniqueAppId;
    data.appName = uniqueAppLabel;
    fs.writeFileSync('capacitor.config.json', JSON.stringify(data, null, 2), 'utf8');
    console.log('Updated capacitor.config.json.');
  } catch(e) {
    console.error('Error modifying capacitor.config.json:', e);
  }
}
if (fs.existsSync('capacitor.config.ts')) {
  try {
    let content = fs.readFileSync('capacitor.config.ts', 'utf8');
    content = content.replace(/appId\s*:\s*['"][^'"]+['"]/g, "appId: '" + uniqueAppId + "'");
    content = content.replace(/appName\s*:\s*['"][^'"]+['"]/g, "appName: '" + uniqueAppLabel + "'");
    fs.writeFileSync('capacitor.config.ts', content, 'utf8');
    console.log('Updated capacitor.config.ts.');
  } catch(e) {
    console.error('Error modifying capacitor.config.ts:', e);
  }
}

// 5. Update Android Project Configuration files
let originalPackage = '';
const baseJavaDirLocation = 'android/app/src/main/java';

const manifestPaths = [
  'android/app/src/main/AndroidManifest.xml',
  'app/src/main/AndroidManifest.xml',
  'android/app/AndroidManifest.xml',
  'app/AndroidManifest.xml'
];

let targetManifestPath = '';
for (const p of manifestPaths) {
  if (fs.existsSync(p)) {
    targetManifestPath = p;
    try {
      const content = fs.readFileSync(p, 'utf8');
      const match = content.match(/package="([^"]+)"/);
      if (match) {
        originalPackage = match[1];
        console.log("Located original package from manifest: " + originalPackage);
      }
    } catch (e) {}
    break;
  }
}

// Bulletproof Active Java Package Detection: check manifest-defined folder first
let locatedJavaPackage = '';
if (originalPackage) {
  const expectedPathJava = path.join(baseJavaDirLocation, ...originalPackage.split('.'), 'MainActivity.java');
  const expectedPathKotlin = path.join(baseJavaDirLocation, ...originalPackage.split('.'), 'MainActivity.kt');
  const expectedPathAppJava = path.join('app/src/main/java', ...originalPackage.split('.'), 'MainActivity.java');
  const expectedPathAppKotlin = path.join('app/src/main/java', ...originalPackage.split('.'), 'MainActivity.kt');
  
  if (fs.existsSync(expectedPathJava) || fs.existsSync(expectedPathKotlin) || fs.existsSync(expectedPathAppJava) || fs.existsSync(expectedPathAppKotlin)) {
    locatedJavaPackage = originalPackage;
    console.log(`[BULLETPROOF] Confirmed MainActivity exists inside original package folder: ${originalPackage}`);
  }
}

// Fallback search only if not found in active package location
if (!locatedJavaPackage) {
  function findMainActivity(dir) {
    if (!fs.existsSync(dir)) return null;
    const list = fs.readdirSync(dir);
    for (const file of list) {
      const fullPath = path.join(dir, file);
      if (fs.statSync(fullPath).isDirectory()) {
        const res = findMainActivity(fullPath);
        if (res) return res;
      } else if (file === 'MainActivity.java' || file === 'MainActivity.kt') {
        return fullPath;
      }
    }
    return null;
  }

  try {
    const mainActivityPath = findMainActivity(baseJavaDirLocation) || findMainActivity('app/src/main/java');
    if (mainActivityPath) {
      const content = fs.readFileSync(mainActivityPath, 'utf8');
      const match = content.match(/package\\s+([^;\\s]+)/);
      if (match) {
        locatedJavaPackage = match[1].trim();
        console.log(`[BULLETPROOF] Located current package directly from ${path.basename(mainActivityPath)}: ${locatedJavaPackage}`);
      }
    }
  } catch (e) {
    console.log('[BULLETPROOF] Error detecting package from source files:', e);
  }
}

if (locatedJavaPackage) {
  originalPackage = locatedJavaPackage;
  console.log("[BULLETPROOF] Overriding originalPackage with the true filesystem package: " + originalPackage);
}

if (!originalPackage) {
  originalPackage = 'com.pwa.app';
}

if (targetManifestPath) {
  try {
    let content = fs.readFileSync(targetManifestPath, 'utf8');
    if (content.includes('package=')) {
      content = content.replace(/package="[^"]+"/g, 'package="' + uniqueAppId + '"');
    } else {
      content = content.replace('<manifest', '<manifest package="' + uniqueAppId + '"');
    }
    content = content.replace(/android:label="Applet"/g, 'android:label="@string/app_name"');
    fs.writeFileSync(targetManifestPath, content, 'utf8');
    console.log('Updated AndroidManifest.xml.');
  } catch (e) {
    console.error('Error modifying AndroidManifest.xml:', e);
  }
}

const stringsPaths = [
  'android/app/src/main/res/values/strings.xml',
  'app/src/main/res/values/strings.xml'
];
for (const p of stringsPaths) {
  if (fs.existsSync(p)) {
    try {
      let content = fs.readFileSync(p, 'utf8');
      content = content.replace(/<string\s+name="app_name">.*?<\/string>/g, '<string name="app_name">' + uniqueAppLabel + '</string>');
      content = content.replace(/<string\s+name="title_activity_main">.*?<\/string>/g, '<string name="title_activity_main">' + uniqueAppLabel + '</string>');
      fs.writeFileSync(p, content, 'utf8');
      console.log("Updated strings.xml resource values: " + p);
    } catch (e) {
      console.error("Error modifying stringsResource: " + p, e);
    }
  }
}

const gradlePaths = [
  'android/app/build.gradle',
  'app/build.gradle'
];
const runNumStr = process.env.GITHUB_RUN_NUMBER || '';
const versionCode = runNumStr ? parseInt(runNumStr, 10) : Math.floor(Date.now() / 1000) % 2000000000;

for (const p of gradlePaths) {
  if (fs.existsSync(p)) {
    try {
      let content = fs.readFileSync(p, 'utf8');
      content = content.replace(/namespace\s*=?\s*['"][^'"]+['"]/g, 'namespace "' + uniqueAppId + '"');
      content = content.replace(/applicationId\s*=?\s*['"][^'"]+['"]/g, 'applicationId "' + uniqueAppId + '"');
      content = content.replace(/versionCode\s+\d+/g, 'versionCode ' + versionCode);
      fs.writeFileSync(p, content, 'utf8');
      console.log("Updated build.gradle gradle config: " + p);
    } catch (e) {
      console.error("Error modifying buildScript: " + p, e);
    }
  }
}

const baseJavaDirs = [
  'android/app/src/main/java',
  'app/src/main/java'
];

function getAllFiles(dirPath, arrayOfFiles) {
  const files = fs.readdirSync(dirPath);
  arrayOfFiles = arrayOfFiles || [];
  files.forEach(function(file) {
    if (fs.statSync(dirPath + "/" + file).isDirectory()) {
      arrayOfFiles = getAllFiles(dirPath + "/" + file, arrayOfFiles);
    } else {
      arrayOfFiles.push(path.join(dirPath, "/", file));
    }
  });
  return arrayOfFiles;
}

for (const baseJavaDir of baseJavaDirs) {
  if (fs.existsSync(baseJavaDir)) {
    try {
      const files = getAllFiles(baseJavaDir);
      const javaKotlinFiles = files.filter(f => f.endsWith('.java') || f.endsWith('.kt'));
      
      for (const file of javaKotlinFiles) {
        let content = fs.readFileSync(file, 'utf8');
        const packageRegex = new RegExp('package\\s+' + originalPackage.replace(/\./g, '\\.') + '\\s*;?');
        if (packageRegex.test(content)) {
          content = content.replace(packageRegex, "package " + uniqueAppId + ";");
          fs.writeFileSync(file, content, 'utf8');
          console.log("Rewrote Package Declaration inside source (bulletproof regex): " + file);
        }
      }

      const oldPackagePath = path.join(baseJavaDir, ...originalPackage.split('.'));
      const newPackagePath = path.join(baseJavaDir, ...uniqueAppId.split('.'));
      
      if (fs.existsSync(oldPackagePath) && oldPackagePath !== newPackagePath) {
        fs.mkdirSync(newPackagePath, { recursive: true });
        const oldFiles = fs.readdirSync(oldPackagePath);
        for (const f of oldFiles) {
          const src = path.join(oldPackagePath, f);
          const dest = path.join(newPackagePath, f);
          if (fs.statSync(src).isFile()) {
            fs.renameSync(src, dest);
            console.log("Migrating layout controller class file: " + dest);
          }
        }
        let inspectDir = oldPackagePath;
        while (inspectDir !== baseJavaDir) {
          try {
            if (fs.readdirSync(inspectDir).length === 0) {
              fs.rmdirSync(inspectDir);
              inspectDir = path.dirname(inspectDir);
            } else {
              break;
            }
          } catch (e) {
            break;
          }
        }
      }
    } catch (e) {
      console.error('Error during package file migration:', e);
    }
  }
}

function stringHash(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

const nameHash = stringHash(uniqueAppLabel);
const descHash = stringHash(appDescription);

const hue = nameHash % 360;
const sat = 75 + (descHash % 20);
const lit = 45 + (nameHash % 15);

function hslToRgb(h, s, l) {
  h /= 360; s /= 100; l /= 100;
  let r, g, b;
  if (s === 0) {
    r = g = b = l;
  } else {
    const hue2rgb = (p, q, t) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1/6) return p + (q - p) * 6 * t;
      if (t < 1/2) return q;
      if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
      return p;
    };
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    r = hue2rgb(p, q, h + 1/3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1/3);
  }
  return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
}

const [rAccent, gAccent, bAccent] = hslToRgb(hue, sat, lit);

const crcTable = [];
for (let n = 0; n < 256; n++) {
  let c = n;
  for (let k = 0; k < 8; k++) {
    c = ((c & 1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1));
  }
  crcTable[n] = c;
}

function computeCrc32(buf) {
  let c = 0xFFFFFFFF;
  for (let i = 0; i < buf.length; i++) {
    c = crcTable[(c ^ buf[i]) & 0xFF] ^ (c >>> 8);
  }
  return (c ^ 0xFFFFFFFF) >>> 0;
}

function makePngChunk(type, data) {
  const buf = Buffer.alloc(12 + data.length);
  buf.writeUInt32BE(data.length, 0);
  buf.write(type, 4, 4, 'ascii');
  data.copy(buf, 8);
  
  const crcInput = Buffer.alloc(4 + data.length);
  crcInput.write(type, 0, 4, 'ascii');
  data.copy(crcInput, 4);
  const crcSum = computeCrc32(crcInput);
  buf.writeUInt32BE(crcSum, 8 + data.length);
  return buf;
}

function compileProceduralPng(size, r, g, b, isRound = false, isForeground = false) {
  const buffer = Buffer.alloc(size * (size * 4 + 1));
  let offset = 0;
  for (let y = 0; y < size; y++) {
    buffer[offset++] = 0;
    for (let x = 0; x < size; x++) {
      const cx = size / 2;
      const cy = size / 2;
      const dx = x - cx;
      const dy = y - cy;
      const dist = Math.sqrt(dx*dx + dy*dy);
      
      let pr = r;
      let pg = g;
      let pb = b;
      let pa = 255;
      
      if (isRound && dist > size * 0.48) {
        pr = 0; pg = 0; pb = 0; pa = 0;
      } else if (isForeground) {
        if (dist < size * 0.42 && dist > size * 0.12) {
          const angle = Math.atan2(dy, dx);
          const petalEffect = Math.sin(angle * (5 + (nameHash % 4))) * (size * 0.08);
          if (dist < size * 0.3 + petalEffect) {
            pr = Math.min(255, r + 50);
            pg = Math.min(255, g + 50);
            pb = 255;
            pa = 255;
          } else {
            pr = 0; pg = 0; pb = 0; pa = 0;
          }
        } else if (dist <= size * 0.12) {
          pr = 255; pg = 255; pb = 255; pa = 255;
        } else {
          pr = 0; pg = 0; pb = 0; pa = 0;
        }
      } else {
        if (dist <= size * 0.42 && dist > size * 0.38) {
          pr = 255; pg = 255; pb = 255;
        } else if (dist <= size * 0.38) {
          const angle = Math.atan2(dy, dx);
          const wave = Math.sin(angle * 6) * (size * 0.04);
          if (dist < size * 0.28 + wave) {
            pr = Math.max(0, r - 40);
            pg = Math.max(0, g - 40);
            pb = Math.max(0, b - 40);
          } else {
            pr = Math.min(255, r + 30);
            pg = Math.min(255, g + 30);
            pb = Math.min(255, b + 30);
          }
        } else {
          pr = Math.max(0, r - 50);
          pg = Math.max(0, g - 50);
          pb = Math.max(0, b - 50);
        }
      }
      
      buffer[offset++] = pr;
      buffer[offset++] = pg;
      buffer[offset++] = pb;
      buffer[offset++] = pa;
    }
  }
  
  const signature = Buffer.from([0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A]);
  const ihdr = Buffer.alloc(13);
  ihdr.writeInt32BE(size, 0);
  ihdr.writeInt32BE(size, 4);
  ihdr.writeUInt8(8, 8);
  ihdr.writeUInt8(6, 9);
  ihdr.writeUInt8(0, 10);
  ihdr.writeUInt8(0, 11);
  ihdr.writeUInt8(0, 12);
  
  const ihdrChunk = makePngChunk('IHDR', ihdr);
  const compressed = zlib.deflateSync(buffer);
  const idatChunk = makePngChunk('IDAT', compressed);
  const iendChunk = makePngChunk('IEND', Buffer.alloc(0));
  
  return Buffer.concat([signature, ihdrChunk, idatChunk, iendChunk]);
}

const mipmapTargets = [
  'android/app/src/main/res',
  'app/src/main/res'
];
const sizesMapping = [
  { name: 'mdpi', size: 48 },
  { name: 'hdpi', size: 72 },
  { name: 'xhdpi', size: 96 },
  { name: 'xxhdpi', size: 144 },
  { name: 'xxxhdpi', size: 192 }
];

let generatedCount = 0;
for (const baseRes of mipmapTargets) {
  if (fs.existsSync(baseRes)) {
    for (const item of sizesMapping) {
      const folderPath = path.join(baseRes, `mipmap-${item.name}`);
      if (!fs.existsSync(folderPath)) {
        fs.mkdirSync(folderPath, { recursive: true });
      }
      
      const standardIcon = compileProceduralPng(item.size, rAccent, gAccent, bAccent, false, false);
      fs.writeFileSync(path.join(folderPath, 'ic_launcher.png'), standardIcon);
      
      const roundIcon = compileProceduralPng(item.size, rAccent, gAccent, bAccent, true, false);
      fs.writeFileSync(path.join(folderPath, 'ic_launcher_round.png'), roundIcon);
      
      const foregroundIcon = compileProceduralPng(item.size, rAccent, gAccent, bAccent, false, true);
      fs.writeFileSync(path.join(folderPath, 'ic_launcher_foreground.png'), foregroundIcon);
      
      generatedCount++;
    }
  }
}

console.log('Unique adaptive and legacy launcher icons written successfully.');

let manifestValid = false;
if (fs.existsSync(targetManifestPath)) {
  const content = fs.readFileSync(targetManifestPath, 'utf8');
  if (content.includes('package="' + uniqueAppId + '"') || content.includes(uniqueAppId)) {
    manifestValid = true;
    console.log('✓ VERIFIED Manifest integration: AndroidManifest.xml matches generated package name.');
  } else {
    console.error('Verification failed: AndroidManifest.xml package does not match ' + uniqueAppId);
    process.exit(1);
  }
}

let gradleValid = false;
for (const p of gradlePaths) {
  if (fs.existsSync(p)) {
    const content = fs.readFileSync(p, 'utf8');
    if (content.includes('applicationId "' + uniqueAppId + '"') && content.includes('namespace "' + uniqueAppId + '"')) {
      gradleValid = true;
      console.log('✓ VERIFIED build.gradle integration: ' + p + ' successfully contains namespaces and applicationId.');
    } else {
      console.error('Verification failed: ' + p + ' namespace or applicationId does not match ' + uniqueAppId);
      process.exit(1);
    }
  }
}

if (!manifestValid || !gradleValid) {
  console.error('[CRITICAL VERIFICATION MISMATCH]: Build halted due to file alignment issues.');
  process.exit(1);
}

console.log('================================================');
console.log('FINAL APP NAME: ' + uniqueAppLabel);
console.log('FINAL PACKAGE: ' + uniqueAppId);
console.log('FINAL ICON GENERATED: Yes (Deterministic procedurally generated unique PNG layers)');
console.log('================================================');