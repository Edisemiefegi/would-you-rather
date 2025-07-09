<script setup lang="ts">
import { onMounted } from 'vue';
import { auth, signInAnonymously, onAuthStateChanged } from './service/firebase';
import { useGamestore } from './store/game';

const store = useGamestore();

onMounted(() => {
  onAuthStateChanged(auth, (user) => {
    if (user) {
      // ✅ Already signed in: use existing UID
      console.log('User already signed in:', user.uid);
      store.currentUserId = user.uid;
    } else {
      // 🔁 Not signed in: sign in anonymously
      signInAnonymously(auth)
        .then((res) => {
          console.log('Signed in anonymously:', res.user.uid);
          store.currentUserId = res.user.uid;
        })
        .catch((error) => {
          console.error('Anonymous sign-in failed:', error);
        });
    }
  });
});
</script>


<template>
  <router-view />
</template>

<style scoped></style>
