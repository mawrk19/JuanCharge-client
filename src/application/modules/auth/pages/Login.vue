<template>
  <div class="login-container">
    <!-- Animated Background -->
    <div class="animated-bg">
      <div class="blob blob-1"></div>
      <div class="blob blob-2"></div>
      <div class="blob blob-3"></div>
    </div>

    <!-- Login Card -->
    <q-card class="login-card tw-glass">
      <!-- Logo & Header -->
      <q-card-section class="text-center q-pb-20px">
        <div class="logo-container">
          <q-icon name="ev_station" size="64px" class="logo-icon" />
        </div>
        <div class="text-h4 text-white q-mt-md" style="font-weight: 700; letter-spacing: 0.5px;">
          JuanCharge
        </div>
        <div class="text-subtitle2 text-grey-5 q-mt-xs" style="letter-spacing: 1px; text-transform: uppercase;">
         Powering Every Juan.
        </div>
      </q-card-section>

      <q-card-section class="q-pt-lg q-px-lg">
        
        <!-- Email Input -->
        <q-input
          v-model="form.email"
          label="Email"
          outlined
          dense
          type="email"
          dark
          color="green"
          class="modern-input q-mb-md"
        >
          <template v-slot:prepend>
            <q-icon name="email" color="green" />
          </template>
        </q-input>

        <!-- Password Input -->
        <q-input
          v-model="form.password"
          label="Password"
          outlined
          dense
          dark
          color="green"
          class="modern-input q-mb-sm"
          :type="showPassword ? 'text' : 'password'"
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

        <!-- Remember Me & Forgot Password -->
        <div class="row items-center justify-between q-mb-md">
          <q-checkbox
            v-model="rememberMe"
            label="Remember me"
            dark
            color="green"
            size="xs"
          />
          <q-btn
            flat
            dense
            size="sm"
            label="Forgot Password?"
            color="green"
            class="text-capitalize"
          />
        </div>

        <!-- Login Button -->
        <q-btn
          label="Sign In"
          color="green"
          class="full-width login-btn"
          size="md"
          unelevated
          @click="loginUser"
          :loading="loading"
        >
          <template v-slot:loading>
            <q-spinner color="white" size="20px" />
          </template>
        </q-btn>

      </q-card-section>
    </q-card>

    <!-- Footer -->
    <div class="login-footer">
      <span class="text-grey-5">© 2025 JuanCharge. All rights reserved.</span>
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
        password: ""
      },
      showPassword: false,
      rememberMe: false,
      loading: false
    };
  },
  methods: {
    async loginUser() {
      try {
        this.loading = true;
        const response = await this.$store.dispatch("auth/login", this.form);
        
        // Verify token was stored
        const storedToken = localStorage.getItem('token');
        const storeToken = this.$store.state.auth.token;
        
        if (!storedToken || !storeToken) {
          console.error('Token not stored properly!', { storedToken, storeToken, response: response.data });
          throw new Error('Authentication failed: Token not stored');
        }
        
        // Login successful
        this.$q.notify({
          type: 'positive',
          message: 'Login successful!',
          icon: 'check_circle',
          position: 'top'
        });
        
        // Small delay to ensure state is fully updated
        setTimeout(() => {
          this.$router.push("/main/dashboard");
        }, 100);
      } catch (e) {
        console.error('Login error:', e);
        console.error('Error response data:', e.response?.data);
        
        let errorMessage = 'Login failed. Please check your credentials.';
        
        // Check for 401 specifically
        if (e.response?.status === 401) {
          errorMessage = e.response?.data?.message || 
                        'Invalid credentials or unauthorized access. Please check your email and password.';
        } else if (e.message) {
          errorMessage = e.message;
        } else if (e.response?.data?.message) {
          errorMessage = e.response.data.message;
        }
        
        this.$q.notify({
          type: 'negative',
          message: errorMessage,
          icon: 'error',
          position: 'top',
          timeout: 5000
        });
      } finally {
        this.loading = false;
      }
    }
  }
};
</script>

