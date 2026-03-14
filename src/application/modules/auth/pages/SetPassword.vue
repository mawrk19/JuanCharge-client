<template>
  <div class="login-container">
    <!-- Modern Animated Background -->
    <div class="animated-background">
      <div class="shape shape-1"></div>
      <div class="shape shape-2"></div>
      <div class="shape shape-3"></div>
      <div class="grid-overlay"></div>
    </div>

    <!-- Set Password Card -->
    <q-card class="login-card">
      <div class="glass-effect"></div>
      
      <div class="relative-position z-10">
        <!-- Logo & Header -->
        <q-card-section class="text-center q-pb-lg mt-md">
          <div class="logo-container q-mb-md">
            <q-icon name="password" size="48px" color="primary" />
          </div>
          <div class="brand-text">
            Set Your Password
          </div>
          <div class="text-caption text-grey-6 q-mt-sm q-px-md font-medium">
            Please create a secure password for your account to continue
          </div>
        </q-card-section>

        <q-card-section class="q-py-md q-px-xl form-section">
          <!-- Email Input (readonly) -->
          <div class="input-wrapper q-mb-md">
            <span class="input-label">Email Address</span>
            <q-input
              v-model="email"
              placeholder="name@example.com"
              outlined
              dense
              readonly
              type="email"
              class="modern-input readonly-input"
              color="primary"
              bg-color="transparent"
            >
              <template v-slot:prepend>
                <q-icon name="mail_outline" class="input-icon" />
              </template>
            </q-input>
          </div>

          <!-- Password Input -->
          <div class="input-wrapper q-mb-md">
            <span class="input-label">New Password</span>
            <q-input
              v-model="password"
              placeholder="Enter your new password"
              outlined
              dense
              class="modern-input"
              color="primary"
              bg-color="transparent"
              :type="showPassword ? 'text' : 'password'"
              :rules="[
                val => !!val || 'Password is required',
                val => val.length >= 8 || 'Must be at least 8 characters'
              ]"
              hide-bottom-space
            >
              <template v-slot:prepend>
                <q-icon name="lock_outline" class="input-icon" />
              </template>
              <template v-slot:append>
                <q-icon
                  :name="showPassword ? 'visibility' : 'visibility_off'"
                  class="cursor-pointer input-icon-append"
                  @click="showPassword = !showPassword"
                />
              </template>
            </q-input>
          </div>

          <!-- Confirm Password Input -->
          <div class="input-wrapper q-mb-xl">
            <span class="input-label">Confirm Password</span>
            <q-input
              v-model="passwordConfirm"
              placeholder="Confirm your password"
              outlined
              dense
              class="modern-input"
              color="primary"
              bg-color="transparent"
              :type="showPasswordConfirm ? 'text' : 'password'"
              :rules="[
                val => !!val || 'Please confirm your password',
                val => val === password || 'Passwords do not match'
              ]"
              hide-bottom-space
            >
              <template v-slot:prepend>
                <q-icon name="lock_outline" class="input-icon" />
              </template>
              <template v-slot:append>
                <q-icon
                  :name="showPasswordConfirm ? 'visibility' : 'visibility_off'"
                  class="cursor-pointer input-icon-append"
                  @click="showPasswordConfirm = !showPasswordConfirm"
                />
              </template>
            </q-input>
          </div>

          <!-- Submit Button -->
          <q-btn
            label="Save and Login"
            class="full-width login-btn q-mb-md"
            unelevated
            no-caps
            @click="handleSubmit"
            :loading="loading"
            :disable="loading || !isFormValid"
          >
            <template v-slot:loading>
              <q-spinner-dots color="white" size="1.5em" />
            </template>
          </q-btn>
        </q-card-section>
      </div>
    </q-card>

    <!-- Footer -->
    <div class="login-footer">
      <span>© 2025 JuanCharge. All rights reserved.</span>
    </div>
  </div>
</template>

<script>
import http from "@/service/axios";

export default {
  name: "SetPassword",
  
  data() {
    return {
      email: "",
      password: "",
      passwordConfirm: "",
      showPassword: false,
      showPasswordConfirm: false,
      loading: false
    };
  },

  computed: {
    isFormValid() {
      return (
        !!this.password &&
        this.password.length >= 8 &&
        this.password === this.passwordConfirm
      );
    }
  },

  mounted() {
    // Extract email from URL query parameters
    this.email = this.$route.query.email || "";

    if (!this.email) {
      this.$q.notify({
        type: "warning",
        message: "Missing Email",
        caption: "No email parameter was provided in the URL.",
        icon: "warning",
        timeout: 5000,
        classes: "rounded-borders"
      });
    }
  },

  methods: {
    async handleSubmit() {
      if (!this.isFormValid) return;

      try {
        this.loading = true;

        await http.post("/lgu/set-password", {
          email: this.email,
          password: this.password,
          password_confirmation: this.passwordConfirm
        });

        this.loading = false;

        this.$q.notify({
          type: "positive",
          message: "Password set successfully!",
          caption: "You can now log in with your new password.",
          icon: "check_circle",
          position: "top",
          timeout: 4000,
          classes: "rounded-borders"
        });

        // Redirect to login
        setTimeout(() => {
          this.$router.push("/login");
        }, 1500);

      } catch (error) {
        this.loading = false;
        
        console.error("Set password error:", error);

        this.$q.notify({
          type: "negative",
          message: "Failed to set password",
          caption: error.response?.data?.message || "Please check your link or try again",
          icon: "error_outline",
          position: "top",
          timeout: 5000,
          classes: "rounded-borders"
        });
      }
    }
  }
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap');

.login-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
  font-family: 'Plus Jakarta Sans', sans-serif;
  background-color: #f8fafc;
}

