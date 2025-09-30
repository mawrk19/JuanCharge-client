<template>
  <div id="map" style="height: 400px;"></div>
</template>

<script>
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

export default {
  mounted() {
    const map = L.map('map').setView([14.5995, 120.9842], 13) // Manila coords
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map)

    // Example marker
    L.marker([14.5995, 120.9842]).addTo(map)
      .bindPopup('JuanCharge Station')
      .openPopup()
  }
}
</script>
