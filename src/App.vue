<script setup lang="ts">
import { onMounted } from 'vue';
import { auth, signInAnonymously } from './service/firebase';

import { useGamestore } from './store/game';

const store = useGamestore();

onMounted(() => {
  if (!auth.currentUser) {
    signInAnonymously(auth)
      .then((res) => {
        const uid = res.user.uid;
        console.log('Signed in anonymously:', res.user.uid);
         store.currentUserId = uid;
      })
      .catch((error) => {
        console.error('Anonymous sign-in failed:', error);
      });
  }
});
</script>

<template>
  <router-view />
</template>

<style scoped></style>
