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
          <img src="/image/logo.png" alt="JuanCharge Logo" class="logo-image" />
        </div>
        <div
          class="text-3xl text-grey-5 q-mt-xs"
          style="letter-spacing: 1px; text-transform: uppercase"
        >
          JuanCharge
        </div>
        <div
          class="text-xs text-grey-5 q-mt-xs"
          style="letter-spacing: 1px; text-transform: uppercase"
        >
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
            class="text-green text-sm"
          />
          <q-btn
            flat
            dense
            size="sm"
            label="Forgot Password?"
            color="green"
            class="text-capitalize"
            @click="$router.push('/forgot-password')"
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

        <!-- Register Link -->
        <div class="text-center q-mt-lg text-dark">
          <span>Don’t have an account? </span>
          <span
            class="text-green cursor-pointer text-decoration-underline"
            @click="$router.push('/register')"
          >
            Register
          </span>
        </div>
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
          // console.error('Token not stored properly!', { storedToken, storeToken, response: response.data });
          throw new Error("Authentication failed: Token not stored");
        }

        // Login successful
        this.$q.notify({
          type: "positive",
          message: "Login successful!",
          icon: "check_circle",
          position: "top",
        });

        // Small delay to ensure state is fully updated, then redirect based on user type
        setTimeout(() => {
          const userType =
            this.$store.state.auth?.user?.user_type ||
            localStorage.getItem("user_type");

          // Treat kiosk_user as patron (they are the users who charge at kiosks)
          if (userType === "patron" || userType === "kiosk_user") {
            this.$router.push("/patron");
          } else {
            this.$router.push("/main/dashboard");
          }
        }, 100);
      } catch (e) {
        // console.error('Login error:', e);
        // console.error('Error response data:', e.response?.data);

        let errorMessage = "Login failed. Please check your credentials.";

        // Check for 401 specifically
        if (e.response?.status === 401) {
          errorMessage =
            e.response?.data?.message ||
            "Invalid credentials or unauthorized access. Please check your email and password.";
        } else if (e.message) {
          errorMessage = e.message;
        } else if (e.response?.data?.message) {
          errorMessage = e.response.data.message;
        }

        this.$q.notify({
          type: "negative",
          message: errorMessage,
          icon: "error",
          position: "top",
          timeout: 5000,
        });
      } finally {
        this.loading = false;
      }
    },
  },
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
  background: #f5f5f5;
  padding: 20px;
}

/* Login Card */
.login-card {
  width: 100%;
  max-width: 450px;
  background: #ffffff;
  border: 1px solid #e0e0e0;
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  position: relative;
  z-index: 1;
}

/* Logo Container */
.logo-container {
  width: 150px;
  height: 150px;
  margin: 0 auto;
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.logo-icon {
  color: white;
  filter: drop-shadow(0 2px 8px rgba(0, 0, 0, 0.3));
}

.logo-image {
  width: 120px;
  height: auto;
  filter: drop-shadow(0 2px 8px rgba(0, 0, 0, 0.3));
}

/* Modern Input Styling */
.modern-input >>> .q-field__control {
  background: rgba(255, 255, 255, 0.7);
  border-radius: 12px;
  border: 1px solid #e0e0e0;
}

.modern-input >>> .q-field__control:hover {
  border-color: #4caf50;
}

.modern-input >>> .q-field--focused .q-field__control {
  border-color: #4caf50;
  box-shadow: 0 0 0 3px rgba(76, 175, 80, 0.15);
}

.modern-input >>> .q-field__label {
  color: #666;
}

.modern-input >>> input {
  color: #333;
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
