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
      <div class="text-subtitle1 text-grey-5">Manage kiosks</div>
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
            <div
              class="full-width row flex-center text-grey-5 q-gutter-sm q-py-xl"
            >
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
                style="min-width: 300px"
              >
                <template v-slot:prepend>
                  <q-icon name="search" />
                </template>
                <template v-slot:append>
                  <q-icon
                    v-if="filter"
                    name="close"
                    @click="filter = ''"
                    class="cursor-pointer"
                  />
                </template>
              </q-input>
            </div>
          </template>

          <!-- ID Column -->
          <template v-slot:body-cell-id="props">
            <q-td :props="props">
              <q-badge color="green" outline> #{{ props.row.id }} </q-badge>
            </q-td>
          </template>

          <!-- Kiosk_Code Column -->
          <template v-slot:body-cell-kiosk_code="props">
            <q-td :props="props">
              <div class="row items-center no-wrap">
                <q-avatar
                  size="32px"
                  color="green"
                  text-color="white"
                  class="q-mr-sm"
                >
                  {{ getInitials(props.row.kiosk_code) }}
                </q-avatar>
                <span class="text-white text-weight-medium">{{
                  props.row.kiosk_code
                }}</span>
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

          <!-- Assigned To Column -->
          <template v-slot:body-cell-assigned_to="props">
            <q-td :props="props">
              <div class="row items-center no-wrap">
                <q-icon
                  name="person"
                  size="16px"
                  color="grey-5"
                  class="q-mr-xs"
                />
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
      <q-card class="dialog-card" style="min-width: 700px; max-width: 90vw">
        <q-card-section class="row items-center q-pb-none">
          <div class="text-h6 text-white">
            {{ editingId ? "Edit Kiosk" : "Add New Kiosk" }}
          </div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>

        <q-card-section>
          <q-form
            @submit="editingId ? updateKioskHandler() : createKioskHandler()"
            class="q-gutter-md"
          >
            <!-- Kiosk Code Field -->
            <q-input
              v-model="kioskForm.kiosk_code"
              label="Kiosk Code"
              outlined
              dense
              :rules="[(val) => !!val || 'Kiosk code is required']"
            >
              <template v-slot:prepend>
                <q-icon name="qr_code" />
              </template>
            </q-input>

            <!-- Location Field with Map Picker -->
            <div class="location-picker">
              <q-input
                v-model="kioskForm.location"
                label="Location (lat, lng)"
                outlined
                dense
                readonly
                :rules="[(val) => !!val || 'Location is required']"
                hint="Click on the map to select location"
              >
                <template v-slot:prepend>
                  <q-icon name="location_on" />
                </template>
                <template v-slot:append>
                  <q-btn
                    flat
                    round
                    dense
                    icon="my_location"
                    @click="getCurrentLocation"
                    :loading="gettingLocation"
                  >
                    <q-tooltip>Use my current location</q-tooltip>
                  </q-btn>
                </template>
              </q-input>

              <!-- Map Container -->
              <div class="map-picker-container q-mt-sm">
                <l-map
                  ref="locationMap"
                  :zoom="mapZoom"
                  :center="mapCenter"
                  style="height: 250px; width: 100%; border-radius: 8px;"
                  @click="onMapClick"
                >
                  <l-tile-layer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution="&copy; OpenStreetMap contributors"
                  />
                  <l-marker
                    v-if="selectedLocation"
                    :lat-lng="selectedLocation"
                  >
                    <l-icon
                      :icon-url="markerIcon"
                      :icon-size="[32, 32]"
                      :icon-anchor="[16, 32]"
                    />
                  </l-marker>
                </l-map>
              </div>
            </div>

            <!-- Status Field -->
            <q-select
              v-model="kioskForm.status"
              :options="statusOptions"
              option-value="value"
              option-label="label"
              emit-value
              label="Status"
              outlined
              dense
              :rules="[(val) => !!val || 'Status is required']"
            >
              <template v-slot:prepend>
                <q-icon name="info" />
              </template>
            </q-select>

            <!-- Assigned To Field -->
            <q-select
              v-model="kioskForm.assigned_to"
              :options="userOptions"
              option-value="value"
              option-label="label"
              emit-value
              map-options
              label="Assigned To"
              outlined
              dense
              clearable
            >
              <template v-slot:prepend>
                <q-icon name="person" />
              </template>
            </q-select>

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
import { LMap, LTileLayer, LMarker, LIcon } from "vue2-leaflet";
import "leaflet/dist/leaflet.css";

