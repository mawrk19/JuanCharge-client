<template>
  <div class="register-container">
    <!-- Animated Background -->
    <div class="animated-bg">
      <div class="blob blob-1"></div>
      <div class="blob blob-2"></div>
      <div class="blob blob-3"></div>
    </div>

    <!-- Register Card -->
    <q-card class="register-card tw-glass">
      <!-- Header -->
      <q-card-section class="text-center q-pb-20px">
        <div class="logo-container">
          <q-icon name="person_add" size="64px" class="logo-icon" />
        </div>
        <div class="text-h4 text-white q-mt-md" style="font-weight: 700; letter-spacing: 0.5px;">
          Create an Account
        </div>
        <div class="text-subtitle2 text-grey-5 q-mt-xs" style="letter-spacing: 1px;">
          Join JuanCharge today.
        </div>
      </q-card-section>

      <!-- Form Section -->
      <q-card-section class="q-pt-lg q-px-lg">
        <q-form @submit.prevent="registerUser" ref="registerForm" class="q-gutter-md">

          <!-- First Name -->
          <q-input
            v-model="form.firstname"
            label="First Name"
            outlined
            dense
            dark
            color="green"
            class="modern-input"
            :rules="[val => !!val || 'First name is required']"
          >
            <template v-slot:prepend>
              <q-icon name="badge" color="green" />
            </template>
          </q-input>

          <!-- Last Name -->
          <q-input
            v-model="form.lastname"
            label="Last Name"
            outlined
            dense
            dark
            color="green"
            class="modern-input"
            :rules="[val => !!val || 'Last name is required']"
          >
            <template v-slot:prepend>
              <q-icon name="badge" color="green" />
            </template>
          </q-input>

          <!-- Email -->
          <q-input
            v-model="form.email"
            label="Email"
            outlined
            dense
            dark
            color="green"
            class="modern-input"
            type="email"
            :rules="[
              val => !!val || 'Email is required',
              val => /.+@.+\..+/.test(val) || 'Enter a valid email address'
            ]"
          >
            <template v-slot:prepend>
              <q-icon name="email" color="green" />
            </template>
          </q-input>

          <!-- Password -->
          <q-input
            v-model="form.password"
            label="Password"
            outlined
            dense
            dark
            color="green"
            class="modern-input"
            :type="showPassword ? 'text' : 'password'"
            :rules="[
              val => !!val || 'Password is required',
              val => val.length >= 6 || 'Password must be at least 6 characters'
            ]"
          >
            <template v-slot:prepend>
              <q-icon name="lock" color="green" />
            </template>
            <template v-slot:append>
              <q-icon
                :name="showPassword ? 'visibility' : 'visibility_off'"
                class="cursor-pointer"
                @click="showPassword = !showPassword"
              />
            </template>
          </q-input>

          <!-- Contact Number -->
          <q-input
            v-model="form.contact"
            label="Contact Number"
            outlined
            dense
            dark
            color="green"
            class="modern-input"
            type="tel"
            :rules="[
              val => !!val || 'Contact number is required',
              val => /^[0-9]{10,11}$/.test(val) || 'Enter a valid 10-11 digit number'
            ]"
          >
            <template v-slot:prepend>
              <q-icon name="phone" color="green" />
            </template>
          </q-input>

          <!-- Register Button -->
          <q-btn
            label="Register"
            color="green"
            class="full-width register-btn"
            size="md"
            unelevated
            type="submit"
            :loading="loading"
          >
            <template v-slot:loading>
              <q-spinner color="white" size="20px" />
            </template>
          </q-btn>

          <!-- Back to Login Link -->
        <div class="text-center q-mt-sm text-white">
        <span>Already have an account? </span>
        <span
            class="text-green cursor-pointer text-decoration-underline"
            @click="$router.push('/login')"
            >
        Sign in
        </span>
        </div>

        </q-form>
      </q-card-section>
    </q-card>

    <!-- Footer -->
    <div class="register-footer">
      <span class="text-grey-5">© 2025 JuanCharge. All rights reserved.</span>
    </div>
  </div>
</template>

