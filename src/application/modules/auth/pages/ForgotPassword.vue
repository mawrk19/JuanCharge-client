<template>
  <div class="auth-page">
    <!-- Animated Background -->
    <div class="animated-bg">
      <div class="blob blob-1"></div>
      <div class="blob blob-2"></div>
      <div class="blob blob-3"></div>
    </div>

    <div class="auth-container">
      <q-card class="auth-card">
        <q-card-section class="text-center q-pb-none">
          <!-- Logo/Icon -->
          <div class="auth-icon q-mb-md">
            <q-icon name="lock_reset" size="48px" color="green" />
          </div>
          
          <div class="text-h5 text-white text-weight-bold q-mb-xs">
            Forgot Password?
          </div>
          <div class="text-caption text-grey-5 q-mb-md">
            Enter your email address and we'll send you a password reset link
          </div>
        </q-card-section>

        <q-card-section>
          <q-form @submit="handleSubmit" class="q-gutter-md">
            <!-- Email Input -->
            <q-input
              v-model="email"
              type="email"
              label="Email Address"
              outlined
              dense
              bg-color="grey-9"
              color="green"
              label-color="grey-5"
              :rules="[
                val => !!val || 'Email is required',
                val => /.+@.+\..+/.test(val) || 'Please enter a valid email'
              ]"
            >
              <template v-slot:prepend>
                <q-icon name="email" color="grey-5" />
              </template>
            </q-input>

            <!-- Submit Button -->
            <q-btn
              type="submit"
              unelevated
              color="green"
              text-color="white"
              label="Send Reset Link"
              class="full-width q-py-sm"
              :loading="loading"
              :disable="loading"
            />

            <!-- Back to Login -->
            <div class="text-center q-mt-md">
              <q-btn
                flat
                dense
                color="green"
                label="Back to Login"
                icon="arrow_back"
                @click="$router.push('/login')"
              />
            </div>
          </q-form>
        </q-card-section>
      </q-card>

      <!-- Info Footer -->
      <div class="info-footer text-center q-mt-md">
        <q-icon name="info_outline" size="16px" class="q-mr-xs" />
        <span class="text-caption text-grey-5">
          If your email exists in our system, you will receive a password reset link
        </span>
      </div>
    </div>
  </div>
</template>

<script>
import http from "@/service/axios";

export default {
  name: "ForgotPassword",
  
  data() {
    return {
      email: "",
      loading: false
    };
  },

  methods: {
    async handleSubmit() {
      try {
        this.loading = true;

        const response = await http.post("/auth/forgot-password", {
          email: this.email
        });

        this.loading = false;

        // Show success message
        this.$q.notify({
          type: "positive",
          message: "Password reset link sent!",
          caption: "Please check your email for the reset link",
          icon: "check_circle",
          timeout: 5000
        });

        // Redirect to login after a short delay
        setTimeout(() => {
          this.$router.push("/login");
        }, 2000);

      } catch (error) {
        this.loading = false;

        console.error("Forgot password error:", error);

        // Show error message
        this.$q.notify({
          type: "negative",
          message: "Failed to send reset link",
          caption: error.response?.data?.message || "Please try again later",
          icon: "error",
          timeout: 5000
        });
      }
    }
  }
};
</script>

<style scoped>
.auth-page {
  background: linear-gradient(135deg, #0a0f0d 0%, #142221 50%, #1a2c28 100%);
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1.5rem;
  position: relative;
  overflow: hidden;
}

/* Animated Background */
.animated-bg {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  z-index: 0;
  pointer-events: none;
}

.blob {
  position: absolute;
  border-radius: 50%;
  filter: blur(100px);
  opacity: 0.5;
  animation: float 20s ease-in-out infinite;
}

.blob-1 {
  width: 300px;
  height: 300px;
  background: rgba(76, 175, 80, 0.3);
  top: 10%;
  left: 10%;
  animation-delay: 0s;
}

.blob-2 {
  width: 400px;
  height: 400px;
  background: rgba(251, 191, 36, 0.2);
  bottom: 10%;
  right: 10%;
  animation-delay: 7s;
}

.blob-3 {
  width: 350px;
  height: 350px;
  background: rgba(59, 130, 246, 0.2);
  top: 50%;
  left: 50%;
  animation-delay: 14s;
}

@keyframes float {
  0%, 100% {
    transform: translate(0, 0) scale(1);
  }
  33% {
    transform: translate(50px, -50px) scale(1.1);
  }
  66% {
    transform: translate(-50px, 50px) scale(0.9);
  }
}

/* Auth Container */
.auth-container {
  position: relative;
  z-index: 1;
  width: 100%;
  max-width: 450px;
}

.auth-card {
  background: rgba(20, 34, 33, 0.95);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(76, 175, 80, 0.3);
  border-radius: 16px;
  box-shadow: 
    0 20px 60px rgba(0, 0, 0, 0.5),
    0 0 40px rgba(76, 175, 80, 0.2),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);
  animation: card-appear 0.5s ease-out;
}

@keyframes card-appear {
  from {
    opacity: 0;
    transform: translateY(30px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.auth-icon {
  width: 80px;
  height: 80px;
  background: rgba(76, 175, 80, 0.2);
  border: 2px solid rgba(76, 175, 80, 0.5);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto;
}

.info-footer {
  background: rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  padding: 0.75rem 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

/* Responsive */
@media (max-width: 600px) {
  .auth-page {
    padding: 1rem;
  }

  .auth-card {
    border-radius: 12px;
  }
}
</style>