export default {
  name: "KiosksIndex",
  components: {
    LMap,
    LTileLayer,
    LMarker,
    LIcon,
  },
  data() {
    return {
      filter: "",
      showCreateDialog: false,
      saving: false,
      editingId: null,
      gettingLocation: false,

      // Map picker properties
      mapZoom: 13,
      mapCenter: [14.5995, 120.9842], // Default: Manila
      selectedLocation: null,
      markerIcon: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='32' height='32' viewBox='0 0 24 24'%3E%3Cpath fill='%234CAF50' d='M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z'/%3E%3C/svg%3E",

      pagination: {
        rowsPerPage: 10,
      },

      kioskForm: {
        kiosk_code: "",
        location: "",
        status: null,
        assigned_to: null,
      },

      userOptions: [], // Will be populated with LGU users

      statusOptions: [
        { label: "Active", value: "active" },
        { label: "Inactive", value: "inactive" },
        { label: "Maintenance", value: "maintenance" },
      ],

      columns: [
        // {
        //   name: 'id',
        //   label: 'ID',
        //   field: 'id',
        //   align: 'left',
        //   sortable: true
        // },
        {
          name: "kiosk_code",
          label: "Kiosk Code",
          field: "kiosk_code",
          align: "left",
          sortable: true,
        },
        {
          name: "location",
          label: "Location",
          field: "location",
          align: "left",
          sortable: true,
        },
        {
          name: "status",
          label: "Status",
          field: "status",
          align: "center",
          sortable: true,
        },
        {
          name: "assigned_to",
          label: "Assigned To",
          field: "assigned_to",
          align: "left",
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

      kiosks: [],
    };
  },

  computed: {
    kioskIsLoading() {
      return this.$store.getters["kiosks/kioskIsLoading"];
    },
    kioskError() {
      return this.$store.getters["kiosks/kioskError"];
    },
  },

  mounted() {
    this.loadKiosks();
    this.loadUsers();
  },

  methods: {
    async loadUsers() {
      try {
        const response = await this.$store.dispatch("users/fetchUsers");
        let usersData = response?.data || response;

        if (Array.isArray(usersData)) {
          this.userOptions = usersData.map((user) => ({
            label: user.name,
            value: user.id,
          }));
        }
      } catch (error) {
        // console.error('Failed to load users:', error);
      }
    },
    async loadKiosks() {
      try {
        const response = await this.$store.dispatch("kiosks/fetchKiosks");
        const kiosksData = response.data || response;

        if (Array.isArray(kiosksData)) {
          this.kiosks = kiosksData.map((kiosk) => ({
            id: kiosk.id,
            kiosk_code: kiosk.kiosk_code,
            location: kiosk.location,
            status: [kiosk.status],
            assigned_to: kiosk.assigned_user_name || "-",
            assigned_to_id: kiosk.assigned_to,
          }));
        }
      } catch (error) {
        this.$q.notify({
          color: "red",
          message: "Failed to load kiosks",
          icon: "error",
          position: "top",
        });
      }
    },

    getInitials(name) {
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
        maintenance: "orange",
      };
      return colors[status] || "grey";
    },

    openCreateDialog() {
      this.editingId = null;
      this.kioskForm = {
        kiosk_code: "",
        location: "",
        status: null,
        assigned_to: null,
      };
      this.selectedLocation = null;
      this.mapCenter = [14.5995, 120.9842]; // Reset to Manila
      this.mapZoom = 13;
      this.showCreateDialog = true;
    },

    onMapClick(event) {
      const { lat, lng } = event.latlng;
      this.selectedLocation = [lat, lng];
      this.kioskForm.location = `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
    },

    getCurrentLocation() {
      if (!navigator.geolocation) {
        this.$q.notify({
          color: "red",
          message: "Geolocation is not supported by your browser",
          icon: "error",
          position: "top",
        });
        return;
      }

      this.gettingLocation = true;
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          this.selectedLocation = [lat, lng];
          this.mapCenter = [lat, lng];
          this.mapZoom = 16;
          this.kioskForm.location = `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
          this.gettingLocation = false;

          // Invalidate map size after center change
          this.$nextTick(() => {
            if (this.$refs.locationMap && this.$refs.locationMap.mapObject) {
              this.$refs.locationMap.mapObject.invalidateSize();
            }
          });
        },
        (error) => {
          this.gettingLocation = false;
          this.$q.notify({
            color: "red",
            message: "Unable to get your location: " + error.message,
            icon: "error",
            position: "top",
          });
        },
        { enableHighAccuracy: true, timeout: 10000 }
      );
    },

    parseLocationToCoords(locationStr) {
      if (!locationStr) return null;
      const parts = locationStr.split(",");
      if (parts.length >= 2) {
        const lat = parseFloat(parts[0].trim());
        const lng = parseFloat(parts[1].trim());
        if (!isNaN(lat) && !isNaN(lng)) {
          return [lat, lng];
        }
      }
      return null;
    },

    async createKioskHandler() {
      this.saving = true;
      try {
        // Prepare the data with correct field name for API
        const payload = {
          ...this.kioskForm,
          assigned_to: this.kioskForm.assigned_to, // Keep the same name used in backend
        };

        const response = await this.$store.dispatch(
          "kiosks/createKiosk",
          payload
        );

        // Handle different response structures
        const kioskData = response.data?.data || response.data || response;

        if (response.success !== false && kioskData) {
          this.$q.notify({
            color: "green",
            message: response.message || "Kiosk created successfully",
            icon: "check_circle",
            position: "top",
          });

          // Add to local array with proper structure
          this.kiosks.unshift({
            id: kioskData.id,
            kiosk_code: kioskData.kiosk_code,
            location: kioskData.location,
            status: [kioskData.status],
            assigned_to:
              kioskData.assigned_to?.name || kioskData.assigned_to || "-",
            assigned_to_id: kioskData.assigned_to?.id || null,
          });

          this.showCreateDialog = false;
        }
      } catch (error) {
        let errorMessage = "Failed to create kiosk";

        if (error.response?.data?.errors) {
          const errors = error.response.data.errors;
          errorMessage = Object.values(errors).flat().join(", ");
        } else if (error.response?.data?.message) {
          errorMessage = error.response.data.message;
        } else if (error.message) {
          errorMessage = error.message;
        }

        this.$q.notify({
          color: "red",
          message: errorMessage,
          icon: "error",
          position: "top",
          timeout: 5000,
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
        assigned_to: kiosk.assigned_to_id || null,
      };
      
      // Parse existing location and set map marker
      const coords = this.parseLocationToCoords(kiosk.location);
      if (coords) {
        this.selectedLocation = coords;
        this.mapCenter = coords;
        this.mapZoom = 16;
      } else {
        this.selectedLocation = null;
        this.mapCenter = [14.5995, 120.9842];
        this.mapZoom = 13;
      }
      
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

        const response = await this.$store.dispatch("kiosks/updateKiosk", {
          id: this.editingId,
          data: payload,
        });

        // Handle different response structures
        const kioskData = response.data?.data || response.data || response;

        if (response.success !== false && kioskData) {
          this.$q.notify({
            color: "green",
            message: response.message || "Kiosk updated successfully",
            icon: "check_circle",
            position: "top",
          });

          // Update the kiosk in the local array
          const index = this.kiosks.findIndex((k) => k.id === this.editingId);
          if (index !== -1) {
            this.kiosks.splice(index, 1, {
              id: kioskData.id,
              kiosk_code: kioskData.kiosk_code,
              location: kioskData.location,
              status: [kioskData.status],
              assigned_to:
                kioskData.assigned_to?.name || kioskData.assigned_to || "-",
              assigned_to_id: kioskData.assigned_to?.id || null,
            });
          }

          this.showCreateDialog = false;
          this.editingId = null;
        }
      } catch (error) {
        let errorMessage = "Failed to update kiosk";

        if (error.response?.data?.errors) {
          const errors = error.response.data.errors;
          errorMessage = Object.values(errors).flat().join(", ");
        } else if (error.response?.data?.message) {
          errorMessage = error.response.data.message;
        } else if (error.message) {
          errorMessage = error.message;
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

    async deleteKioskHandler(kiosk) {
      this.$q
        .dialog({
          title: "Confirm Delete",
          message: `Are you sure you want to delete kiosk ${kiosk.kiosk_code}?`,
          cancel: true,
          persistent: true,
          dark: true,
        })
        .onOk(async () => {
          try {
            const response = await this.$store.dispatch(
              "kiosks/deleteKiosk",
              kiosk.id
            );
            this.kiosks = this.kiosks.filter((k) => k.id !== kiosk.id);

            this.$q.notify({
              color: "green",
              message: "Kiosk deleted successfully",
              icon: "check_circle",
              position: "top",
            });
          } catch (error) {
            this.$q.notify({
              color: "red",
              message: "Failed to delete kiosk",
              icon: "error",
              position: "top",
            });
          }
        });
    },
  },
};
</script>

<style scoped>
.kiosks-page {
  background: #f5f5f5;
  min-height: 100vh;
  position: relative;
  overflow: hidden;
}

.page-header {
  position: relative;
  z-index: 1;
  padding: 24px;
  background: #ffffff;
  border: 1px solid #e0e0e0;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  transition: all 0.2s ease;
}

.page-header:hover {
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.12),
    0 4px 12px rgba(76, 175, 80, 0.15);
  transform: translateY(-2px);
}

.modern-btn {
  border-radius: 12px;
  padding: 10px 24px;
  font-weight: 600;
  letter-spacing: 0.5px;
  text-transform: none;
  box-shadow: 0 4px 16px rgba(76, 175, 80, 0.3);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
}

.modern-btn::before {
  content: "";
  position: absolute;
  top: 50%;
  left: 50%;
  width: 0;
  height: 0;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.3);
  transform: translate(-50%, -50%);
  transition: width 0.6s, height 0.6s;
}

.modern-btn:hover::before {
  width: 300px;
  height: 300px;
}

.modern-btn:hover {
  box-shadow: 0 8px 24px rgba(76, 175, 80, 0.5);
  transform: translateY(-3px) scale(1.02);
}

.table-card {
  position: relative;
  z-index: 1;
  background: linear-gradient(
    135deg,
    rgba(255, 255, 255, 0.95) 0%,
    rgba(248, 250, 252, 0.9) 100%
  );
  backdrop-filter: blur(24px);
  -webkit-backdrop-filter: blur(24px);
  border: 1px solid rgba(76, 175, 80, 0.2);
  border-radius: 20px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.08), 0 2px 8px rgba(76, 175, 80, 0.05);
  overflow: hidden;
  transition: all 0.3s ease;
}

