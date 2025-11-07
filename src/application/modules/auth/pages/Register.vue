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
      <q-card-section class="text-center q-pb-sm">
        <div class="logo-container">
          <q-icon name="person_add" size="48px" class="logo-icon" />
        </div>
        <div class="text-h5 text-white q-mt-sm" style="font-weight: 700; letter-spacing: 0.5px;">
          Create an Account
        </div>
        <div class="text-caption text-grey-5 q-mt-xs" style="letter-spacing: 0.5px;">
          Join JuanCharge today.
        </div>
      </q-card-section>

      <!-- Form Section -->
      <q-card-section class="q-pt-sm q-px-md q-pb-md">
        <q-form @submit.prevent="registerUser" ref="registerForm" class="q-gutter-sm">

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

          <!-- Confirm Password -->
          <q-input
            v-model="form.confirmPassword"
            label="Confirm Password"
            outlined
            dense
            dark
            color="green"
            class="modern-input"
            :type="showConfirmPassword ? 'text' : 'password'"
            :rules="[
              val => !!val || 'Please confirm your password',
              val => val === form.password || 'Passwords do not match'
            ]"
          >
            <template v-slot:prepend>
              <q-icon name="lock" color="green" />
            </template>
            <template v-slot:append>
              <q-icon
                :name="showConfirmPassword ? 'visibility' : 'visibility_off'"
                class="cursor-pointer"
                @click="showConfirmPassword = !showConfirmPassword"
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

          <!-- EULA Agreement -->
          <div class="eula-section q-mt-sm">
            <q-checkbox
              v-model="form.acceptedEula"
              dark
              color="green"
              class="eula-checkbox"
              :rules="[val => !!val || 'You must accept the terms to continue']"
            >
              <template v-slot:default>
                <div class="text-caption text-white">
                  I agree to the 
                  <span class="text-green cursor-pointer text-decoration-underline" @click.stop="showEulaDialog = true">
                    Terms of Service
                  </span>
                  and
                  <span class="text-green cursor-pointer text-decoration-underline" @click.stop="showEulaDialog = true">
                    Privacy Policy
                  </span>
                </div>
              </template>
            </q-checkbox>
          </div>

          <!-- Register Button -->
          <q-btn
            label="Register"
            color="green"
            class="full-width register-btn q-mt-sm"
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
        <div class="text-center q-mt-xs text-white">
        <span class="text-caption">Already have an account? </span>
        <span
            class="text-caption text-green cursor-pointer text-decoration-underline"
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

    <!-- EULA Dialog -->
    <q-dialog v-model="showEulaDialog">
      <q-card class="eula-dialog" style="width: 700px; max-width: 90vw;">
        <q-toolbar class="bg-green text-white">
          <q-toolbar-title>
            <div class="text-h6">Terms of Service & Privacy Policy</div>
            <div class="text-caption">JuanCharge EV Charging Services</div>
          </q-toolbar-title>
          <q-btn flat round dense icon="close" v-close-popup />
        </q-toolbar>

        <q-card-section class="scroll" style="max-height: 60vh;">
          <q-tabs
            v-model="eulaTab"
            dense
            active-color="green"
            indicator-color="green"
            class="text-grey-7"
          >
            <q-tab name="terms" label="Terms of Service" />
            <q-tab name="privacy" label="Privacy Policy" />
          </q-tabs>

          <q-separator class="q-mb-md" />

          <q-tab-panels v-model="eulaTab" animated>
            <q-tab-panel name="terms" class="q-pa-md">
              <div class="text-caption text-grey-6 q-mb-md">Effective Date: November 5, 2025</div>
              
              <div class="eula-content">
                <h6>1. Acceptance of Terms</h6>
                <p>By accessing and using JuanCharge's electric vehicle (EV) charging network ("Service"), you agree to be bound by these Terms of Service ("Terms"). If you do not agree to these Terms, you may not use the Service.</p>

                <h6>2. Service Description</h6>
                <p>JuanCharge operates a network of EV charging stations throughout the Philippines. The Service allows registered users to locate, reserve, and pay for EV charging sessions through our platform.</p>

                <h6>3. User Accounts and Registration</h6>
                <p>You must provide accurate, current, and complete information during registration. You are responsible for maintaining the confidentiality of your account credentials and for all activities under your account. Notify us immediately of any unauthorized use.</p>

                <h6>4. Acceptable Use</h6>
                <p>You agree to use the Service only for lawful purposes and in accordance with these Terms. You shall not: (a) use the Service in any manner that could damage or overburden our infrastructure; (b) attempt to gain unauthorized access to any systems or networks; (c) interfere with other users' access to the Service; or (d) use the Service for any fraudulent purposes.</p>

                <h6>5. Payment Terms</h6>
                <p>Charging rates are displayed at each station and are subject to change. You authorize us to charge your designated payment method for all services rendered. All fees are non-refundable unless otherwise stated. You are responsible for all taxes associated with your use of the Service.</p>

                <h6>6. Rewards Program</h6>
                <p>JuanCharge operates a points-based rewards program. Points earned have no monetary value and cannot be exchanged for cash. We reserve the right to modify, suspend, or terminate the rewards program at any time without notice. Points are non-transferable and will expire upon account closure.</p>

                <h6>7. Limitation of Liability</h6>
                <p>TO THE MAXIMUM EXTENT PERMITTED BY LAW, JUANCHARGE SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING BUT NOT LIMITED TO LOSS OF PROFITS, DATA, OR VEHICLE DAMAGE ARISING FROM YOUR USE OF THE SERVICE. OUR TOTAL LIABILITY SHALL NOT EXCEED THE AMOUNT PAID BY YOU IN THE LAST SIX MONTHS.</p>

                <h6>8. Service Availability</h6>
                <p>We strive to provide continuous service but do not guarantee uninterrupted or error-free access. Stations may be unavailable due to maintenance, technical issues, or force majeure events. We reserve the right to modify or discontinue any aspect of the Service without notice.</p>

                <h6>9. Intellectual Property</h6>
                <p>All content, trademarks, and intellectual property rights related to the Service remain the property of JuanCharge. You are granted a limited, non-exclusive license to use the Service for personal, non-commercial purposes only.</p>

                <h6>10. Termination</h6>
                <p>We reserve the right to suspend or terminate your account at our sole discretion, without notice, for violations of these Terms or for any other reason. Upon termination, all rights granted to you will immediately cease.</p>

                <h6>11. Governing Law</h6>
                <p>These Terms shall be governed by and construed in accordance with the laws of the Republic of the Philippines. Any disputes shall be subject to the exclusive jurisdiction of the courts of Metro Manila.</p>

                <h6>12. Changes to Terms</h6>
                <p>We may modify these Terms at any time. Continued use of the Service after changes constitutes acceptance of the modified Terms. We will provide notice of material changes through the Service or via email.</p>

                <h6>13. Contact Information</h6>
                <p>For questions regarding these Terms, contact us at:<br>
                Email: legal@juancharge.com<br>
                Address: Metro Manila, Philippines</p>
              </div>
            </q-tab-panel>

            <q-tab-panel name="privacy" class="q-pa-md">
              <div class="text-caption text-grey-6 q-mb-md">Effective Date: November 5, 2025</div>
              
              <div class="eula-content">
                <h6>1. Information We Collect</h6>
                <p><strong>Personal Information:</strong> Name, email address, phone number, payment information, and government-issued identification (as required).</p>
                <p><strong>Usage Data:</strong> Charging session details, location data, device information, IP addresses, browser types, and timestamps of your interactions with our Service.</p>
                <p><strong>Vehicle Information:</strong> Make, model, battery capacity, and charging preferences (optional).</p>

                <h6>2. How We Use Your Information</h6>
                <p>We use collected information to:</p>
                <ul>
                  <li>Provide, maintain, and improve the Service</li>
                  <li>Process transactions and send transaction receipts</li>
                  <li>Communicate service updates, security alerts, and administrative messages</li>
                  <li>Personalize your experience and provide customer support</li>
                  <li>Detect, prevent, and address technical issues and fraudulent activities</li>
                  <li>Comply with legal obligations and enforce our Terms</li>
                  <li>Conduct research and analytics to improve our Service</li>
                </ul>

                <h6>3. Information Sharing and Disclosure</h6>
                <p>We do not sell your personal information. We may share information with:</p>
                <ul>
                  <li><strong>Service Providers:</strong> Third-party vendors who perform services on our behalf, subject to confidentiality agreements</li>
                  <li><strong>Business Partners:</strong> Station operators and charging equipment manufacturers, as necessary to provide the Service</li>
                  <li><strong>Legal Requirements:</strong> Government authorities when required by law or to protect our rights</li>
                  <li><strong>Business Transfers:</strong> In connection with mergers, acquisitions, or asset sales</li>
                </ul>

                <h6>4. Data Security</h6>
                <p>We implement industry-standard security measures including encryption, secure servers, and regular security audits. However, no method of electronic transmission or storage is completely secure. We cannot guarantee absolute security of your information.</p>

                <h6>5. Data Retention</h6>
                <p>We retain personal information for as long as necessary to fulfill the purposes outlined in this Privacy Policy, unless a longer retention period is required by law. Account data is retained for seven (7) years after account closure for legal and accounting purposes.</p>

                <h6>6. Your Rights and Choices</h6>
                <p>You have the right to:</p>
                <ul>
                  <li>Access and receive a copy of your personal information</li>
                  <li>Correct inaccurate or incomplete information</li>
                  <li>Request deletion of your personal information (subject to legal requirements)</li>
                  <li>Object to or restrict processing of your information</li>
                  <li>Withdraw consent for data processing (where applicable)</li>
                  <li>Opt-out of marketing communications</li>
                </ul>
                <p>To exercise these rights, contact us at privacy@juancharge.com</p>

                <h6>7. Cookies and Tracking Technologies</h6>
                <p>We use cookies, web beacons, and similar technologies to enhance user experience, analyze usage patterns, and deliver targeted content. You may disable cookies through your browser settings, but this may limit certain Service features.</p>

                <h6>8. Third-Party Links</h6>
                <p>Our Service may contain links to third-party websites. We are not responsible for the privacy practices of these external sites. We encourage you to review their privacy policies.</p>

                <h6>9. Children's Privacy</h6>
                <p>The Service is not intended for individuals under 18 years of age. We do not knowingly collect personal information from minors. If we discover such collection, we will delete the information immediately.</p>

                <h6>10. International Data Transfers</h6>
                <p>Your information may be transferred to and processed in countries other than the Philippines. We ensure appropriate safeguards are in place to protect your information in accordance with this Privacy Policy.</p>

                <h6>11. Changes to Privacy Policy</h6>
                <p>We may update this Privacy Policy periodically. We will notify you of material changes via email or through a prominent notice on our Service. Your continued use constitutes acceptance of the updated policy.</p>

                <h6>12. Contact Us</h6>
                <p>For privacy-related inquiries or to exercise your rights, contact:<br>
                Email: privacy@juancharge.com<br>
                Data Protection Officer: dpo@juancharge.com<br>
                Address: Metro Manila, Philippines</p>
              </div>
            </q-tab-panel>
          </q-tab-panels>
        </q-card-section>

        <q-separator />

        <q-card-actions align="right" class="q-pa-md">
          <q-btn 
            label="Decline" 
            flat 
            color="grey-7" 
            v-close-popup 
          />
          <q-btn 
            label="I Accept" 
            color="green" 
            unelevated
            @click="acceptEula"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
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
        confirmPassword: "",
        contact: "",
        acceptedEula: false
      },
      showPassword: false,
      showConfirmPassword: false,
      showEulaDialog: false,
      eulaTab: 'terms',
      loading: false
    };
  },
  methods: {
    acceptEula() {
      this.form.acceptedEula = true;
      this.showEulaDialog = false;
    },

    async registerUser() {
      const valid = await this.$refs.registerForm.validate();
      if (!valid) return;

      try {
        this.loading = true;

        // Prepare user data for registration
        const userData = {
          firstName: this.form.firstname,
          lastName: this.form.lastname,
          email: this.form.email,
          password: this.form.password,
          passwordConfirmation: this.form.confirmPassword,
          contactNumber: this.form.contact
        };

        // Register via auth store
        const response = await this.$store.dispatch("auth/register", userData);

        this.$q.notify({
          type: "positive",
          message: response.data?.message || "Registration successful! Please check your email for next steps.",
          icon: "check_circle",
          position: "top",
          timeout: 5000
        });

        this.$router.push("/login");
      } catch (e) {
        const errorMessage = e.response?.data?.message || "Registration failed. Please try again.";
        const errors = e.response?.data?.errors;
        
        // Display field-specific errors if available
        if (errors) {
          const errorMessages = Object.values(errors).flat().join(', ');
          this.$q.notify({
            type: "negative",
            message: errorMessages,
            icon: "error",
            position: "top",
            timeout: 5000
          });
        } else {
          this.$q.notify({
            type: "negative",
            message: errorMessage,
            icon: "error",
            position: "top"
          });
        }
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
  max-width: 420px;
  background: rgba(20, 34, 33, 0.85);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(76, 175, 80, 0.3);
  border-radius: 20px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4), 0 0 60px rgba(76, 175, 80, 0.1);
  position: relative;
  z-index: 1;
}

.logo-container {
  width: 70px;
  height: 70px;
  margin: 0 auto;
  background: linear-gradient(135deg, #4caf50 0%, #66bb6a 100%);
  border-radius: 16px;
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
  height: 44px;
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
  margin-top: 16px;
  text-align: center;
}

@media (max-width: 600px) {
  .register-card { max-width: 100%; border-radius: 16px; }
  .logo-container { width: 60px; height: 60px; }
  .logo-icon { font-size: 40px !important; }
}

.eula-section {
  padding: 8px 0;
}

.eula-checkbox >>> .q-checkbox__label {
  color: rgba(255, 255, 255, 0.87);
}

.eula-dialog {
  background: white;
  color: #333;
}

.eula-dialog .q-toolbar {
  min-height: 64px;
}

.eula-content {
  font-size: 13px;
  line-height: 1.7;
  color: #424242;
}

.eula-content h6 {
  color: #2e7d32;
  font-weight: 600;
  font-size: 14px;
  margin-top: 1.25rem;
  margin-bottom: 0.5rem;
}

.eula-content p {
  margin-bottom: 0.875rem;
  text-align: justify;
}

.eula-content ul {
  margin-left: 1.5rem;
  margin-bottom: 0.875rem;
  padding-left: 0.5rem;
}

.eula-content ul li {
  margin-bottom: 0.5rem;
}

.eula-content strong {
  color: #1b5e20;
  font-weight: 600;
}
</style>
