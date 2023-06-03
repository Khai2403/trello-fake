import {
  collection,
  doc,
  getDocs,
  getDoc,
  getFirestore,
  onSnapshot,
  query,
  orderBy,
  updateDoc,
  where,
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

  async function updateDeletedWorkRank(deletedRank) {
    const error = ref(null);
    const db = getFirestore();
    const dbDoc = ref(null);
    if (deletedRank == workListStore.value.length + 1) {
      return { error };
    } else {
      const works = workListStore.value.filter((work) => {
        return work.rank > deletedRank;
      });
      for (let i = 0; i < works.length; i++) {
        dbDoc.value = doc(db, "work-list", works[i].id);
        try {
          const response = await updateDoc(
            dbDoc.value,
            "rank",
            works[i].rank - 1
          );
        } catch (err) {
          error.value = err.message;
        }
      }
    }
    return { error };
  }

  async function updateWorkRank(oldIndex, newIndex) {
    const error = ref(null);
    const dbDoc = ref(null);
    const db = getFirestore();
    if (oldIndex < newIndex) {
      const works = workListStore.value.filter((work) => {
        return work.rank >= oldIndex + 1 && work.rank <= newIndex + 1;
      });
      works.sort((a, b) => a.rank - b.rank);
      dbDoc.value = doc(db, "work-list", works[0].id);
      await updateDoc(dbDoc.value, "rank", newIndex + 1);
      for (let i = 1; i < works.length; i++) {
        dbDoc.value = doc(db, "work-list", works[i].id);
        try {
          const response = await updateDoc(
            dbDoc.value,
            "rank",
            works[i].rank - 1
          );
        } catch (err) {
          error.value = err.message;
        }
      }
    } else {
      const works = workListStore.value.filter((work) => {
        return work.rank >= newIndex + 1 && work.rank <= oldIndex + 1;
      });
      const tmp = oldIndex - newIndex;
      works.sort((a, b) => a.rank - b.rank);
      dbDoc.value = doc(db, "work-list", works[tmp].id);
      await updateDoc(dbDoc.value, "rank", newIndex + 1);
      for (let i = 0; i < oldIndex - newIndex; i++) {
        dbDoc.value = doc(db, "work-list", works[i].id);
        try {
          const response = await updateDoc(
            dbDoc.value,
            "rank",
            works[i].rank + 1
          );
        } catch (err) {
          error.value = err.message;
        }
      }
    }
    return { error };
  }
  return { workListStore, updateWorkRank, updateDeletedWorkRank };
};

export const workDetail = async (workId) => {
  const work = ref(null);
  const db = getFirestore();
  const docRef = doc(db, "work-list", workId);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    work.value = docSnap.data();
  }
  onSnapshot(docRef, (snap) => {
    if (snap.exists()) {
      work.value = snap.data();
    }
  });
  return { work };
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
