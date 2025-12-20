<template>
  <q-page class="map-page">
    <!-- Split Layout Container -->
    <div class="split-container">
      <!-- Left Side: Map -->
      <div class="map-section">
        <!-- Search Filter Panel -->
        <div class="search-panel tw-glass q-pa-md">
          <div class="row q-col-gutter-sm">
            <!-- Search Input with Autocomplete -->
            <div class="col-12 col-md-6">
              <q-input
                v-model="searchQuery"
                outlined
                dense
                placeholder="Search charging stations..."
                bg-color="white"
                @input="onSearchInput"
                clearable
                @clear="clearSearch"
              >
                <template v-slot:prepend>
                  <q-icon name="search" />
                </template>
                
                <!-- Suggestions Menu -->
                <q-menu
                  v-model="showSuggestions"
                  fit
                  no-parent-event
                >
                  <q-list style="min-width: 100px; max-height: 400px; overflow-y: auto;">
                    <q-item
                      v-for="suggestion in searchSuggestions"
                      :key="suggestion.value"
                      clickable
                      v-close-popup
                      @click="selectSuggestion(suggestion)"
                    >
                      <q-item-section avatar>
                        <q-icon :name="suggestion.icon" :color="suggestion.iconColor" />
                      </q-item-section>
                      <q-item-section>
                        <q-item-label>{{ suggestion.label }}</q-item-label>
                        <q-item-label caption>{{ suggestion.caption }}</q-item-label>
                      </q-item-section>
                      <q-item-section side>
                        <q-badge :color="suggestion.badgeColor" :label="suggestion.badge" />
                      </q-item-section>
                    </q-item>
                    <q-item v-if="searchSuggestions.length === 0">
                      <q-item-section class="text-grey text-center">
                        No results found
                      </q-item-section>
                    </q-item>
                  </q-list>
                </q-menu>
              </q-input>
            </div>

            <!-- Status Filter -->
            <div class="col-12 col-sm-6 col-md-3">
              <q-select
                v-model="selectedStatus"
                :options="statusOptions"
                outlined
                dense
                label="Status"
                bg-color="white"
                emit-value
                map-options
                @update:model-value="filterStations"
              />
            </div>

            <!-- Connector Type Filter -->
            <div class="col-12 col-sm-6 col-md-3">
              <q-select
                v-model="selectedConnector"
                :options="connectorOptions"
                outlined
                dense
                label="Connector Type"
                bg-color="white"
                emit-value
                map-options
                @update:model-value="filterStations"
              />
            </div>
          </div>
        </div>

        <!-- Map Container -->
        <div class="map-container">
          <l-map
            ref="map"
            :zoom="zoom"
            :center="center"
            :options="mapOptions"
            style="height: 100%; width: 100%;"
            @ready="onMapReady"
          >
            <l-tile-layer
              :url="tileLayerUrl"
              :attribution="attribution"
            />
            
            <!-- Markers for Charging Stations -->
            <l-marker
              v-for="station in filteredStations"
              :key="station.id"
              :lat-lng="[station.lat, station.lng]"
              @click="selectStation(station)"
            >
              <l-icon
                :icon-url="getMarkerIcon(station.status)"
                :icon-size="[32, 32]"
                :icon-anchor="[16, 32]"
              />
              <l-popup>
                <div class="station-popup">
                  <div class="text-subtitle2 text-weight-bold">{{ station.name }}</div>
                  <div class="text-caption">Click to view details →</div>
                </div>
              </l-popup>
            </l-marker>

            <!-- User Location Marker -->
            <l-marker
              v-if="userLocation"
              :lat-lng="[userLocation.lat, userLocation.lng]"
            >
              <l-icon
                icon-url="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24'%3E%3Ccircle cx='12' cy='12' r='8' fill='%234285F4' stroke='white' stroke-width='3'/%3E%3C/svg%3E"
                :icon-size="[24, 24]"
                :icon-anchor="[12, 12]"
              />
              <l-popup>
                <div class="text-subtitle2 text-weight-bold">Your Location</div>
              </l-popup>
            </l-marker>
          </l-map>

          <!-- Locate Me Button -->
          <q-btn
            round
            color="white"
            text-color="primary"
            icon="my_location"
            class="locate-btn"
            @click="locateUser"
            :loading="locating"
          >
            <q-tooltip>Find my location</q-tooltip>
          </q-btn>
        </div>
      </div>

      <!-- Right Side: Stations Catalog -->
      <div class="stations-catalog">
        <div class="catalog-header q-pa-md">
          <div class="text-h6 text-white">Charging Stations</div>
          <div class="text-caption text-grey-5">
            {{ filteredStations.length }} station{{ filteredStations.length !== 1 ? 's' : '' }} found
          </div>
        </div>

        <div class="catalog-content">
          <!-- Loading State -->
          <div v-if="isLoadingStations" class="tw-text-center tw-p-8">
            <q-spinner color="green" size="48px" class="tw-mb-4" />
            <div class="text-grey-5">Loading stations...</div>
          </div>

          <div v-else-if="filteredStations.length === 0" class="tw-text-center tw-p-8 tw-opacity-60">
            <q-icon name="ev_station" size="48px" class="tw-mb-2" />
            <div>No stations found</div>
          </div>

          <q-card
            v-for="station in filteredStations"
            :key="station.id"
            class="station-card q-mb-md tw-cursor-pointer"
            :class="{ 'selected': selectedStation && selectedStation.id === station.id }"
            @click="selectStation(station)"
          >
            <q-card-section class="q-pa-md">
              <div class="row items-center q-mb-sm">
                <q-avatar size="40px" :color="getStatusColor(station.status)" text-color="white">
                  <q-icon name="ev_station" />
                </q-avatar>
                <div class="col q-ml-sm">
                  <div class="text-subtitle2 text-weight-bold text-white">{{ station.name }}</div>
                  <div class="text-caption text-grey-5">{{ station.kiosk_code }}</div>
                </div>
              </div>

              <q-separator class="q-my-sm" style="border-color: rgba(76, 175, 80, 0.2);" />

              <!-- Availability Indicator -->
              <div class="q-mb-sm">
                <div class="row items-center justify-between q-mb-xs">
                  <span class="text-caption text-grey-4">Availability</span>
                  <span class="text-caption text-weight-bold" :style="{ color: getStatusColor(station.status) }">
                    {{ station.available }}/{{ station.total }} ports
                  </span>
                </div>
                <q-linear-progress
                  :value="station.available / station.total"
                  :color="getStatusColor(station.status)"
                  size="8px"
                  rounded
                  class="q-mb-xs"
                />
                <div class="text-caption text-grey-5">
                  {{ Math.round((station.available / station.total) * 100) }}% available
                </div>
              </div>

              <!-- Station Info -->
              <div class="row q-col-gutter-sm q-mb-sm">
                <div class="col-6">
                  <div class="info-box q-pa-xs">
                    <q-icon name="attach_money" size="16px" color="green" />
                    <span class="text-caption text-grey-4 q-ml-xs">₱{{ station.rate }}/kWh</span>
                  </div>
                </div>
                <div class="col-6">
                  <div class="info-box q-pa-xs">
                    <q-icon name="cable" size="16px" color="blue" />
                    <span class="text-caption text-grey-4 q-ml-xs text-truncate">{{ station.connectors.join(', ') }}</span>
                  </div>
                </div>
              </div>

              <div class="row q-col-gutter-sm">
                <div class="col-6">
                  <div class="info-box q-pa-xs">
                    <q-icon name="place" size="16px" color="orange" />
                    <span class="text-caption text-grey-4 q-ml-xs">{{ station.distance }}</span>
                  </div>
                </div>
                <div class="col-6">
                  <q-badge :color="getStatusColor(station.status)" :label="station.status" class="full-width" />
                </div>
              </div>

              <!-- Action Buttons -->
              <div class="row q-col-gutter-xs q-mt-sm">
                <div class="col-6">
                  <q-btn
                    flat
                    dense
                    size="sm"
                    color="primary"
                    label="Details"
                    icon="info"
                    class="full-width"
                    @click.stop="viewStationDetails(station)"
                  />
                </div>
                <div class="col-6">
                  <q-btn
                    flat
                    dense
                    size="sm"
                    color="positive"
                    label="Directions"
                    icon="directions"
                    class="full-width"
                    @click.stop="getDirections(station)"
                  />
                </div>
              </div>
            </q-card-section>
          </q-card>
        </div>
      </div>
    </div>

    <!-- Station Details Dialog -->
    <q-dialog v-model="showDetailsDialog">
      <q-card style="min-width: 350px">
        <q-card-section v-if="selectedStation">
          <div class="text-h6">{{ selectedStation.name }}</div>
          <div class="text-subtitle2 text-grey-7">{{ selectedStation.kiosk_code }}</div>
        </q-card-section>

        <q-separator />

        <q-card-section v-if="selectedStation">
          <div class="q-mb-sm">
            <strong>Kiosk Code:</strong> {{ selectedStation.kiosk_code }}
          </div>
          <div class="q-mb-sm">
            <strong>Status:</strong>
            <q-badge :color="getStatusColor(selectedStation.status)" :label="selectedStation.status" class="q-ml-sm" />
          </div>
          <div class="q-mb-sm">
            <strong>Rate:</strong> ₱{{ selectedStation.rate }}/kWh
          </div>
          <div class="q-mb-sm">
            <strong>Available Ports:</strong> {{ selectedStation.available }}/{{ selectedStation.total }}
          </div>
          <div class="q-mb-sm">
            <strong>Connector Types:</strong> {{ selectedStation.connectors.join(', ') }}
          </div>
          <div class="q-mb-sm">
            <strong>Distance:</strong> {{ selectedStation.distance }}
          </div>
          <div class="q-mb-sm">
            <strong>Software Version:</strong> {{ selectedStation.software_version }}
          </div>
          <div class="q-mb-sm">
            <strong>Location:</strong> {{ selectedStation.lat }}, {{ selectedStation.lng }}
          </div>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Close" color="primary" v-close-popup />
          <q-btn label="Get Directions" color="primary" @click="getDirections(selectedStation)" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script>
