<template>
  <q-page class="convert-page q-pa-md">
    <div class="kiosk-container">
      <!-- Page Header -->
      <div class="page-header q-mb-md">
        <div class="row items-center">
          <q-btn
            flat
            dense
            round
            icon="arrow_back"
            color="white"
            @click="$router.back()"
            class="q-mr-md"
          />
          <!-- <div>
            <div class="text-h5 text-white text-weight-bold">
              <q-icon name="bolt" color="amber" size="28px" class="q-mr-sm" />
              Convert Points to Energy
            </div>
            <div class="text-caption text-grey-5">Redeem your recycling points for charging time</div>
          </div> -->
        </div>
      </div>

      <div class="row q-col-gutter-md">
        <!-- Left Column: Balance & Calculator -->
        <div class="col-12 col-md-7">
          <!-- Available Points Card -->
          <q-card class="balance-card q-mb-md">
            <q-card-section class="q-pa-md">
              <div class="row items-center justify-between">
                <div>
                  <div class="text-caption text-grey-5">Available Points</div>
                  <div class="text-h4 text-white text-weight-bold">{{ userPointsBalance }}</div>
                </div>
                <div class="energy-display">
                  <div class="text-caption text-grey-5">Energy Value</div>
                  <div class="text-h6 text-green text-weight-bold">{{ totalEnergyWh }} Wh</div>
                  <div class="text-caption text-grey-5">≈ {{ totalChargingTime }}</div>
                </div>
              </div>
            </q-card-section>
          </q-card>

          <!-- Conversion Calculator -->
          <q-card class="calculator-card">
            <q-card-section class="q-pa-md">
              <!-- Display Amount -->
              <div class="amount-display q-mb-md">
                <div class="text-caption text-grey-6 q-mb-xs">Points to Convert</div>
                <div class="amount-value text-h4 text-white text-weight-bold">
                  {{ convertAmount || '0' }}
                </div>
                <div class="conversion-details q-mt-sm">
                  <div class="detail-row">
                    <span class="text-grey-5 text-caption">Energy:</span>
                    <span class="text-green text-weight-bold">{{ convertedEnergy }} Wh</span>
                  </div>
                  <div class="detail-row">
                    <span class="text-grey-5 text-caption">Time:</span>
                    <span class="text-amber text-weight-bold">{{ convertedTime }}</span>
                  </div>
                </div>
              </div>

              <!-- Numpad -->
              <div class="numpad q-mb-sm">
                <div class="numpad-row">
                  <q-btn 
                    v-for="num in [1, 2, 3]" 
                    :key="num"
                    class="numpad-btn"
                    color="grey-9"
                    text-color="white"
                    :label="num.toString()"
                    @click="addDigit(num)"
                    size="md"
                  />
                </div>
                <div class="numpad-row">
                  <q-btn 
                    v-for="num in [4, 5, 6]" 
                    :key="num"
                    class="numpad-btn"
                    color="grey-9"
                    text-color="white"
                    :label="num.toString()"
                    @click="addDigit(num)"
                    size="md"
                  />
                </div>
                <div class="numpad-row">
                  <q-btn 
                    v-for="num in [7, 8, 9]" 
                    :key="num"
                    class="numpad-btn"
                    color="grey-9"
                    text-color="white"
                    :label="num.toString()"
                    @click="addDigit(num)"
                    size="md"
                  />
                </div>
                <div class="numpad-row">
                  <q-btn 
                    class="numpad-btn"
                    color="grey-9"
                    text-color="white"
                    label="Clear"
                    @click="clearAmount"
                    size="md"
                  />
                  <q-btn 
                    class="numpad-btn"
                    color="grey-9"
                    text-color="white"
                    label="0"
                    @click="addDigit(0)"
                    size="md"
                  />
                  <q-btn 
                    class="numpad-btn"
                    color="orange"
                    text-color="white"
                    icon="backspace"
                    @click="backspace"
                    size="md"
                  />
                </div>
              </div>

              <!-- Quick Amount Buttons -->
              <div class="quick-amounts q-mb-sm">
                <q-btn
                  v-for="amount in [10, 50, 100, 500]"
                  :key="amount"
                  outline
                  color="green"
                  :label="`${amount}`"
                  @click="setAmount(amount)"
                  size="sm"
                  class="q-mr-xs"
                />
              </div>

              <!-- Convert Button -->
              <q-btn
                color="green"
                size="md"
                icon="bolt"
                label="Redeem for Charging"
                @click="confirmConversion"
                :disable="!convertAmount || convertAmount < 10 || convertAmount > userPointsBalance"
                class="full-width"
                unelevated
              />
              <div v-if="convertAmount < 10 && convertAmount > 0" class="text-caption text-orange q-mt-xs text-center">
                Minimum: 10 points
              </div>
            </q-card-section>
          </q-card>
        </div>

        <!-- Right Column: Info & Table -->
        <div class="col-12 col-md-5">
          <!-- Combined Card for Info & Table -->
          <q-card class="info-table-card">
            <q-card-section class="q-pa-md">
              <!-- How It Works -->
              <div class="q-mb-md">
                <div class="text-subtitle2 text-white q-mb-sm">
                  <q-icon name="info" color="blue" size="18px" class="q-mr-xs" />
                  How It Works
                </div>
                <div class="text-caption text-grey-4 q-mb-xs">
                  <strong>Base:</strong> 1 pt = 0.5 Wh ≈ 5 mins
                </div>
                <div class="text-caption text-grey-4 q-mb-xs">
                  <strong>Port:</strong> 5V × 2A = 10W
                </div>
                <div class="text-caption text-grey-4">
                  <strong>Min:</strong> 10 points = 5 Wh ≈ 50 mins
                </div>
              </div>

              <!-- Divider -->
              <q-separator color="green" class="q-my-md" />

              <!-- Item Conversion Table -->
              <div>
                <div class="text-subtitle2 text-white q-mb-sm">
                  <q-icon name="recycling" color="green" size="18px" class="q-mr-xs" />
                  Item Conversion
                </div>
                <q-markup-table flat dense bordered class="conversion-table">
                  <thead>
                    <tr>
                      <th class="text-left">Item</th>
                      <th class="text-center">Pts</th>
                      <th class="text-center">Time</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="item in conversionTable" :key="item.name">
                      <td class="text-left">
                        <q-icon :name="item.icon" :color="item.color" size="16px" class="q-mr-xs" />
                        <span class="text-caption">{{ item.name }}</span>
                      </td>
                      <td class="text-center">
                        <q-badge color="green" outline size="xs">{{ item.points }}</q-badge>
                      </td>
                      <td class="text-center text-amber text-caption">{{ item.time }}</td>
                    </tr>
                  </tbody>
                </q-markup-table>
              </div>
            </q-card-section>
          </q-card>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script>
