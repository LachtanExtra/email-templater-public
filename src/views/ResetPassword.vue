<template>
  <div class="signup-container">
    <h1 class="green">Reset your password</h1>
    <form @submit.prevent="handleSubmit">
      <div class="form-group">
        <label for="email">Email Address</label>
        <input type="email" id="email" v-model="email" required />
      </div>
      <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
      <button type="submit">Send link</button>
    </form>
    <RouterLink to="/login" class="link">Suddenly remembered your password? Log In</RouterLink>
    <RouterLink to="/register" class="link">Don't have an account? Sign Up</RouterLink>
  </div>
</template>
  
<script setup>
  import { ref } from 'vue';
  import { getAuth, sendPasswordResetEmail } from 'firebase/auth';
  
  const email = ref('');
  const errorMessage = ref('');
  
  const handleSubmit = async () => {
    const auth = getAuth();
    errorMessage.value = '';

    try {
      await sendPasswordResetEmail(auth, email.value);
      errorMessage.value = '✅ Link sent! Check your email.';
    } catch (error) {
      console.error(error);
      if (error.code === 'auth/user-not-found') {
        errorMessage.value = '⚠️ No user found with that email.';
      } else if (error.code === 'auth/invalid-email') {
        errorMessage.value = '⚠️ Invalid email address.';
      } else {
        errorMessage.value = '⚠️ Something went wrong. Please try again.';
      }
    }
  };
</script>