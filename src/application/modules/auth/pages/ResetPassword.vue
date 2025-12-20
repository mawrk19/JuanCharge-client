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
        <q-card-section class="text-center">
          <!-- Loading State -->
          <div v-if="loading" class="loading-state">
            <q-spinner-gears size="64px" color="green" />
            <div class="text-h6 text-white q-mt-md">Resetting Password...</div>
            <div class="text-caption text-grey-5 q-mt-xs">Please wait a moment</div>
          </div>

          <!-- Success State -->
          <div v-else-if="success" class="success-state">
            <div class="auth-icon success-icon q-mb-md">
              <q-icon name="check_circle" size="48px" color="green" />
            </div>
            <div class="text-h5 text-white text-weight-bold q-mb-xs">
              Password Reset Successful!
            </div>
            <div class="text-body2 text-grey-4 q-mb-lg">
              Your new password has been sent to <strong class="text-green">{{ email }}</strong>
            </div>
            <div class="info-box q-mb-md">
              <q-icon name="mail" size="24px" color="amber" />
              <span>Check your email for your new password</span>
            </div>
            <q-btn
              unelevated
              color="green"
              text-color="white"
              label="Go to Login"
              icon="login"
              class="full-width q-py-sm"
              @click="$router.push('/login')"
            />
          </div>

          <!-- Error State -->
          <div v-else-if="error" class="error-state">
            <div class="auth-icon error-icon q-mb-md">
              <q-icon name="error" size="48px" color="negative" />
            </div>
            <div class="text-h5 text-white text-weight-bold q-mb-xs">
              Reset Failed
            </div>
            <div class="text-body2 text-grey-4 q-mb-lg">
              {{ errorMessage }}
            </div>
            <div class="error-box q-mb-md">
              <q-icon name="info" size="20px" color="orange" />
              <span>{{ errorDetails }}</span>
            </div>
            <div class="q-gutter-sm">
              <q-btn
                unelevated
                color="green"
                text-color="white"
                label="Try Again"
                icon="refresh"
                class="full-width q-py-sm"
                @click="$router.push('/forgot-password')"
              />
              <q-btn
                flat
                color="grey-5"
                label="Back to Login"
                icon="arrow_back"
                class="full-width"
                @click="$router.push('/login')"
              />
            </div>
          </div>
        </q-card-section>
      </q-card>
    </div>
  </div>
</template>

<script>
import http from "@/service/axios";

export default {
  name: "ResetPassword",
  
  data() {
    return {
      loading: true,
      success: false,
      error: false,
      errorMessage: "",
      errorDetails: "",
      email: "",
      token: ""
    };
  },

  mounted() {
    // Extract token and email from URL query parameters
    this.token = this.$route.query.token;
    this.email = this.$route.query.email;

    // Validate parameters
    if (!this.token || !this.email) {
      this.loading = false;
      this.error = true;
      this.errorMessage = "Invalid Reset Link";
      this.errorDetails = "The password reset link is missing required information. Please request a new reset link.";
      return;
    }

    // Automatically trigger password reset
    this.resetPassword();
  },

  methods: {
    async resetPassword() {
      try {
        this.loading = true;

        const response = await http.post("/auth/reset-password", {
          email: this.email,
          token: this.token
        });

        this.loading = false;
        this.success = true;

        // Show success notification
        this.$q.notify({
          type: "positive",
          message: "Password reset successful!",
          caption: "Check your email for your new password",
          icon: "check_circle",
          timeout: 5000
        });

        // Auto-redirect to login after 5 seconds
        setTimeout(() => {
          this.$router.push("/login");
        }, 5000);

      } catch (error) {
        this.loading = false;
        this.error = true;

        console.error("Reset password error:", error);

        // Parse error message
        if (error.response?.status === 404) {
          this.errorMessage = "Invalid or Expired Link";
          this.errorDetails = "This password reset link has expired or already been used. Please request a new one.";
        } else if (error.response?.status === 422) {
          this.errorMessage = "Validation Error";
          this.errorDetails = error.response?.data?.message || "The provided information is invalid.";
        } else {
          this.errorMessage = "Reset Failed";
          this.errorDetails = error.response?.data?.message || "An unexpected error occurred. Please try again.";
        }

        // Show error notification
        this.$q.notify({
          type: "negative",
          message: this.errorMessage,
          caption: this.errorDetails,
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
  max-width: 500px;
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
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto;
}

.success-icon {
  background: rgba(76, 175, 80, 0.2);
  border: 2px solid rgba(76, 175, 80, 0.5);
  animation: success-pulse 2s ease-in-out infinite;
}

.error-icon {
  background: rgba(239, 68, 68, 0.2);
  border: 2px solid rgba(239, 68, 68, 0.5);
}

@keyframes success-pulse {
  0%, 100% {
    transform: scale(1);
    box-shadow: 0 0 0 0 rgba(76, 175, 80, 0.7);
  }
  50% {
    transform: scale(1.05);
    box-shadow: 0 0 0 10px rgba(76, 175, 80, 0);
  }
}

.info-box {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  background: rgba(251, 191, 36, 0.1);
  border: 1px solid rgba(251, 191, 36, 0.3);
  border-radius: 8px;
  padding: 1rem;
  color: #fbbf24;
  font-size: 0.9rem;
}

.error-box {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  background: rgba(251, 146, 60, 0.1);
  border: 1px solid rgba(251, 146, 60, 0.3);
  border-radius: 8px;
  padding: 1rem;
  color: #fb923c;
  font-size: 0.9rem;
  text-align: left;
}

.loading-state,
.success-state,
.error-state {
  padding: 2rem 1rem;
}

/* Responsive */
@media (max-width: 600px) {
  .auth-page {
    padding: 1rem;
  }

  .auth-card {
    border-radius: 12px;
  }

  .loading-state,
  .success-state,
  .error-state {
    padding: 1.5rem 0.5rem;
  }
}
</style>
