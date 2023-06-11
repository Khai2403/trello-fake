import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
  onAuthStateChanged,
  signOut,
  getAuth,
} from "firebase/auth";
import {
  ref as storageRef,
  uploadBytes,
  getDownloadURL,
  getStorage,
} from "firebase/storage";

import {
  addDoc,
  collection,
  getFirestore,
  deleteDoc,
  doc,
} from "firebase/firestore";

const error = ref(null);

export const useSignIn = async (email, password) => {
  const auth = getAuth();
  error.value = null;
  const response = ref(null);
  try {
    response.value = await signInWithEmailAndPassword(auth, email, password);
  } catch (err) {
    error.value = err.message;
  }

  return { error, response };
};

export const useSignUp = async (email, password, fullName, initialsName) => {
  const auth = getAuth();
  error.value = null;
  const response = ref(null);
  try {
    response.value = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    if (!response.value) throw new Error("Couldn't create user");
    updateProfile(auth.currentUser, {
      displayName: fullName,
      photoURL: initialsName,
    });
  } catch (err) {
    error.value = err.message;
  }

  return { error, response };
};

export const useUser = async () => {
  const auth = getAuth();
  const user = ref(auth.currentUser);

  onAuthStateChanged(auth, (_user) => {
    if (_user) {
      user.value = _user;
    }
  });

  return { user };
};

export const useLogout = async () => {
  const auth = getAuth();
  error.value = null;
  const response = ref(null);
  try {
    response.value = await signOut(auth);
  } catch (err) {
    error.value = err.message;
  }

  return { error, response };
};

export const useStorage = async (name) => {
  const { user } = await useUser();
  error.value = null;
  const filePath = ref(null);
  const url = ref(null);
  const storage = getStorage();

  async function uploadFile(file) {
    error.value = null;
    filePath.value = `${name}/${user.value.uid}/${file.name}`;
    // console.log(filePath.value);
    const fileRef = storageRef(storage, filePath.value);
    // console.log(fileRef);
    try {
      const response = await uploadBytes(fileRef, file);
      url.value = await getDownloadURL(response.ref);
      // console.log(url.value);
      return url.value;
    } catch (err) {
      error.value = err.message;
    }
  }

  return { error, filePath, url, uploadFile };
};

export const useCollection = (name) => {
  error.value = null;
  const db = getFirestore();
  const response = ref(null);
  async function addRecord(record) {
    error.value = null;
    try {
      response.value = await addDoc(collection(db, name), record);
      return response;
    } catch (err) {
      error.value = err.message;
    }
  }
  return { error, addRecord };
};

export const useDelete = async (name, id) => {
  const error = ref(null);
  const db = getFirestore();
  const dbDoc = doc(db, name, id);
  try {
    const response = await deleteDoc(dbDoc);
  } catch (err) {
    error.value = err.message;
  }
  return { error };
};

const userEmail = admin.auth().getUserByEmail("congkhai@gmail.com");

console.log(userEmail);
