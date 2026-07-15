import type { CapacitorConfig } from '@capacitor/cli'

/* Capacitor wraps the built web app (dist/) into native iOS and Android apps
   you can submit to the App Store / Play Store.

   First-time native setup (from apps/keydate/):
     npm install
     npm run build              # produces dist/
     npx cap add ios            # needs macOS + Xcode
     npx cap add android        # needs Android Studio + JDK
     npx cap sync
     npx cap open ios           # or: npx cap open android

   Change `appId` to your own reverse-domain identifier before publishing —
   it must match the bundle/app ID you register with Apple and Google. */
const config: CapacitorConfig = {
  appId: 'app.keydate.mobile',
  appName: 'KeyDate',
  webDir: 'dist',
  backgroundColor: '#F7F8F4',
}

export default config
