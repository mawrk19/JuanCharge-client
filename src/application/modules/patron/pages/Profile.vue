<template>
  <q-page class="profile-page q-pa-md">
    <!-- Page Header -->
    <!-- <div class="page-header q-mb-lg">
      <div class="text-h4 text-white text-weight-bold">
        <q-icon name="account_circle" color="green" size="40px" class="q-mr-md" />
        My Profile
      </div>
      <div class="text-subtitle1 text-grey-5 q-mt-sm">
        Manage your profile and account settings
      </div>
    </div> -->

    <!-- Tabs -->
    <q-card class="profile-card">
      <q-tabs
        v-model="tab"
        dense
        class="text-grey-5"
        active-color="green"
        indicator-color="green"
        align="left"
      >
        <q-tab name="profile" icon="person" label="Profile" />
        <q-tab name="settings" icon="settings" label="Account Settings" />
      </q-tabs>

      <q-separator dark />

      <q-tab-panels v-model="tab" animated class="bg-transparent">
        <!-- Profile Tab -->
        <q-tab-panel name="profile">
          <div class="row q-col-gutter-md">
            <!-- Profile Header Card (Facebook-style) -->
            <div class="col-12">
              <q-card class="profile-header-card">
                <!-- Cover Photo -->
                <div class="cover-photo">
                  <div class="cover-overlay"></div>
                </div>

                <!-- Profile Info Section -->
                <q-card-section class="profile-info-section">
                  <div class="profile-header-content">
                    <!-- Avatar -->
                    <q-avatar size="168px" class="profile-avatar">
                      <img v-if="userAvatar" :src="userAvatar" />
                      <div v-else class="avatar-placeholder">
                        <span class="avatar-initials">{{ userInitials }}</span>
                      </div>
                    </q-avatar>

                    <!-- Name and Info -->
                    <div class="profile-details">
                      <div class="profile-name-section">
                        <h2 class="profile-name">{{ userFullName }}</h2>
                        <div class="profile-subtitle text-grey-5">Kiosk User</div>
                      </div>
                    </div>
                  </div>
                </q-card-section>

                <q-separator dark />

                <!-- Profile Navigation Tabs -->
                <q-card-section class="profile-nav-section q-pa-none">
                  <div class="profile-nav">
                    <div class="nav-item active">
                      <q-icon name="info" size="20px" />
                      <span>About</span>
                    </div>
                  </div>
                </q-card-section>
              </q-card>
            </div>

            <!-- About Section -->
            <div class="col-12">
              <q-card class="about-card">
                <q-card-section>
                  <div class="section-header">
                    <h3 class="section-title">
                      <q-icon name="info" color="blue" size="24px" class="q-mr-sm" />
                      About
                    </h3>
                  </div>

                  <div class="info-list">
                    <div class="info-item">
                      <div class="info-icon">
                        <q-icon name="person" color="grey-5" size="24px" />
                      </div>
                      <div class="info-content">
                        <div class="info-label">Full Name</div>
                        <div class="info-text">{{ profileForm.firstName }} {{ profileForm.lastName }}</div>
                      </div>
                    </div>

                    <div class="info-item">
                      <div class="info-icon">
                        <q-icon name="email" color="grey-5" size="24px" />
                      </div>
                      <div class="info-content">
                        <div class="info-label">Email Address</div>
                        <div class="info-text">{{ profileForm.email || 'Not provided' }}</div>
                      </div>
                    </div>

                    <div class="info-item">
                      <div class="info-icon">
                        <q-icon name="phone" color="grey-5" size="24px" />
                      </div>
                      <div class="info-content">
                        <div class="info-label">Contact Number</div>
                        <div class="info-text">{{ profileForm.contactNumber || 'Not provided' }}</div>
                      </div>
                    </div>

                    <div class="info-item">
                      <div class="info-icon">
                        <q-icon name="badge" color="grey-5" size="24px" />
                      </div>
                      <div class="info-content">
                        <div class="info-label">User Type</div>
                        <div class="info-text">Kiosk User</div>
                      </div>
                    </div>
                  </div>
                </q-card-section>
              </q-card>
            </div>

            <!-- Achievements Section -->
            <div class="col-12">
              <q-card class="achievements-preview-card">
                <q-card-section>
                  <div class="row items-center justify-between q-mb-md">
                    <div class="text-h6 text-white">
                      <q-icon name="emoji_events" color="amber" class="q-mr-sm" />
                      Recent Achievements
                    </div>
                    <q-btn
                      flat
                      dense
                      color="green"
                      label="View All"
                      icon-right="arrow_forward"
                      @click="goToAchievements"
                    />
                  </div>

                  <div class="text-subtitle2 text-grey-5 q-mb-md">
                    {{ unlockedAchievements }}/{{ totalAchievements }} Unlocked
                  </div>

                  <q-linear-progress 
                    :value="unlockedAchievements / totalAchievements" 
                    color="amber"
                    size="12px"
                    rounded
                    class="q-mb-lg"
                  />

                  <!-- Achievement Grid -->
                  <div class="row q-col-gutter-md">
                    <div 
                      v-for="achievement in recentAchievements" 
                      :key="achievement.id"
                      class="col-6 col-sm-4 col-md-2"
                    >
                      <q-card 
                        class="achievement-card"
                        :class="{ 'unlocked': achievement.unlocked }"
                      >
                        <q-card-section class="text-center q-pa-md">
                          <q-avatar 
                            size="60px" 
                            :color="achievement.unlocked ? achievement.color : 'grey-8'"
                            class="q-mb-sm"
                          >
                            <q-icon :name="achievement.icon" size="32px" color="white" />
                          </q-avatar>
                          
                          <div class="text-subtitle2 text-white q-mb-xs">{{ achievement.name }}</div>
                          
                          <div v-if="achievement.unlocked" class="text-caption text-green">
                            <q-icon name="check_circle" size="14px" />
                            Unlocked
                          </div>
                          <div v-else class="text-caption text-grey-5">
                            {{ achievement.progress }}
                          </div>

                          <div class="text-caption text-amber q-mt-xs">
                            +{{ achievement.points }} pts
                          </div>
                        </q-card-section>
                      </q-card>
                    </div>
                  </div>
                </q-card-section>
              </q-card>
            </div>
          </div>
        </q-tab-panel>

        <!-- Account Settings Tab -->
        <q-tab-panel name="settings">
          <!-- Settings Header -->
          <div class="settings-header q-mb-lg">
            <div class="text-h5 text-white text-weight-bold">Account Settings</div>
            <div class="text-subtitle2 text-grey-5">Manage your personal information and security</div>
          </div>

          <!-- Profile Information Section -->
          <q-card class="settings-section q-mb-lg">
            <q-card-section>
              <div class="section-title q-mb-md">
                <q-icon name="badge" color="blue" size="24px" class="q-mr-sm" />
                <span class="text-h6 text-white">Profile Information</span>
              </div>

              <q-form @submit="updateProfile">
                <div class="row q-col-gutter-md">
                  <div class="col-12 col-md-6">
                    <q-input
                      v-model="profileForm.firstName"
                      label="First Name"
                      filled
                      dark
                      color="green"
                      :rules="[val => !!val || 'First name is required']"
                    >
                      <template v-slot:prepend>
                        <q-icon name="person" />
                      </template>
                    </q-input>
                  </div>

                  <div class="col-12 col-md-6">
                    <q-input
                      v-model="profileForm.lastName"
                      label="Last Name"
                      filled
                      dark
                      color="green"
                      :rules="[val => !!val || 'Last name is required']"
                    >
                      <template v-slot:prepend>
                        <q-icon name="person" />
                      </template>
                    </q-input>
                  </div>

                  <div class="col-12 col-md-6">
                    <q-input
                      v-model="profileForm.email"
                      label="Email Address"
                      type="email"
                      filled
                      dark
                      color="green"
                      :rules="[
                        val => !!val || 'Email is required',
                        val => /.+@.+\..+/.test(val) || 'Please enter a valid email'
                      ]"
                    >
                      <template v-slot:prepend>
                        <q-icon name="email" />
                      </template>
                    </q-input>
                  </div>

                  <div class="col-12 col-md-6">
                    <q-input
                      v-model="profileForm.contactNumber"
                      label="Contact Number"
                      filled
                      dark
                      color="green"
                      mask="####-###-####"
                      hint="Format: 0912-345-6789"
                    >
                      <template v-slot:prepend>
                        <q-icon name="phone" />
                      </template>
                    </q-input>
                  </div>

                  <div class="col-12">
                    <div class="row justify-end q-gutter-sm q-mt-md">
                      <q-btn
                        label="Reset"
                        flat
                        color="grey-5"
                        @click="resetProfileForm"
                        class="btn-action"
                      />
                      <q-btn
                        label="Save Changes"
                        type="submit"
                        color="green"
                        unelevated
                        :loading="profileLoading"
                        class="btn-action"
                      >
                        <template v-slot:loading>
                          <q-spinner-dots />
                        </template>
                      </q-btn>
                    </div>
                  </div>
                </div>
              </q-form>
            </q-card-section>
          </q-card>

          <!-- Security Section -->
          <q-card class="settings-section">
            <q-card-section>
              <div class="section-title q-mb-md">
                <q-icon name="security" color="amber" size="24px" class="q-mr-sm" />
                <span class="text-h6 text-white">Security</span>
              </div>

              <q-form @submit="changePassword">
                <div class="row q-col-gutter-md">
                  <div class="col-12">
                    <q-input
                      v-model="passwordForm.currentPassword"
                      label="Current Password"
                      :type="showCurrentPassword ? 'text' : 'password'"
                      filled
                      dark
                      color="green"
                      :rules="[val => !!val || 'Current password is required']"
                    >
                      <template v-slot:prepend>
                        <q-icon name="lock" />
                      </template>
                      <template v-slot:append>
                        <q-icon
                          :name="showCurrentPassword ? 'visibility_off' : 'visibility'"
                          class="cursor-pointer"
                          @click="showCurrentPassword = !showCurrentPassword"
                        />
                      </template>
                    </q-input>
                  </div>

                  <div class="col-12 col-md-6">
                    <q-input
                      v-model="passwordForm.newPassword"
                      label="New Password"
                      :type="showNewPassword ? 'text' : 'password'"
                      filled
                      dark
                      color="green"
                      :rules="[
                        val => !!val || 'New password is required',
                        val => val.length >= 8 || 'Password must be at least 8 characters'
                      ]"
                    >
                      <template v-slot:prepend>
                        <q-icon name="lock" />
                      </template>
                      <template v-slot:append>
                        <q-icon
                          :name="showNewPassword ? 'visibility_off' : 'visibility'"
                          class="cursor-pointer"
                          @click="showNewPassword = !showNewPassword"
                        />
                      </template>
                    </q-input>
                  </div>

                  <div class="col-12 col-md-6">
                    <q-input
                      v-model="passwordForm.confirmPassword"
                      label="Confirm New Password"
                      :type="showConfirmPassword ? 'text' : 'password'"
                      filled
                      dark
                      color="green"
                      :rules="[
                        val => !!val || 'Please confirm your password',
                        val => val === passwordForm.newPassword || 'Passwords do not match'
                      ]"
                    >
                      <template v-slot:prepend>
                        <q-icon name="lock" />
                      </template>
                      <template v-slot:append>
                        <q-icon
                          :name="showConfirmPassword ? 'visibility_off' : 'visibility'"
                          class="cursor-pointer"
                          @click="showConfirmPassword = !showConfirmPassword"
                        />
                      </template>
                    </q-input>
                  </div>

                  <div class="col-12">
                    <q-banner class="password-requirements" rounded dense>
                      <div class="row items-center">
                        <q-icon name="info" color="blue" size="20px" class="q-mr-sm" />
                        <div class="text-caption">
                          <strong>Password Requirements:</strong> Must be at least 8 characters long and contain a mix of letters and numbers for better security.
                        </div>
                      </div>
                    </q-banner>
                  </div>

                  <div class="col-12">
                    <div class="row justify-end q-gutter-sm q-mt-md">
                      <q-btn
                        label="Cancel"
                        flat
                        color="grey-5"
                        @click="resetPasswordForm"
                        class="btn-action"
                      />
                      <q-btn
                        label="Update Password"
                        type="submit"
                        color="amber"
                        unelevated
                        :loading="passwordLoading"
                        class="btn-action"
                      >
                        <template v-slot:loading>
                          <q-spinner-dots />
                        </template>
                      </q-btn>
                    </div>
                  </div>
                </div>
              </q-form>
            </q-card-section>
          </q-card>
        </q-tab-panel>
      </q-tab-panels>
    </q-card>
  </q-page>