import { LMap, LTileLayer, LMarker, LPopup, LIcon } from 'vue2-leaflet';
import 'leaflet/dist/leaflet.css';

export default {
  name: "PatronMap",
  components: {
    LMap,
    LTileLayer,
    LMarker,
    LPopup,
    LIcon
  },
  data() {
    return {
      // Map Settings
      zoom: 13,
      center: [14.5995, 120.9842], // Manila, Philippines (default)
      mapOptions: {
        zoomControl: true,
        attributionControl: true,
        zoomSnap: 0.5
      },
      tileLayerUrl: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',

      // Search and Filter
      searchQuery: '',
      searchSuggestions: [],
      allSuggestions: [],
      showSuggestions: false,
      selectedStatus: 'all',
      selectedConnector: 'all',
      
      // Filter Options
      statusOptions: [
        { label: 'All Status', value: 'all' },
        { label: 'Available', value: 'available' },
        { label: 'Occupied', value: 'occupied' },
        { label: 'Offline', value: 'offline' }
      ],
      connectorOptions: [
        { label: 'All Types', value: 'all' },
        { label: 'Type 2', value: 'Type 2' },
        { label: 'CCS', value: 'CCS' }
      ],

      // Stations Data
      allStations: [],
      filteredStations: [],
      isLoadingStations: false,

      // User Location
      userLocation: null,
      locating: false,

      // Selected Station
      selectedStation: null,
      showDetailsDialog: false
    };
  },
  async mounted() {
    await this.loadKiosks();
    this.filteredStations = [...this.allStations];
    this.generateSearchSuggestions();
    this.locateUser();
  },
  methods: {
    async loadKiosks() {
      this.isLoadingStations = true;
      try {
        await this.$store.dispatch('kiosks/fetchKiosks');
        const kiosksData = this.$store.state.kiosks.kiosks || [];
        
        this.allStations = kiosksData
          .filter(kiosk => kiosk.location)
          .map(kiosk => {
            // Parse location string "lat, lng"
            const [lat, lng] = kiosk.location.split(',').map(coord => parseFloat(coord.trim()));
            
            return {
              id: kiosk.id,
              name: `Station ${kiosk.kiosk_code}`,
              kiosk_code: kiosk.kiosk_code,
              lat: lat,
              lng: lng,
              status: kiosk.status === 'active' ? 'available' : 'offline',
              available: kiosk.status === 'active' ? 2 : 0,
              total: 2,
              rate: 15.00,
              connectors: ['Type 2', 'CCS'],
              distance: '0.5 km',
              serial_number: kiosk.serial_number,
              mac_address: kiosk.mac_address,
              ip_address: kiosk.ip_address,
              software_version: kiosk.software_version,
              assigned_to: kiosk.assigned_to
            };
          });
        
        this.filteredStations = [...this.allStations];
        
        // Center map on first station if available
        if (this.allStations.length > 0) {
          this.center = [this.allStations[0].lat, this.allStations[0].lng];
        }
      } catch (error) {
        // console.error('Error loading kiosks:', error);
        this.$q.notify({
          type: 'negative',
          message: 'Failed to load charging stations',
          icon: 'error'
        });
      } finally {
        this.isLoadingStations = false;
      }
    },

    generateSearchSuggestions() {
      this.allSuggestions = this.allStations.map(station => ({
        label: station.name,
        value: station.id,
        caption: station.kiosk_code,
        icon: 'ev_station',
        iconColor: this.getStatusColor(station.status),
        badge: station.status,
        badgeColor: this.getStatusColor(station.status),
        station: station
      }));
      this.searchSuggestions = [...this.allSuggestions];
    },

    onSearchInput(val) {
      if (val && val.length > 0) {
        const needle = val.toLowerCase();
        this.searchSuggestions = this.allSuggestions.filter(v => 
          v.label.toLowerCase().includes(needle) || 
          v.caption.toLowerCase().includes(needle)
        );
        this.showSuggestions = true;
      } else {
        this.searchSuggestions = [...this.allSuggestions];
        this.showSuggestions = false;
      }
      this.filterStations();
    },

    selectSuggestion(suggestion) {
      this.searchQuery = suggestion.label;
      this.showSuggestions = false;
      if (suggestion.station) {
        this.selectStation(suggestion.station);
      }
      this.filterStations();
    },

    onMapReady() {
      // console.log('Map is ready');
    },
    
    filterStations() {
      let filtered = [...this.allStations];

      // Filter by search query
      if (this.searchQuery && typeof this.searchQuery === 'string' && this.searchQuery.trim()) {
        const query = this.searchQuery.toLowerCase();
        filtered = filtered.filter(station => 
          station.name.toLowerCase().includes(query) ||
          station.kiosk_code.toLowerCase().includes(query)
        );
      }

      // Filter by status
      if (this.selectedStatus !== 'all') {
        filtered = filtered.filter(station => station.status === this.selectedStatus);
      }

      // Filter by connector type
      if (this.selectedConnector !== 'all') {
        filtered = filtered.filter(station => 
          station.connectors.some(c => c === this.selectedConnector)
        );
      }

      this.filteredStations = filtered;
    },

    clearSearch() {
      this.searchQuery = '';
      this.showSuggestions = false;
      // Reset to show all stations based on other filters
      this.filterStations();
    },

    selectStation(station) {
      this.selectedStation = station;
      this.center = [station.lat, station.lng];
      this.zoom = 16;
    },

    viewStationDetails(station) {
      this.selectedStation = station;
      this.showDetailsDialog = true;
    },

    getStatusColor(status) {
      switch (status) {
        case 'available':
          return 'green';
        case 'occupied':
          return 'orange';
        case 'offline':
          return 'red';
        default:
          return 'grey';
      }
    },

    getMarkerIcon(status) {
      const color = status === 'available' ? '%2322c55e' : 
                    status === 'occupied' ? '%23f97316' : 
                    '%23ef4444';
      return `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='32' height='32' viewBox='0 0 24 24'%3E%3Cpath fill='${color}' d='M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z'/%3E%3C/svg%3E`;
    },

    locateUser() {
      this.locating = true;
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            this.userLocation = {
              lat: position.coords.latitude,
              lng: position.coords.longitude
            };
            this.center = [this.userLocation.lat, this.userLocation.lng];
            this.zoom = 14;
            this.locating = false;
            this.$q.notify({
              color: 'positive',
              message: 'Location found!',
              icon: 'check_circle'
            });
          },
          (error) => {
            // console.error('Error getting location:', error);
            this.locating = false;
            this.$q.notify({
              color: 'negative',
              message: 'Unable to get your location',
              icon: 'error'
            });
          }
        );
      } else {
        this.locating = false;
        this.$q.notify({
          color: 'warning',
          message: 'Geolocation is not supported by your browser',
          icon: 'warning'
        });
      }
    },

    getDirections(station) {
      const destination = `${station.lat},${station.lng}`;
      const url = `https://www.google.com/maps/dir/?api=1&destination=${destination}`;
      window.open(url, '_blank');
    }
  }
};
</script>