<style scoped>
.login-container {
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

/* Animated Background Blobs */
.animated-bg {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  z-index: 0;
}

.blob {
  position: absolute;
  border-radius: 50%;
  filter: blur(80px);
  opacity: 0.3;
  animation: float 20s infinite ease-in-out;
}

.blob-1 {
  width: 400px;
  height: 400px;
  background: linear-gradient(135deg, #4caf50 0%, #66bb6a 100%);
  top: -200px;
  left: -200px;
  animation-delay: 0s;
}

.blob-2 {
  width: 350px;
  height: 350px;
  background: linear-gradient(135deg, #2e7d32 0%, #4caf50 100%);
  bottom: -150px;
  right: -150px;
  animation-delay: 7s;
}

.blob-3 {
  width: 300px;
  height: 300px;
  background: linear-gradient(135deg, #66bb6a 0%, #81c784 100%);
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  animation-delay: 14s;
}

@keyframes float {
  0%, 100% {
    transform: translate(0, 0) scale(1);
  }
  33% {
    transform: translate(30px, -50px) scale(1.1);
  }
  66% {
    transform: translate(-20px, 30px) scale(0.9);
  }
}

/* Login Card */
.login-card {
  width: 100%;
  max-width: 450px;
  background: rgba(20, 34, 33, 0.85);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(76, 175, 80, 0.3);
  border-radius: 24px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4), 0 0 60px rgba(76, 175, 80, 0.1);
  position: relative;
  z-index: 1;
}

/* Logo Container */
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
  0%, 100% {
    box-shadow: 0 8px 24px rgba(76, 175, 80, 0.4);
  }
  50% {
    box-shadow: 0 8px 32px rgba(76, 175, 80, 0.6);
  }
}

.logo-icon {
  color: white;
  filter: drop-shadow(0 2px 8px rgba(0, 0, 0, 0.3));
}

/* Modern Input Styling */
.modern-input >>> .q-field__control {
  background: rgba(0, 0, 0, 0.3);
  border-radius: 12px;
  border-color: rgba(76, 175, 80, 0.3);
}

.modern-input >>> .q-field__control:hover {
  border-color: rgba(76, 175, 80, 0.5);
}

.modern-input >>> .q-field--focused .q-field__control {
  border-color: #4caf50;
  box-shadow: 0 0 0 2px rgba(76, 175, 80, 0.2);
}

.modern-input >>> .q-field__label {
  color: rgba(255, 255, 255, 0.7);
}

.modern-input >>> input {
  color: white;
}

/* Login Button */
.login-btn {
  height: 48px;
  border-radius: 12px;
  font-weight: 600;
  letter-spacing: 0.5px;
  text-transform: uppercase;
  background: linear-gradient(135deg, #4caf50 0%, #66bb6a 100%);
  box-shadow: 0 4px 12px rgba(76, 175, 80, 0.3);
  transition: all 0.3s ease;
}

.login-btn:hover {
  box-shadow: 0 6px 20px rgba(76, 175, 80, 0.5);
  transform: translateY(-2px);
}

.login-btn:active {
  transform: translateY(0);
}

/* Social Buttons */
.social-btn {
  border-radius: 8px;
  text-transform: capitalize;
  border-color: rgba(255, 255, 255, 0.2);
}

.social-btn:hover {
  border-color: rgba(76, 175, 80, 0.5);
  background: rgba(76, 175, 80, 0.1);
}

/* Footer */
.login-footer {
  position: relative;
  z-index: 1;
  margin-top: 24px;
  text-align: center;
}

/* Responsive */
@media (max-width: 600px) {
  .login-card {
    max-width: 100%;
    border-radius: 16px;
  }
  
  .logo-container {
    width: 80px;
    height: 80px;
  }
  
  .logo-icon {
    font-size: 48px !important;
  }
}
</style>
