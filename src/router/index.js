import { createRouter, createWebHistory } from 'vue-router'
import CustomerHomePage from '../views/CustomerHomePage.vue'
import CustomerLoginPage from '../views/LoginPage.vue'
import CustomerSignupPage from '../views/CustomerSignupPage.vue'
import ForgetPasswordPage from '../views/ForgetPasswordPage.vue'
import MedicalRegister from "@/components/MedicalRegister.vue";
import CheckupHistory from "@/components/CheckupHistory.vue";
import NotFoundPage from "@/views/NotFoundPage.vue";
import UserHomePage from "@/views/UserHomePage.vue";
import UserManagementPage from "@/views/UserManagementPage.vue";
import CheckupMangementPage from "@/views/CheckupMangementPage.vue";
import ReportPage from "@/views/ReportPage.vue";


const routes = [
  {
    path: '/',
    redirect: to => {
      return { name: 'loginPage' }
    }
  },
  {
    path: '/login',
    name: 'loginPage',
    component: CustomerLoginPage,
    meta: {
      requiresAuth: false
    }
  },
  {
    path: '/signup',
    name: 'customerSignupPage',
    component: CustomerSignupPage,
    meta: {
      requiresAuth: false
    }
  },
  {
    path: '/forget-password',
    name: 'forgetPasswordPage',
    component: ForgetPasswordPage,
    meta: {
      requiresAuth: false
    }
  },
  {
    path: '/logout',
    redirect: to => {
      return {
        path: '/login',
        name: 'loginPage',
        component: CustomerLoginPage
      }
    }
  },
  {
    path: '/customer',
    name: 'homePage',
    component: CustomerHomePage,
    meta: {
      requiresAuth: true
    },
    children: [
      { path: 'register', name: 'register', component: MedicalRegister }, // khong co '/' o path
      { path: 'checkup-history', name: 'checkupHistory', component: CheckupHistory }
    ]
  },

  {
    path: '/manage-home',
    name: 'userHomePage',
    component: UserHomePage,
    meta: {
      requiresAuth: true
    },
    children: [
      { path: 'manage-users', name: 'manageUsers', component: UserManagementPage }, // khong co '/' o path
      { path: 'manage-checkups', name: 'manageCheckups', component: CheckupMangementPage },
      { path: 'report', name: 'report', component: ReportPage }
    ]
  },
  {
    path: '/about',
    name: 'about',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/AboutView.vue')
  },
  { path: '/:notFound(.*)', component: NotFoundPage },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
  linkActiveClass: 'active'
})


// router.beforeEach((to, from, next) => {
//   const accessToken = store.state.accessToken;
//   let isAuthenticated = store.getters.isAuthenticated
//
//   if (!isAuthenticated && to.name !== 'loginPage') {
//     next({name: 'loginPage'})
//   }
//   else {
//     const decoded = jwtDecode(accessToken)
//     const role = decoded.roles[0].authority
//     // if (role === 'ROLE_CUSTOMER' && to.name.includes('customer')) {
//     //   next({name: 'homePage'})
//     // }
//     // else if (role !== 'ROLE_CUSTOMER' && to.name.startsWith('/customer')) {
//     //   next({name: 'about'})
//     // }
//     // else return false
//     next()
//   }
// });

export default router