</template>

<script>
export default {
  name: "PatronProfile",
  data() {
    return {
      tab: 'profile',
      
      // User stats
      unlockedAchievements: 2,
      totalAchievements: 10,
      userAvatar: null,

      // Profile form
      profileForm: {
        firstName: '',
        lastName: '',
        email: '',
        contactNumber: ''
      },
      profileLoading: false,

      // Password form
      passwordForm: {
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      },
      passwordLoading: false,
      showCurrentPassword: false,
      showNewPassword: false,
      showConfirmPassword: false,

      // Recent achievements
      recentAchievements: [
        { 
          id: 1, 
          name: 'Account Created', 
          icon: 'account_circle',
          color: 'blue',
          unlocked: true,
          points: 5,
          progress: ''
        },
        { 
          id: 2, 
          name: 'First Charge', 
          icon: 'bolt',
          color: 'green',
          unlocked: true,
          points: 10,
          progress: ''
        },
        { 
          id: 3, 
          name: '10 Charges', 
          icon: 'battery_charging_full',
          color: 'purple',
          unlocked: false,
          points: 25,
          progress: '6/10 charges'
        },
        { 
          id: 4, 
          name: 'Eco Warrior', 
          icon: 'eco',
          color: 'teal',
          unlocked: false,
          points: 50,
          progress: '120/500 kWh'
        },
        { 
          id: 5, 
          name: 'Point Collector', 
          icon: 'stars',
          color: 'amber',
          unlocked: false,
          points: 75,
          progress: '150/500 points'
        },
        { 
          id: 6, 
          name: 'Station Explorer', 
          icon: 'explore',
          color: 'cyan',
          unlocked: false,
          points: 30,
          progress: '2/5 stations'
        }
      ]
    };
  },

  computed: {
    userFullName() {
      const user = this.$store.state.auth?.user;
      if (user?.first_name && user?.last_name) {
        return `${user.first_name} ${user.last_name}`;
      }
      return 'Kiosk User';
    },

    userEmail() {
      return this.$store.state.auth?.user?.email || 'user@example.com';
    },

    userInitials() {
      const user = this.$store.state.auth?.user;
      if (user?.first_name && user?.last_name) {
        return `${user.first_name[0]}${user.last_name[0]}`.toUpperCase();
      }
      return 'KU';
    }
  },

  mounted() {
    this.loadUserData();
  },

  methods: {
    loadUserData() {
      const user = this.$store.state.auth?.user;
      if (user) {
        this.profileForm.firstName = user.first_name || '';
        this.profileForm.lastName = user.last_name || '';
        this.profileForm.email = user.email || '';
        this.profileForm.contactNumber = user.contact_number || '';
      }
    },

    async updateProfile() {
      this.profileLoading = true;

      try {
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
          position: 'top'
        });
      } catch (error) {
        this.$q.notify({
          type: 'negative',
          message: 'Failed to update profile',
          caption: error.response?.data?.message || error.message,
          icon: 'error',
          position: 'top'
        });
      } finally {
        this.profileLoading = false;
      }
    },

    async changePassword() {
      this.passwordLoading = true;

      try {
        await this.$store.dispatch('auth/changePassword', {
          currentPassword: this.passwordForm.currentPassword,
          newPassword: this.passwordForm.newPassword,
          newPasswordConfirmation: this.passwordForm.confirmPassword
        });

        this.$q.notify({
          type: 'positive',
          message: 'Password changed successfully. Please login again.',
          icon: 'check_circle',
          position: 'top'
        });

        this.resetPasswordForm();

        // Redirect to login after successful password change
        setTimeout(() => {
          this.$router.push('/login');
        }, 1500);
      } catch (error) {
        this.$q.notify({
          type: 'negative',
          message: 'Failed to change password',
          caption: error.response?.data?.message || error.message,
          icon: 'error',
          position: 'top'
        });
      } finally {
        this.passwordLoading = false;
      }
    },

    resetProfileForm() {
      this.loadUserData();
    },

    resetPasswordForm() {
      this.passwordForm.currentPassword = '';
      this.passwordForm.newPassword = '';
      this.passwordForm.confirmPassword = '';
    },

    goToAchievements() {
      this.$router.push('/patron/achievements');
    }
  }
};
</script>

