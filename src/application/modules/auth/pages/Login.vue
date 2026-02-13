<template>
  <div class="login-container">
    <!-- Modern Animated Background -->
    <div class="animated-background">
      <div class="shape shape-1"></div>
      <div class="shape shape-2"></div>
      <div class="shape shape-3"></div>
      <div class="grid-overlay"></div>
    </div>

    <!-- Login Card -->
    <q-card class="login-card">
      <div class="glass-effect"></div>
      
      <div class="relative-position z-10">
        <!-- Logo & Header -->
        <q-card-section class="text-center q-pb-lg">
          <div class="logo-container q-mb-md">
            <img src="/image/logo.png" alt="JuanCharge Logo" class="logo-image" />
          </div>
          <div class="brand-text">
            JuanCharge
          </div>
          <div class="tagline-text">
            Powering Every Juan.
          </div>
        </q-card-section>

        <q-card-section class="q-py-lg q-px-xl form-section">
          <!-- Email Input -->
          <div class="input-wrapper q-mb-lg">
            <span class="input-label">Email Address</span>
            <q-input
              v-model="form.email"
              placeholder="name@example.com"
              outlined
              dense
              type="email"
              class="modern-input"
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
            <span class="input-label">Password</span>
            <q-input
              v-model="form.password"
              placeholder="Enter your password"
              outlined
              dense
              class="modern-input"
              color="primary"
              bg-color="transparent"
              :type="showPassword ? 'text' : 'password'"
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

          <!-- Remember Me & Forgot Password -->
          <div class="row items-center justify-between q-mb-xl">
            <q-checkbox
              v-model="rememberMe"
              label="Remember me"
              class="custom-checkbox text-grey-8"
              color="primary"
              size="sm"
            />
            <q-btn
              flat
              dense
              no-caps
              label="Forgot Password?"
              class="forgot-link"
              @click="$router.push('/forgot-password')"
            />
          </div>

          <!-- Login Button -->
          <q-btn
            label="Sign In"
            class="full-width login-btn"
            unelevated
            no-caps
            @click="loginUser"
            :loading="loading"
          >
            <template v-slot:loading>
              <q-spinner-dots color="white" size="1.5em" />
            </template>
          </q-btn>

          <!-- Register Link -->
          <!-- <div class="text-center q-mt-lg text-grey-7 text-body2">
            Don’t have an account? 
            <span
              class="register-link cursor-pointer"
              @click="$router.push('/register')"
            >
              Create Account
            </span>
          </div> -->
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
export default {
  name: "Login",
  data() {
    return {
      form: {
        email: "",
        password: "",
      },
      showPassword: false,
      rememberMe: false,
      loading: false,
    };
  },
  methods: {
    async loginUser() {
      try {
        this.loading = true;
        await this.$store.dispatch("auth/login", this.form);

        // Verify token was stored
        const storedToken = localStorage.getItem("token");
        const storeToken = this.$store.state.auth.token;

        if (!storedToken || !storeToken) {
          throw new Error("Authentication failed: Token not stored");
        }

        // Login successful
        this.$q.notify({
          type: "positive",
          message: "Welcome back!",
          icon: "check_circle",
          position: "top",
          classes: "rounded-borders",
        });

        // Small delay to ensure state is fully updated
        setTimeout(() => {
          const userType =
            this.$store.state.auth?.user?.user_type ||
            localStorage.getItem("user_type");

          // Treat kiosk_user as patron
          if (userType === "patron" || userType === "kiosk_user") {
            this.$router.push("/patron");
          } else if (userType === "lgu") {
            this.$router.push("/main/users");
          } else {
            this.$router.push("/main/dashboard");
          }
        }, 300);
      } catch (e) {
        let errorMessage = "Login failed. Please check your credentials.";

        if (e.response?.status === 401) {
          errorMessage =
            e.response?.data?.message ||
            "Invalid credentials. Please check your email and password.";
        } else if (e.message) {
          errorMessage = e.message;
        } else if (e.response?.data?.message) {
          errorMessage = e.response.data.message;
        }

        this.$q.notify({
          type: "negative",
          message: errorMessage,
          icon: "error_outline",
          position: "top",
          classes: "rounded-borders",
        });
      } finally {
        this.loading = false;
      }
    },
  },
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

.tagline-text {
  font-size: 13px;
  font-weight: 600;
  color: #64748b;
  text-transform: uppercase;
  letter-spacing: 1.5px;
  margin-top: 4px;
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

.logo-image {
  width: 100%;
  height: auto;
  object-fit: contain;
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

/* Links & Buttons */
.custom-checkbox >>> .q-checkbox__inner {
  font-size: 32px;
}

.forgot-link {
  font-weight: 600;
  color: #64748b;
  font-size: 13px;
}

.forgot-link:hover {
  color: #22c55e;
  background: transparent;
}

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

.login-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(22, 163, 74, 0.35);
  filter: brightness(1.05);
}

.login-btn:active {
  transform: translateY(0);
}

.register-link {
  color: #16a34a;
  font-weight: 700;
  text-decoration: none;
  transition: color 0.2s;
  position: relative;
  display: inline-block;
}

.register-link::after {
  content: '';
  position: absolute;
  bottom: -2px;
  left: 0;
  width: 100%;
  height: 2px;
  background: currentColor;
  transform: scaleX(0);
  transform-origin: right;
  transition: transform 0.3s ease;
  opacity: 0.5;
}

.register-link:hover::after {
  transform: scaleX(1);
  transform-origin: left;
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
  
  .login-container {
    padding: 0;
  }
  
  .shape {
    opacity: 0.4;
  }
}
</style>