.table-card:hover {
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.12),
    0 4px 12px rgba(76, 175, 80, 0.15);
}

.modern-table {
  background: transparent;
}

.modern-table >>> .q-table__top {
  background: transparent;
  border-bottom: 2px solid rgba(76, 175, 80, 0.15);
  padding: 16px;
}

.modern-table >>> thead tr {
  background: linear-gradient(
    135deg,
    rgba(76, 175, 80, 0.08) 0%,
    rgba(102, 187, 106, 0.05) 100%
  );
}

.modern-table >>> thead th {
  color: #2e7d32;
  font-weight: 700;
  text-transform: uppercase;
  font-size: 0.75rem;
  letter-spacing: 1.2px;
  border: none;
  border-bottom: 2px solid rgba(76, 175, 80, 0.2);
  padding: 16px;
  background: transparent;
}

.modern-table >>> tbody tr {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border-bottom: 1px solid rgba(76, 175, 80, 0.08);
}

.modern-table >>> tbody tr:hover {
  background: linear-gradient(
    135deg,
    rgba(76, 175, 80, 0.08) 0%,
    rgba(102, 187, 106, 0.05) 100%
  );
  transform: translateX(4px);
  box-shadow: -4px 0 12px rgba(76, 175, 80, 0.1);
}

.modern-table >>> tbody td {
  color: rgba(0, 0, 0, 0.87);
  padding: 16px;
  font-size: 0.9rem;
  border: none;
  font-weight: 500;
}