<style scoped>
.profile-page {
  background: linear-gradient(135deg, #0a0f0d 0%, #142221 50%, #1a2c28 100%);
  min-height: calc(100vh - 50px);
}

.page-header {
  padding: 1rem 0;
}

.profile-card {
  background: rgba(30, 30, 30, 0.8);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(76, 175, 80, 0.2);
  border-radius: 12px;
}

/* Facebook-style Profile Header */
.profile-header-card {
  background: rgba(40, 40, 40, 0.95);
  border: 1px solid rgba(76, 175, 80, 0.2);
  border-radius: 12px;
  overflow: hidden;
}

.cover-photo {
  height: 300px;
  background: linear-gradient(135deg, #1a3a2e 0%, #2d5a47 50%, #4a7c59 100%);
  position: relative;
  overflow: hidden;
}

.cover-photo::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: 
    radial-gradient(circle at 20% 50%, rgba(76, 175, 80, 0.3) 0%, transparent 50%),
    radial-gradient(circle at 80% 50%, rgba(76, 175, 80, 0.2) 0%, transparent 50%);
}

.cover-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 100px;
  background: linear-gradient(to top, rgba(40, 40, 40, 0.95) 0%, transparent 100%);
}

.profile-info-section {
  margin-top: -84px;
  padding: 0 24px 24px 24px !important;
}

