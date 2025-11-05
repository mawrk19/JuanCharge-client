<template>
	<q-page class="settings-bg">
		<div class="animated-bg">
			<div class="blob blob-1"></div>
			<div class="blob blob-2"></div>
			<div class="blob blob-3"></div>
		</div>
			<div class="settings-header">
				<div class="row items-center justify-between">
					<div>
					<div class="text-h3 text-white text-weight-bold ">
						Settings
					</div>
					<div class="text-subtitle1 text-grey-5">
						Settings and Configurations
					</div>
					</div>
				</div>
				</div>

		<div class="content-container q-pa-md">
			<q-card class="floating-drawer">
				<q-list class="navigation-menu">
					<q-item clickable class="menu-item" :class="{ 'active-menu-item': activeSection === 'profile' }"
						@click="setActive('profile')">
						<q-item-section avatar><q-icon name="person" /></q-item-section>
						<q-item-section><q-item-label>Profile</q-item-label></q-item-section>
					</q-item>

					<q-item clickable class="menu-item" :class="{ 'active-menu-item': activeSection === 'preferences' }"
						@click="setActive('preferences')">
						<q-item-section avatar><q-icon name="tune" /></q-item-section>
						<q-item-section><q-item-label>Preferences</q-item-label></q-item-section>
					</q-item>

					<q-item clickable class="menu-item" :class="{ 'active-menu-item': activeSection === 'other' }"
						@click="setActive('other')">
						<q-item-section avatar><q-icon name="more_horiz" /></q-item-section>
						<q-item-section><q-item-label>Other Settings</q-item-label></q-item-section>
					</q-item>
				</q-list>
			</q-card>

			<q-card class="content-panel-card">
				<q-card-section v-if="activeSection === 'profile'" class="section-content">
					<header class="active-panel-header text-white">Profile Setting</header>
				</q-card-section>

				<q-card-section v-if="activeSection === 'preferences'" class="section-content">
					<header class="active-panel-header text-white">Preference Settings</header>
				</q-card-section>

				<q-card-section v-if="activeSection === 'other'" class="section-content">
					<header class="active-panel-header text-white">Other Settings</header>
				</q-card-section>
			</q-card>
		</div>
	</q-page>
</template>

<script>
export default {
	name: 'SettingsIndex',
	data() {
		return {
			activeSection: 'profile'
		}
	},
	methods: {
		setActive(section) {
			this.activeSection = section
		}
	},
	mounted() {
		// correct console.log syntax
		console.log('Settings mounted, activeSection:', this.activeSection)
	}
}
</script>

<style scoped>
.settings-bg {
	background: linear-gradient(135deg, #0a0f0d 0%, #142221 50%, #1a2c28 100%);
	min-height: 100vh;
	position: relative;
	overflow-y: auto;
}

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

	0%,
	100% {
		transform: translate(0, 0) scale(1);
	}

	33% {
		transform: translate(50px, -80px) scale(1.15);
	}

	66% {
		transform: translate(-30px, 50px) scale(0.9);
	}
}

/* ===== Main Layout ===== */
.content-container {
	position: relative;
	z-index: 1;
	display: grid;
	grid-template-columns: 280px 1fr;
	gap: 24px;
	max-width: 1400px;
	margin: 0 auto;
}

/* ===== Floating Drawer ===== */
.floating-drawer {
	background: rgba(20, 34, 33, 0.8);
	backdrop-filter: blur(10px);
	border: 1px solid rgba(76, 175, 80, 0.2);
	border-radius: 16px;
	height: fit-content;
	position: sticky;
	top: 24px;
	transition: all 0.3s ease;
}

.floating-drawer:hover {
	border-color: rgba(76, 175, 80, 0.4);
	box-shadow: 0 8px 32px rgba(76, 175, 80, 0.15);
}

.navigation-menu {
	padding: 8px;
}

.menu-header {
	padding: 16px;
	margin-bottom: 8px;
}

.menu-item {
  padding: 8px;
  margin: 4px;
  border-radius: 12px;
  transition: all 0.2s ease;
  color: rgba(255, 255, 255, 0.7);
}

.menu-item:hover {
  background: rgba(56, 255, 62, 0.1);
  color: #ffffff;
}

.active-menu-item {
  background: rgba(44, 163, 48, 0.241);
  color: #ffffff;
  font-weight: 600;
}

/* ===== Content Panel Card ===== */
.content-panel-card {
	background: rgba(20, 34, 33, 0.8);
	backdrop-filter: blur(10px);
	border: 1px solid rgba(76, 175, 80, 0.2);
	border-radius: 16px;
	min-height: 600px;
	transition: all 0.3s ease;
}

.content-panel-card:hover {
	border-color: rgba(76, 175, 80, 0.3);
}

.section-content {
	animation: fadeIn 0.3s ease-in;
	
}

.section-content h1 {
	color: #e8f5e9;
	font-weight: 600;
	font-size: 2rem;
	margin: 0;
}

.active-panel-header {
	font-size: 1.7rem;
	font-weight: 600;
	margin-bottom: 16px;
	border-bottom: 2px solid rgba(76, 175, 80, 0.5);
	padding-bottom: 8px;
}

.settings-header{
	padding: 18px;
	margin-top: 16px;
	margin-bottom: 12px;
	background: rgba(20, 34, 33, 0.6);
	backdrop-filter: blur(10px);
	border: 1px solid rgba(76, 175, 80, 0.2);
	border-radius: 16px;
	max-width: 1368px;
	margin-left: auto;
	margin-right: auto;
	
}

@keyframes fadeIn {
	from {
		opacity: 0;
		transform: translateY(10px);
	}

	to {
		opacity: 1;
		transform: translateY(0);
	}
}

/* ===== Responsive Design ===== */


@media (max-width: 1024px) {
	.content-container {
		grid-template-columns: 1fr;
	}

	.floating-drawer {
		position: relative;
		top: 0;
	}

	.settings-header{
		max-width: 100%;
		margin-left: 12px;
		margin-right: 12px;
		margin-bottom:6px;
	}
}

@media (max-width: 600px) {
	.settings-bg {
		padding: 12px;
	}

	.content-container {
		gap: 16px;
	}

	.settings-header{
		max-width: 100%;
		margin-left: 12px;
		margin-right: 12px;
		margin-bottom:6px;
	}
}
</style>