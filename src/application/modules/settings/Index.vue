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
			<q-card class="content-panel-card">
				<!-- Tabs Navigation -->
				<q-tabs
					v-model="activeSection"
					class="professional-tabs-compact"
					active-color="green"
					indicator-color="green"
					align="left"
					dense
				>
					<q-tab name="profile" icon="person" label="Profile" class="tab-item-compact" />
					<q-tab name="preferences" icon="settings" label="Account Settings" class="tab-item-compact" />
				</q-tabs>

				<q-separator color="rgba(76, 175, 80, 0.2)" />

				<q-tab-panels v-model="activeSection" animated class="tab-panels-compact">
					<!-- Profile Panel -->
					<q-tab-panel name="profile" class="professional-panel-compact">
						<!-- Profile Header -->
						<div class="profile-header-compact">
							<q-avatar size="80px" color="green" text-color="white" class="profile-avatar-compact">
								<span class="text-h4 text-weight-bold">{{ userInitials }}</span>
							</q-avatar>
							<div class="profile-info-compact">
								<h2 class="profile-name-compact">{{ userFullName }}</h2>
								<p class="profile-email-compact">{{ userEmail }}</p>
								<q-chip size="sm" color="green" text-color="white" dense>
									<q-icon name="verified_user" size="14px" class="q-mr-xs" />
									{{ userType }}
								</q-chip>
							</div>
						</div>

						<q-separator color="rgba(76, 175, 80, 0.2)" class="q-my-md" />					<!-- Information Section -->
					<div class="info-section-compact">
						<h3 class="section-title-compact">
							<q-icon name="info" color="green" size="20px" class="q-mr-sm" />
							Personal Information
						</h3>
						
						<div class="info-list-professional">
							<!-- Full Name -->
							<div class="info-row-item">
								<div class="info-label">
									<q-icon name="badge" color="green" size="18px" class="q-mr-sm" />
									<span>Full Name</span>
								</div>
								<div class="info-value">{{ userFullName || 'Not provided' }}</div>
							</div>

							<q-separator color="rgba(76, 175, 80, 0.1)" />

							<!-- Email Address -->
							<div class="info-row-item">
								<div class="info-label">
									<q-icon name="email" color="green" size="18px" class="q-mr-sm" />
									<span>Email Address</span>
								</div>
								<div class="info-value">{{ userEmail || 'Not provided' }}</div>
							</div>

							<q-separator color="rgba(76, 175, 80, 0.1)" />

							<!-- Contact Number -->
							<div class="info-row-item">
								<div class="info-label">
									<q-icon name="phone" color="green" size="18px" class="q-mr-sm" />
									<span>Contact Number</span>
								</div>
								<div class="info-value">{{ userContact || 'Not provided' }}</div>
							</div>

							<q-separator color="rgba(76, 175, 80, 0.1)" />

							<!-- Account Type -->
							<div class="info-row-item">
								<div class="info-label">
									<q-icon name="admin_panel_settings" color="green" size="18px" class="q-mr-sm" />
									<span>Account Type</span>
								</div>
								<div class="info-value">
									<q-chip 
										dense 
										:color="userType === 'admin' ? 'green' : userType === 'lgu' ? 'blue' : 'orange'" 
										text-color="white"
										class="text-weight-medium"
										size="sm"
									>
										{{ userType }}
									</q-chip>
								</div>
							</div>
						</div>
					</div>
				</q-tab-panel>

				<!-- Settings Panel -->
				<q-tab-panel name="preferences" class="professional-panel-compact">
					<!-- Profile Information Section -->
					<div class="settings-section-compact">
						<div class="section-header-compact">
							<q-icon name="person" color="green" size="20px" />
							<span>Profile Information</span>
						</div>
						
						<q-form @submit.prevent="updateProfile" class="compact-form">
							<div class="form-grid-2">
								<div class="form-group-compact">
									<label class="form-label-compact">First Name</label>
									<q-input
										v-model="profileForm.firstName"
										outlined
										dense
										dark
										color="green"
										placeholder="First name"
										class="compact-input"
									>
										<template v-slot:prepend>
											<q-icon name="badge" color="green" size="18px" />
										</template>
									</q-input>
								</div>
								
								<div class="form-group-compact">
									<label class="form-label-compact">Last Name</label>
									<q-input
										v-model="profileForm.lastName"
										outlined
										dense
										dark
										color="green"
										placeholder="Last name"
										class="compact-input"
									>
										<template v-slot:prepend>
											<q-icon name="badge" color="green" size="18px" />
										</template>
									</q-input>
								</div>
							</div>

							<div class="form-grid-2">
								<div class="form-group-compact">
									<label class="form-label-compact">Email Address</label>
									<q-input
										v-model="profileForm.email"
										outlined
										dense
										dark
										color="green"
										type="email"
										placeholder="Email address"
										class="compact-input"
									>
										<template v-slot:prepend>
											<q-icon name="email" color="green" size="18px" />
										</template>
									</q-input>
								</div>

								<div class="form-group-compact">
									<label class="form-label-compact">Contact Number</label>
									<q-input
										v-model="profileForm.contactNumber"
										outlined
										dense
										dark
										color="green"
										mask="(+63) #### - ### - ####"
										placeholder="(+63) ____ - ___ - ____"
										class="compact-input"
									>
										<template v-slot:prepend>
											<q-icon name="phone" color="green" size="18px" />
										</template>
									</q-input>
								</div>
							</div>

							<div class="form-actions-compact">
								<q-btn
									label="Save Changes"
									type="submit"
									color="green"
									unelevated
									no-caps
									size="sm"
									:loading="profileLoading"
									class="action-btn-compact"
									icon="save"
								/>
							</div>
						</q-form>
					</div>

					<q-separator color="rgba(76, 175, 80, 0.2)" class="q-my-md" />

					<!-- Security Section -->
					<div class="settings-section-compact">
						<div class="section-header-compact">
							<q-icon name="security" color="green" size="20px" />
							<span>Security Settings</span>
						</div>
						
						<q-form @submit.prevent="changePassword" class="compact-form">
							<div class="form-group-compact">
								<label class="form-label-compact">Current Password</label>
								<q-input
									v-model="passwordForm.currentPassword"
									outlined
									dense
									dark
									color="green"
									:type="showCurrentPassword ? 'text' : 'password'"
									placeholder="Current password"
									class="compact-input"
								>
									<template v-slot:prepend>
										<q-icon name="lock" color="green" size="18px" />
									</template>
									<template v-slot:append>
										<q-icon
											:name="showCurrentPassword ? 'visibility' : 'visibility_off'"
											class="cursor-pointer"
											size="18px"
											@click="showCurrentPassword = !showCurrentPassword"
										/>
									</template>
								</q-input>
							</div>

							<div class="form-grid-2">
								<div class="form-group-compact">
									<label class="form-label-compact">New Password</label>
									<q-input
										v-model="passwordForm.newPassword"
										outlined
										dense
										dark
										color="green"
										:type="showNewPassword ? 'text' : 'password'"
										placeholder="New password"
										class="compact-input"
									>
										<template v-slot:prepend>
											<q-icon name="lock_open" color="green" size="18px" />
										</template>
										<template v-slot:append>
											<q-icon
												:name="showNewPassword ? 'visibility' : 'visibility_off'"
												class="cursor-pointer"
												size="18px"
												@click="showNewPassword = !showNewPassword"
											/>
										</template>
									</q-input>
								</div>

								<div class="form-group-compact">
									<label class="form-label-compact">Confirm Password</label>
									<q-input
										v-model="passwordForm.confirmPassword"
										outlined
										dense
										dark
										color="green"
										:type="showConfirmPassword ? 'text' : 'password'"
										placeholder="Confirm password"
										class="compact-input"
									>
										<template v-slot:prepend>
											<q-icon name="lock_reset" color="green" size="18px" />
										</template>
										<template v-slot:append>
											<q-icon
												:name="showConfirmPassword ? 'visibility' : 'visibility_off'"
												class="cursor-pointer"
												size="18px"
												@click="showConfirmPassword = !showConfirmPassword"
											/>
										</template>
									</q-input>
								</div>
							</div>

							<div class="form-actions-compact">
								<q-btn
									label="Change Password"
									type="submit"
									color="green"
									unelevated
									no-caps
									size="sm"
									:loading="passwordLoading"
									class="action-btn-compact"
									icon="vpn_key"
								/>
							</div>
						</q-form>
					</div>
				</q-tab-panel>
				</q-tab-panels>
			</q-card>
		</div>
	</q-page>
