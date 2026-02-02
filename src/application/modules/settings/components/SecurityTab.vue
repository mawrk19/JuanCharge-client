<template>
  <div class="space-y-6">
    <div class="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
      <div class="flex items-center justify-between mb-6">
        <div>
          <h3 class="text-lg font-bold text-gray-900">Change Password</h3>
          <p class="text-sm text-gray-500 mt-1">
            Ensure your account is using a long, random password to stay secure.
          </p>
        </div>
      </div>

      <q-form @submit.prevent="changePassword" class="max-w-xl space-y-5">
        <div class="space-y-1.5">
          <label
            class="text-xs font-semibold text-gray-700 uppercase tracking-wide"
            >Current Password</label
          >
          <q-input
            v-model="form.currentPassword"
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
          <label
            class="text-xs font-semibold text-gray-700 uppercase tracking-wide"
            >New Password</label
          >
          <q-input
            v-model="form.newPassword"
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
          <label
            class="text-xs font-semibold text-gray-700 uppercase tracking-wide"
            >Confirm New Password</label
          >
          <q-input
            v-model="form.confirmPassword"
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
            :loading="loading"
            class="px-6 rounded-lg font-semibold"
          />
        </div>
      </q-form>
    </div>
  </div>
</template>

<script>
export default {
  name: "SecurityTab",
  data() {
    return {
      form: {
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      },
      loading: false,
      showCurrentPassword: false,
      showNewPassword: false,
      showConfirmPassword: false,
    };
  },
  methods: {
    async changePassword() {
      // Basic validation
      if (
        !this.form.currentPassword ||
        !this.form.newPassword ||
        !this.form.confirmPassword
      ) {
        this.$q.notify({
          type: "warning",
          message: "Please fill in all password fields",
          icon: "warning",
          position: "top",
          classes: "rounded-borders",
        });
        return;
      }

      if (this.form.newPassword.length < 6) {
        this.$q.notify({
          type: "warning",
          message: "New password must be at least 6 characters",
          icon: "warning",
          position: "top",
          classes: "rounded-borders",
        });
        return;
      }

      if (this.form.newPassword !== this.form.confirmPassword) {
        this.$q.notify({
          type: "warning",
          message: "New passwords do not match",
          icon: "warning",
          position: "top",
          classes: "rounded-borders",
        });
        return;
      }

      try {
        this.loading = true;

        await this.$store.dispatch("auth/changePassword", {
          currentPassword: this.form.currentPassword,
          newPassword: this.form.newPassword,
          newPasswordConfirmation: this.form.confirmPassword,
        });

        this.$q.notify({
          type: "positive",
          message: "Password changed successfully",
          icon: "check_circle",
          position: "top",
          classes: "rounded-borders",
        });

        // Clear form
        this.form = {
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        };
      } catch (err) {
        this.$q.notify({
          type: "negative",
          message:
            err.response?.data?.message ||
            "Failed to change password. Check your current password.",
          icon: "error",
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
