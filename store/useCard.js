import {
  collection,
  doc,
  getDocs,
  getDoc,
  getFirestore,
  onSnapshot,
  arrayUnion,
  arrayRemove,
  query,
  orderBy,
  updateDoc,
} from "firebase/firestore";
import { useUser } from "~~/composable/useFirebase";

export const cardDetail = async (cardId) => {
  const card = ref(null);
  const db = getFirestore();
  const docRef = doc(db, "card", cardId);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    card.value = docSnap.data();
  }
  onSnapshot(docRef, (snap) => {
    if (snap.exists()) {
      card.value = snap.data();
    }
  });
  return { card };
};

export const numberOfCards = async (cardIds) => {
  const { user } = await useUser();
  const db = getFirestore();
  const total = ref(0);
  const isAdd = ref([]);
  for (let index = 0; index < cardIds.length; index++) {
    isAdd.value[index] = false;
    const docRef = doc(db, "card", cardIds[index]);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      if (docSnap.data().userId.includes(user.value.uid)) {
        total.value += 1;
        isAdd.value[index] = true;
      }
    }
    onSnapshot(docRef, (snap) => {
      if (snap.exists()) {
        if (
          snap.data().userId.includes(user.value.uid) &&
          !isAdd.value[index]
        ) {
          total.value += 1;
          isAdd.value[index] = true;
        } else if (
          !snap.data().userId.includes(user.value.uid) &&
          isAdd.value[index]
        ) {
          total.value -= 1;
          isAdd.value[index] = false;
        }
      }
    });
  }
  return { total };
};

export const updatePropertyCard = async (cardId, name, property) => {
  const error = ref(null);
  const db = getFirestore();
  const dbDoc = doc(db, "card", cardId);
  try {
    const response = await updateDoc(dbDoc, name, property);
  } catch (err) {
    error.value = err.message;
  }
  return { error };
};

export const addLabelStore = async (cardId, label) => {
  const error = ref(null);
  const db = getFirestore();
  const dbDoc = doc(db, "card", cardId);
  try {
    await updateDoc(dbDoc, {
      label: arrayUnion(label),
    });
  } catch (err) {
    error.value = err.message;
  }
  return { error };
};

export const addActivity = async (cardId, activity) => {
  const error = ref(null);
  const db = getFirestore();
  const dbDoc = doc(db, "card", cardId);
  try {
    await updateDoc(dbDoc, {
      activityLog: arrayUnion(activity),
    });
  } catch (err) {
    error.value = err.message;
  }
  return { error };
};

export const removeAccount = async (cardId, userId) => {
  const error = ref(null);
  const db = getFirestore();
  const dbDoc = doc(db, "card", cardId);
  try {
    await updateDoc(dbDoc, {
      userId: arrayRemove(userId),
    });
  } catch (err) {
    error.value = err.message;
  }
  return { error };
};

export const removeLabel = async (cardId, labels) => {
  const error = ref(null);
  const db = getFirestore();
  const dbDoc = doc(db, "card", cardId);
  try {
    for (let label of labels) {
      await updateDoc(dbDoc, {
        label: arrayRemove(label),
      });
    }
  } catch (err) {
    error.value = err.message;
  }
  return { error };
};
