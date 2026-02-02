<template>
  <div class="space-y-6">
    <!-- Profile Header Card -->
    <div
      class="bg-white rounded-xl p-6 shadow-sm border border-gray-100 flex items-center gap-6"
    >
      <q-avatar
        size="80px"
        class="bg-green-50 text-green-600 font-bold text-2xl shadow-sm border-2 border-white ring-2 ring-green-100"
      >
        {{ userInitials }}
      </q-avatar>
      <div>
        <h2 class="text-xl font-bold text-gray-900">{{ userFullName }}</h2>
        <p class="text-gray-500 text-sm">{{ userEmail }}</p>
        <div class="mt-2 flex items-center gap-2">
          <span
            class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-50 text-green-700 capitalize"
          >
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
            <label
              class="text-xs font-semibold text-gray-700 uppercase tracking-wide"
              >First Name</label
            >
            <q-input
              v-model="form.firstName"
              outlined
              dense
              placeholder="First name"
              class="bg-gray-50"
              bg-color="transparent"
              color="green"
            />
          </div>
          <div class="space-y-1.5">
            <label
              class="text-xs font-semibold text-gray-700 uppercase tracking-wide"
              >Last Name</label
            >
            <q-input
              v-model="form.lastName"
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
            <label
              class="text-xs font-semibold text-gray-700 uppercase tracking-wide"
              >Email Address</label
            >
            <q-input
              v-model="form.email"
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
            <label
              class="text-xs font-semibold text-gray-700 uppercase tracking-wide"
              >Phone Number</label
            >
            <q-input
              v-model="form.contactNumber"
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
  name: "ProfileTab",
  data() {
    return {
      form: {
        firstName: "",
        lastName: "",
        email: "",
        contactNumber: "",
      },
      loading: false,
    };
  },
  computed: {
    user() {
      return this.$store.state.auth.user || {};
    },
    userFullName() {
      return (
        `${this.user.first_name || ""} ${this.user.last_name || ""}`.trim() ||
        "User"
      );
    },
    userEmail() {
      return this.user.email || "No email associated";
    },
    userType() {
      const type = this.user.user_type || "user";
      return type.replace("_", " ");
    },
    userInitials() {
      const first = this.user.first_name?.[0] || "";
      const last = this.user.last_name?.[0] || "";
      return (first + last).toUpperCase() || "U";
    },
  },
  methods: {
    loadUserData() {
      this.form.firstName = this.user.first_name || "";
      this.form.lastName = this.user.last_name || "";
      this.form.email = this.user.email || "";
      this.form.contactNumber = this.user.contact_number || "";
    },
    async updateProfile() {
      try {
        this.loading = true;

        await this.$store.dispatch("auth/updateProfile", {
          firstName: this.form.firstName,
          lastName: this.form.lastName,
          email: this.form.email,
          contactNumber: this.form.contactNumber,
        });

        this.$q.notify({
          type: "positive",
          message: "Profile updated successfully",
          icon: "check_circle",
          position: "top",
          classes: "rounded-borders",
        });
      } catch (err) {
        this.$q.notify({
          type: "negative",
          message: err.response?.data?.message || "Failed to update profile",
          icon: "error",
          position: "top",
          classes: "rounded-borders",
        });
      } finally {
        this.loading = false;
      }
    },
  },
  mounted() {
    this.loadUserData();
  },
};
</script>
