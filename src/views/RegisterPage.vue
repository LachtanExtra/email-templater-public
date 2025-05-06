<template>
  <div class="signup-container">
    <h1 class="green">Sign Up</h1>
    <form @submit.prevent="handleSubmit">
      <div class="form-group">
        <label for="email">Email Address</label>
        <input type="email" id="email" v-model="email" required />
      </div>
      <div class="form-group">
        <label for="password">Password</label>
        <input type="password" id="password" v-model="password" required minlength="6" />
      </div>
      <div class="form-group">
        <label for="confirmPassword">Confirm Password</label>
        <input
          type="password"
          id="confirmPassword"
          v-model="confirmPassword"
          required
        />
      </div>
      <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
      <button type="submit">Create Account</button>
    </form>
    <RouterLink to="/login" class="link">Already have an account? Log In</RouterLink>
  </div>
</template>
  
<script setup>
  import { ref } from 'vue';
  import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
  import { useRouter } from 'vue-router';
  
  const email = ref('');
  const password = ref('');
  const confirmPassword = ref('');
  const errorMessage = ref('');
  const router = useRouter();
  
  const handleSubmit = () => {
    if (password.value !== confirmPassword.value) {
      errorMessage.value = 'Passwords do not match.';
      return;
    }
  
    errorMessage.value = '';
    const auth = getAuth();

    createUserWithEmailAndPassword(auth, email.value, password.value)
      .then(() => {
        router.push('/');
      })
      .catch((error) => {
        console.log(error.code);
        alert(error.message);
      })
  };
</script>