<script>
export default {
  name: "Register",
  data() {
    return {
      form: {
        firstname: "",
        lastname: "",
        email: "",
        password: "",
        contact: ""
      },
      showPassword: false,
      loading: false
    };
  },
  methods: {
    async registerUser() {
      const valid = await this.$refs.registerForm.validate();
      if (!valid) return;

      try {
        this.loading = true;

        // Example Vuex dispatch (adjust to your actual auth module)
        await this.$store.dispatch("auth/register", this.form);

        this.$q.notify({
          type: "positive",
          message: "Registration successful! You can now log in.",
          icon: "check_circle",
          position: "top"
        });

        this.$router.push("/login");
      } catch (e) {
        const errorMessage = e.response?.data?.message || "Registration failed. Please try again.";
        this.$q.notify({
          type: "negative",
          message: errorMessage,
          icon: "error",
          position: "top"
        });
      } finally {
        this.loading = false;
      }
    }
  }
};
</script>

<style scoped>
/* Reuse login design styles */
.register-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
  background: linear-gradient(135deg, #0a0f0d 0%, #142221 50%, #1a2c28 100%);
  padding: 20px;
}

.animated-bg { position: absolute; top: 0; left: 0; width: 100%; height: 100%; overflow: hidden; z-index: 0; }
.blob { position: absolute; border-radius: 50%; filter: blur(80px); opacity: 0.3; animation: float 20s infinite ease-in-out; }
.blob-1 { width: 400px; height: 400px; background: linear-gradient(135deg, #4caf50 0%, #66bb6a 100%); top: -200px; left: -200px; animation-delay: 0s; }
.blob-2 { width: 350px; height: 350px; background: linear-gradient(135deg, #2e7d32 0%, #4caf50 100%); bottom: -150px; right: -150px; animation-delay: 7s; }
.blob-3 { width: 300px; height: 300px; background: linear-gradient(135deg, #66bb6a 0%, #81c784 100%); top: 50%; left: 50%; transform: translate(-50%, -50%); animation-delay: 14s; }

@keyframes float {
  0%, 100% { transform: translate(0, 0) scale(1); }
  33% { transform: translate(30px, -50px) scale(1.1); }
  66% { transform: translate(-20px, 30px) scale(0.9); }
}

.register-card {
  width: 100%;
  max-width: 480px;
  background: rgba(20, 34, 33, 0.85);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(76, 175, 80, 0.3);
  border-radius: 24px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4), 0 0 60px rgba(76, 175, 80, 0.1);
  position: relative;
  z-index: 1;
}

.logo-container {
  width: 100px;
  height: 100px;
  margin: 0 auto;
  background: linear-gradient(135deg, #4caf50 0%, #66bb6a 100%);
  border-radius: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 8px 24px rgba(76, 175, 80, 0.4);
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%, 100% { box-shadow: 0 8px 24px rgba(76, 175, 80, 0.4); }
  50% { box-shadow: 0 8px 32px rgba(76, 175, 80, 0.6); }
}

.logo-icon { color: white; }

.modern-input >>> .q-field__control {
  background: rgba(0, 0, 0, 0.3);
  border-radius: 12px;
  border-color: rgba(76, 175, 80, 0.3);
}
.modern-input >>> .q-field__control:hover { border-color: rgba(76, 175, 80, 0.5); }
.modern-input >>> .q-field--focused .q-field__control { border-color: #4caf50; box-shadow: 0 0 0 2px rgba(76, 175, 80, 0.2); }
.modern-input >>> input { color: white; }

.register-btn {
  height: 48px;
  border-radius: 12px;
  font-weight: 600;
  letter-spacing: 0.5px;
  text-transform: uppercase;
  background: linear-gradient(135deg, #4caf50 0%, #66bb6a 100%);
  box-shadow: 0 4px 12px rgba(76, 175, 80, 0.3);
  transition: all 0.3s ease;
}
.register-btn:hover { box-shadow: 0 6px 20px rgba(76, 175, 80, 0.5); transform: translateY(-2px); }
.register-btn:active { transform: translateY(0); }

.register-footer {
  position: relative;
  z-index: 1;
  margin-top: 24px;
  text-align: center;
}

@media (max-width: 600px) {
  .register-card { max-width: 100%; border-radius: 16px; }
  .logo-container { width: 80px; height: 80px; }
  .logo-icon { font-size: 48px !important; }
}
</style>