<style scoped>
.map-page {
  height: calc(100vh - 50px);
  position: relative;
  overflow: hidden;
}

.split-container {
  display: flex;
  height: 100%;
  width: 100%;
}

.map-section {
  flex: 1;
  position: relative;
  min-width: 0;
}

.search-panel {
  position: absolute;
  top: 16px;
  left: 16px;
  right: 16px;
  z-index: 1000;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.map-container {
  height: 100%;
  width: 100%;
  position: relative;
}

.locate-btn {
  position: absolute;
  bottom: 24px;
  right: 24px;
  z-index: 999;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
}

.station-popup {
  min-width: 150px;
}

/* Stations Catalog */
.stations-catalog {
  width: 380px;
  background-color: #1a1a1a;
  border-left: 2px solid rgba(76, 175, 80, 0.3);
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.catalog-header {
  background: linear-gradient(135deg, rgba(76, 175, 80, 0.15) 0%, rgba(76, 175, 80, 0.05) 100%);
  border-bottom: 2px solid rgba(76, 175, 80, 0.3);
}

.catalog-content {
  flex: 1;
  overflow-y: auto;
  padding: 16px;
}

/* Custom Scrollbar for Catalog */
.catalog-content::-webkit-scrollbar {
  width: 8px;
}

.catalog-content::-webkit-scrollbar-track {
  background: rgba(0, 0, 0, 0.2);
}

.catalog-content::-webkit-scrollbar-thumb {
  background: rgba(76, 175, 80, 0.3);
  border-radius: 4px;
}

.catalog-content::-webkit-scrollbar-thumb:hover {
  background: rgba(76, 175, 80, 0.5);
}

/* Station Card */
.station-card {
  background: rgba(30, 30, 30, 0.9);
  border: 1px solid rgba(76, 175, 80, 0.2);
  border-radius: 8px;
  transition: all 0.3s ease;
}

.station-card:hover {
  border-color: rgba(76, 175, 80, 0.5);
  background: rgba(40, 40, 40, 0.9);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(76, 175, 80, 0.2);
}

.station-card.selected {
  border-color: #4caf50;
  background: rgba(50, 50, 50, 0.95);
  box-shadow: 0 0 20px rgba(76, 175, 80, 0.3);
}

.info-box {
  background: rgba(0, 0, 0, 0.3);
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.tw-glass {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.tw-cursor-pointer {
  cursor: pointer;
}

.tw-text-center {
  text-align: center;
}

.tw-p-8 {
  padding: 2rem;
}

.tw-mb-4 {
  margin-bottom: 1rem;
}

.tw-mb-2 {
  margin-bottom: 0.5rem;
}

.tw-opacity-60 {
  opacity: 0.6;
}

.text-truncate {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* Responsive */
@media (max-width: 1024px) {
  .stations-catalog {
    width: 320px;
  }
}

@media (max-width: 768px) {
  .split-container {
    flex-direction: column;
  }
  
  .map-section {
    height: 50%;
  }
  
  .stations-catalog {
    width: 100%;
    height: 50%;
    border-left: none;
    border-top: 2px solid rgba(76, 175, 80, 0.3);
  }
}
</style>