.profile-header-content {
  display: flex;
  align-items: flex-end;
  gap: 24px;
}

.profile-avatar {
  border: 5px solid rgba(40, 40, 40, 0.95);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);
  flex-shrink: 0;
}

.avatar-placeholder {
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #4caf50 0%, #66bb6a 100%);
  display: flex;
  align-items: center;
  justify-content: center;
}

.avatar-initials {
  font-size: 64px;
  font-weight: 700;
  color: white;
  text-transform: uppercase;
}

.profile-details {
  flex: 1;
  padding-bottom: 8px;
}

.profile-name-section {
  margin-bottom: 8px;
}

.profile-name {
  font-size: 32px;
  font-weight: 700;
  color: white;
  margin: 0;
  line-height: 1.2;
}

.profile-subtitle {
  font-size: 15px;
  margin-top: 4px;
}

/* Profile Navigation */
.profile-nav-section {
  border-top: 1px solid rgba(76, 175, 80, 0.15);
}

.profile-nav {
  display: flex;
  padding: 0 24px;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 16px 16px;
  color: rgba(255, 255, 255, 0.6);
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  border-bottom: 3px solid transparent;
  transition: all 0.2s ease;
  position: relative;
  top: 1px;
}

.nav-item:hover {
  background: rgba(76, 175, 80, 0.1);
  color: rgba(255, 255, 255, 0.9);
}

