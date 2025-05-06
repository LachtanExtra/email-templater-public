<template>
  <div class="signup-container">
    <h1 class="green">Sign In</h1>
    <form @submit.prevent="handleSubmit">
      <div class="form-group">
        <label for="email">Email Address</label>
        <input type="email" id="email" v-model="email" required />
      </div>
      <div class="form-group">
        <label for="password">Password</label>
        <input type="password" id="password" v-model="password" required minlength="6" />
      </div>
      <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
      <button type="submit">Log In</button>
    </form>
    <RouterLink to="/register" class="link">Don't have an account? Sign Up</RouterLink>
    <RouterLink to="/forgot-password" class="link">Forgot Password?</RouterLink>
  </div>
</template>
  
<script setup>
  import { ref } from 'vue';
  import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
  import { useRouter } from 'vue-router';
  
  const email = ref('');
  const password = ref('');
  const errorMessage = ref('');
  const router = useRouter();
  
  const handleSubmit = () => {
    errorMessage.value = '';
    const auth = getAuth();

    signInWithEmailAndPassword(auth, email.value, password.value)
      .then(() => {
        router.push('/')
      })
      .catch((error) => {
        switch (error.code) {
          case 'auth/invalid-email':
            errorMessage.value = 'Invalid email';
            break;
          case 'auth/wrong-password':
            errorMessage.value = 'Incorrect password';
            break;
          case 'auth/user-not-found':
            errorMessage.value = 'Email not recognised';
            break;
          default:
            errorMessage.value = 'Email or password was incorrect';
        }
      });
  };
</script>