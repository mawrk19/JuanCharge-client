<template>
  <div class="flex flex-center" style="min-height: 100vh;">
    <q-card class="q-pa-md" style="width: 300px">
      <q-card-section>
        <div class="text-h6">Login</div>
      </q-card-section>

      <q-card-section>
        <q-input v-model="form.email" label="Email" outlined />
        <q-input v-model="form.password" type="password" label="Password" outlined />
      </q-card-section>

      <q-card-actions align="right">
        <q-btn label="Login" color="primary" @click="loginUser" />
      </q-card-actions>
    </q-card>
  </div>
</template>

<script>
export default {
  name: "Login",
  data() {
    return {
      form: {
        email: "",
        password: ""
      }
    };
  },
  methods: {
    async loginUser() {
      try {
        await this.$store.dispatch("auth/login", this.form);
        this.$router.push("/main/dashboard");
      } catch (e) {
        console.error('Login error:', e);
        console.error('Error response:', e.response?.data);
        console.error('Error status:', e.response?.status);
        
        // Show user-friendly error message
        const errorMessage = e.response?.data?.message || 'Login failed. Please check your credentials.';
        alert(errorMessage); // You can replace this with a proper notification
      }
    }
  }
};
</script>
