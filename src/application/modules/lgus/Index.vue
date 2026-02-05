<template>
  <q-page class="bg-[#F8F9FB] min-h-screen font-sans text-gray-800 q-pa-lg">
    <div class="max-w-7xl mx-auto space-y-6">
      
      <!-- Premium Header Section -->
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h4 class="text-2xl font-bold text-[#1A1A1A] tracking-tight q-mb-xs">
            LGU Management
          </h4>
          <p class="text-gray-400 text-sm font-medium">Configure and monitor Local Government Units across the network</p>
        </div>
        <q-btn
          @click="openCreateDialog"
          icon="add"
          label="Add New LGU"
          unelevated
          class="tw-btn-primary px-6 shadow-sm hover:translate-y-[-2px] transition-all duration-300"
        />
      </div>

      <!-- Main Table Card -->
      <div class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div class="px-6 py-4 border-b border-gray-50 flex items-center justify-between bg-white">
          <h5 class="text-xs font-bold text-[#1A1A1A] uppercase tracking-wide">LGU Directory</h5>
          <div class="relative">
            <q-icon name="search" class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size="16px" />
            <input 
              v-model="filter" 
              type="text" 
              placeholder="Search LGUs..." 
              class="pl-10 pr-4 py-2 bg-gray-50 rounded-lg text-xs border-none focus:ring-1 focus:ring-[#82D616]/20 w-64 placeholder-gray-400 text-gray-600 font-medium transition-all"
            >
          </div>
        </div>

        <q-table
          :data="lgus"
          :columns="columns"
          row-key="id"
          :pagination.sync="pagination"
          :filter="filter"
          :loading="isLoading"
          flat
          class="premium-table"
        >
          <!-- Custom ID Cell -->
          <template v-slot:body-cell-id="props">
            <q-td :props="props">
              <span class="text-[10px] font-bold text-gray-400 tracking-wider">#{{ props.value }}</span>
            </q-td>
          </template>

          <!-- LGU Name Cell -->
          <template v-slot:body-cell-name="props">
            <q-td :props="props">
              <div class="flex items-center no-wrap">
                <q-avatar
                  size="28px"
                  class="bg-green-50 text-[#82D616] q-mr-sm font-bold text-[10px]"
                >
                  {{ getInitials(props.row.name) }}
                </q-avatar>
                <div>
                  <div class="font-bold text-[#1A1A1A] text-sm">{{ props.value }}</div>
                  <div class="text-[10px] text-gray-400 font-medium uppercase tracking-tight">{{ props.row.region || 'Unknown Region' }}</div>
                </div>
              </div>
            </q-td>
          </template>

          <!-- Location Cell -->
          <template v-slot:body-cell-location="props">
            <q-td :props="props">
              <div class="flex items-center gap-2">
                <q-icon name="place" size="14px" class="text-gray-400" />
                <span class="text-xs text-gray-600 font-medium">{{ props.value }}</span>
              </div>
            </q-td>
          </template>

          <!-- Stats Cell -->
          <template v-slot:body-cell-stats="props">
            <q-td :props="props" class="text-center">
              <div class="flex items-center justify-center gap-4">
                <div class="flex flex-col items-center">
                  <span class="text-xs font-bold text-[#1A1A1A]">{{ props.row.users_count || 0 }}</span>
                  <span class="text-[9px] font-bold text-gray-400 uppercase">Users</span>
                </div>
                <div class="w-px h-6 bg-gray-100"></div>
                <div class="flex flex-col items-center">
                  <span class="text-xs font-bold text-[#1A1A1A]">{{ props.row.kiosks_count || 0 }}</span>
                  <span class="text-[9px] font-bold text-gray-400 uppercase">Kiosks</span>
                </div>
              </div>
            </q-td>
          </template>

          <!-- Status Cell -->
          <template v-slot:body-cell-status="props">
            <q-td :props="props" class="text-center">
              <span 
                class="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide"
                :class="{
                  'bg-green-50 text-[#82D616]': props.value === 'active',
                  'bg-amber-50 text-amber-600': props.value === 'pending',
                  'bg-red-50 text-red-500': props.value === 'inactive'
                }"
              >
                {{ props.value }}
              </span>
            </q-td>
          </template>

          <!-- Actions Cell -->
          <template v-slot:body-cell-actions="props">
            <q-td :props="props" class="text-center">
              <div class="flex items-center justify-center gap-1">
                <q-btn
                  flat
                  round
                  color="blue"
                  icon="edit"
                  size="sm"
                  @click="editLgu(props.row)"
                  class="hover:bg-blue-50 transition-colors"
                >
                  <q-tooltip>Edit LGU</q-tooltip>
                </q-btn>
                <q-btn
                  flat
                  round
                  color="red"
                  icon="delete"
                  size="sm"
                  @click="deleteLguHandler(props.row)"
                  class="hover:bg-red-50 transition-colors"
                >
                  <q-tooltip>Delete LGU</q-tooltip>
                </q-btn>
              </div>
            </q-td>
          </template>
        </q-table>
      </div>
    </div>

    <!-- Create/Edit LGU Dialog -->
    <q-dialog v-model="showCreateDialog" persistent transition-show="scale" transition-hide="scale">
      <q-card class="dialog-card shadow-24" style="min-width: 800px; border-radius: 24px;">
        <q-card-section class="q-pa-lg row items-center bg-gray-50/50">
          <div>
            <div class="text-h6 text-[#1A1A1A] font-bold tracking-tight">
              {{ editingId ? "Edit LGU Profile" : "Create New LGU" }}
            </div>
            <div class="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-0.5">
              {{ editingId ? "Update existing government unit details" : "Register a new local government entity" }}
            </div>
          </div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup color="grey-5" class="hover:bg-gray-100 transition-colors" />
        </q-card-section>

        <q-card-section class="q-pa-xl">
          <q-form @submit="editingId ? updateLguHandler() : createLguHandler()">
            <div class="space-y-8">
              
              <!-- Section: General Identity -->
              <div>
                <div class="flex items-center gap-2 mb-4">
                  <div class="w-8 h-8 rounded-lg bg-green-50 flex items-center justify-center text-[#82D616]">
                    <q-icon name="fingerprint" size="18px" />
                  </div>
                  <h6 class="text-xs font-bold text-[#1A1A1A] uppercase tracking-wider">General Identity</h6>
                </div>
                
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <q-input
                    v-model="lguForm.name"
                    label="Official LGU Name"
                    outlined
                    dense
                    class="premium-input shadow-sm"
                    :rules="[(val) => !!val || 'Name is required']"
                    placeholder="e.g. City of Manila"
                  >
                    <template v-slot:prepend>
                      <q-icon name="business" size="18px" color="primary" />
                    </template>
                  </q-input>

                  <q-select
                    v-model="lguForm.status"
                    :options="statusOptions"
                    option-value="value"
                    option-label="label"
                    emit-value
                    map-options
                    label="Operational Status"
                    outlined
                    dense
                    class="premium-input shadow-sm"
                    :rules="[(val) => !!val || 'Status is required']"
                  >
                    <template v-slot:prepend>
                      <q-icon name="verified_user" size="18px" color="primary" />
                    </template>
                  </q-select>
                </div>
              </div>

              <!-- Section: Geographic Location -->
              <div>
                <div class="flex items-center gap-2 mb-4">
                  <div class="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-500">
                    <q-icon name="map" size="18px" />
                  </div>
                  <h6 class="text-xs font-bold text-[#1A1A1A] uppercase tracking-wider">Geographic Location</h6>
                </div>
                
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <q-input v-model="lguForm.region" label="Region" outlined dense class="premium-input shadow-sm" placeholder="e.g. NCR" />
                  <q-input v-model="lguForm.province" label="Province" outlined dense class="premium-input shadow-sm" placeholder="e.g. Metro Manila" />
                  <q-input v-model="lguForm.city_municipality" label="City / Municipality" outlined dense class="premium-input shadow-sm" placeholder="e.g. Manila" />
                  <q-input v-model="lguForm.barangay" label="Barangay" outlined dense class="premium-input shadow-sm" placeholder="e.g. Brgy. 123" />
                  <div class="md:col-span-2">
                    <q-input
                      v-model="lguForm.address"
                      label="Detailed Office Address"
                      type="textarea"
                      outlined
                      dense
                      class="premium-input shadow-sm"
                      rows="2"
                      placeholder="Street name, building, floor..."
                    >
                      <template v-slot:prepend>
                        <q-icon name="place" size="18px" color="primary" />
                      </template>
                    </q-input>
                  </div>
                </div>
              </div>

              <!-- Section: Primary Contact -->
              <div>
                <div class="flex items-center gap-2 mb-4">
                  <div class="w-8 h-8 rounded-lg bg-purple-50 flex items-center justify-center text-purple-500">
                    <q-icon name="contact_phone" size="18px" />
                  </div>
                  <h6 class="text-xs font-bold text-[#1A1A1A] uppercase tracking-wider">Primary Contact</h6>
                </div>
                
                <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <q-input v-model="lguForm.contact_person" label="Contact Person" outlined dense class="premium-input shadow-sm">
                    <template v-slot:prepend>
                      <q-icon name="person" size="18px" color="primary" />
                    </template>
                  </q-input>
                  <q-input v-model="lguForm.contact_email" label="Email Address" type="email" outlined dense class="premium-input shadow-sm">
                    <template v-slot:prepend>
                      <q-icon name="alternate_email" size="18px" color="primary" />
                    </template>
                  </q-input>
                  <q-input v-model="lguForm.contact_number" label="Mobile/Phone Number" outlined dense class="premium-input shadow-sm">
                    <template v-slot:prepend>
                      <q-icon name="smartphone" size="18px" color="primary" />
                    </template>
                  </q-input>
                </div>
              </div>

              <!-- Action Footer -->
              <div class="flex items-center justify-end gap-3 pt-6 border-t border-gray-100">
                <q-btn
                  label="Discard Changes"
                  flat
                  color="grey-6"
                  class="px-5 font-bold text-xs"
                  v-close-popup
                  :disable="saving"
                />
                <q-btn
                  :label="editingId ? 'Update Unit Profile' : 'Register LGU'"
                  type="submit"
                  unelevated
                  class="tw-btn-primary px-8 shadow-md"
                  :loading="saving"
                />
              </div>
            </div>
          </q-form>
        </q-card-section>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script>
