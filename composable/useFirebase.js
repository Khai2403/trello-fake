import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import { getAuth } from "firebase/auth";

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

export const useSignUp = async (email, password, fullName) => {
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
    });
  } catch (err) {
    error.value = err.message;
  }

  return { error, response };
};
