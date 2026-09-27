// src/services/quizService.js

import {
  addDoc,
  collection,
  onSnapshot,
} from "firebase/firestore";

import {
  onAuthStateChanged,
  signInAnonymously,
} from "firebase/auth";

import { auth, db } from "../firebase";

/*
  =========================================
  QUIZ MODE
  =========================================

  true  = Testing mode
          Multiple submissions allowed.

  false = Final event mode
          One submission per Firebase
          anonymous account.
*/
export const DEMO_MODE = true;

/*
  Unique quiz identifier.
*/
export const QUIZ_ID =
  "jeevamu-gala-thandri-sannidhi-2026";

/*
  Firestore collection.
*/
const RESULTS_COLLECTION =
  "quizResults";

/*
  =========================================
  FIREBASE AUTH
  =========================================
*/

export async function ensureAnonymousUser() {
  /*
    If a Firebase user already exists,
    return it.
  */
  if (auth.currentUser) {
    console.log(
      "Firebase user already signed in:",
      auth.currentUser.uid
    );

    return auth.currentUser;
  }

  /*
    Wait for Firebase authentication state.
  */
  const existingUser =
    await new Promise((resolve) => {
      let unsubscribe = null;

      unsubscribe =
        onAuthStateChanged(
          auth,
          (user) => {
            if (unsubscribe) {
              unsubscribe();
            }

            resolve(user);
          }
        );
    });

  if (existingUser) {
    console.log(
      "Existing Firebase user:",
      existingUser.uid
    );

    return existingUser;
  }

  /*
    Create anonymous Firebase user.
  */
  console.log(
    "Creating anonymous Firebase user..."
  );

  const credential =
    await signInAnonymously(auth);

  console.log(
    "Anonymous user created:",
    credential.user.uid
  );

  return credential.user;
}

/*
  =========================================
  SAVE QUIZ RESULT
  =========================================
*/

export async function submitQuizResult({
  participantName,
  score,
  totalQuestions,
  elapsedSeconds,
  elapsedMs,
}) {
  try {
    console.log(
      "Starting quiz submission..."
    );

    /*
      Make sure Firebase authentication
      is available before writing.
    */
    const user =
      await ensureAnonymousUser();

    if (!user) {
      throw new Error(
        "Unable to authenticate with Firebase."
      );
    }

    /*
      Safe time values.
    */
    const safeSeconds =
      Number(elapsedSeconds || 0);

    const safeMilliseconds =
      Number.isFinite(
        Number(elapsedMs)
      )
        ? Number(elapsedMs)
        : safeSeconds * 1000;

    /*
      Data to save.
    */
    const resultData = {
      quizId: QUIZ_ID,

      participantName:
        String(
          participantName || ""
        ).trim(),

      score:
        Number(score || 0),

      totalQuestions:
        Number(totalQuestions || 0),

      elapsedSeconds:
        safeSeconds,

      elapsedMs:
        safeMilliseconds,

      userId:
        user.uid,

      submittedAt:
        new Date().toISOString(),

      submittedAtMs:
        Date.now(),
    };

    console.log(
      "Submitting this data:",
      resultData
    );

    /*
      TESTING MODE
      Every submission gets a new document.
    */
    if (DEMO_MODE) {
      const resultRef =
        await addDoc(
          collection(
            db,
            RESULTS_COLLECTION
          ),
          resultData
        );

      console.log(
        "✅ FIRESTORE SAVE SUCCESS:",
        resultRef.id
      );

      return {
        id: resultRef.id,
        ...resultData,
      };
    }

    /*
      FINAL MODE
      UID-based document can be used
      together with strict Firestore rules
      to prevent editing/re-submission.
    */

    const {
      doc,
      setDoc,
    } = await import(
      "firebase/firestore"
    );

    const resultRef = doc(
      db,
      RESULTS_COLLECTION,
      user.uid
    );

    await setDoc(
      resultRef,
      resultData
    );

    console.log(
      "✅ FINAL RESULT SAVED:",
      resultRef.id
    );

    return {
      id: resultRef.id,
      ...resultData,
    };

  } catch (error) {
    console.error(
      "❌ FIREBASE SUBMISSION FAILED:",
      error
    );

    throw error;
  }
}

/*
  =========================================
  LIVE LEADERBOARD
  =========================================
*/

export function subscribeToLeaderboard(
  callback,
  onError
) {
  const resultsRef =
    collection(
      db,
      RESULTS_COLLECTION
    );

  console.log(
    "Connecting to Firestore leaderboard..."
  );

  /*
    Realtime listener.
  */
  const unsubscribe =
    onSnapshot(
      resultsRef,

      (snapshot) => {
        const results = [];

        snapshot.forEach(
          (document) => {
            const data =
              document.data();

            results.push({
              id: document.id,
              ...data,
            });
          }
        );

        /*
          Ranking:
          1. Highest score
          2. Fastest completion time
          3. Earlier submission
        */
        results.sort(
          (a, b) => {

            const scoreA =
              Number(
                a.score || 0
              );

            const scoreB =
              Number(
                b.score || 0
              );

            /*
              Higher score first.
            */
            if (
              scoreA !== scoreB
            ) {
              return (
                scoreB - scoreA
              );
            }

            /*
              Faster time first.
            */
            const timeA =
              Number(
                a.elapsedMs ??
                Number(
                  a.elapsedSeconds ||
                    0
                ) * 1000
              );

            const timeB =
              Number(
                b.elapsedMs ??
                Number(
                  b.elapsedSeconds ||
                    0
                ) * 1000
              );

            if (
              timeA !== timeB
            ) {
              return (
                timeA - timeB
              );
            }

            /*
              Earlier submission first.
            */
            return (
              Number(
                a.submittedAtMs || 0
              ) -
              Number(
                b.submittedAtMs || 0
              )
            );
          }
        );

        console.log(
          "✅ LIVE LEADERBOARD:",
          results
        );

        callback(results);
      },

      (error) => {
        console.error(
          "❌ LEADERBOARD ERROR:",
          error
        );

        if (
          typeof onError ===
          "function"
        ) {
          onError(error);
        }
      }
    );

  /*
    Return listener cleanup function.
  */
  return unsubscribe;
}