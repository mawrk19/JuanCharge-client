<template>
  <q-page class="bg-gray-50 min-h-screen font-sans text-gray-800">
    <div class="max-w-5xl mx-auto p-4 md:p-8 space-y-6">
      
      <!-- Header -->
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 class="text-2xl font-bold text-gray-900 tracking-tight">Settings</h1>
          <p class="text-gray-500 text-sm mt-1">Manage your account preferences and configurations</p>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <!-- Sidebar Navigation (Desktop) / Tabs (Mobile) -->
        <div class="lg:col-span-3">
          <q-card class="bg-white shadow-sm border border-gray-100 rounded-xl overflow-hidden">
            <q-tabs
              v-model="activeSection"
              vertical
              class="text-gray-500"
              active-color="green"
              indicator-color="green"
              align="left"
              content-class="py-2"
            >
              <q-tab 
                name="profile" 
                icon="person_outline" 
                label="Profile" 
                class="justify-start px-6 py-3 min-h-[50px] capitalize transition-colors hover:bg-gray-50" 
              />
              <q-tab 
                name="security" 
                icon="lock_outline" 
                label="Security" 
                class="justify-start px-6 py-3 min-h-[50px] capitalize transition-colors hover:bg-gray-50" 
              />
            </q-tabs>
          </q-card>
        </div>

        <!-- Main Content Area -->
        <div class="lg:col-span-9 space-y-6">
          
          <q-tab-panels v-model="activeSection" animated class="bg-transparent p-0">
            <!-- Profile Panel -->
            <q-tab-panel name="profile" class="p-0 space-y-6">
              
              <!-- Profile Header Card -->
              <div class="bg-white rounded-xl p-6 shadow-sm border border-gray-100 flex items-center gap-6">
                <q-avatar size="80px" class="bg-green-50 text-green-600 font-bold text-2xl shadow-sm border-2 border-white ring-2 ring-green-100">
                  {{ userInitials }}
                </q-avatar>
                <div>
                  <h2 class="text-xl font-bold text-gray-900">{{ userFullName }}</h2>
                  <p class="text-gray-500 text-sm">{{ userEmail }}</p>
                  <div class="mt-2 flex items-center gap-2">
                    <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-50 text-green-700 capitalize">
                      {{ userType }}
                    </span>
                  </div>
                </div>
              </div>

              <!-- Personal Information Form -->
              <div class="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <div class="flex items-center justify-between mb-6">
                  <h3 class="text-lg font-bold text-gray-900">Personal Information</h3>
                </div>

                <q-form @submit.prevent="updateProfile" class="space-y-5">
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div class="space-y-1.5">
                      <label class="text-xs font-semibold text-gray-700 uppercase tracking-wide">First Name</label>
                      <q-input
                        v-model="profileForm.firstName"
                        outlined
                        dense
                        placeholder="First name"
                        class="bg-gray-50"
                        bg-color="transparent"
                        color="green"
                      />
                    </div>
                    <div class="space-y-1.5">
                      <label class="text-xs font-semibold text-gray-700 uppercase tracking-wide">Last Name</label>
                      <q-input
                        v-model="profileForm.lastName"
                        outlined
                        dense
                        placeholder="Last name"
                        class="bg-gray-50"
                        bg-color="transparent"
                        color="green"
                      />
                    </div>
                  </div>

                  <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div class="space-y-1.5">
                      <label class="text-xs font-semibold text-gray-700 uppercase tracking-wide">Email Address</label>
                      <q-input
                        v-model="profileForm.email"
                        outlined
                        dense
                        type="email"
                        placeholder="Email address"
                        class="bg-gray-50"
                        bg-color="transparent"
                        color="green"
                      >
                         <template v-slot:prepend>
                            <q-icon name="mail_outline" class="text-gray-400" size="18px" />
                         </template>
                      </q-input>
                    </div>
                    <div class="space-y-1.5">
                      <label class="text-xs font-semibold text-gray-700 uppercase tracking-wide">Phone Number</label>
                      <q-input
                        v-model="profileForm.contactNumber"
                        outlined
                        dense
                        mask="(+63) #### - ### - ####"
                        placeholder="(+63) ____ - ___ - ____"
                        class="bg-gray-50"
                        bg-color="transparent"
                        color="green"
                      >
                         <template v-slot:prepend>
                            <q-icon name="phone" class="text-gray-400" size="18px" />
                         </template>
                      </q-input>
                    </div>
                  </div>

                  <div class="pt-2 flex justify-end">
                    <q-btn
                      label="Save Changes"
                      type="submit"
                      color="green"
                      unelevated
                      no-caps
                      :loading="profileLoading"
                      class="px-6 rounded-lg font-semibold"
                    />
                  </div>
                </q-form>
              </div>
            </q-tab-panel>

            <!-- Security Panel -->
            <q-tab-panel name="security" class="p-0 space-y-6">
              <div class="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <div class="flex items-center justify-between mb-6">
                  <div>
                    <h3 class="text-lg font-bold text-gray-900">Change Password</h3>
                    <p class="text-sm text-gray-500 mt-1">Ensure your account is using a long, random password to stay secure.</p>
                  </div>
                </div>

                <q-form @submit.prevent="changePassword" class="max-w-xl space-y-5">
                   <div class="space-y-1.5">
                      <label class="text-xs font-semibold text-gray-700 uppercase tracking-wide">Current Password</label>
                      <q-input
                        v-model="passwordForm.currentPassword"
                        outlined
                        dense
                        :type="showCurrentPassword ? 'text' : 'password'"
                        placeholder="Enter current password"
                         class="bg-gray-50"
                        bg-color="transparent"
                        color="green"
                      >
                        <template v-slot:append>
                          <q-icon
                            :name="showCurrentPassword ? 'visibility' : 'visibility_off'"
                            class="cursor-pointer text-gray-400 hover:text-gray-600"
                            size="18px"
                            @click="showCurrentPassword = !showCurrentPassword"
                          />
                        </template>
                      </q-input>
                   </div>

                   <hr class="border-gray-100 my-4" />

                   <div class="space-y-1.5">
                      <label class="text-xs font-semibold text-gray-700 uppercase tracking-wide">New Password</label>
                      <q-input
                        v-model="passwordForm.newPassword"
                        outlined
                        dense
                        :type="showNewPassword ? 'text' : 'password'"
                        placeholder="Enter new password"
                         class="bg-gray-50"
                        bg-color="transparent"
                        color="green"
                      >
                        <template v-slot:append>
                          <q-icon
                            :name="showNewPassword ? 'visibility' : 'visibility_off'"
                            class="cursor-pointer text-gray-400 hover:text-gray-600"
                            size="18px"
                            @click="showNewPassword = !showNewPassword"
                          />
                        </template>
                      </q-input>
                   </div>

                   <div class="space-y-1.5">
                      <label class="text-xs font-semibold text-gray-700 uppercase tracking-wide">Confirm New Password</label>
                      <q-input
                        v-model="passwordForm.confirmPassword"
                        outlined
                        dense
                        :type="showConfirmPassword ? 'text' : 'password'"
                        placeholder="Confirm new password"
                         class="bg-gray-50"
                        bg-color="transparent"
                        color="green"
                      >
                        <template v-slot:append>
                          <q-icon
                            :name="showConfirmPassword ? 'visibility' : 'visibility_off'"
                            class="cursor-pointer text-gray-400 hover:text-gray-600"
                            size="18px"
                            @click="showConfirmPassword = !showConfirmPassword"
                          />
                        </template>
                      </q-input>
                   </div>

                   <div class="pt-4 flex justify-end">
                    <q-btn
                      label="Update Password"
                      type="submit"
                      color="green"
                      unelevated
                      no-caps
                      :loading="passwordLoading"
                      class="px-6 rounded-lg font-semibold"
                    />
                  </div>
                </q-form>
              </div>
            </q-tab-panel>
          </q-tab-panels>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script>
