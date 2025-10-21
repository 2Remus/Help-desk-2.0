import { createRouter, createWebHistory } from 'vue-router'
import Client from '../components/client.vue'
import TicketList from '../components/ticket_list.vue'
import UserManagement from '../components/userManagement.vue'
import Login from '../components/Login.vue'
import InstitutionManagement from '../components/institutionManagement.vue'
import EditInstitution from '../components/EditInstitution.vue'
import EditUser from '../components/EditUser.vue'
import ViewTicket from '../components/ViewTicket.vue'
import RegisterForm from '../components/RegisterForm.vue'
import ActivateView from '../components/Activate.vue'
import FequentlyAskedQuestions from '../components/FequentlyAskedQuestions.vue'
import IssueTypeManagement from '../components/IssueTypeManagement.vue'
import TicketStatusManagement from '../components/TicketStatusManagement.vue'
import AllTickets from '../components/AllTickets.vue'
import ForgotPassword from '../components/ForgotPassword.vue'
import ResetPassword from '../components/ResetPassword.vue'
import MyTickets from '../components/mytickets.vue'
<<<<<<< HEAD
import UserRoleManagement from '../components/UserRoleManagement.vue'
import UserPermissionManagement from '../components/UserPermissionManagement.vue'
import ViewUser from '../views/ViewUser.vue'
=======
import RoleManager from '../components/RoleManager.vue'
import UpdateRole from '../components/updateRole.vue'
>>>>>>> d81c0d74f7afa7beac1c4b77559aead47a9d3796

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL || '/'),
  routes: [
     {
      path: '/',
      name: 'Client',
      component: Client
    },
    {
      path: '/tickets',
      name: 'TicketList',
      component: TicketList
    },
      {
      path: '/all-tickets',
      name: 'AllTickets',
      component: AllTickets
    },
    {
      path: '/user-management',
      name: 'UserManagement',
      component: UserManagement
    },
    {
      path: '/institution-management',
      name: 'InstitutionManagement',
      component: InstitutionManagement
    },
     {
      path: '/institutions/edit/:id',
      name: 'edit-institution',
      component: EditInstitution
    },
    {
      path: '/users/edit/:id',
      name: 'edit-user',
      component: EditUser
    },
     {
      path: '/tickets/view/:id',
      name: 'view-ticket',
      component: ViewTicket
    },
    {
      path: '/login',
      name: 'login',
      component: Login
    },
    {
      path: '/register',
      name: 'register',
      component: RegisterForm
    },
    {
      path: '/activate',
      name: 'activate-account',
      component: ActivateView
    },
     {
      path: '/frequently-asked-questions',
      name: 'frequently-asked-questions',
      component: FequentlyAskedQuestions
    },
    {
      path: '/issue-types',
      name: 'issue-types',
      component: IssueTypeManagement
    },
     {
      path: '/ticket-statuses',
      name: 'ticket-statuses',
      component: TicketStatusManagement
      },
      {
        path: '/my-tickets',
        name: 'my-tickets',
        component: MyTickets
        },
      {
      path: '/forgot-password',
      name: 'forgot password',
      component: ForgotPassword
      },
       {
      path: '/reset-password',
      name: 'reset password',
      component: ResetPassword
      },
<<<<<<< HEAD
      {
      path: '/user-roles',
      name: 'user roles',
      component: UserRoleManagement
      },
        {
      path: '/user-permissions',
      name: 'user permissions',
      component: UserPermissionManagement
      },
        {
      path: '/users/view/:id',
      name: 'view user',
      component: ViewUser
      },
=======


      {
        path: '/role-management',
        name: 'role management',
        component: RoleManager
        },

        {
          path: '/update-role',
          name: 'update role',
          component: UpdateRole
          },
>>>>>>> d81c0d74f7afa7beac1c4b77559aead47a9d3796
    { path: '/:pathMatch(.*)*', redirect: '/' }
  ]
})


export default router
