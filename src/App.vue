<script setup>
  import { onMounted, ref } from 'vue';
  import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth';
  import { useRouter } from 'vue-router';

  const isLoggedIn = ref(false);
  const router = useRouter();

  let auth;
  onMounted(() => {
    // Check if user is logged in
    auth = getAuth();
    onAuthStateChanged(auth, (user) => {
      if (user) {
        isLoggedIn.value = true;
      } else {
        isLoggedIn.value = false;
      }
    });

    //Check and handle if user is trying to reset password
    const params = new URLSearchParams(window.location.search);
    const mode = params.get('mode');
    const oobCode = params.get('oobCode');

    if (mode === 'resetPassword' && oobCode) {
      router.replace({ path: '/reset-password', query: { oobCode } });
    }
  });

  const handleSignOut = () => {
    signOut(auth).then(() => {
      router.push('/login');
    });
  }
</script>

<template>
  <main>
    <nav class="navbar">
      <div class="nav-left">
        <RouterLink to="/" class="brand">Home</RouterLink>
        <RouterLink to="/templates" v-if="isLoggedIn">Templates</RouterLink>
        <RouterLink to="/contacts" v-if="isLoggedIn">Contacts</RouterLink>
      </div>
      <div class="nav-right" v-if="isLoggedIn">
        <button @click="handleSignOut">Sign Out</button>
      </div>
    </nav>
    <div id="app">
      <div>
        <RouterView />
      </div>
    </div>
  </main>
</template>

<style scoped>
.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 14px 24px;
  border-bottom: 1px solid #e2e8f0;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.nav-left {
  display: flex;
  gap: 20px;
  align-items: center;
}

.brand {
  font-size: 1rem;
  font-weight: 600;
}
</style>