/* Animated Background */
.animated-background {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  z-index: 0;
}

.shape {
  position: absolute;
  filter: blur(80px);
  opacity: 0.6;
  animation: float 20s infinite alternate;
}

.shape-1 {
  top: -10%;
  left: -10%;
  width: 50vw;
  height: 50vw;
  background: radial-gradient(circle, rgba(34, 197, 94, 0.4) 0%, rgba(34, 197, 94, 0) 70%);
  animation-delay: 0s;
}

.shape-2 {
  bottom: -10%;
  right: -10%;
  width: 60vw;
  height: 60vw;
  background: radial-gradient(circle, rgba(21, 128, 61, 0.3) 0%, rgba(21, 128, 61, 0) 70%);
  animation-delay: -5s;
}

.shape-3 {
  top: 40%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 40vw;
  height: 40vw;
  background: radial-gradient(circle, rgba(134, 239, 172, 0.3) 0%, rgba(134, 239, 172, 0) 70%);
  animation-delay: -10s;
}

.grid-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: 
    linear-gradient(rgba(34, 197, 94, 0.03) 1px, transparent 1px),
    linear-gradient(90deg, rgba(34, 197, 94, 0.03) 1px, transparent 1px);
  background-size: 40px 40px;
  z-index: 1;
}

@keyframes float {
  0% { transform: translate(0, 0) rotate(0deg); }
  100% { transform: translate(30px, 30px) rotate(5deg); }
}

/* Login Card */
.login-card {
  width: 100%;
  max-width: 420px;
  border-radius: 24px;
  box-shadow: 
    0 20px 40px -10px rgba(0, 0, 0, 0.08),
    0 0 0 1px rgba(255, 255, 255, 0.5);
  position: relative;
  z-index: 10;
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.6);
  opacity: 0;
  animation: slideUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

@keyframes slideUp {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

.glass-effect {
  position: absolute;
  inset: 0;
  background: linear-gradient(145deg, rgba(255,255,255,0.6) 0%, rgba(255,255,255,0.2) 100%);
  border-radius: 24px;
  z-index: 0;
}

/* Typography */
.brand-text {
  font-family: 'Plus Jakarta Sans', sans-serif;
  font-size: 28px;
  font-weight: 800;
  color: #1a1a1a;
  letter-spacing: -0.5px;
  margin-top: 8px;
  background: linear-gradient(135deg, #16a34a 0%, #15803d 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.font-medium {
  font-weight: 500;
}

.mt-md {
  margin-top: 1rem;
}

/* Logo */
.logo-container {
  width: 90px;
  height: 90px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 20px;
  background: linear-gradient(135deg, #ffffff 0%, #f0fdf4 100%);
  box-shadow: 
    0 10px 25px -5px rgba(22, 163, 74, 0.15),
    0 0 0 1px rgba(22, 163, 74, 0.1);
  padding: 16px;
}

/* Inputs */
.input-label {
  display: block;
  font-size: 13px;
  font-weight: 600;
  color: #334155;
  margin-bottom: 6px;
  margin-left: 4px;
}

.modern-input >>> .q-field__control {
  height: 48px;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
  transition: all 0.2s ease;
  background: #f8fafc;
}

.modern-input.readonly-input >>> .q-field__control {
  background: #f1f5f9;
  border-color: #cbd5e1;
  opacity: 0.8;
}

.modern-input >>> .q-field__control:hover {
  border-color: #cbd5e1;
  background: #ffffff;
}

.modern-input >>> .q-field--focused .q-field__control {
  border-color: #22c55e;
  box-shadow: 0 0 0 4px rgba(34, 197, 94, 0.1);
  background: #ffffff;
}

.modern-input >>> .q-field__native {
  padding-left: 8px;
  font-weight: 500;
}

.input-icon {
  color: #94a3b8;
  font-size: 20px;
  transition: color 0.2s;
}

.modern-input >>> .q-field--focused .input-icon {
  color: #22c55e;
}

.input-icon-append {
  color: #94a3b8;
}

.input-icon-append:hover {
  color: #64748b;
}

/* Buttons */
.login-btn {
  height: 52px;
  border-radius: 14px;
  font-size: 16px;
  font-weight: 700;
  letter-spacing: 0.3px;
  background: linear-gradient(135deg, #16a34a 0%, #15803d 100%);
  box-shadow: 0 4px 12px rgba(22, 163, 74, 0.25);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.login-btn:not(:disabled):hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(22, 163, 74, 0.35);
  filter: brightness(1.05);
}

.login-btn:not(:disabled):active {
  transform: translateY(0);
}

.login-btn:disabled {
  opacity: 0.7;
}

/* Footer */
.login-footer {
  position: absolute;
  bottom: 24px;
  font-size: 12px;
  color: #94a3b8;
  font-weight: 500;
  z-index: 10;
}

/* Responsive */
@media (max-width: 600px) {
  .login-card {
    border-radius: 0;
    max-width: 100%;
    height: 100vh;
    box-shadow: none;
    display: flex;
    flex-direction: column;
    justify-content: center;
    background: rgba(255, 255, 255, 0.95);
  }

  .login-footer {
    display: none;
  }
}
</style>