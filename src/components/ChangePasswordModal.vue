<template>
  <q-dialog v-model="showDialog" persistent>
    <q-card style="min-width: 450px; max-width: 500px; background-color: #142221;" class="text-white">
      <q-card-section class="row items-center q-pb-none">
        <div class="text-h6">First Time Login</div>
      </q-card-section>

      <q-card-section>
        <p class="text-grey-5 q-mb-md">
          Please change your default password to continue. This is required for security purposes.
        </p>

        <q-form @submit.prevent="handleSubmit" ref="form">
          <!-- Current Password -->
          <q-input
            v-model="form.currentPassword"
            label="Current Password *"
            outlined
            dense
            dark
            color="green"
            class="q-mb-md"
            :type="showCurrentPassword ? 'text' : 'password'"
            :rules="[val => !!val || 'Current password is required']"
          >
            <template v-slot:prepend>
              <q-icon name="lock" color="green" />
            </template>
            <template v-slot:append>
              <q-icon
                :name="showCurrentPassword ? 'visibility' : 'visibility_off'"
                class="cursor-pointer"
                @click="showCurrentPassword = !showCurrentPassword"
              />
            </template>
          </q-input>

          <!-- New Password -->
          <q-input
            v-model="form.newPassword"
            label="New Password *"
            outlined
            dense
            dark
            color="green"
            class="q-mb-md"
            :type="showNewPassword ? 'text' : 'password'"
            :rules="[
              val => !!val || 'New password is required',
              val => val.length >= 8 || 'Password must be at least 8 characters',
              val => val !== form.currentPassword || 'New password must be different from current password'
            ]"
          >
            <template v-slot:prepend>
              <q-icon name="lock" color="green" />
            </template>
            <template v-slot:append>
              <q-icon
                :name="showNewPassword ? 'visibility' : 'visibility_off'"
                class="cursor-pointer"
                @click="showNewPassword = !showNewPassword"
              />
            </template>
          </q-input>

          <!-- Confirm Password -->
          <q-input
            v-model="form.confirmPassword"
            label="Confirm Password *"
            outlined
            dense
            dark
            color="green"
            class="q-mb-md"
            :type="showConfirmPassword ? 'text' : 'password'"
            :rules="[
              val => !!val || 'Please confirm your password',
              val => val === form.newPassword || 'Passwords do not match'
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

          <!-- Password Requirements -->
          <q-banner dense class="bg-blue-grey-9 text-white q-mb-md" rounded>
            <template v-slot:avatar>
              <q-icon name="info" color="blue" />
            </template>
            <div class="text-caption">
              <strong>Password Requirements:</strong>
              <ul class="q-ml-md q-my-xs" style="padding-left: 16px;">
                <li :class="form.newPassword.length >= 8 ? 'text-green' : ''">
                  At least 8 characters
                </li>
                <li :class="form.newPassword && form.newPassword !== form.currentPassword ? 'text-green' : ''">
                  Different from current password
                </li>
              </ul>
            </div>
          </q-banner>

          <!-- Actions -->
          <div class="row q-gutter-sm justify-end">
            <q-btn
              label="Change Password"
              type="submit"
              color="green"
              unelevated
              :loading="loading"
              class="q-px-lg"
            >
              <template v-slot:loading>
                <q-spinner color="white" size="20px" />
              </template>
            </q-btn>
          </div>
        </q-form>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script>
export default {
  name: 'ChangePasswordModal',
  props: {
    value: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      showDialog: this.value,
      form: {
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      },
      showCurrentPassword: false,
      showNewPassword: false,
      showConfirmPassword: false,
      loading: false
    };
  },
  watch: {
    value(val) {
      this.showDialog = val;
    },
    showDialog(val) {
      this.$emit('input', val);
    }
  },
  methods: {
    async handleSubmit() {
      const isValid = await this.$refs.form.validate();
      if (!isValid) return;

      try {
        this.loading = true;
        
        await this.$store.dispatch('auth/changePassword', {
          currentPassword: this.form.currentPassword,
          newPassword: this.form.newPassword,
          newPasswordConfirmation: this.form.confirmPassword
        });

        this.$q.notify({
          type: 'positive',
          message: 'Password changed successfully! Please login with your new password.',
          icon: 'check_circle',
          position: 'top',
          timeout: 3000
        });

        // Close modal
        this.showDialog = false;
        
        // Redirect to login after a short delay
        setTimeout(() => {
          this.$router.push('/login');
        }, 1000);

      } catch (error) {
        const errorMessage = error.response?.data?.message || 
                           error.response?.data?.errors?.new_password?.[0] ||
                           'Failed to change password. Please try again.';
        
        this.$q.notify({
          type: 'negative',
          message: errorMessage,
          icon: 'error',
          position: 'top',
          timeout: 4000
        });
      } finally {
        this.loading = false;
      }
    }
  }
};
</script>

<style scoped>
.q-banner ul {
  margin: 4px 0;
}

.q-banner li {
  font-size: 12px;
  line-height: 1.6;
}
</style>