.modern-table >>> .q-table__bottom {
  background: transparent;
  color: rgba(0, 0, 0, 0.6);
  border-top: 2px solid rgba(76, 175, 80, 0.15);
  padding: 16px;
}

.modern-table >>> .q-table__card {
  background: transparent;
  box-shadow: none;
}

.search-input >>> .q-field__control {
  background: rgba(255, 255, 255, 0.7);
  border-radius: 12px;
  border: 1px solid rgba(76, 175, 80, 0.2);
  transition: all 0.3s ease;
}

.search-input >>> .q-field__control:hover {
  border-color: rgba(76, 175, 80, 0.4);
  background: rgba(255, 255, 255, 0.9);
}

.search-input >>> .q-field--focused .q-field__control {
  border-color: #4caf50;
  box-shadow: 0 0 0 3px rgba(76, 175, 80, 0.15);
}

.dialog-card {
  background: linear-gradient(
    135deg,
    rgba(255, 255, 255, 0.98) 0%,
    rgba(248, 250, 252, 0.95) 100%
  );
  backdrop-filter: blur(24px);
  -webkit-backdrop-filter: blur(24px);
  border: 1px solid rgba(76, 175, 80, 0.2);
  border-radius: 20px;
  box-shadow: 0 16px 48px rgba(0, 0, 0, 0.15), 0 4px 16px rgba(76, 175, 80, 0.1);
}

