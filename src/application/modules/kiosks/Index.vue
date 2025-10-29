<template>
  <q-page class="users-page q-pa-lg">
    <!-- Animated Background -->
    <div class="animated-bg">
      <div class="blob blob-1"></div>
      <div class="blob blob-2"></div>
      <div class="blob blob-3"></div>
    </div>

    <!-- Page Header -->
    <div class="page-header q-mb-lg">
      <div class="text-h4 text-white text-weight-bold q-mb-xs">
        Kiosk Management
      </div>
      <div class="text-subtitle1 text-grey-5">
        Manage kiosks
      </div>
    </div>

    <!-- Kiosks Table Card -->
    <q-card class="table-card">
      <q-card-section class="q-pa-none">
        <q-table
          :data="kiosks"
          :columns="columns"
          row-key="id"
          :pagination.sync="pagination"
          :filter="filter"
          :loading="isLoading"
          bordered
          class="modern-table"
        >
          <!-- No Data Slot -->
          <template v-slot:no-data>
            <div class="full-width row flex-center text-grey-5 q-gutter-sm q-py-xl">
              <q-icon size="2em" name="warning" />
              <span>No users found</span>
            </div>
          </template>

          <!-- Table Header Slot -->
          <template v-slot:top>
              <div class="row full-width items-center q-pa-md">
                <div class="text-h6 text-white">Kiosks List</div>
                <q-space />
                <q-btn
                  color="green"
                  icon="add"
                  label="Add Kiosk"
                  @click="openCreateDialog"
                  class="modern-btn q-mr-md"
                />
                <q-input
                  v-model="filter"
                  outlined
                  dense
                  placeholder="Search users..."
                  dark
                  class="search-input"
                  style="min-width: 300px;"
                >
                  <template v-slot:prepend>
                    <q-icon name="search" />
                  </template>
                  <template v-slot:append>
                    <q-icon v-if="filter" name="close" @click="filter = ''" class="cursor-pointer" />
                  </template>
                </q-input>
              </div>
          </template>

          <!-- ID Column -->
          <template v-slot:body-cell-id="props">
            <q-td :props="props">
              <q-badge color="green" outline>
                #{{ props.row.id }}
              </q-badge>
            </q-td>
          </template>

          <!-- Name Column -->
          <template v-slot:body-cell-name="props">
            <q-td :props="props">
              <div class="row items-center no-wrap">
                <q-avatar size="32px" color="green" text-color="white" class="q-mr-sm">
                  {{ getInitials(props.row.name) }}
                </q-avatar>
                <span class="text-white text-weight-medium">{{ props.row.name }}</span>
              </div>
            </q-td>
          </template>

          <!-- Roles Column -->
          <template v-slot:body-cell-roles="props">
            <q-td :props="props">
              <q-badge
                v-for="role in props.row.roles"
                :key="role"
                :color="getRoleColor(role)"
                :label="role"
                class="q-mr-xs"
              />
            </q-td>
          </template>

          <!-- Phone Number Column -->
          <template v-slot:body-cell-phone="props">
            <q-td :props="props">
              <div class="row items-center no-wrap">
                <q-icon name="phone" size="16px" color="grey-5" class="q-mr-xs" />
                <span class="text-grey-4">{{ props.row.phone }}</span>
              </div>
            </q-td>
          </template>

          <!-- Email Column -->
          <template v-slot:body-cell-email="props">
            <q-td :props="props">
              <div class="row items-center no-wrap">
                <q-icon name="email" size="16px" color="grey-5" class="q-mr-xs" />
                <span class="text-grey-4">{{ props.row.email }}</span>
              </div>
            </q-td>
          </template>

          <!-- Actions Column -->
          <template v-slot:body-cell-actions="props">
            <q-td :props="props">
              <q-btn
                flat
                dense
                round
                icon="edit"
                color="blue"
                size="sm"
                @click="editKiosk(props.row)"
              >
                <q-tooltip>Edit Kiosk</q-tooltip>
              </q-btn>
              <q-btn
                flat
                dense
                round
                icon="delete"
                color="red"
                size="sm"
                @click="deleteKioskHandler(props.row)"
                class="q-ml-xs"
              >
                <q-tooltip>Delete Kiosk</q-tooltip>
              </q-btn>
            </q-td>
          </template>
        </q-table>
      </q-card-section>
    </q-card>

    <!-- Create User Dialog -->
    <q-dialog v-model="showCreateDialog" persistent>
      <q-card class="dialog-card" style="min-width: 500px;">
        <q-card-section class="row items-center q-pb-none">
          <div class="text-h6 text-white">Add New Kiosk</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>

        <q-card-section>
          <q-form @submit="editingId ? updateKioskHandler : createKioskHandler" class="q-gutter-md">
            <!-- Kiosk Code Field -->
            <q-input
              v-model="userForm.kiosk_code"
              label="Kiosk Code"
              dark
              outlined
              dense
              :rules="[val => !!val || 'Kiosk code is required']"
            >
              <template v-slot:prepend>
                <q-icon name="qr_code" />
              </template>
            </q-input>

            <!-- Location Field -->
            <q-input
              v-model="userForm.location"
              label="Location"
              dark
              outlined
              dense
              :rules="[val => !!val || 'Location is required']"
            >
              <template v-slot:prepend>
                <q-icon name="location_on" />
              </template>
            </q-input>

            <!-- Status Field -->
            <q-select
              v-model="userForm.status"
              :options="statusOptions"
              option-value="value"
              option-label="label"
              emit-value
              label="Status"
              dark
              outlined
              dense
              :rules="[val => !!val || 'Status is required']"
            >
              <template v-slot:prepend>
                <q-icon name="info" />
              </template>
            </q-select>

            <!-- Serial Number Field -->
            <q-input
              v-model="userForm.serial_number"
              label="Serial Number"
              dark
              outlined
              dense
              :rules="[val => !!val || 'Serial number is required']"
            >
              <template v-slot:prepend>
                <q-icon name="pin" />
              </template>
            </q-input>

            <!-- MAC Address Field -->
            <q-input
              v-model="userForm.mac_address"
              label="MAC Address"
              dark
              outlined
              dense
              :rules="[val => !!val || 'MAC address is required']"
            >
              <template v-slot:prepend>
                <q-icon name="settings_ethernet" />
              </template>
            </q-input>

            <!-- IP Address Field -->
            <q-input
              v-model="userForm.ip_address"
              label="IP Address"
              dark
              outlined
              dense
              :rules="[val => !!val || 'IP address is required']"
            >
              <template v-slot:prepend>
                <q-icon name="wifi" />
              </template>
            </q-input>

            <!-- Software Version Field -->
            <q-input
              v-model="userForm.software_version"
              label="Software Version"
              dark
              outlined
              dense
              :rules="[val => !!val || 'Software version is required']"
            >
              <template v-slot:prepend>
                <q-icon name="update" />
              </template>
            </q-input>

            <!-- Assigned To Field -->
            <q-select
              v-model="userForm.assigned_to"
              :options="userOptions"
              label="Assigned To"
              dark
              outlined
              dense
            >
              <template v-slot:prepend>
                <q-icon name="person" />
              </template>
            </q-select>

            <!-- Notes Field -->
            <q-input
              v-model="userForm.notes"
              label="Notes"
              type="textarea"
              dark
              outlined
              dense
            >
              <template v-slot:prepend>
                <q-icon name="notes" />
              </template>
            </q-input>

            <!-- Action Buttons -->
            <div class="row q-gutter-sm justify-end q-mt-md">
              <q-btn
                label="Cancel"
                color="grey"
                flat
                v-close-popup
                :disable="saving"
              />
              <q-btn
                label="Create Kiosk"
                type="submit"
                color="green"
                class="modern-btn"
                :loading="saving"
              />
            </div>
          </q-form>
        </q-card-section>
      </q-card>
    </q-dialog>

  </q-page>
