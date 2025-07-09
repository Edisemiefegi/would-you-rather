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
  deleteDoc,
} from "../service/firebase.ts";
import type { GameData } from "../types/index.ts";
import questions from "../service/questions.json";

export const useGamestore = defineStore("game", {
  state: () => ({
    currentGameId: "" as string,
    currentUserName: "" as string,
    currentUserId: "" as string,
    participants: [] as { userId: string; name: string }[],
    gameStatus: "" as string,
    currentQuestion: null as any,
  }),

  actions: {
    async uploadQuestions() {
      for (const q of questions) {
        await addDoc(collection(db, "questions"), q);
      }
      console.log(questions, "this is json");

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
        const questionsByCategory = this.getQuestionsByCategory(
          config.topicCategory
        );
        const shuffled = [...questionsByCategory].sort(
          () => 0.5 - Math.random()
        );
        const selectedQuestions = shuffled.slice(0, parseInt(config.rounds));

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
          gameStatus: "lobby",
          questions: selectedQuestions,
          results: [],
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
      // get the real time data on a particular  then update the participants and gamestatus
      try {
        const gameRef = doc(db, "games", gameId);

        onSnapshot(gameRef, (docSnap) => {
          const data = docSnap.data();
          if (!data) return;

          this.gameStatus = data.gameStatus;
          this.participants = data.participants;
          this.currentGameId = gameId;

          // console.log("[Realtime] Game status:", data.gameStatus, data);
        });
      } catch (error) {
        throw error;
      }
    },

    async joinGame(gameId: string, userId: string, name: string) {
      try {
        const gameRef = doc(db, "games", gameId);

        await updateDoc(gameRef, {
          waitingRoom: arrayUnion(userId),
          participants: arrayUnion({ userId, name }),
        });

        this.currentGameId = gameId;
        this.currentUserName = name;
      } catch (error) {
        throw error;
      }
    },

    async startGame(gameId: string) {
      // update gamestatus to rules
      const gameRef = doc(db, "games", gameId);
      await updateDoc(gameRef, {
        gameStatus: "rules",
        waitingRoom: [],
      });
    },

    async rulesTimer(gameId: string) {
      // after 10 secs update the gamestatus to playing
      const gameRef = doc(db, "games", gameId);
      await updateDoc(gameRef, {
        gameStatus: "playing",
      });
    },

    async getCurrentGameById(gameId: string) {
      try {
        const docRef = doc(db, "games", gameId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          // console.log("Document data:", docSnap.data());
          return docSnap.data();
        } else {
          console.log("No such document!");
        }
      } catch (error) {
        throw error;
      }
    },

    getQuestionsByCategory(category: string) {
      // search through the questions and return ones with the same category
      return questions.filter((q) => q.questioncategory === category);
    },

    async submitAnswer(round: number, option: string) {
      try {
        const gameRef = doc(db, "games", this.currentGameId);
        const gameSnap = await getDoc(gameRef);
        const gameData = gameSnap.data();

        if (!gameData) return;
        const results = gameData.results || [];

        //  Current round result (create if not exists)
        let result = results.find((r: any) => r.round === round);
        if (!result) {
          result = {
            round,
            question: this.currentQuestion,
            answers: {},
          };
          results.push(result);
        }

        // Add player's answer
        result.answers[this.currentUserId] = option;

        console.log(result, "results");

        // Check if all players have answered
        const totalPlayers = this.participants.length;
        const answerCount = Object.keys(result.answers).length;

        if (answerCount === totalPlayers) {
          const option1 = result.question.option1;
          const option2 = result.question.option2;

          const count1 = Object.values(result.answers).filter(
            (a) => a === option1
          ).length;
          const percent1 = Math.round((count1 / totalPlayers) * 100);
          const percent2 = 100 - percent1;

          result.percentages = {
            [option1]: percent1,
            [option2]: percent2,
          };

          // Update Firestore with final result and advance game status
          await updateDoc(gameRef, {
            results,
            gameStatus: "showingResult",
          });
        } else {
          // Update only answers
          await updateDoc(gameRef, {
            results,
          });
        }
      } catch (error) {
        throw error;
      }
    },

    listenForResult(round: number, callback: (result: any) => void) {
      try {
        const gameRef = doc(db, "games", this.currentGameId);

        return onSnapshot(gameRef, (docSnap) => {
          const data = docSnap.data();
          if (!data) return;

          console.log(data, 'resultdata');
          

          const result = (data.results || []).find(
            (r: any) => r.round === round
          );
          if (result?.percentages) {
            callback(result);
          }
        });
      } catch (error) {
        throw error;
      }
    },

    async nextRound(Round: number, totalRounds: number) {
      try {
        const gameRef = doc(db, "games", this.currentGameId);

        if (Round <= totalRounds) {
          await updateDoc(gameRef, {
            gameStatus: "playing",
          });
        } else {
          await updateDoc(gameRef, {
            gameStatus: "completed",
          });
        }
      } catch (error) {
        throw error;
      }
    },


    async deleteGame(gameId: string) {
  try {
    const gameRef = doc(db, "games", gameId);
    await deleteDoc(gameRef);
    console.log(`Game ${gameId} deleted successfully.`);
  } catch (error) {
    console.error("Failed to delete game:", error);
    throw error;
  }
}
  },

  persist: true,
});