.dialog-card >>> .q-field__control {
  background: rgba(255, 255, 255, 0.7);
  border-radius: 10px;
  border: 1px solid rgba(76, 175, 80, 0.2);
  transition: all 0.3s ease;
}

.dialog-card >>> .q-field__control:hover {
  border-color: rgba(76, 175, 80, 0.4);
  background: rgba(255, 255, 255, 0.9);
}

.dialog-card >>> .q-field--focused .q-field__control {
  border-color: #4caf50;
  box-shadow: 0 0 0 3px rgba(76, 175, 80, 0.15);
}

/* Dialog input label and text colors */
.dialog-card >>> .q-field__label {
  color: #1b5e20 !important;
}

.dialog-card >>> .q-field__native,
.dialog-card >>> .q-field__input {
  color: #333 !important;
}

.dialog-card >>> .q-field__native::placeholder,
.dialog-card >>> .q-field__input::placeholder {
  color: rgba(0, 0, 0, 0.5) !important;
}

.dialog-card >>> .q-icon {
  color: #1b5e20 !important;
}

.dialog-card >>> .q-select__dropdown-icon {
  color: #1b5e20 !important;
}

.dialog-card >>> .q-field--float .q-field__label {
  color: #1b5e20 !important;
}

/* Map Picker Styles */
.location-picker {
  margin-bottom: 8px;
}

.map-picker-container {
  border: 2px solid rgba(76, 175, 80, 0.3);
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.map-picker-container:hover {
  border-color: rgba(76, 175, 80, 0.5);
}

.map-picker-container .leaflet-container {
  cursor: crosshair !important;
}

/* Text Colors */
.text-white {
  color: #1b5e20 !important;
}

.text-grey-5 {
  color: rgba(0, 0, 0, 0.6) !important;
}

.text-grey-4 {
  color: rgba(0, 0, 0, 0.7) !important;
}

@media (max-width: 1024px) {
  .page-header .row {
    flex-direction: column;
    align-items: flex-start !important;
    gap: 16px;
  }

  .blob {
    filter: blur(80px);
  }
}
</style>
