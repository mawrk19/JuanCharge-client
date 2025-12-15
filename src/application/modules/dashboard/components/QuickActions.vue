<template>
  <q-card class="quick-actions-card">
    <q-card-section>
      <div class="text-h6 q-mb-md">
        <q-icon name="bolt" size="24px" color="green" class="q-mr-sm" />
        Quick Actions
      </div>
      <div class="actions-grid">
        <q-btn
          unelevated
          class="action-btn"
          @click="$router.push('/main/kiosks')"
        >
          <div class="action-content">
            <q-icon name="add_business" size="32px" />
            <div class="action-label">Add Kiosk</div>
          </div>
        </q-btn>
        
        <q-btn
          unelevated
          class="action-btn"
          @click="$router.push('/main/users')"
        >
          <div class="action-content">
            <q-icon name="people" size="32px" />
            <div class="action-label">View Patrons</div>
          </div>
        </q-btn>
        
        <q-btn
          unelevated
          class="action-btn"
          @click="$router.push('/main/analytics')"
        >
          <div class="action-content">
            <q-icon name="analytics" size="32px" />
            <div class="action-label">Analytics</div>
          </div>
        </q-btn>
        
        <q-btn
          unelevated
          class="action-btn"
          @click="$router.push('/main/map')"
        >
          <div class="action-content">
            <q-icon name="map" size="32px" />
            <div class="action-label">Map View</div>
          </div>
        </q-btn>
        
        <q-btn
          unelevated
          class="action-btn"
          @click="$router.push('/main/kiosks')"
        >
          <div class="action-content">
            <q-icon name="inventory_2" size="32px" />
            <div class="action-label">Kiosks</div>
          </div>
        </q-btn>
        
        <q-btn
          unelevated
          class="action-btn"
          @click="$router.push('/main/settings')"
        >
          <div class="action-content">
            <q-icon name="settings" size="32px" />
            <div class="action-label">Settings</div>
          </div>
        </q-btn>
      </div>
    </q-card-section>
  </q-card>
</template>

<script>
export default {
  name: "QuickActions"
};
</script>

<style scoped>
.quick-actions-card {
  background: rgba(20, 34, 33, 0.8);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(76, 175, 80, 0.2);
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  transition: all 0.3s ease;
  height: 100%;
}

.quick-actions-card:hover {
  border-color: rgba(76, 175, 80, 0.4);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.4), 0 0 30px rgba(76, 175, 80, 0.1);
}

.quick-actions-card >>> .text-h6 {
  color: white;
  font-weight: 600;
  display: flex;
  align-items: center;
}

.actions-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
}

.action-btn {
  background: rgba(76, 175, 80, 0.1);
  border: 1px solid rgba(76, 175, 80, 0.3);
  border-radius: 12px;
  padding: 20px 12px;
  transition: all 0.3s ease;
  height: auto;
  min-height: 100px;
}

.action-btn:hover {
  background: rgba(76, 175, 80, 0.2);
  border-color: rgba(76, 175, 80, 0.5);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(76, 175, 80, 0.3);
}

.action-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  color: white;
}

.action-content .q-icon {
  color: #66bb6a;
}

.action-label {
  font-size: 0.875rem;
  font-weight: 500;
  text-align: center;
  line-height: 1.2;
}

@media (max-width: 768px) {
  .actions-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 480px) {
  .actions-grid {
    grid-template-columns: 1fr;
  }
}
</style>
