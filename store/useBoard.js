import {
  collection,
  doc,
  getDocs,
  getFirestore,
  onSnapshot,
  query,
  orderBy,
  updateDoc,
} from "firebase/firestore";
import { useUser } from "~~/composable/useFirebase";

export const useBoards = async () => {
  const { user } = await useUser();
  const boards = ref(null);
  const boardStore = ref(null);
  const db = getFirestore();
  const dbCollection = collection(db, "dashboard");

  const response = await getDocs(query(dbCollection, orderBy("title", "asc")));
  boards.value = response.docs.map((doc) => {
    return { ...doc.data(), id: doc.id };
  });
  boardStore.value = boards.value.filter((board) => {
    return board.userId.includes(user.value.uid);
  });

  onSnapshot(dbCollection, (snap) => {
    boards.value = snap.docs.map((doc) => {
      return { ...doc.data(), id: doc.id };
    });
    boardStore.value = boards.value.filter((board) => {
      return board.userId === user.value.uid;
    });
  });

  function boardDetail(boardId) {
    const board = ref(null);
    board.value = boardStore.value.find((board) => board.id === boardId);
    return { board };
  }
  return { boardStore, boardDetail };
};

export const updateBoardMember = async (boardId, member) => {
  const error = ref(null);
  const db = getFirestore();
  const dbDoc = doc(db, "dashboard", boardId);
  try {
    const response = await updateDoc(dbDoc, "userId", member);
  } catch (err) {
    error.value = err.message;
  }
  return { error };
};
