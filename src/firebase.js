import app from "firebase/app";
import "firebase/database";
import "firebase/auth";
import "firebase/storage";

let firebaseConfig = {
  apiKey: "AIzaSyBtrsPcHX09Vin2rg3r0N1Um3b8W77jwGA",
  authDomain: "blog-react-39a6f.firebaseapp.com",
  databaseURL: "https://blog-react-39a6f.firebaseio.com",
  projectId: "blog-react-39a6f",
  storageBucket: "blog-react-39a6f.appspot.com",
  messagingSenderId: "836298364361",
  appId: "1:836298364361:web:90c92148d54b405c0a8418",
  measurementId: "G-872VWDVXN2"
};

class Firebase {
  constructor() {
    // Initialize Firebase
    app.initializeApp(firebaseConfig);

    // Referenciando a database para acesso em outros locais da aplicação
    this.app = app.database();
    this.storage = app.storage();
  }

  login(email, password) {
    return app.auth().signInWithEmailAndPassword(email, password);
  }

  logout() {
    return app.auth().signOut();
  }

  async register(nome, email, password) {
    await app.auth().createUserWithEmailAndPassword(email, password);

    const uid = app.auth().currentUser.uid;

    return app
      .database()
      .ref("usuarios")
      .child(uid)
      .set({ nome: nome });
  }

  isInitialized() {
    return new Promise(resolve => {
      app.auth().onAuthStateChanged(resolve);
    });
  }

  getCurrent() {
    return app.auth().currentUser && app.auth().currentUser.email;
  }

  getCurrentUid() {
    return app.auth().currentUser && app.auth().currentUser.uid;
  }

  async getUsername(callback) {
    if (!app.auth().currentUser) {
      return null;
    }

    const uid = app.auth().currentUser.uid;
    await app
      .database()
      .ref("usuarios")
      .child(uid)
      .once("value")
      .then(callback);
  }
}

export default new Firebase();
