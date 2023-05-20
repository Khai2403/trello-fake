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

  function boardDetail(boardId) {
    const board = ref(null);
    board.value = boardStore.value.find((board) => board.id === boardId);
    return { board };
  }
  return { boardStore, boardDetail };
};

export const useWorkList = async (boardId) => {
  const workList = ref(null);
  const workListStore = ref(null);
  const db = getFirestore();
  const dbCollection = collection(db, "work-list");
  const response = await getDocs(query(dbCollection, orderBy("rank", "asc")));
  workList.value = response.docs.map((doc) => {
    return { ...doc.data(), id: doc.id };
  });
  workListStore.value = workList.value.filter((work) => {
    return work.boardId === boardId;
  });
  onSnapshot(dbCollection, (snap) => {
    workList.value = snap.docs.map((doc) => {
      return { ...doc.data(), id: doc.id };
    });
    workListStore.value = workList.value.filter((work) => {
      return work.boardId === boardId;
    });
  });

  function workDetail(workId) {
    const work = ref(null);
    work.value = workListStore.value.find((work) => work.id === workId);
    return { work };
  }
  return { workListStore, workDetail };
};

export const updateCard = async (workId, cards) => {
  const error = ref(null);
  const db = getFirestore();
  const dbDoc = doc(db, "work-list", workId);
  try {
    const response = await updateDoc(dbDoc, "cards", cards);
  } catch (err) {
    error.value = err.message;
  }
  return { error };
};

export const editWorkTitle = async (workId, workTitle) => {
  const error = ref(null);
  const db = getFirestore();
  const dbDoc = doc(db, "work-list", workId);
  try {
    const response = await updateDoc(dbDoc, "title", workTitle);
  } catch (err) {
    error.value = err.message;
  }
  return { error };
};

// const { workDetail } = await useWorkList("BohS2CezHdKTVplYt6Jb");
// const { work } = workDetail("OlxjTLs6cK1Hghl80Ux7");
// console.log(work.value);
