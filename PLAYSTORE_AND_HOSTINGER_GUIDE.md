# 🚀 KAMZO Marketplace - Hostinger VPS & Google Play Store Guide
**آپ کی ضرورت، ہمارے ماہر (KAMZO Platform Deployment Documentation)**

This guide provides step-by-step instructions for deploying KAMZO on **Hostinger VPS** and publishing the native mobile app on **Google Play Store**.

---

## 📱 Part 1: Instant Mobile App via PWA (Available Right Now!)

KAMZO has been upgraded with **Progressive Web App (PWA)** capabilities (`manifest.json` + mobile icons + standalone app display).

### How Customers & Workers Can Install it on Android & iPhone:
1. Open **[https://kamzo-woad.vercel.app/](https://kamzo-woad.vercel.app/)** in Google Chrome on Android or Safari on iPhone.
2. An **"Add KAMZO to Home screen"** or **"Install App"** prompt will appear automatically at the bottom.
3. Tap **"Install"**.
4. The **KAMZO 3D Metallic Blue Icon** will appear on the user's phone home screen like a native mobile app!
5. When tapped, it opens in fullscreen mode without browser URL bars, with instant loading and offline caching.

---

## 🌐 Part 2: Deploying to Hostinger VPS (When You Are Ready)

The repository contains an automated deployment script `hostinger-setup.sh` and PM2 ecosystem configuration.

### Prerequisites on Hostinger:
- Buy an **Ubuntu 22.04 / 24.04 VPS** on Hostinger (e.g. KVM 1 or KVM 2 plan).
- Point your custom domain (e.g. `kamzo.pk` or `kamzomarketplace.com`) `A Record` to your Hostinger VPS IP address.

### 1-Click Setup on Hostinger VPS:
1. Connect to your VPS via SSH (using PuTTY or Windows Terminal):
   ```bash
   ssh root@YOUR_SERVER_IP
   ```
2. Run the deployment setup:
   ```bash
   # Clone the repository
   git clone https://github.com/parvindarjambra/kamzo.git
   cd kamzo

   # Make the setup script executable and run it
   chmod +x hostinger-setup.sh
   ./hostinger-setup.sh
   ```
3. Install dependencies and build:
   ```bash
   npm install
   npm run build
   ```
4. Start with PM2 (Process Manager keeps your app alive 24/7):
   ```bash
   pm2 start npm --name "kamzo" -- start
   pm2 startup
   pm2 save
   ```
5. Setup Free SSL (HTTPS) with Certbot:
   ```bash
   sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
   ```
   Now your site is running live on Hostinger with automatic HTTPS!

---

## 🤖 Part 3: Publishing to Google Play Store (Flutter Mobile App)

The complete Flutter source code is located in the `mobile_app/` folder (and `kamzo_app/`).
It is already configured with:
- **Package Name**: `com.kamzo.app`
- **Branding**: MedicoEngineer Royal Electric Blue (`#0062FF`) & Tech Navy theme
- **Icons**: Pre-generated Android launcher icons for all screen densities (`mdpi`, `hdpi`, `xhdpi`, `xxhdpi`, `xxxhdpi`)
- **Permissions**: Internet, Location, Camera, Notifications, Foreground services

### Step 1: Install Flutter SDK (on your or your developer's computer)
1. Download Flutter SDK from [flutter.dev](https://flutter.dev).
2. Verify installation:
   ```bash
   flutter doctor
   ```

### Step 2: Generate Release Keystore (for signing the APK)
Run this command in terminal to create your secret signing key:
```bash
keytool -genkey -v -keystore kamzo-release-key.jks -keyalg RSA -keysize 2048 -validity 10000 -alias kamzo-key
```
Save the password you choose safely.

### Step 3: Build the Google Play Store Bundle (.aab)
Navigate to the mobile app folder and build the release appbundle:
```bash
cd mobile_app
flutter pub get
flutter build appbundle --release
```
Your compiled upload bundle will be ready at:
`mobile_app/build/app/outputs/bundle/release/app-release.aab`

*(If you also want an APK for direct testing via WhatsApp, run `flutter build apk --release`)*

### Step 4: Upload to Google Play Console
1. Log into your [Google Play Console](https://play.google.com/console) account ($25 one-time registration fee).
2. Click **Create App**:
   - App Name: `KAMZO - Pakistan Service Marketplace`
   - Default Language: `English (United States)` or `Urdu`
   - App or Game: `App`
   - Free or Paid: `Free`
3. In **Production** (or **Closed Testing**), upload `app-release.aab`.
4. Fill in Store Listing:
   - **Short Description**: Certified local mechanics, AC technicians, plumbers, and electricians across Pakistan.
   - **Full Description**: KAMZO is Pakistan's premier on-demand skilled labor marketplace. Connect with 100% CNIC verified technicians for auto repair, AC servicing, plumbing, and electrical works with a transparent flat Rs. 200 visit fee.
   - **App Icon**: Upload `public/logo.png` (512x512).
   - **Feature Graphic**: 1024x500 banner highlighting KAMZO services.
5. Set Privacy Policy URL: `https://kamzo-woad.vercel.app/`
6. Click **Review & Rollout** to submit to Google for review!

---

## 📞 Official Platform Support
- **WhatsApp Support Hotline**: `+92 319 7318425`
- **Direct Chat Link**: `https://wa.me/923197318425`
- **Admin Portal**: `https://kamzo-woad.vercel.app/admin`
- **Super Admin Email**: `admin@kamzo.pk`