.nav-item.active {
  color: #4caf50;
  border-bottom-color: #4caf50;
}

/* About Card */
.about-card {
  background: rgba(40, 40, 40, 0.95);
  border: 1px solid rgba(76, 175, 80, 0.2);
  border-radius: 12px;
}

.section-header {
  margin-bottom: 16px;
}

.section-title {
  display: flex;
  align-items: center;
  font-size: 20px;
  font-weight: 700;
  color: white;
  margin: 0;
}

.info-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.info-item {
  display: flex;
  align-items: flex-start;
  gap: 16px;
  padding: 12px 0;
  transition: all 0.2s ease;
}

.info-item:hover {
  background: rgba(76, 175, 80, 0.05);
  margin: 0 -12px;
  padding: 12px 12px;
  border-radius: 8px;
}

.info-icon {
  flex-shrink: 0;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(76, 175, 80, 0.1);
  border-radius: 50%;
}

.info-content {
  flex: 1;
  padding-top: 2px;
}

.info-label {
  font-size: 13px;
  color: rgba(255, 255, 255, 0.5);
  font-weight: 500;
  margin-bottom: 4px;
}

.info-text {
  font-size: 15px;
  color: white;
  font-weight: 400;
  word-break: break-word;
}

/* Achievements Preview Card */
.achievements-preview-card {
  background: rgba(40, 40, 40, 0.8);
  border: 1px solid rgba(76, 175, 80, 0.2);
  border-radius: 12px;
  height: 100%;
}

.achievement-card {
  background: rgba(30, 30, 30, 0.8);
  border: 1px solid rgba(76, 175, 80, 0.2);
  border-radius: 8px;
  transition: all 0.3s ease;
  cursor: pointer;
}

.achievement-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);
  border-color: rgba(76, 175, 80, 0.4);
}

.achievement-card.unlocked {
  border-color: rgba(76, 175, 80, 0.5);
  background: rgba(40, 40, 40, 0.9);
}

/* Settings Card */
.settings-card {
  background: rgba(40, 40, 40, 0.8);
  border: 1px solid rgba(76, 175, 80, 0.2);
  border-radius: 12px;
}

/* Settings Tab Styles */
.settings-header {
  padding: 0 0 1rem 0;
}

.settings-section {
  background: rgba(40, 40, 40, 0.8);
  border: 1px solid rgba(76, 175, 80, 0.2);
  border-radius: 12px;
  transition: all 0.3s ease;
}

.settings-section:hover {
  border-color: rgba(76, 175, 80, 0.3);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
}

.section-title {
  display: flex;
  align-items: center;
  padding-bottom: 1rem;
  border-bottom: 1px solid rgba(76, 175, 80, 0.2);
}

.password-requirements {
  background: rgba(33, 150, 243, 0.1);
  border: 1px solid rgba(33, 150, 243, 0.3);
}

.btn-action {
  min-width: 120px;
  padding: 8px 24px;
  font-weight: 500;
}

/* Form Styles */
.q-field--filled .q-field__control {
  background: rgba(30, 30, 30, 0.8);
}

.q-field--filled .q-field__control:before {
  border-bottom: 1px solid rgba(76, 175, 80, 0.2);
}

.q-field--filled .q-field__control:hover:before {
  border-bottom: 1px solid rgba(76, 175, 80, 0.4);
}
</style>
