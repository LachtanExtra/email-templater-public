<template>
  <div class="signup-container">
    <h1 class="green">Reset your password</h1>
    <form @submit.prevent="confirmReset">
      <p v-if="email">Resetting password for <strong>{{ email }}</strong></p>
      <div class="form-group">
        <label for="password">New Password</label>
        <input type="password" id="password" v-model="newPassword" required />
      </div>
      <div class="form-group">
        <label for="confirmPassword">Confirm New Password</label>
        <input type="password" id="confirmPassword" v-model="confirmPassword" required />
      </div>
      <p v-if="message" :class="{ error: isError, success: !isError }">{{ message }}</p>
      <button type="submit">Set new password</button>
    </form>
    <RouterLink to="/login" class="link">Back to login</RouterLink>
  </div>
</template>

<script setup>
  import { ref, onMounted } from 'vue';
  import { useRouter, useRoute } from 'vue-router';
  import { getAuth, verifyPasswordResetCode, confirmPasswordReset } from 'firebase/auth';

  const auth = getAuth();
  const router = useRouter();
  const route = useRoute();

  const email = ref('');
  const newPassword = ref('');
  const confirmPassword = ref('');
  const message = ref('');
  const isError = ref(false);
  const resetMode = ref(false);
  const oobCode = ref(null);

  // Check if user arrived via reset link
  onMounted(async () => {
    const query = route.query;
    if (query.mode === 'resetPassword' && query.oobCode) {
      resetMode.value = true;
      oobCode.value = query.oobCode;

      try {
        email.value = await verifyPasswordResetCode(auth, oobCode.value);
      } catch (err) {
        isError.value = true;
        message.value = '⚠️ Invalid or expired reset link.';
      }
    }
  });

  // Confirm password reset
  const confirmReset = async () => {
    isError.value = false;
    message.value = '';

    if (newPassword.value !== confirmPassword.value) {
      isError.value = true;
      message.value = '⚠️ Passwords do not match.';
      return;
    }

    try {
      await confirmPasswordReset(auth, oobCode.value, newPassword.value);
      message.value = '✅ Password successfully reset. Redirecting to login...';
      setTimeout(() => router.push('/login'), 3000);
    } catch (err) {
      isError.value = true;
      message.value = '⚠️ Could not reset password. Try again.';
    }
  };
</script>

<style scoped>
  .success {
    color: hsla(105, 100%, 50%, 1);
    text-shadow: 0 0 4px hsla(105, 100%, 50%, 0.6);
  }
</style>