export default {
  name: "ConvertPoints",
  data() {
    return {
      convertAmount: '',
      pointToWh: 0.5, // 1 point = 0.5 Wh
      minutesPerWh: 10, // 1 Wh = 10 minutes at 10W
      
      conversionTable: [
        {
          name: 'PET Bottle (290mL)',
          weight: '15g',
          points: '1',
          energy: '0.5',
          time: '5 mins',
          icon: 'water_drop',
          color: 'blue'
        },
        {
          name: 'Aluminum Can',
          weight: '7.5g',
          points: '1',
          energy: '0.5',
          time: '5 mins',
          icon: 'sports_bar',
          color: 'grey-6'
        },
        {
          name: 'Tin Can',
          weight: '15g',
          points: '1.5',
          energy: '0.75',
          time: '7.5 mins',
          icon: 'bento',
          color: 'brown'
        }
      ]
    };
  },

  computed: {
    userPointsBalance() {
      const user = this.$store.state.auth?.user;
      return user?.points_balance || 0;
    },

    totalEnergyWh() {
      return (this.userPointsBalance * this.pointToWh).toFixed(1);
    },

    totalChargingTime() {
      const totalMinutes = this.userPointsBalance * this.pointToWh * this.minutesPerWh;
      return this.formatTime(totalMinutes);
    },

    convertedEnergy() {
      const amount = parseFloat(this.convertAmount) || 0;
      return (amount * this.pointToWh).toFixed(1);
    },

    convertedTime() {
      const amount = parseFloat(this.convertAmount) || 0;
      const minutes = amount * this.pointToWh * this.minutesPerWh;
      return this.formatTime(minutes);
    }
  },

  methods: {
    formatTime(minutes) {
      if (minutes < 60) {
        return `${Math.round(minutes)} mins`;
      }
      const hours = Math.floor(minutes / 60);
      const mins = Math.round(minutes % 60);
      return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
    },

    addDigit(digit) {
      if (this.convertAmount === '' && digit === 0) return;
      this.convertAmount = this.convertAmount + digit.toString();
      
      // Prevent exceeding available balance
      if (parseFloat(this.convertAmount) > this.userPointsBalance) {
        this.convertAmount = this.userPointsBalance.toString();
      }
    },

    backspace() {
      this.convertAmount = this.convertAmount.slice(0, -1);
    },

    clearAmount() {
      this.convertAmount = '';
    },

    setAmount(amount) {
      if (amount > this.userPointsBalance) {
        this.convertAmount = this.userPointsBalance.toString();
      } else {
        this.convertAmount = amount.toString();
      }
    },

    confirmConversion() {
      const amount = parseFloat(this.convertAmount);
      
      if (amount < 10) {
        this.$q.notify({
          type: 'warning',
          message: 'Minimum redemption is 10 points',
          position: 'top'
        });
        return;
      }

      if (amount > this.userPointsBalance) {
        this.$q.notify({
          type: 'warning',
          message: 'Insufficient points balance',
          position: 'top'
        });
        return;
      }

      const energy = (amount * this.pointToWh).toFixed(1);
      const time = this.formatTime(amount * this.pointToWh * this.minutesPerWh);

      this.$q.dialog({
        title: 'Confirm Redemption',
        message: `Redeem ${amount} points for ${energy} Wh (≈${time} of charging)?`,
        html: true,
        cancel: true,
        persistent: true,
        ok: {
          label: 'Confirm',
          color: 'green'
        }
      }).onOk(async () => {
        try {
          this.$q.loading.show({ message: 'Processing redemption...' });

          // Call backend API to redeem points and start charging session
          const session = await this.$store.dispatch('patron/startChargingSession', {
            pointsRedeemed: amount
          });

          this.$q.loading.hide();
          
          this.$q.notify({
            type: 'positive',
            message: `Charging session started! ${energy} Wh for ${time}`,
            position: 'top',
            timeout: 2000
          });
          
          // Navigate to charging session page
          setTimeout(() => {
            this.$router.push('/patron/charging');
          }, 500);
          
        } catch (error) {
          this.$q.loading.hide();
          
          // Handle specific error messages from backend
          const errorMessage = error.message || 'Failed to redeem points. Please try again.';
          
          this.$q.notify({
            type: 'negative',
            message: errorMessage,
            position: 'top'
          });
        }
      });
    }
  }
};
</script>

