user_type (WHO the user is)
Examples:

super_admin
admin
doctor
customer
pharmacy_owner
------------------------
user_role (WHAT the user can manage)
Examples:

user_management
claims_management
pharmacy_management
consultation_management
------------------
user_type defines the category of the user and is used for high-level access
control like super admin bypass, while roles define the permissions and
responsibilities within the system using RBAC.

### sequilize operation:
npx sequelize-cli migration:generate --name add-user-type-to-users