export default {
  name: "LgusIndex",
  data() {
    return {
      filter: "",
      showCreateDialog: false,
      saving: false,
      editingId: null,

      pagination: {
        rowsPerPage: 10,
      },

      lguForm: {
        name: "",
        region: "",
        province: "",
        city_municipality: "",
        barangay: "",
        address: "",
        contact_person: "",
        contact_email: "",
        contact_number: "",
        status: "pending",
      },

      statusOptions: [
        { label: "Active", value: "active" },
        { label: "Inactive", value: "inactive" },
        { label: "Pending", value: "pending" },
      ],

      columns: [
        {
          name: "id",
          label: "ID",
          field: "id",
          align: "left",
          sortable: true,
        },
        {
          name: "name",
          label: "LGU Name",
          field: "name",
          align: "left",
          sortable: true,
        },
        {
          name: "location",
          label: "Location",
          field: (row) => `${row.city_municipality || ""}, ${row.province || ""}`,
          align: "left",
          sortable: true,
        },
        {
          name: "stats",
          label: "Utilization",
          field: "stats",
          align: "center",
          sortable: false,
        },
        {
          name: "status",
          label: "Status",
          field: "status",
          align: "center",
          sortable: true,
        },
        {
          name: "actions",
          label: "Actions",
          field: "actions",
          align: "center",
          sortable: false,
        },
      ],

      lgus: [],
    };
  },

  computed: {
    lgus() {
      return this.$store.getters["lgus/lgus"] || [];
    },
    isLoading() {
      return this.$store.getters["lgus/isLoading"];
    },
    totalKiosks() {
      return this.lgus.reduce((sum, lgu) => sum + (lgu.kiosks_count || 0), 0);
    },
  },

  mounted() {
    this.loadLgus();
  },

  methods: {
    async loadLgus() {
      try {
        const response = await this.$store.dispatch("lgus/fetchLgus");
        this.lgus = response.data || response;
      } catch (error) {
        this.$q.notify({
          color: "red",
          message: "Failed to load LGUs",
          icon: "error",
          position: "top",
        });
      }
    },

    getInitials(name) {
      if (!name) return "LGU";
      return name
        .split(" ")
        .map((word) => word[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);
    },

    getStatusColor(status) {
      const colors = {
        active: "green",
        inactive: "grey",
        pending: "orange",
      };
      return colors[status] || "grey";
    },

    openCreateDialog() {
      this.editingId = null;
      this.lguForm = {
        name: "",
        region: "",
        province: "",
        city_municipality: "",
        barangay: "",
        address: "",
        contact_person: "",
        contact_email: "",
        contact_number: "",
        status: "active",
      };
      this.showCreateDialog = true;
    },

    async createLguHandler() {
      this.saving = true;
      try {
        const response = await this.$store.dispatch("lgus/createLgu", this.lguForm);
        
        if (response) {
          this.$q.notify({
            color: "green",
            message: "LGU created successfully",
            icon: "check_circle",
            position: "top",
          });
          this.loadLgus();
          this.showCreateDialog = false;
        }
      } catch (error) {
        let errorMessage = "Failed to create LGU";
        if (error.response?.data?.message) {
          errorMessage = error.response.data.message;
        }
        this.$q.notify({
          color: "red",
          message: errorMessage,
          icon: "error",
          position: "top",
        });
      } finally {
        this.saving = false;
      }
    },

    editLgu(lgu) {
      this.editingId = lgu.id;
      this.lguForm = { ...lgu };
      this.showCreateDialog = true;
    },

    async updateLguHandler() {
      this.saving = true;
      try {
        const response = await this.$store.dispatch("lgus/updateLgu", {
          id: this.editingId,
          data: this.lguForm,
        });

        if (response) {
          this.$q.notify({
            color: "green",
            message: "LGU updated successfully",
            icon: "check_circle",
            position: "top",
          });
          this.loadLgus();
          this.showCreateDialog = false;
        }
      } catch (error) {
        this.$q.notify({
          color: "red",
          message: "Failed to update LGU",
          icon: "error",
          position: "top",
        });
      } finally {
        this.saving = false;
      }
    },

    async deleteLguHandler(lgu) {
      this.$q
        .dialog({
          title: '<span class="text-[#1A1A1A] font-bold">Confirm Deletion</span>',
          message: `<div class="text-gray-500 text-sm">Are you sure you want to delete <span class="text-red-600 font-bold">${lgu.name}</span>?<br/><br/>This action will affect all associated kiosks and users. This cannot be undone.</div>`,
          html: true,
          cancel: {
            label: 'Keep Unit',
            flat: true,
            color: 'grey-6',
            class: 'text-xs font-bold'
          },
          ok: {
            label: 'Yes, Delete',
            unelevated: true,
            color: 'red-6',
            class: 'px-6 rounded-lg text-xs font-bold shadow-md'
          },
          persistent: true,
          style: 'border-radius: 20px; padding: 24px;'
        })
        .onOk(async () => {
          try {
            await this.$store.dispatch("lgus/deleteLgu", lgu.id);
            this.lgus = this.lgus.filter((l) => l.id !== lgu.id);
            this.$q.notify({
              color: "green",
              message: "LGU successfully removed from network",
              icon: "check_circle",
              position: "top-right",
              classes: "premium-notify"
            });
          } catch (error) {
            this.$q.notify({
              color: "red",
              message: "Operational error: Could not delete unit",
              icon: "warning",
              position: "top-right"
            });
          }
        });
    },
  },
};
</script>

<style scoped>
.premium-table {
  background: transparent !important;
}

:deep(.q-table thead tr) {
  background-color: #fcfcfc;
  height: 48px;
}

:deep(.q-table th) {
  color: #9CA3AF !important;
  font-weight: 700 !important;
  text-transform: uppercase !important;
  font-size: 10px !important;
  letter-spacing: 0.05em !important;
  border-bottom: 1px solid #f9fafb !important;
  padding: 12px 24px !important;
}

:deep(.q-table tbody tr) {
  height: 64px;
  transition: all 0.3s ease;
}

:deep(.q-table tbody tr:hover) {
  background-color: #F9FAFB !important;
}

:deep(.q-table td) {
  border-bottom: 1px solid #F9FAFB !important;
  padding: 12px 24px !important;
}

:deep(.q-table__bottom) {
  border-top: 1px solid #F9FAFB !important;
  color: #9CA3AF;
  font-size: 11px;
  font-weight: 500;
}

.tw-btn-primary {
  background-color: #82D616;
  color: white;
  font-weight: 700;
  text-transform: none;
  font-size: 13px;
  border-radius: 10px;
}

.tw-btn-primary:hover {
  background-color: #72bc13;
}

:deep(.premium-input .q-field__control) {
  border-radius: 12px;
  background-color: #ffffff;
  transition: all 0.3s ease;
}

:deep(.premium-input .q-field__control:hover) {
  border-color: #82D616 !important;
}

:deep(.premium-input.q-field--focused .q-field__control) {
  border-color: #82D616 !important;
  box-shadow: 0 0 0 4px rgba(130, 214, 22, 0.1);
}

:deep(.q-table__container) {
  border-radius: 12px;
}

/* Animations */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.max-w-7xl > * {
  animation: fadeInUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) both;
}

.max-w-7xl > *:nth-child(2) { animation-delay: 0.1s; }
.max-w-7xl > *:nth-child(3) { animation-delay: 0.2s; }

/* Transitions */
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.5s ease;
}
.fade-enter, .fade-leave-to {
  opacity: 0;
}
</style>
