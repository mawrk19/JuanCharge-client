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
        LGU User Management
      </div>
      <div class="text-subtitle1 text-grey-5">
        Manage LGU users, roles, and permissions
      </div>
    </div>

    <!-- Users Table Card -->
    <q-card class="table-card">
      <q-card-section class="q-pa-none">
        <q-table
          :data="users"
          :columns="columns"
          row-key="id"
          :pagination.sync="pagination"
          :filter="filter"
          :loading="isLoading"
          @request="onRequest"
          bordered
          class="modern-table"
        >
          <!-- No Data Slot -->
          <template v-slot:no-data>
            <div
              class="full-width row flex-center text-grey-5 q-gutter-sm q-py-xl"
            >
              <q-icon size="2em" name="warning" />
              <span>No users found</span>
            </div>
          </template>

          <!-- Table Header Slot -->
          <template v-slot:top>
            <div class="row full-width items-center q-pa-md">
              <div class="text-h6 text-white">LGU Users List</div>
              <q-space />
              <q-btn
                color="green"
                icon="add"
                label="Create User"
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

          <!-- Name Column -->
          <template v-slot:body-cell-name="props">
            <q-td :props="props">
              <div class="row items-center no-wrap">
                <q-avatar
                  size="32px"
                  color="green"
                  text-color="white"
                  class="q-mr-sm"
                >
                  {{ getInitials(props.row.name) }}
                </q-avatar>
                <span class="text-white text-weight-medium">{{
                  props.row.name
                }}</span>
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
                <q-icon
                  name="phone"
                  size="16px"
                  color="grey-5"
                  class="q-mr-xs"
                />
                <span class="text-grey-4">{{ props.row.phone }}</span>
              </div>
            </q-td>
          </template>

          <!-- Email Column -->
          <template v-slot:body-cell-email="props">
            <q-td :props="props">
              <div class="row items-center no-wrap">
                <q-icon
                  name="email"
                  size="16px"
                  color="grey-5"
                  class="q-mr-xs"
                />
                <span class="text-grey-4">{{ props.row.email }}</span>
              </div>
            </q-td>
          </template>

          <!-- LGU Column -->
          <template v-slot:body-cell-lgu="props">
            <q-td :props="props">
              <div class="row items-center no-wrap">
                <q-icon
                  name="business"
                  size="16px"
                  color="primary"
                  class="q-mr-xs"
                />
                <span class="text-weight-medium text-primary">{{ props.row.lgu_name || "-" }}</span>
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
                @click="editUser(props.row)"
              >
                <q-tooltip>Edit User</q-tooltip>
              </q-btn>
              <q-btn
                flat
                dense
                round
                icon="delete"
                color="red"
                size="sm"
                @click="deleteUserHandler(props.row)"
                class="q-ml-xs"
              >
                <q-tooltip>Delete User</q-tooltip>
              </q-btn>
            </q-td>
          </template>
        </q-table>
      </q-card-section>
    </q-card>

    <!-- Create/Edit User Dialog -->
    <q-dialog v-model="showCreateDialog" persistent>
      <q-card class="dialog-card" style="min-width: 500px">
        <q-card-section class="row items-center q-pb-none">
          <div class="text-h6 text-white">
            {{ editingId ? "Edit User" : "Create New User" }}
          </div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>

        <q-card-section>
          <q-form
            @submit="editingId ? updateUserHandler() : createUserHandler()"
            class="q-gutter-md"
          >
            <!-- First Name Field -->
            <q-input
              v-model="userForm.first_name"
              label="First Name"
              outlined
              dense
              :rules="[(val) => !!val || 'First name is required']"
            >
              <template v-slot:prepend>
                <q-icon name="person" />
              </template>
            </q-input>

            <!-- Last Name Field -->
            <q-input
              v-model="userForm.last_name"
              label="Last Name"
              
              outlined
              dense
              :rules="[(val) => !!val || 'Last name is required']"
            >
              <template v-slot:prepend>
                <q-icon name="person_outline" />
              </template>
            </q-input>

            <!-- Role Dropdown -->
            <q-select
              v-model="userForm.role"
              :options="roleOptions"
              label="Role"
              outlined
              dense
              :rules="[(val) => !!val || 'Role is required']"
            >
              <template v-slot:prepend>
                <q-icon name="badge" />
              </template>
            </q-select>

            <!-- LGU Selection Field -->
            <q-select
              v-model="userForm.lgu_id"
              :options="lguOptions"
              option-value="value"
              option-label="label"
              emit-value
              map-options
              label="Select LGU"
              outlined
              dense
              :rules="[(val) => !!val || 'LGU is required']"
            >
              <template v-slot:prepend>
                <q-icon name="business" />
              </template>
            </q-select>

            <!-- Phone Number Field -->
            <q-input
              v-model="userForm.phone_number"
              label="Phone Number"
              
              outlined
              dense
              :rules="[(val) => !!val || 'Phone number is required']"
              placeholder="+63 XXX XXX XXXX"
            >
              <template v-slot:prepend>
                <q-icon name="phone" />
              </template>
            </q-input>

            <!-- Email Field -->
            <q-input
              v-model="userForm.email"
              label="Email Address"
              type="email"
              
              outlined
              dense
              :rules="[
                (val) => !!val || 'Email is required',
                (val) => /.+@.+\..+/.test(val) || 'Email must be valid',
              ]"
            >
              <template v-slot:prepend>
                <q-icon name="email" />
              </template>
            </q-input>

            <!-- Birth Date Field -->
            <q-input
              v-model="userForm.birth_date"
              label="Birth Date"
              
              outlined
              dense
              placeholder="YYYY-MM-DD or click calendar"
            >
              <template v-slot:prepend>
                <q-icon name="cake" />
              </template>
              <template v-slot:append>
                <q-icon name="event" class="cursor-pointer">
                  <q-popup-proxy
                    cover
                    transition-show="scale"
                    transition-hide="scale"
                  >
                    <q-date
                      v-model="userForm.birth_date"
                      dark
                      mask="YYYY-MM-DD"
                      today-btn
                    >
                      <div class="row items-center justify-end">
                        <q-btn
                          v-close-popup
                          label="Close"
                          color="primary"
                          flat
                        />
                      </div>
                    </q-date>
                  </q-popup-proxy>
                </q-icon>
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
                :label="editingId ? 'Update User' : 'Create User'"
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

    <!-- Edit User Dialog -->
    <q-dialog v-model="showEditDialog" persistent>
      <q-card class="dialog-card" style="min-width: 500px">
        <q-card-section class="row items-center q-pb-none">
          <div class="text-h6 text-white">Edit User</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>

        <q-card-section>
          <q-form @submit="updateUserHandler" class="q-gutter-md">
            <!-- First Name Field -->
            <q-input
              v-model="userForm.first_name"
              label="First Name"
              outlined
              dense
              :rules="[(val) => !!val || 'First name is required']"
            >
              <template v-slot:prepend>
                <q-icon name="person" />
              </template>
            </q-input>

            <!-- Last Name Field -->
            <q-input
              v-model="userForm.last_name"
              label="Last Name"
              outlined
              dense
              :rules="[(val) => !!val || 'Last name is required']"
            >
              <template v-slot:prepend>
                <q-icon name="person_outline" />
              </template>
            </q-input>

            <!-- Role Dropdown -->
            <q-select
              v-model="userForm.role"
              :options="roleOptions"
              label="Role"
              outlined
              dense
              :rules="[(val) => !!val || 'Role is required']"
            >
              <template v-slot:prepend>
                <q-icon name="badge" />
              </template>
            </q-select>

            <!-- LGU Selection Field -->
            <q-select
              v-model="userForm.lgu_id"
              :options="lguOptions"
              option-value="value"
              option-label="label"
              emit-value
              map-options
              label="Select LGU"
              outlined
              dense
              :rules="[(val) => !!val || 'LGU is required']"
            >
              <template v-slot:prepend>
                <q-icon name="business" />
              </template>
            </q-select>

            <!-- Phone Number Field -->
            <q-input
              v-model="userForm.phone_number"
              label="Phone Number"
              outlined
              dense
              :rules="[(val) => !!val || 'Phone number is required']"
              placeholder="+63 XXX XXX XXXX"
            >
              <template v-slot:prepend>
                <q-icon name="phone" />
              </template>
            </q-input>

            <!-- Email Field -->
            <q-input
              v-model="userForm.email"
              label="Email Address"
              type="email"
              outlined
              dense
              :rules="[
                (val) => !!val || 'Email is required',
                (val) => /.+@.+\..+/.test(val) || 'Email must be valid',
              ]"
            >
              <template v-slot:prepend>
                <q-icon name="email" />
              </template>
            </q-input>

            <!-- Birth Date Field -->
            <q-input
              v-model="userForm.birth_date"
              label="Birth Date"
              outlined
              dense
              placeholder="YYYY-MM-DD or click calendar"
            >
              <template v-slot:prepend>
                <q-icon name="cake" />
              </template>
              <template v-slot:append>
                <q-icon name="event" class="cursor-pointer">
                  <q-popup-proxy
                    cover
                    transition-show="scale"
                    transition-hide="scale"
                  >
                    <q-date
                      v-model="userForm.birth_date"
                      dark
                      mask="YYYY-MM-DD"
                      today-btn
                    >
                      <div class="row items-center justify-end">
                        <q-btn
                          v-close-popup
                          label="Close"
                          color="primary"
                          flat
                        />
                      </div>
                    </q-date>
                  </q-popup-proxy>
                </q-icon>
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
                label="Update User"
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
      filter: "",
      showCreateDialog: false,
      showEditDialog: false, // NEW: for edit modal
      saving: false,
      editingUserId: null, // NEW: track which user is being edited
      editingId: null, // Track which user is being edited in create/edit dialog

      pagination: {
        page: 1,
        rowsPerPage: 10,
        rowsNumber: 0,
      },

      userForm: {
        phone_number: "",
        email: "",
        birth_date: null,
        lgu_id: null,
      },

      roleOptions: ["Admin", "Manager", "Operator", "Support"],
      lguOptions: [],

      columns: [
        // {
        //   name: 'id',
        //   label: 'ID',
        //   field: 'id',
        //   align: 'left',
        //   sortable: true
        // },
        {
          name: "name",
          label: "Name",
          field: "name",
          align: "left",
          sortable: true,
        },
        {
          name: "roles",
          label: "Roles",
          field: "roles",
          align: "left",
          sortable: false,
        },
        {
          name: "phone",
          label: "Phone Number",
          field: "phone",
          align: "left",
          sortable: true,
        },
        {
          name: "email",
          label: "Email Address",
          field: "email",
          align: "left",
          sortable: true,
        },
        {
          name: "lgu",
          label: "LGU",
          field: (row) => row.lgu_name || "-",
          align: "left",
          sortable: true,
        },
        {
          name: "birth_date",
          label: "Birth Date",
          field: "birth_date",
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

      users: [],
    };
  },

  computed: {
    isLoading() {
      return this.$store.getters["users/isLoading"];
    },
    error() {
      return this.$store.getters["users/error"];
    },
  },

  mounted() {
    this.loadUsers();
    this.loadLgus();
  },

  methods: {
    async loadLgus() {
      try {
        const response = await this.$store.dispatch("lgus/fetchLgus");
        const lgusData = response?.data || response;
        if (Array.isArray(lgusData)) {
          this.lguOptions = lgusData.map((lgu) => ({
            label: lgu.name,
            value: lgu.id,
          }));
        }
      } catch (error) {
        // console.error('Failed to load LGUs:', error);
      }
    },
    // Normalize date to YYYY-MM-DD format (remove time)
    normalizeDateOnly(dateString) {
      if (!dateString) return null;
      // Handle both 'T' separator and space separator
      return dateString.split("T")[0].split(" ")[0];
    },

    async loadUsers() {
      await this.onRequest({
        pagination: this.pagination,
      });
    },

    // Handle table pagination requests
    async onRequest(props) {
      const { page, rowsPerPage } = props.pagination;

      try {
        const response = await this.$store.dispatch("users/fetchUsers", {
          page,
          per_page: rowsPerPage,
        });

        // Map the response data to table format
        if (response && response.data) {
          const mappedUsers = response.data.map((user) => ({
            id: user.id,
            name:
              user.first_name && user.last_name
                ? `${user.first_name} ${user.last_name}`
                : user.name || "N/A",
            first_name: user.first_name,
            last_name: user.last_name,
            email: user.email,
            phone: user.phone_number,
            birth_date: this.normalizeDateOnly(user.birth_date),
            roles: [user.role],
            lgu_id: user.lgu_id,
            lgu_name: user.lgu?.name || user.lgu_name || "-",
          }));

          this.users = mappedUsers;

          // Update pagination
          if (response.pagination) {
            this.pagination.rowsNumber = response.pagination.total;
          }
        }

        // Update local pagination
        this.pagination.page = page;
        this.pagination.rowsPerPage = rowsPerPage;
      } catch (error) {
        this.$q.notify({
          color: "red",
          message: "Failed to load users",
          icon: "error",
          position: "top",
        });
      } finally {
        // Loading state is managed by store
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

    getRoleColor(role) {
      const colors = {
        Admin: "red",
        Manager: "orange",
        Operator: "blue",
        Support: "purple",
        User: "grey",
        Administrator: "red",
      };
      return colors[role] || "grey";
    },

    openCreateDialog() {
      this.editingId = null;
      this.userForm = {
        first_name: "",
        last_name: "",
        role: null,
        phone_number: "",
        email: "",
        birth_date: null,
        lgu_id: null,
      };
      this.showCreateDialog = true;
    },

    async createUserHandler() {
      this.saving = true;

      try {
        const response = await this.$store.dispatch(
          "users/createUser",
          this.userForm
        );

        if (response.success) {
          this.$q.notify({
            color: "green",
            message: response.message || "User created successfully",
            icon: "check_circle",
            position: "top",
          });

          this.users.unshift({
            id: response.data.id,
            name: `${response.data.first_name} ${response.data.last_name}`,
            first_name: response.data.first_name,
            last_name: response.data.last_name,
            email: response.data.email,
            phone: response.data.phone_number,
            birth_date: this.normalizeDateOnly(response.data.birth_date),
            roles: [response.data.role],
            lgu_id: response.data.lgu_id,
            lgu_name: response.data.lgu?.name || response.data.lgu_name || "-",
          });

          this.showCreateDialog = false;

          // Show success notification
          this.$q.notify({
            color: "green",
            message: "User created successfully",
            icon: "check_circle",
            position: "top",
          });
        }
      } catch (error) {
        let errorMessage = "Failed to create user";

        if (error.response?.data?.errors) {
          const errors = error.response.data.errors;
          errorMessage = Object.values(errors).flat().join(", ");
        } else if (error.response?.data?.message) {
          errorMessage = error.response.data.message;
        } else if (error.response?.data) {
          errorMessage = JSON.stringify(error.response.data);
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

    async editUser(user) {
      // Fetch full user data from API to get birth_date
      this.editingUserId = user.id;

      try {
        // Fetch complete user data from backend
        const response = await this.$store.dispatch("users/getUser", user.id);

        if (response.data) {
          const fullUserData = response.data;
          this.userForm = {
            first_name: fullUserData.first_name || "",
            last_name: fullUserData.last_name || "",
            role: fullUserData.role,
            phone_number: fullUserData.phone_number,
            email: fullUserData.email,
            birth_date: this.normalizeDateOnly(fullUserData.birth_date),
            lgu_id: fullUserData.lgu_id,
          };
        }
      } catch (error) {
        // console.error('Error fetching user details:', error);
        // Fallback to table data if API call fails
        this.userForm = {
          first_name: "",
          last_name: "",
          role: user.roles[0],
          phone_number: user.phone,
          email: user.email,
          birth_date: null,
        };
      }

      this.showEditDialog = true;
    },

    async updateUserHandler() {
      this.saving = true;

      try {
        const response = await this.$store.dispatch("users/updateUser", {
          id: this.editingUserId,
          userData: this.userForm, // FIX: changed 'data' to 'userData'
        });

        if (response.success) {
          this.$q.notify({
            color: "green",
            message: response.message || "User updated successfully",
            icon: "check_circle",
            position: "top",
          });

          // Update user in the table immediately (no refresh needed!)
          const index = this.users.findIndex(
            (u) => u.id === this.editingUserId
          );
          if (index !== -1) {
            // Use $set to ensure Vue detects the change
            this.$set(this.users, index, {
              id: response.data.id,
              name: `${response.data.first_name} ${response.data.last_name}`,
              first_name: response.data.first_name,
              last_name: response.data.last_name,
              email: response.data.email,
              phone: response.data.phone_number,
              birth_date: this.normalizeDateOnly(response.data.birth_date),
              roles: [response.data.role],
              lgu_id: response.data.lgu_id,
              lgu_name: response.data.lgu?.name || response.data.lgu_name || "-",
            });
          }

          this.showEditDialog = false;

          // Force Vue to update the table
          this.$forceUpdate();
        }
      } catch (error) {
        let errorMessage = "Failed to update user";

        if (error.response?.data?.errors) {
          const errors = error.response.data.errors;
          errorMessage = Object.values(errors).flat().join(", ");
        } else if (error.response?.data?.message) {
          errorMessage = error.response.data.message;
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

    async deleteUserHandler(user) {
      this.$q
        .dialog({
          title: "Confirm Delete",
          message: `Are you sure you want to delete ${user.name}?`,
          cancel: true,
          persistent: true,
          dark: true,
        })
        .onOk(async () => {
          try {
            await this.$store.dispatch("users/deleteUser", user.id);
            this.users = this.users.filter((u) => u.id !== user.id);

            this.$q.notify({
              color: "green",
              message: "User deleted successfully",
              icon: "check_circle",
              position: "top",
            });
          } catch (error) {
            this.$q.notify({
              color: "red",
              message: "Failed to delete user",
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
.users-page {
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
