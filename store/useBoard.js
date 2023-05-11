import {
  collection,
  getDocs,
  getFirestore,
  onSnapshot,
} from "firebase/firestore";
import { useUser } from "~~/composable/useFirebase";

export const useBoards = async () => {
  const { user } = await useUser();
  const boards = ref(null);
  const boardStore = ref(null);
  const db = getFirestore();
  const dbCollection = collection(db, "dashboard");
  const response = await getDocs(dbCollection);
  boards.value = response.docs.map((doc) => {
    return { ...doc.data(), id: doc.id };
  });
  boardStore.value = boards.value.filter((board) => {
    return board.userId === user.value.uid;
  });

  onSnapshot(dbCollection, (snap) => {
    boards.value = snap.docs.map((doc) => {
      return { ...doc.data(), id: doc.id };
    });
    boardStore.value = boards.value.filter((board) => {
      return board.userId === user.value.uid;
    });
  });
  return { boardStore };
};
