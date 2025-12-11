# Help Desk 2.0

A modern, full-stack help desk ticketing system built with Vue 3, Vite, and a backend API. This application allows users to submit support tickets, track their status, and manage user roles and permissions.

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Installation](#installation)
- [Configuration](#configuration)
- [Usage](#usage)
- [API Endpoints](#api-endpoints)
- [Components](#components)
- [User Roles & Permissions](#user-roles--permissions)
- [Contributing](#contributing)
- [License](#license)

## ✨ Features

### User Management
- **User Registration & Authentication**: Secure login with JWT tokens
- **Role-Based Access Control**: Admin, User, and custom roles
- **User Permissions**: Fine-grained permission system
- **User Status**: Active/Inactive user management
- **Issue Type Assignment**: Assign support categories to users

### Ticket Management
- **Create Tickets**: Users can submit support requests
- **View All Tickets**: Admins can view all tickets in the system
- **My Tickets**: Users can view their assigned tickets
- **Update Ticket Status**: Change ticket status (Open, In Progress, Closed)
- **Update Priority**: Manage ticket priority levels (Low, Medium, High)
- **Issue Type Categorization**: Organize tickets by issue type
- **Date Filtering**: Filter tickets by date range
- **Search Functionality**: Search tickets by subject/description

### Institution Management
- **Multi-Institution Support**: Manage users across multiple institutions
- **Institution Assignment**: Assign users to specific institutions

### Admin Dashboard
- **User Management**: Create, edit, delete users
- **Role Management**: Manage user roles and permissions
- **Permission Management**: Fine-tune system permissions
- **Ticket Oversight**: Monitor all system tickets
- **Issue Type Management**: Create and manage issue types
- **Ticket Status Management**: Define custom ticket statuses

## 🛠 Tech Stack

### Frontend
- **Vue 3** - Progressive JavaScript framework
- **Vite** - Next-generation build tool
- **Vue Router** - Client-side routing
- **PrimeIcons** - Icon library
- **JWT Decode** - JWT token decoding
- **Vue Toastification** - Toast notifications

### Backend
- **Java/Kotlin**
- **REST API**
- **JWT Authentication**

### Styling
- **CSS 3** with scoped styles
- **Responsive Design**

## 📁 Project Structure

```
Help-desk-2.0/
├── src/
│   ├── components/
│   │   ├── MainTemplate.vue          # Main layout wrapper
│   │   ├── userManagement.vue        # User CRUD operations
│   │   ├── ticket_list.vue           # All tickets view
│   │   ├── mytickets.vue             # User's assigned tickets
│   │   ├── TicketView.vue            # Single ticket detail view
│   │   └── ...other components
│   ├── stores/
│   │   └── auth.ts                   # Pinia auth store
│   ├── router/
│   │   └── index.ts                  # Vue Router configuration
│   ├── App.vue
│   └── main.js
├── vite.config.js
├── package.json
└── README.md
```

## 📦 Installation

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Help-desk-2.0
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```
   or
   ```bash
   yarn install
   ```

4. **Install missing packages** (if needed)
   ```bash
   npm install @vitejs/plugin-vue
   ```

## ⚙️ Configuration

### Environment Setup

Update the API base URLs in your component files. Currently set to:
```javascript
https://vswiftsupport.gov.vc/api
// or
http://138.68.58.185:8080/api
```

### Vite Config

The `vite.config.js` is pre-configured with Vue support:

```javascript
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  base: '/', // Set the base path for the application
})
```

## 🚀 Usage

### Development

```bash
npm run dev
```

The app will start at `http://localhost:5173` (or similar).

### Production Build

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## 🔌 API Endpoints

### Authentication
- `POST /api/login` - User login
- `POST /api/register` - User registration

### Users
- `GET /api/users` - Fetch all users
- `POST /api/users/create` - Create new user
- `PUT /api/users/edit/role/{userId}` - Update user role
- `PUT /api/users/edit/activeStatus/{userId}` - Update user active status
- `DELETE /api/users/change/{userId}` - Delete user
- `GET /api/users/{userId}` - Get user details
- `PUT /api/users/{userId}` - Update user

### Tickets
- `GET /api/tickets` - Fetch all tickets
- `GET /api/tickets/my-assigned` - Fetch user's assigned tickets
- `POST /api/tickets` - Create new ticket
- `GET /api/tickets/{ticketId}` - Get ticket details
- `PUT /api/tickets/status/{ticketId}` - Update ticket status
- `PUT /api/tickets/priority/{ticketId}` - Update ticket priority
- `PUT /api/tickets/issue-type/{ticketId}` - Update ticket issue type

### Issue Types
- `GET /api/issue-types` - Fetch all issue types
- `POST /api/issue-types` - Create issue type

### Institutions
- `GET /api/institutions` - Fetch all institutions
- `POST /api/institutions` - Create institution

### Roles & Permissions
- `GET /api/user-roles` - Fetch all roles
- `GET /api/user-permissions` - Fetch all permissions

## 🧩 Components

### MainTemplate.vue
Main layout component with:
- Fixed topbar with user info
- Responsive sidebar navigation
- Mobile-friendly hamburger menu
- Dark overlay on mobile sidebar toggle

**Features:**
- Permission-based menu items
- Logout functionality
- User email display

### UserManagement.vue
Comprehensive user management interface:
- Create new users
- View all users (admin only)
- Edit user roles
- Update issue type assignment
- Change user active status
- Delete users

**Required Permissions:**
- `create user` - Add new users
- `update user` - Edit user properties
- `delete user` - Remove users
- `admin` - Access user list

### MyTickets.vue
Users can view and manage their assigned tickets:
- View assigned tickets
- Filter by status, priority, date range
- Search by subject
- Update ticket status
- Update ticket priority
- Update issue type

**Features:**
- Responsive table layout
- Real-time status updates
- Date formatting
- Multiple filter options

### ticket_list.vue
Admin view of all system tickets:
- View all tickets
- Same filtering and update capabilities as MyTickets
- Full system oversight

## 👥 User Roles & Permissions

### Permission System

The app uses a fine-grained permission system. Available permissions include:
- `view roles` - View role management
- `view institutions` - Access institution management
- `view assigned tickets` - See assigned tickets
- `view categorized tickets` - View tickets by category
- `view ticket statuses` - Manage ticket statuses
- `view issue types` - Manage issue types
- `create user` - Create new users
- `update user` - Update user information
- `delete user` - Delete users
- `update ticket` - Modify ticket details
- `admin` - Full admin access

### Role Types
- **Admin**: Full system access
- **User**: Limited access (can view/manage own tickets)
- **Custom Roles**: Defined by institution

## 🎨 Styling & Responsiveness

### Breakpoints
- **Mobile**: ≤ 500px
- **Tablet**: ≤ 768px
- **Desktop**: > 768px

### Key Features
- Mobile-first responsive design
- Sidebar collapses on mobile
- Table converts to card layout on small screens
- Touch-friendly interface

## 🔐 Authentication & Security

- **JWT Tokens**: Secure token-based authentication
- **Token Storage**: Stored in localStorage
- **Authorization Headers**: All API calls include Bearer token
- **Permission Validation**: Client-side permission checking with `$can()` directive

## 📝 Form Validation

- Email format validation
- Required field validation
- Password field masking
- Confirmation dialogs for destructive actions

## 🧪 Toast Notifications

User feedback via toast notifications:
- Success messages (green)
- Error messages (red)
- Auto-dismiss after 3 seconds

## 🐛 Troubleshooting

### Missing Package Error
```bash
npm install @vitejs/plugin-vue
```

### API Connection Issues
- Check API URL configuration
- Verify backend server is running
- Check network connectivity
- Verify JWT token validity

### Permission Denied
- Check user role assignment
- Verify user permissions in backend
- Check token expiration

## 📚 Additional Resources

- [Vue 3 Documentation](https://vuejs.org/)
- [Vite Documentation](https://vitejs.dev/)
- [Vue Router Guide](https://router.vuejs.org/)
- [PrimeIcons](https://www.primeicons.org/)

## 🤝 Contributing

1. Create a feature branch
2. Commit your changes
3. Push to the branch
4. Open a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

**Last Updated**: December 11, 2025
**Version**: 2.0
