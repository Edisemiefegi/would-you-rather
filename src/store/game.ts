import { defineStore } from "pinia";
import {
  collection,
  addDoc,
  serverTimestamp,
  doc,
  db,
  getDoc,
  onSnapshot,
  updateDoc,
  arrayUnion,
} from "../service/firebase.ts";
import type { GameData } from "../types/index.ts";
import questions from "../service/questions.json";

export const useGamestore = defineStore("game", {
  state: () => ({
    currentGameId: "" as string,
    currentUserName: "" as string,
    currentUserId: "" as string,
    participants: [] as { userId: string; name: string }[],
  }),

  actions: {
async uploadQuestions () {
 for (const q of questions) {
  await addDoc(collection(db, "questions"), q);
}
console.log(questions, 'this is json');

  //  await setDoc(doc(db, "questions", 'qestionsid12344555'), questions);

  console.log("✅ All questions uploaded.");
  
},


    setCurrentUser(userId: string, userName: string) {
      this.currentUserId = userId;
      this.currentUserName = userName;
    },

    async createGame(config: {
      title: string;
      topicCategory: string;
      rounds: string;
      time: string;
      maxPlayers: string;
      createdBy: string;
      userName: string;
    }) {
      try {
        const gameData = {
          title: config.title,
          topicCategory: config.topicCategory,
          rounds: config.rounds,
          time: config.time,
          maxPlayers: config.maxPlayers,
          createdBy: config.createdBy,
          createdAt: serverTimestamp(),
          waitingRoom: [config.createdBy],
          participants: [{ userId: config.createdBy, name: config.userName }],
        };

        const gameRef = await addDoc(collection(db, "games"), gameData);

        this.currentGameId = gameRef.id;
        this.currentUserName = config.userName;

        console.log(this.currentGameId, this.currentUserName, "gameid");
      } catch (error) {
        console.error("Error creating game:", error);
        throw error;
      }
    },

    async getLobbyGame(gameId: string): Promise<GameData | null> {
      try {
        const docRef = doc(db, "games", gameId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          return docSnap.data() as GameData;
        } else {
          return null;
        }
      } catch (error) {
        throw error;
      }
    },

    listenToGame(gameId: string) {
      try {
        const gameDoc = doc(db, "games", gameId);

        onSnapshot(gameDoc, (snapshot) => {
          const data = snapshot.data();
          if (data) {
            this.participants = data.participants || [];
            console.log(this.participants, "parti");
          }
        });
      } catch (error) {
        throw error;
      }
    },

    async joinGame(gameId: string, userId: string, name: string) {
      const gameRef = doc(db, "games", gameId);

      await updateDoc(gameRef, {
        waitingRoom: arrayUnion(userId),
        participants: arrayUnion({ userId, name }),
      });

      this.currentGameId = gameId;
      this.currentUserName = name;
    },
  },

  persist: true,
});
