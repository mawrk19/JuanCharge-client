<template>
  <q-page class="kiosks-page q-pa-lg">
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
          :loading="kioskIsLoading"
          bordered
          class="modern-table"
        >
          <!-- No Data Slot -->
          <template v-slot:no-data>
            <div class="full-width row flex-center text-grey-5 q-gutter-sm q-py-xl">
              <q-icon size="2em" name="warning" />
              <span>No kiosks found</span>
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
                  placeholder="Search kiosks..."
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

          <!-- Kiosk_Code Column -->
          <template v-slot:body-cell-kiosk_code="props">
            <q-td :props="props">
              <div class="row items-center no-wrap">
                <q-avatar size="32px" color="green" text-color="white" class="q-mr-sm">
                  {{ getInitials(props.row.kiosk_code) }}
                </q-avatar>
                <span class="text-white text-weight-medium">{{ props.row.kiosk_code }}</span>
              </div>
            </q-td>
          </template>

          <!-- Status Column -->
          <template v-slot:body-cell-status="props">
            <q-td :props="props">
              <q-badge
                v-for="status in props.row.status"
                :key="status"
                :color="getStatusColor(status)"
                :label="status"
                class="q-mr-xs"
              />
            </q-td>
          </template>

          <!-- Serial Number Column -->
          <template v-slot:body-cell-serial_number="props">
            <q-td :props="props">
              <div class="row items-center no-wrap">
                <q-icon name="dialpad" size="16px" color="grey-5" class="q-mr-xs" />
                <span class="text-grey-4">{{ props.row.serial_number }}</span>
              </div>
            </q-td>
          </template>

          <!-- MAC Address Column -->
          <template v-slot:body-cell-mac_address="props">
            <q-td :props="props">
              <div class="row items-center no-wrap">
                <q-icon name="device_hub" size="16px" color="grey-5" class="q-mr-xs" />
                <span class="text-grey-4">{{ props.row.mac_address }}</span>
              </div>
            </q-td>
          </template>

          <!-- IP Address Column -->
          <template v-slot:body-cell-ip_address="props">
            <q-td :props="props">
              <div class="row items-center no-wrap">
                <q-icon name="wifi" size="16px" color="grey-5" class="q-mr-xs" />
                <span class="text-grey-4">{{ props.row.ip_address }}</span>
              </div>
            </q-td>
          </template>

          <!-- Software Version Column -->
          <template v-slot:body-cell-software_version="props">
            <q-td :props="props">
              <div class="row items-center no-wrap">
                <q-icon name="update" size="16px" color="grey-5" class="q-mr-xs" />
                <span class="text-grey-4">{{ props.row.software_version }}</span>
              </div>
            </q-td>
          </template>

          <!-- Assigned To Column -->
          <template v-slot:body-cell-assigned_to="props">
            <q-td :props="props">
              <div class="row items-center no-wrap">
                <q-icon name="person" size="16px" color="grey-5" class="q-mr-xs" />
                <span class="text-grey-4">{{ props.row.assigned_to }}</span>
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

    <!-- Create/Edit Kiosk Dialog -->
    <q-dialog v-model="showCreateDialog" persistent>
      <q-card class="dialog-card" style="min-width: 500px;">
        <q-card-section class="row items-center q-pb-none">
          <div class="text-h6 text-white">{{ editingId ? 'Edit Kiosk' : 'Add New Kiosk' }}</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>

        <q-card-section>
          <q-form @submit="editingId ? updateKioskHandler() : createKioskHandler()" class="q-gutter-md">
            <!-- Kiosk Code Field -->
            <q-input
              v-model="kioskForm.kiosk_code"
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
              v-model="kioskForm.location"
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
              v-model="kioskForm.status"
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
              v-model="kioskForm.serial_number"
              label="Serial Number"
              dark
              outlined
              dense
              :rules="[val => !!val || 'Serial number is required']"
            >
              <template v-slot:prepend>
                <q-icon name="dialpad" />
              </template>
            </q-input>

            <!-- MAC Address Field -->
            <q-input
              v-model="kioskForm.mac_address"
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
              v-model="kioskForm.ip_address"
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
              v-model="kioskForm.software_version"
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
              v-model="kioskForm.assigned_to"
              :options="userOptions"
              option-value="value"
              option-label="label"
              emit-value
              map-options
              label="Assigned To"
              dark
              outlined
              dense
              clearable
            >
              <template v-slot:prepend>
                <q-icon name="person" />
              </template>
            </q-select>

            <!-- Notes Field -->
            <q-input
              v-model="kioskForm.notes"
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
                :label="editingId ? 'Update Kiosk' : 'Create Kiosk'"
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
  name: "KiosksIndex",
  data() {
    return {
      filter: '',
      showCreateDialog: false,
      saving: false,
      editingId: null,
      
      pagination: {
        rowsPerPage: 10
      },

      kioskForm: {
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

      userOptions: [], // Will be populated with LGU users

      statusOptions: [
        { label: 'Active', value: 'active' },
        { label: 'Inactive', value: 'inactive' },
        { label: 'Maintenance', value: 'maintenance' }
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
          field: 'assigned_to',
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

      kiosks: []
    };
  },

  computed: {
    kioskIsLoading() {
      return this.$store.getters['kiosks/kioskIsLoading'];
    },
    kioskError() {
      return this.$store.getters['kiosks/kioskError'];
    }
  },

  mounted() {
    this.loadKiosks();
    this.loadUsers();
  },

  methods: {
    async loadUsers() {
      try {
        const response = await this.$store.dispatch('users/fetchUsers');
        let usersData = response?.data || response;
        
        if (Array.isArray(usersData)) {
          this.userOptions = usersData.map(user => ({
            label: user.name,
            value: user.id
          }));
        }
      } catch (error) {
        // console.error('Failed to load users:', error);
      }
    },
    async loadKiosks() {
      try {
        const response = await this.$store.dispatch('kiosks/fetchKiosks');
        const kiosksData = response.data || response;

        if (Array.isArray(kiosksData)) {
          this.kiosks = kiosksData.map(kiosk => ({
            id: kiosk.id,
            kiosk_code: kiosk.kiosk_code,
            location: kiosk.location,
            status: [kiosk.status],
            serial_number: kiosk.serial_number,
            mac_address: kiosk.mac_address,
            ip_address: kiosk.ip_address,
            software_version: kiosk.software_version,
            assigned_to: kiosk.assigned_user_name || '-',
            assigned_to_id: kiosk.assigned_to,
            notes: kiosk.notes
          }));
        }
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

    getStatusColor(status) {
      const colors = {
        'active': 'green',
        'inactive': 'grey',
        'maintenance': 'orange',
      };
      return colors[status] || 'grey';
    },

    openCreateDialog() {
      this.editingId = null;
      this.kioskForm = {
        kiosk_code: '',
        location: '',
        status: null,
        serial_number: '',
        mac_address: '',
        ip_address: '',
        software_version: '',
        assigned_to: '',
        notes: ''
      };
      this.showCreateDialog = true;
    },

    async createKioskHandler() {
      this.saving = true;
      try {
        // Prepare the data with correct field name for API
        const payload = {
  ...this.kioskForm,
  assigned_to: this.kioskForm.assigned_to, // Keep the same name used in backend
};

        
        const response = await this.$store.dispatch('kiosks/createKiosk', payload);
        
        // Handle different response structures
        const kioskData = response.data?.data || response.data || response;
        
        if (response.success !== false && kioskData) {
          this.$q.notify({
            color: 'green',
            message: response.message || 'Kiosk created successfully',
            icon: 'check_circle',
            position: 'top'
          });

          // Add to local array with proper structure
          this.kiosks.unshift({
            id: kioskData.id,
            kiosk_code: kioskData.kiosk_code,
            location: kioskData.location,
            status: [kioskData.status],
            serial_number: kioskData.serial_number,
            mac_address: kioskData.mac_address,
            ip_address: kioskData.ip_address,
            software_version: kioskData.software_version,
            assigned_to: kioskData.assigned_to?.name || kioskData.assigned_to || '-',
            assigned_to_id: kioskData.assigned_to?.id || null,
            notes: kioskData.notes || ''
          });
          
          this.showCreateDialog = false;
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
          position: 'top',
          timeout: 5000
        });
      } finally {
        this.saving = false;
      }
    },

    editKiosk(kiosk) {
      this.editingId = kiosk.id;
      this.kioskForm = {
        kiosk_code: kiosk.kiosk_code,
        location: kiosk.location,
        status: kiosk.status[0],
        serial_number: kiosk.serial_number,
        mac_address: kiosk.mac_address,
        ip_address: kiosk.ip_address,
        software_version: kiosk.software_version,
        assigned_to: kiosk.assigned_to_id || null,
        notes: kiosk.notes || ''
      };
      this.showCreateDialog = true;
    },

    async updateKioskHandler() {
      this.saving = true;
      
      try {
        // Prepare the data with correct field name for API
        const payload = {
  ...this.kioskForm,
  assigned_to: this.kioskForm.assigned_to, // Keep the same name used in backend
};

        
        const response = await this.$store.dispatch('kiosks/updateKiosk', {
          id: this.editingId,
          data: payload
        });
        
        // Handle different response structures
        const kioskData = response.data?.data || response.data || response;
        
        if (response.success !== false && kioskData) {
          this.$q.notify({
            color: 'green',
            message: response.message || 'Kiosk updated successfully',
            icon: 'check_circle',
            position: 'top'
          });

          // Update the kiosk in the local array
          const index = this.kiosks.findIndex(k => k.id === this.editingId);
          if (index !== -1) {
            this.kiosks.splice(index, 1, {
              id: kioskData.id,
              kiosk_code: kioskData.kiosk_code,
              location: kioskData.location,
              status: [kioskData.status],
              serial_number: kioskData.serial_number,
              mac_address: kioskData.mac_address,
              ip_address: kioskData.ip_address,
              software_version: kioskData.software_version,
              assigned_to: kioskData.assigned_to?.name || kioskData.assigned_to || '-',
              assigned_to_id: kioskData.assigned_to?.id || null,
              notes: kioskData.notes || ''
            });
          }

          this.showCreateDialog = false;
          this.editingId = null;
        }
      } catch (error) {
        let errorMessage = 'Failed to update kiosk';
        
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

    async deleteKioskHandler(kiosk) {
      this.$q.dialog({
        title: 'Confirm Delete',
        message: `Are you sure you want to delete kiosk ${kiosk.kiosk_code}?`,
        cancel: true,
        persistent: true,
        dark: true
      }).onOk(async () => {
        try {
          const response = await this.$store.dispatch('kiosks/deleteKiosk', kiosk.id);
          this.kiosks = this.kiosks.filter(k => k.id !== kiosk.id);

          this.$q.notify({
            color: 'green',
            message: 'Kiosk deleted successfully',
            icon: 'check_circle',
            position: 'top'
          });
        } catch (error) {
          this.$q.notify({
            color: 'red',
            message: 'Failed to delete kiosk',
            icon: 'error',
            position: 'top'
          });
        }
      });
    }
  }
};
</script>

<style scoped>
.kiosks-page {
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

.modern-table >>> tbody tr:nth-child(even) td {
  color: rgba(255, 255, 255, 0.95);
  border: 1px solid rgba(76, 175, 80, 0.15);
  padding: 12px;
  font-size: 0.9rem;
  background: rgba(0, 0, 0, 0.15);
}

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