Claro, aquí te dejo el README con la sección de **Environment Setup** añadida para **Windows** y **macOS**. Esto incluye la instalación de SDK, JDK, NDK, y las variables de entorno necesarias para React Native.

---

# React Native Project Setup

This is a new [**React Native**](https://reactnative.dev) project, bootstrapped using [`@react-native-community/cli`](https://github.com/react-native-community/cli).

## Getting Started

>**Note**: Make sure you have completed the [React Native - Environment Setup](https://reactnative.dev/docs/environment-setup) instructions up to the "Creating a new application" step before proceeding.

### Step 1: Environment Setup

#### For Windows

1. **Install Node.js and Yarn**:
   - Install [Node.js](https://nodejs.org/) (Recommended LTS version).
   - Install Yarn:  
     Run the following command in your terminal:
     ```bash
     npm install --global yarn
     ```

2. **Install Java Development Kit (JDK)**:
   - Download the latest [JDK 11](https://adoptopenjdk.net/) or JDK 17.
   - After installation, set the following environment variables:
     - `JAVA_HOME`: Path to your JDK installation (e.g., `C:\Program Files\AdoptOpenJDK\jdk-11.0.11.7-hotspot`)
     - Add `JAVA_HOME\bin` to your `PATH`.

3. **Install Android Studio (SDK, NDK)**:
   - Download and install [Android Studio](https://developer.android.com/studio).
   - During installation, make sure to install the **Android SDK** and **Android NDK**.
   - After installation, set up the following environment variables:
     - `ANDROID_HOME`: Path to your Android SDK (e.g., `C:\Users\<YourUsername>\AppData\Local\Android\Sdk`)
     - Add `ANDROID_HOME\platform-tools` and `ANDROID_HOME\tools` to your `PATH`.

4. **Install Android Emulator**:
   - In Android Studio, open the **AVD Manager** and create an emulator for testing.

5. **Verify the Setup**:
   - Run the following command to check if everything is set up correctly:
     ```bash
     yarn doctor
     ```

#### For macOS

1. **Install Node.js and Yarn**:
   - Install [Node.js](https://nodejs.org/) (Recommended LTS version).
   - Install Yarn:
     ```bash
     brew install yarn
     ```

2. **Install Java Development Kit (JDK)**:
   - Download and install [JDK 11](https://adoptopenjdk.net/) or JDK 17.
   - Set the `JAVA_HOME` environment variable:
     ```bash
     export JAVA_HOME=$(/usr/libexec/java_home -v 11)
     ```

3. **Install Android Studio (SDK, NDK)**:
   - Download and install [Android Studio](https://developer.android.com/studio).
   - During installation, make sure to install the **Android SDK** and **Android NDK**.
   - After installation, set up the following environment variables:
     ```bash
     export ANDROID_HOME=$HOME/Library/Android/sdk
     export PATH=$PATH:$ANDROID_HOME/tools:$ANDROID_HOME/platform-tools
     ```

4. **Install Android Emulator**:
   - In Android Studio, open the **AVD Manager** and create an emulator for testing.

5. **Verify the Setup**:
   - Run the following command to check if everything is set up correctly:
     ```bash
     yarn doctor
     ```

### Step 2: Start the Metro Server

First, you'll need to start **Metro**, the JavaScript _bundler_ that ships with React Native.

To start Metro, run the following command from the root of your React Native project:

```bash
yarn start
```

Metro will run in its own terminal window. Keep this terminal open as it watches for changes in your app.

### Step 3: Run Your Application on Android

Open a new terminal window from the root of your React Native project and run the following command to launch your app on **Android**:

```bash
yarn android
```

This will launch the app on your Android emulator or connected device. Ensure you have an Android emulator running, or connect a physical device via USB.

If everything is set up correctly, you should see your new app running shortly on your Android emulator or connected device.

### Step 4: Modify Your App

Now that you have successfully run the app, it's time to modify it.

1. Open `App.tsx` in your preferred text editor or IDE and start editing.
2. For **Android**: Press the <kbd>R</kbd> key twice or open the **Developer Menu** (<kbd>Ctrl</kbd> + <kbd>M</kbd> on Windows/Linux or <kbd>Cmd ⌘</kbd> + <kbd>M</kbd> on macOS) and select **Reload** to see your changes immediately.

---

### Environment Variables

For setting the API base URL, ensure the following is added to your `.env` file:

```
API_BASE_URL=https://api-financore.onrender.com/api
```

---

### Note

If you have any questions or run into issues, feel free to consult the official documentation or reach out to the React Native community. I am happy to help!
Harold Medrano Ritchie clan.