export default {
  name: 'SettingsIndex',
  data() {
    return {
      activeSection: 'profile',
      profileForm: {
        firstName: '',
        lastName: '',
        email: '',
        contactNumber: ''
      },
      passwordForm: {
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      },
      profileLoading: false,
      passwordLoading: false,
      showCurrentPassword: false,
      showNewPassword: false,
      showConfirmPassword: false
    }
  },
  computed: {
    user() {
      return this.$store.state.auth.user || {};
    },
    userFullName() {
      return `${this.user.first_name || ''} ${this.user.last_name || ''}`.trim() || 'User';
    },
    userEmail() {
      return this.user.email || 'No email associated';
    },
    userType() {
      const type = this.user.user_type || 'user';
      return type.replace('_', ' ');
    },
    userInitials() {
      const first = this.user.first_name?.[0] || '';
      const last = this.user.last_name?.[0] || '';
      return (first + last).toUpperCase() || 'U';
    }
  },
  methods: {
    loadUserData() {
      this.profileForm.firstName = this.user.first_name || '';
      this.profileForm.lastName = this.user.last_name || '';
      this.profileForm.email = this.user.email || '';
      this.profileForm.contactNumber = this.user.contact_number || '';
    },
    async updateProfile() {
      try {
        this.profileLoading = true;
        
        await this.$store.dispatch('auth/updateProfile', {
          firstName: this.profileForm.firstName,
          lastName: this.profileForm.lastName,
          email: this.profileForm.email,
          contactNumber: this.profileForm.contactNumber
        });
        
        this.$q.notify({
          type: 'positive',
          message: 'Profile updated successfully',
          icon: 'check_circle',
          position: 'top',
          classes: 'rounded-borders'
        });
      } catch (err) {
        this.$q.notify({
          type: 'negative',
          message: err.response?.data?.message || 'Failed to update profile',
          icon: 'error',
          position: 'top',
          classes: 'rounded-borders'
        });
      } finally {
        this.profileLoading = false;
      }
    },
    async changePassword() {
      // Basic validation
      if (!this.passwordForm.currentPassword || !this.passwordForm.newPassword || !this.passwordForm.confirmPassword) {
        this.$q.notify({
          type: 'warning',
          message: 'Please fill in all password fields',
          icon: 'warning',
          position: 'top',
          classes: 'rounded-borders'
        });
        return;
      }

      if (this.passwordForm.newPassword.length < 6) {
        this.$q.notify({
          type: 'warning',
          message: 'New password must be at least 6 characters',
          icon: 'warning',
          position: 'top',
          classes: 'rounded-borders'
        });
        return;
      }

      if (this.passwordForm.newPassword !== this.passwordForm.confirmPassword) {
        this.$q.notify({
          type: 'warning',
          message: 'New passwords do not match',
          icon: 'warning',
          position: 'top',
          classes: 'rounded-borders'
        });
        return;
      }

      try {
        this.passwordLoading = true;
        
        await this.$store.dispatch('auth/changePassword', {
          currentPassword: this.passwordForm.currentPassword,
          newPassword: this.passwordForm.newPassword,
          newPasswordConfirmation: this.passwordForm.confirmPassword
        });
        
        this.$q.notify({
          type: 'positive',
          message: 'Password changed successfully',
          icon: 'check_circle',
          position: 'top',
          classes: 'rounded-borders'
        });
        
        // Clear form
        this.passwordForm = {
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        };
      } catch (err) {
        this.$q.notify({
          type: 'negative',
          message: err.response?.data?.message || 'Failed to change password. Check your current password.',
          icon: 'error',
          position: 'top',
          classes: 'rounded-borders'
        });
      } finally {
        this.passwordLoading = false;
      }
    }
  },
  mounted() {
    this.loadUserData();
  }
}
</script>

<style scoped>
/* Utility classes from Tailwind handle most styling */
</style>