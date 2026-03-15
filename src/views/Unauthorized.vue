<template>
  <q-page class="flex flex-center bg-gray-50 min-h-screen">
    <div class="text-center max-w-lg p-6 bg-white rounded-2xl shadow-sm border border-gray-100">
      <div class="mb-6 flex justify-center">
        <div class="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center">
          <q-icon name="do_not_disturb_alt" size="32px" />
        </div>
      </div>
      <h3 class="text-2xl font-bold text-gray-800 mb-2">Access Denied</h3>
      <p class="text-gray-600 mb-6 text-sm">
        You are not authorized for this page. If you are sure this is a bug, please contact admin.
      </p>
      <q-btn
        unelevated
        color="primary"
        label="Go Back to Home"
        no-caps
        class="px-6 py-2 rounded-xl text-sm font-semibold"
        @click="goHome"
      />
    </div>
  </q-page>
</template>

<script>
export default {
  name: "Unauthorized",
  methods: {
    goHome() {
      const userType = localStorage.getItem('user_type')?.toLowerCase();
      if (userType === 'lgu' || userType === 'lgu_user') {
        this.$router.push('/main/users');
      } else if (userType === 'patron' || userType === 'kiosk_user') {
        this.$router.push('/patron');
      } else {
        this.$router.push('/main/dashboard');
      }
    }
  }
};
</script>