</template>

<script>
export default {
  name: "UsersIndex",
  data() {
    return {
      filter: '',
      showCreateDialog: false,
      saving: false,
      editingId: null,
      
      pagination: {
        rowsPerPage: 10
      },
      
      userForm: {
        kiosk_code: '',
        location: '',
        status: null,
        serial_number: '',
        mac_address: '',
        ip_address: '',
        software_version: '',
        assigned_to: null,
        notes: ''
      },

      userOptions: [], // This will need to be populated with available users

      statusOptions: [
        { label: 'Active', value: 'active' },
        { label: 'Inactive', value: 'inactive' },
        { label: 'Maintenance', value: 'maintenance' }
      ],

      roleOptions: [
        'Admin',
        'Manager',
        'Operator',
        'Support',
        'User'
      ],

      columns: [
        {
          name: 'id',
          label: 'ID',
          field: 'id',
          align: 'left',
          sortable: true
        },
        {
          name: 'kiosk_code',
          label: 'Kiosk Code',
          field: 'kiosk_code',
          align: 'left',
          sortable: true
        },
        {
          name: 'location',
          label: 'Location',
          field: 'location',
          align: 'left',
          sortable: true
        },
        {
          name: 'status',
          label: 'Status',
          field: 'status',
          align: 'center',
          sortable: true
        },
        {
          name: 'serial_number',
          label: 'Serial Number',
          field: 'serial_number',
          align: 'left',
          sortable: true
        },
        {
          name: 'mac_address',
          label: 'MAC Address',
          field: 'mac_address',
          align: 'left',
          sortable: true
        },
        {
          name: 'ip_address',
          label: 'IP Address',
          field: 'ip_address',
          align: 'left',
          sortable: true
        },
        {
          name: 'software_version',
          label: 'Software Version',
          field: 'software_version',
          align: 'left',
          sortable: true
        },
        {
          name: 'assigned_to',
          label: 'Assigned To',
          field: row => row.user ? row.user.name : '-',
          align: 'left',
          sortable: true
        },
        {
          name: 'last_active',
          label: 'Last Active',
          field: 'last_active',
          align: 'left',
          sortable: true
        },
        {
          name: 'actions',
          label: 'Actions',
          field: 'actions',
          align: 'center',
          sortable: false
        }
      ],

      users: []
    };
  },

  computed: {
    kiosks() {
      return this.$store.getters['kiosks/kiosks'];
    },
    isLoading() {
      return this.$store.getters['kiosks/kioskIsLoading'];
    },
    error() {
      return this.$store.getters['kiosks/kioskError'];
    },
    userOptions() {
      return this.users.map(user => ({
        label: user.name,
        value: user.id
      }));
    }
  },

  mounted() {
    this.loadKiosks(); // Changed from loadUsers
  },

  methods: {
    async loadKiosks() {
      try {
        await this.$store.dispatch('kiosks/fetchKiosks');
      } catch (error) {
        this.$q.notify({
          color: 'red',
          message: 'Failed to load kiosks',
          icon: 'error',
          position: 'top'
        });
      }
    },

    getInitials(name) {
      return name
        .split(' ')
        .map(word => word[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);
    },

    getRoleColor(role) {
      const colors = {
        'Admin': 'red',
        'Manager': 'orange',
        'Operator': 'blue',
        'Support': 'purple',
        'User': 'grey',
        'Administrator': 'red'
      };
      return colors[role] || 'grey';
    },

    openCreateDialog() {
      this.userForm = {
        kiosk_code: '',
        location: '',
        status: null,
        serial_number: '',
        mac_address: '',
        ip_address: '',
        software_version: '',
        assigned_to: null,
        notes: ''
      };
      this.showCreateDialog = true;
    },

    async createKioskHandler() {
      this.saving = true;
      try {
        // Changed from 'createUser' to 'createKiosk'
        const response = await this.$store.dispatch('kiosks/createKiosk', {
          ...this.userForm,
          status: this.userForm.status?.toLowerCase()
        });
        
        if (response.success) {
          this.$q.notify({
            color: 'green',
            message: response.message || 'Kiosk created successfully',
            icon: 'check_circle',
            position: 'top'
          });

          this.showCreateDialog = false;
          await this.loadKiosks(); // Changed from loadUsers
        } else {
          throw new Error(response.message);
        }
      } catch (error) {
        let errorMessage = 'Failed to create kiosk';
        
        if (error.response?.data?.errors) {
          const errors = error.response.data.errors;
          errorMessage = Object.values(errors).flat().join(', ');
        } else if (error.response?.data?.message) {
          errorMessage = error.response.data.message;
        } else if (error.message) {
          errorMessage = error.message;
        }

        this.$q.notify({
          color: 'red',
          message: errorMessage,
          icon: 'error',
          position: 'top'
        });
      } finally {
        this.saving = false;
      }
    },

    editKiosk(kiosk) {
      this.editingId = kiosk.id;
      this.userForm = { ...kiosk };
      this.showCreateDialog = true;
    },

    async updateKioskHandler() {
      this.saving = true;
      
      try {
        const response = await this.$store.dispatch('kiosks/updateUser', {
          id: this.editingId,
          data: this.userForm
        });
        
        if (response.success) {
          this.$q.notify({
            color: 'green',
            message: response.message || 'Kiosk user updated successfully',
            icon: 'check_circle',
            position: 'top'
          });

          this.showCreateDialog = false;
          this.editingId = null;
          await this.loadUsers(); // Reload the full list after update
        }
      } catch (error) {
        let errorMessage = 'Failed to update kiosk user';
        
        if (error.response?.data?.errors) {
          const errors = error.response.data.errors;
          errorMessage = Object.values(errors).flat().join(', ');
        } else if (error.response?.data?.message) {
          errorMessage = error.response.data.message;
        }

        this.$q.notify({
          color: 'red',
          message: errorMessage,
          icon: 'error',
          position: 'top'
        });
      } finally {
        this.saving = false;
      }
    },

    async deleteKioskHandler(kiosk) {
      this.$q.dialog({
        title: 'Confirm Delete',
        message: `Are you sure you want to delete ${kiosk.name}?`,
        cancel: true,
        persistent: true,
        dark: true
      }).onOk(async () => {
        try {
          const response = await this.$store.dispatch('kiosks/deleteUser', kiosk.id);
          // Remove user from local state immediately after successful deletion
          this.users = this.users.filter(u => u.id !== kiosk.id);
          
          this.$q.notify({
            color: 'green',
            message: 'Kiosk user deleted successfully',
            icon: 'check_circle',
            position: 'top'
          });
        } catch (error) {
          this.$q.notify({
            color: 'red',
            message: 'Failed to delete kiosk user',
            icon: 'error',
            position: 'top'
          });
        }
      });
    },

    dateOptions(date) {
      // Allow dates from the past up to today (no future dates for birth date)
      const today = new Date().toISOString().split('T')[0];
      return date <= today;
    },
  }
};
</script>

<style scoped>
.users-page {
  background: linear-gradient(135deg, #0a0f0d 0%, #142221 50%, #1a2c28 100%);
  min-height: 100vh;
  position: relative;
  overflow: hidden;
}

/* Animated Background Blobs */
.animated-bg {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  z-index: 0;
  pointer-events: none;
}

.blob {
  position: absolute;
  border-radius: 50%;
  filter: blur(100px);
  opacity: 0.2;
  animation: float 25s infinite ease-in-out;
}

.blob-1 {
  width: 500px;
  height: 500px;
  background: linear-gradient(135deg, #4caf50 0%, #66bb6a 100%);
  top: -250px;
  right: -250px;
  animation-delay: 0s;
}

.blob-2 {
  width: 400px;
  height: 400px;
  background: linear-gradient(135deg, #2e7d32 0%, #4caf50 100%);
  bottom: -200px;
  left: -200px;
  animation-delay: 8s;
}

.blob-3 {
  width: 350px;
  height: 350px;
  background: linear-gradient(135deg, #66bb6a 0%, #81c784 100%);
  top: 40%;
  left: 50%;
  animation-delay: 16s;
}

@keyframes float {
  0%, 100% {
    transform: translate(0, 0) scale(1);
  }
  33% {
    transform: translate(50px, -80px) scale(1.15);
  }
  66% {
    transform: translate(-30px, 50px) scale(0.9);
  }
}

.page-header {
  position: relative;
  z-index: 1;
  padding: 24px;
  background: rgba(20, 34, 33, 0.6);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(76, 175, 80, 0.2);
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
}

.modern-btn {
  border-radius: 10px;
  padding: 8px 20px;
  font-weight: 600;
  letter-spacing: 0.5px;
  text-transform: none;
  box-shadow: 0 4px 12px rgba(76, 175, 80, 0.3);
  transition: all 0.3s ease;
}

.modern-btn:hover {
  box-shadow: 0 6px 20px rgba(76, 175, 80, 0.5);
  transform: translateY(-2px);
}

.table-card {
  position: relative;
  z-index: 1;
  background: rgba(20, 34, 33, 0.8);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(76, 175, 80, 0.2);
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  overflow: hidden;
}

.modern-table {
  background: transparent;
}

.modern-table >>> .q-table__top {
  background: transparent;
  border-bottom: 2px solid rgba(76, 175, 80, 0.3);
}

.modern-table >>> thead tr {
  background: rgba(76, 175, 80, 0.15);
}

.modern-table >>> thead th {
  color: #4caf50;
  font-weight: 700;
  text-transform: uppercase;
  font-size: 0.8rem;
  letter-spacing: 1px;
  border: 1px solid rgba(76, 175, 80, 0.3);
  padding: 16px;
  background: rgba(20, 34, 33, 0.8);
}

.modern-table >>> tbody tr {
  transition: all 0.3s ease;
  border-bottom: 1px solid rgba(76, 175, 80, 0.2);
}

.modern-table >>> tbody tr:hover {
  background: rgba(76, 175, 80, 0.1);
}

/* Odd rows - no column borders */
.modern-table >>> tbody tr:nth-child(odd) td {
  color: rgba(255, 255, 255, 0.95);
  border-left: none;
  border-right: none;
  border-top: none;
  border-bottom: 1px solid rgba(76, 175, 80, 0.1);
  padding: 12px;
  font-size: 0.9rem;
  background: rgba(0, 0, 0, 0.05);
}

/* Even rows - with column borders */
.modern-table >>> tbody tr:nth-child(even) td {
  color: rgba(255, 255, 255, 0.95);
  border: 1px solid rgba(76, 175, 80, 0.15);
  padding: 12px;
  font-size: 0.9rem;
  background: rgba(0, 0, 0, 0.15);
}

/* Remove old styles */
.modern-table >>> tbody td {
  color: rgba(255, 255, 255, 0.95);
  padding: 12px;
  font-size: 0.9rem;
}

.modern-table >>> .q-table__bottom {
  background: transparent;
  color: rgba(255, 255, 255, 0.7);
  border-top: 2px solid rgba(76, 175, 80, 0.3);
  padding: 12px;
}

.modern-table >>> .q-table__card {
  background: transparent;
  box-shadow: none;
}

.search-input >>> .q-field__control {
  background: rgba(0, 0, 0, 0.3);
  border-radius: 10px;
}

.search-input >>> .q-field__control:hover {
  border-color: rgba(76, 175, 80, 0.5);
}

.dialog-card {
  background: rgba(20, 34, 33, 0.95);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(76, 175, 80, 0.3);
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5);
}

.dialog-card >>> .q-field__control {
  background: rgba(0, 0, 0, 0.3);
  border-radius: 8px;
}

.dialog-card >>> .q-field__control:hover {
  border-color: rgba(76, 175, 80, 0.5);
}

.dialog-card >>> .q-field--focused .q-field__control {
  border-color: #4caf50;
  box-shadow: 0 0 0 2px rgba(76, 175, 80, 0.2);
}

@media (max-width: 1024px) {
  .page-header .row {
    flex-direction: column;
    align-items: flex-start !important;
    gap: 16px;
  }
}
</style>
