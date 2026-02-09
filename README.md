# 75 Hard Challenge Tracker

This repository contains an application designed to help you track your progress through the 75 Hard Challenge.

## What is 75 Hard?

75 Hard is a mental toughness program designed by Andy Frisella. It's not a fitness program, but a "transformative mental toughness program" that requires strict adherence to five critical rules for 75 consecutive days. If you miss any one of the tasks, you must start over from Day 1.

### The 5 Critical Rules:

1.  **Follow a Diet:** No cheat meals and no alcohol. The diet should be structured for your goals.
2.  **Drink a Gallon of Water:** Consume one gallon (approximately 3.78 liters) of water daily.
3.  **Complete Two 45-Minute Workouts:** One workout must be outdoors, regardless of weather conditions.
4.  **Read 10 Pages of a Non-Fiction Book:** Books must be non-fiction and self-improvement focused. Audiobooks do not count.
5.  **Take a Progress Picture:** Take a picture of yourself every single day.

## Using this Application

This application provides a user-friendly interface to log your daily progress and keep track of your 75 Hard journey.

## Run Locally

**Prerequisites:** Node.js

1.  Install dependencies:
    `npm install`
2.  Set the `GEMINI_API_KEY` in `.env.local` to your Gemini API key
3.  Run the app:
    `npm run dev`

## Using as a Web App (PWA)

This application is a Progressive Web App (PWA), meaning you can "install" it directly from your web browser to your phone's home screen. This provides an app-like experience with offline capabilities and faster loading.

**To install the PWA on your phone:**

1.  **Deploy your application** to a static hosting service (e.g., Netlify, Vercel).
2.  **Open the deployed URL** in your mobile browser (Chrome for Android, Safari for iOS).
3.  **Add to Home Screen:**
    *   **On Android (Chrome):** Tap the three-dot menu > "Add to Home screen" (or "Install app").
    *   **On iOS (Safari):** Tap the Share button (square with arrow) > "Add to Home Screen."

## Building and Installing the Android App (APK)

If you prefer a standalone Android application (`.apk` file) that can be sideloaded onto your device, you can build one using Capacitor. This wraps the web application in a native container.

**Prerequisites:**

*   Node.js
*   Android Studio installed with necessary SDKs

**Steps:**

1.  **Ensure Capacitor is installed and configured:**
    ```bash
    npm install @capacitor/core @capacitor/cli @capacitor/android
    npx cap init --appName "75HardTracker" --appId "com.example.a75hardtracker" # (if not already done)
    # Ensure you have capacitor.config.json:
    # { "appId": "com.example.a75hardtracker", "appName": "75HardTracker", "webDir": "dist", "bundledWebRuntime": false }
    npx cap add android # (if not already done)
    ```
2.  **Build your web application:**
    ```bash
    npm run build
    ```
3.  **Sync web assets to the native project:**
    ```bash
    npx cap sync
    ```
4.  **Open the Android project in Android Studio:**
    ```bash
    npx cap open android
    ```
5.  **Build the APK in Android Studio:**
    *   In Android Studio, select `Build` > `Build Bundle(s) / APK(s)` > `Build APK(s)`.
    *   Once built, Android Studio will provide a link to "Locate" the `app-debug.apk` file (typically found in `android/app/build/outputs/apk/debug/`).
6.  **Install the APK:** Transfer the `app-debug.apk` file to your Android device and install it. You may need to enable "Install from Unknown Sources" in your device settings.