</template>

<script>
export default {
	name: 'SettingsIndex',
	data() {
		return {
			activeSection: 'profile',
			profileForm: {
				firstName: '',
				lastName: '',
				email: '',
				contactNumber: ''
			},
			passwordForm: {
				currentPassword: '',
				newPassword: '',
				confirmPassword: ''
			},
			profileLoading: false,
			passwordLoading: false,
			showCurrentPassword: false,
			showNewPassword: false,
			showConfirmPassword: false
		}
	},
	computed: {
		user() {
			return this.$store.state.auth.user || {};
		},
		userFullName() {
			return `${this.user.first_name || ''} ${this.user.last_name || ''}`.trim() || 'User';
		},
		userEmail() {
			return this.user.email || 'No email';
		},
		userContact() {
			return this.user.contact_number || 'No contact number';
		},
		userType() {
			const type = this.user.user_type || 'user';
			return type.charAt(0).toUpperCase() + type.slice(1).replace('_', ' ');
		},
		userInitials() {
			const first = this.user.first_name?.[0] || '';
			const last = this.user.last_name?.[0] || '';
			return (first + last).toUpperCase() || 'U';
		}
	},
	methods: {
		setActive(section) {
			this.activeSection = section;
		},
		loadUserData() {
			this.profileForm.firstName = this.user.first_name || '';
			this.profileForm.lastName = this.user.last_name || '';
			this.profileForm.email = this.user.email || '';
			this.profileForm.contactNumber = this.user.contact_number || '';
		},
		async updateProfile() {
			try {
				this.profileLoading = true;
				
				await this.$store.dispatch('auth/updateProfile', {
					firstName: this.profileForm.firstName,
					lastName: this.profileForm.lastName,
					email: this.profileForm.email,
					contactNumber: this.profileForm.contactNumber
				});
				
				this.$q.notify({
					type: 'positive',
					message: 'Profile updated successfully',
					icon: 'check_circle',
					position: 'top'
				});
			} catch (err) {
				this.$q.notify({
					type: 'negative',
					message: err.response?.data?.message || 'Failed to update profile',
					icon: 'error',
					position: 'top'
				});
			} finally {
				this.profileLoading = false;
			}
		},
		async changePassword() {
			// Validate that all fields are filled
			if (!this.passwordForm.currentPassword || !this.passwordForm.newPassword || !this.passwordForm.confirmPassword) {
				this.$q.notify({
					type: 'warning',
					message: 'Please fill in all password fields',
					icon: 'warning',
					position: 'top'
				});
				return;
			}

			// Validate new password length
			if (this.passwordForm.newPassword.length < 6) {
				this.$q.notify({
					type: 'warning',
					message: 'New password must be at least 6 characters',
					icon: 'warning',
					position: 'top'
				});
				return;
			}

			// Validate that new passwords match
			if (this.passwordForm.newPassword !== this.passwordForm.confirmPassword) {
				this.$q.notify({
					type: 'warning',
					message: 'New passwords do not match',
					icon: 'warning',
					position: 'top'
				});
				return;
			}

			try {
				this.passwordLoading = true;
				
				await this.$store.dispatch('auth/changePassword', {
					currentPassword: this.passwordForm.currentPassword,
					newPassword: this.passwordForm.newPassword,
					newPasswordConfirmation: this.passwordForm.confirmPassword
				});
				
				this.$q.notify({
					type: 'positive',
					message: 'Password changed successfully.',
					icon: 'check_circle',
					position: 'top'
				});
				
				// Clear form
				this.passwordForm = {
					currentPassword: '',
					newPassword: '',
					confirmPassword: ''
				};
			} catch (err) {
				this.$q.notify({
					type: 'negative',
					message: err.response?.data?.message || 'Current password is incorrect or failed to change password',
					icon: 'error',
					position: 'top'
				});
			} finally {
				this.passwordLoading = false;
			}
		}
	},
	mounted() {
		this.loadUserData();
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
	max-width: 1200px;
	margin: 0 auto;
}

/* ===== Content Panel Card ===== */
.content-panel-card {
	background: rgba(20, 34, 33, 0.8);
	backdrop-filter: blur(10px);
	border: 1px solid rgba(76, 175, 80, 0.2);
	border-radius: 16px;
	overflow: hidden;
	transition: all 0.3s ease;
}

.content-panel-card:hover {
	border-color: rgba(76, 175, 80, 0.3);
}

/* ===== Professional Tabs ===== */
.professional-tabs-compact {
	background: rgba(20, 34, 33, 0.5);
	min-height: 48px;
	padding: 0 12px;
}

.tab-item-compact {
	font-weight: 600;
	font-size: 14px;
	letter-spacing: 0.3px;
	text-transform: uppercase;
	transition: all 0.3s ease;
	min-height: 48px;
	padding: 0 16px;
}

.tab-item-compact:hover {
	background-color: rgba(76, 175, 80, 0.1);
}

/* ===== Tab Panels ===== */
.tab-panels-compact {
	background: transparent;
}

.professional-panel-compact {
	padding: 20px 24px !important;
}

/* ===== Profile Header Compact ===== */
.profile-header-compact {
	display: flex;
	align-items: center;
	gap: 20px;
	padding: 16px;
	background: linear-gradient(135deg, rgba(20, 34, 33, 0.6) 0%, rgba(76, 175, 80, 0.1) 100%);
	border-radius: 12px;
	border: 2px solid rgba(76, 175, 80, 0.2);
}

.profile-avatar-compact {
	border: 3px solid rgba(76, 175, 80, 0.5);
	box-shadow: 0 4px 12px rgba(76, 175, 80, 0.3);
	flex-shrink: 0;
}

.profile-info-compact {
	flex: 1;
}

.profile-name-compact {
	font-size: 24px;
	font-weight: 700;
	color: #ffffff;
	margin: 0 0 4px 0;
	letter-spacing: -0.3px;
}

.profile-email-compact {
	font-size: 14px;
	color: rgba(255, 255, 255, 0.7);
	margin: 0 0 8px 0;
}

/* ===== Section Titles Compact ===== */
.section-title-compact {
	display: flex;
	align-items: center;
	font-size: 18px;
	font-weight: 600;
	color: #ffffff;
	margin: 0 0 16px 0;
	padding-bottom: 8px;
	border-bottom: 2px solid rgba(76, 175, 80, 0.3);
}

/* ===== Info Section Compact ===== */
.info-section-compact {
	margin-top: 20px;
}

/* Old styles for backward compatibility */
.tab-item {
	font-size: 14px;
	font-weight: 600;
	text-transform: none;
	letter-spacing: 0.3px;
}

.tab-panels-container {
	background: transparent;
}

.professional-panel {
	padding: 32px;
}

/* ===== Profile Header Modern ===== */
.profile-header-modern {
	display: flex;
	align-items: center;
	gap: 32px;
	padding: 24px;
	background: rgba(76, 175, 80, 0.05);
	border-radius: 12px;
	border: 1px solid rgba(76, 175, 80, 0.15);
}

.profile-avatar-container {
	flex-shrink: 0;
}

.profile-avatar-large {
	border: 4px solid rgba(76, 175, 80, 0.4);
	box-shadow: 0 8px 24px rgba(76, 175, 80, 0.3);
}

.profile-info-header {
	flex: 1;
}

.profile-name {
	font-size: 32px;
	font-weight: 700;
	color: #ffffff;
	margin: 0 0 8px 0;
	letter-spacing: -0.5px;
}

.profile-email {
	font-size: 16px;
	color: rgba(255, 255, 255, 0.7);
	margin: 0;
}

/* ===== Section Titles ===== */
.section-title {
	display: flex;
	align-items: center;
	font-size: 22px;
	font-weight: 600;
	color: #ffffff;
	margin: 0 0 24px 0;
	padding-bottom: 12px;
	border-bottom: 2px solid rgba(76, 175, 80, 0.3);
}

/* ===== Info Section ===== */
.info-section {
	margin-top: 32px;
}

.info-list-professional {
	background: rgba(20, 34, 33, 0.4);
	border: 1px solid rgba(76, 175, 80, 0.2);
	border-radius: 12px;
	overflow: hidden;
}

.info-row-item {
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 18px 20px;
	transition: background-color 0.2s ease;
}

.info-row-item:hover {
	background-color: rgba(76, 175, 80, 0.05);
}

.info-label {
	display: flex;
	align-items: center;
	font-size: 14px;
	font-weight: 600;
	color: rgba(255, 255, 255, 0.7);
	text-transform: capitalize;
	min-width: 160px;
}

.info-value {
	font-size: 15px;
	font-weight: 500;
	color: #ffffff;
	text-align: right;
	flex: 1;
}

/* Old card styles - keeping for backward compatibility if needed */
.info-grid-modern {
	display: grid;
	grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
	gap: 20px;
}

.info-card {
	background: rgba(20, 34, 33, 0.6);
	border: 1px solid rgba(76, 175, 80, 0.2);
	border-radius: 12px;
	padding: 20px;
	transition: all 0.3s ease;
}

.info-card:hover {
	border-color: rgba(76, 175, 80, 0.4);
	transform: translateY(-4px);
	box-shadow: 0 8px 16px rgba(76, 175, 80, 0.2);
}

.info-card-header {
	display: flex;
	align-items: center;
	gap: 8px;
	margin-bottom: 12px;
}

.info-card-title {
	font-size: 12px;
	font-weight: 600;
	color: rgba(255, 255, 255, 0.6);
	text-transform: uppercase;
	letter-spacing: 0.5px;
}

.info-card-content {
	font-size: 16px;
	font-weight: 500;
	color: #ffffff;
	word-break: break-word;
}

/* ===== Settings Section ===== */
.settings-section {
	margin-bottom: 48px;
}

.settings-section:last-child {
	margin-bottom: 0;
}

/* ===== Professional Form ===== */
.professional-form {
	max-width: 800px;
}

.form-row {
	display: grid;
	grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
	gap: 20px;
	margin-bottom: 20px;
}

.form-col {
	display: flex;
	flex-direction: column;
}

.form-field {
	margin-bottom: 20px;
}

.form-label {
	display: block;
	font-size: 13px;
	font-weight: 600;
	color: rgba(255, 255, 255, 0.8);
	margin-bottom: 8px;
	text-transform: uppercase;
	letter-spacing: 0.5px;
}

.professional-input {
	background: rgba(0, 0, 0, 0.2);
	border-radius: 8px;
}

.professional-input >>> .q-field__control {
	background: transparent;
	border-color: rgba(76, 175, 80, 0.3);
}

.professional-input >>> .q-field__control:hover {
	border-color: rgba(76, 175, 80, 0.5);
}

.professional-input >>> .q-field--focused .q-field__control {
	border-color: #4caf50;
	box-shadow: 0 0 0 2px rgba(76, 175, 80, 0.2);
}

.form-actions {
	margin-top: 32px;
	display: flex;
	justify-content: flex-end;
	gap: 12px;
}

.action-btn {
	min-width: 160px;
	height: 44px;
	font-weight: 600;
	letter-spacing: 0.3px;
	font-size: 14px;
}

/* ===== Compact Form Styles ===== */
.settings-section-compact {
	margin-bottom: 0;
}

.section-header-compact {
	display: flex;
	align-items: center;
	gap: 10px;
	font-size: 16px;
	font-weight: 600;
	color: #ffffff;
	margin-bottom: 16px;
	padding-bottom: 8px;
	border-bottom: 1px solid rgba(76, 175, 80, 0.2);
}

.compact-form {
	max-width: 100%;
}

.form-grid-2 {
	display: grid;
	grid-template-columns: repeat(2, 1fr);
	gap: 16px;
	margin-bottom: 16px;
}

.form-group-compact {
	display: flex;
	flex-direction: column;
}

.form-label-compact {
	display: block;
	font-size: 12px;
	font-weight: 600;
	color: rgba(255, 255, 255, 0.7);
	margin-bottom: 6px;
	text-transform: capitalize;
	letter-spacing: 0.3px;
}

.compact-input {
	background: rgba(0, 0, 0, 0.2);
	border-radius: 8px;
}

.compact-input >>> .q-field__control {
	background: transparent;
	border-color: rgba(76, 175, 80, 0.3);
	min-height: 40px;
}

.compact-input >>> .q-field__control:hover {
	border-color: rgba(76, 175, 80, 0.5);
}

.compact-input >>> .q-field--focused .q-field__control {
	border-color: #4caf50;
	box-shadow: 0 0 0 2px rgba(76, 175, 80, 0.2);
}

.compact-input >>> .q-field__native {
	font-size: 14px;
	padding: 8px 12px;
}

.form-actions-compact {
	margin-top: 16px;
	display: flex;
	justify-content: flex-end;
}

.action-btn-compact {
	min-width: 140px;
	height: 36px;
	font-weight: 600;
	letter-spacing: 0.3px;
	font-size: 13px;
}

/* ===== Responsive Design ===== */
@media (max-width: 768px) {
	.professional-panel {
		padding: 20px;
	}

	.profile-header-modern {
		flex-direction: column;
		text-align: center;
		gap: 20px;
	}

	.profile-name {
		font-size: 24px;
	}

	.section-title {
		font-size: 18px;
	}

	.info-grid-modern {
		grid-template-columns: 1fr;
	}

	.form-row {
		grid-template-columns: 1fr;
	}

	.professional-form {
		max-width: 100%;
	}
}

/* Remove old styles that are no longer needed */
.floating-drawer,
.navigation-menu,
.menu-item,
.active-menu-item,
.profile-card,
.profile-header-section,
.profile-avatar,
.about-grid,
.about-item,
.about-icon,
.about-content,
.about-label,
.about-value,
.settings-card {
	/* These are now replaced by the new professional styles */
}

/* ===== Old Styles to Keep ===== */

.settings-header{
	padding: 18px;
	margin-top: 16px;
	margin-bottom: 12px;
	background: rgba(20, 34, 33, 0.6);
	backdrop-filter: blur(10px);
	border: 1px solid rgba(76, 175, 80, 0.2);
	border-radius: 16px;
	max-width: 1200px;
	margin-left: auto;
	margin-right: auto;
}

/* ===== Profile Cards ===== */
.profile-card {
	background: rgba(20, 34, 33, 0.6);
	backdrop-filter: blur(10px);
	border: 1px solid rgba(76, 175, 80, 0.2);
	border-radius: 16px;
	transition: all 0.3s ease;
}

.profile-card:hover {
	border-color: rgba(76, 175, 80, 0.4);
}

.profile-header-section {
	padding: 24px;
}

.profile-avatar {
	border: 3px solid rgba(76, 175, 80, 0.5);
	box-shadow: 0 4px 12px rgba(76, 175, 80, 0.3);
}

.about-grid {
	display: grid;
	grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
	gap: 16px;
}

.about-item {
	display: flex;
	align-items: flex-start;
	gap: 12px;
	padding: 16px;
	background: rgba(0, 0, 0, 0.2);
	border-radius: 12px;
	transition: all 0.2s ease;
}

.about-item:hover {
	background: rgba(76, 175, 80, 0.1);
	transform: translateY(-2px);
}

.about-icon {
	width: 40px;
	height: 40px;
	display: flex;
	align-items: center;
	justify-content: center;
	background: rgba(76, 175, 80, 0.2);
	border-radius: 50%;
}

.about-content {
	flex: 1;
}

.about-label {
	font-size: 12px;
	color: rgba(255, 255, 255, 0.6);
	text-transform: uppercase;
	letter-spacing: 0.5px;
	margin-bottom: 4px;
}

.about-value {
	font-size: 16px;
	color: #ffffff;
	font-weight: 500;
}

/* ===== Settings Cards ===== */
.settings-card {
	background: rgba(20, 34, 33, 0.6);
	backdrop-filter: blur(10px);
	border: 1px solid rgba(76, 175, 80, 0.2);
	border-radius: 16px;
	transition: all 0.3s ease;
}

.settings-card:hover {
	border-color: rgba(76, 175, 80, 0.4);
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
	.settings-header {
		max-width: 100%;
		margin-left: 12px;
		margin-right: 12px;
	}
}

@media (max-width: 600px) {
	.settings-bg {
		padding: 12px;
	}

	.content-container {
		padding: 12px !important;
	}

	.settings-header {
		margin-left: 0;
		margin-right: 0;
	}

	.form-grid-2 {
		grid-template-columns: 1fr;
		gap: 12px;
	}

	.professional-panel-compact {
		padding: 16px 20px !important;
	}

	.profile-header-compact {
		flex-direction: column;
		text-align: center;
		gap: 12px;
	}
}
</style>