<style scoped>
.convert-page {
  background: linear-gradient(135deg, #0a0f0d 0%, #142221 50%, #1a2c28 100%);
  min-height: 100vh;
  max-height: 100vh;
  overflow: hidden;
}

.kiosk-container {
  max-height: calc(100vh - 100px);
  overflow-y: auto;
}

.page-header {
  padding: 0.5rem 0;
}

/* Balance Card */
.balance-card {
  background: linear-gradient(135deg, rgba(76, 175, 80, 0.2) 0%, rgba(20, 34, 33, 0.9) 100%);
  backdrop-filter: blur(10px);
  border: 2px solid rgba(76, 175, 80, 0.4);
  border-radius: 12px;
}

.energy-display {
  text-align: right;
}

/* Info Card */
.info-card {
  background: rgba(30, 30, 30, 0.8);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(33, 150, 243, 0.3);
  border-radius: 12px;
}

/* Combined Info & Table Card */
.info-table-card {
  background: rgba(30, 30, 30, 0.8);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(76, 175, 80, 0.3);
  border-radius: 12px;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.info-table-card .q-card__section {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

/* Calculator Card */
.calculator-card {
  background: rgba(20, 34, 33, 0.9);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(76, 175, 80, 0.3);
  border-radius: 12px;
}

.amount-display {
  background: rgba(30, 30, 30, 0.8);
  border: 2px solid rgba(76, 175, 80, 0.3);
  border-radius: 12px;
  padding: 16px;
  text-align: center;
}

.amount-value {
  font-size: 2rem;
  color: #4caf50;
  letter-spacing: 2px;
  font-family: monospace;
}

.conversion-details {
  display: flex;
  justify-content: space-around;
  gap: 12px;
}

.detail-row {
  display: flex;
  flex-direction: column;
  gap: 2px;
  text-align: center;
}

/* Numpad Styles */
.numpad {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.numpad-row {
  display: flex;
  gap: 6px;
  justify-content: center;
}

.numpad-btn {
  flex: 1;
  min-height: 45px;
  font-size: 1.2rem;
  font-weight: bold;
  border-radius: 8px;
  transition: all 0.2s ease;
}

.numpad-btn:hover {
  transform: scale(1.05);
  box-shadow: 0 4px 12px rgba(76, 175, 80, 0.3);
}

.numpad-btn:active {
  transform: scale(0.95);
}

/* Quick Amounts */
.quick-amounts {
  padding-top: 8px;
  border-top: 1px solid rgba(76, 175, 80, 0.2);
  text-align: center;
}

/* Table Card */
.table-card {
  background: rgba(30, 30, 30, 0.8);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(76, 175, 80, 0.2);
  border-radius: 12px;
}

.conversion-table {
  background: transparent;
}

.conversion-table thead tr {
  background: rgba(76, 175, 80, 0.15);
}

.conversion-table thead th {
  color: #4caf50;
  font-weight: 700;
  text-transform: uppercase;
  font-size: 0.65rem;
  letter-spacing: 0.5px;
  border: 1px solid rgba(76, 175, 80, 0.3);
  padding: 8px 4px;
}

.conversion-table tbody tr {
  transition: all 0.3s ease;
  border-bottom: 1px solid rgba(76, 175, 80, 0.2);
}

.conversion-table tbody tr:hover {
  background: rgba(76, 175, 80, 0.1);
}

.conversion-table tbody td {
  color: rgba(255, 255, 255, 0.9);
  padding: 8px 4px;
  font-size: 0.75rem;
  border: 1px solid rgba(76, 175, 80, 0.1);
}

/* Responsive for Kiosk */
@media (max-width: 1024px) {
  .amount-value {
    font-size: 1.5rem;
  }
  
  .numpad-btn {
    min-height: 40px;
    font-size: 1rem;
  }
}
</style>
