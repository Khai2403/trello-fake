import {
  collection,
  getFirestore,
  getDocs,
  query,
  where,
} from "firebase/firestore";

export const getUserIdByEmail = async (email) => {
  const error = ref(null);
  const db = getFirestore();
  const dbCollection = collection(db, "users");
  const response = await getDocs(
    query(dbCollection, where("email", "==", email))
  );
  if (response.docs.length === 0) {
    return null;
  } else {
    return response.docs[0].data().userId;
  }
};
export const getInfoByUserId = async (userId) => {
  const error = ref(null);
  const db = getFirestore();
  const dbCollection = collection(db, "users");
  const response = await getDocs(
    query(dbCollection, where("userId", "==", userId))
  );
  if (response.docs.length === 0) {
    return null;
  } else {
    const email = response.docs[0].data().email;
    const fullName = response.docs[0].data().fullName;
    const initialsName = response.docs[0].data().initialsName;
    const id = response.docs[0].data().userId;
    return {
      id,
      email,
      initialsName,
      fullName,
    };
  }
};
