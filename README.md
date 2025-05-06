# 📧 Vue + Firebase Email Template App

A simple Vue 3 application using Firebase for authentication, Firestore data storage, and email template generation. Create dynamic templates with variables, manage contacts, and generate personalized messages for each recipient.

---

## 🚀 Features

* ✅ User authentication (register, login, reset password)
* 📝 WYSIWYG editor for email templates
* ⟳ Variable substitution (e.g. `{{firstName}}`)
* 💇️ Contact management with custom variables
* 📨 Generate personalized emails with mailto: links
* 🔐 Firebase-hosted and secured

---

## 💦 Tech Stack

* [Vue 3](https://vuejs.org/)
* [Vite](https://vitejs.dev/)
* [Firebase Auth](https://firebase.google.com/products/auth)
* [Firestore](https://firebase.google.com/products/firestore)
* [Quill Editor](https://quilljs.com/) (via `@vueup/vue-quill`)
* [Firebase Hosting](https://firebase.google.com/products/hosting)

---

## 📦 Installation

```bash
git clone https://github.com/LachtanExtra/email-templater-public
cd email-templater-public
npm install
```

---

## 🔐 Firebase Setup

Create a `.env` file in the project root:

```env
VITE_FIREBASE_API_KEY=your-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-app.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-app.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your-messaging-id
VITE_FIREBASE_APP_ID=your-app-id
```

Make sure Firestore and Auth are enabled in your Firebase console.

---

## 🧪 Development

```bash
npm run dev
```

---

## 🚀 Deployment

Build and deploy to Firebase Hosting:

```bash
npm run build
firebase deploy
```

Make sure you've initialized Firebase with:

```bash
firebase login
firebase init
```

---

## 📄 License

MIT


