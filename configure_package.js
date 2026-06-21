const fs = require('fs');
const path = require('path');

console.log('=== ANDROID PACKAGE PERMANENT CONFLICT RESOLVER ===');

const runNumStr = process.env.GITHUB_RUN_NUMBER || '';
let suffix = '';
if (runNumStr) {
  suffix = runNumStr.padStart(3, '0');
} else {
  const now = new Date();
  suffix = String(now.getHours()).padStart(2, '0') + 
           String(now.getMinutes()).padStart(2, '0') + 
           String(now.getSeconds()).padStart(2, '0');
}

let uniqueAppId = "com.builderpro.app" + suffix;
if (fs.existsSync('capacitor.config.json')) {
  try {
    const config = JSON.parse(fs.readFileSync('capacitor.config.json', 'utf8'));
    if (config.appId) uniqueAppId = config.appId;
  } catch (e) {}
}
console.log("Target Package Name/ApplicationId: " + uniqueAppId);

let appName = 'Applet';
if (fs.existsSync('capacitor.config.json')) {
  try {
    const config = JSON.parse(fs.readFileSync('capacitor.config.json', 'utf8'));
    if (config.appName) appName = config.appName;
  } catch (e) {}
} else if (fs.existsSync('package.json')) {
  try {
    const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
    if (pkg.name) {
      appName = pkg.name.split(/[-_]/).map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
    }
  } catch (e) {}
}

const cleanAppName = appName.trim() || 'Applet';
const uniqueAppLabel = cleanAppName;
console.log("Target App Label: " + uniqueAppLabel);

const versionCode = runNumStr ? parseInt(runNumStr, 10) : Math.floor(Date.now() / 1000) % 2000000000;
console.log("Target Version Code: " + versionCode);

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

let originalPackage = '';
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
        console.log("Found original package name: " + originalPackage);
      }
    } catch (e) {}
    break;
  }
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
    fs.writeFileSync(targetManifestPath, content, 'utf8');
    console.log('Updated AndroidManifest.xml package attribute.');
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
      // /<string\s+name="app_name">.*?</string>/g
      content = content.replace(new RegExp('<string\\s+name="app_name">.*?</string>', 'g'), '<string name="app_name">' + uniqueAppLabel + '</string>');
      // /<string\s+name="title_activity_main">.*?</string>/g
      content = content.replace(new RegExp('<string\\s+name="title_activity_main">.*?</string>', 'g'), '<string name="title_activity_main">' + uniqueAppLabel + '</string>');
      fs.writeFileSync(p, content, 'utf8');
      console.log("Updated strings.xml: " + p);
    } catch (e) {
      console.error("Error modifying strings.xml: " + p, e);
    }
  }
}

const gradlePaths = [
  'android/app/build.gradle',
  'app/build.gradle'
];
for (const p of gradlePaths) {
  if (fs.existsSync(p)) {
    try {
      let content = fs.readFileSync(p, 'utf8');
      content = content.replace(/namespace\s+['"][^'"]+['"]/g, 'namespace "' + uniqueAppId + '"');
      content = content.replace(/applicationId\s+['"][^'"]+['"]/g, 'applicationId "' + uniqueAppId + '"');
      content = content.replace(/versionCode\s+\d+/g, 'versionCode ' + versionCode);
      fs.writeFileSync(p, content, 'utf8');
      console.log("Updated build.gradle: " + p);
    } catch (e) {
      console.error("Error modifying build.gradle: " + p, e);
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
        if (content.includes("package " + originalPackage)) {
          content = content.split("package " + originalPackage).join("package " + uniqueAppId);
          fs.writeFileSync(file, content, 'utf8');
          console.log("Updated package declaration inside: " + file);
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
            console.log("Moved file to new package folder: " + dest);
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

console.log('=== LOGGING THE FINAL GENERATED PACKAGE NAME ===');
console.log("FINAL_APPLICATION_ID: " + uniqueAppId);
console.log('================================================');