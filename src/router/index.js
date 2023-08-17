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
import jwtDecode from "jwt-decode";
import store from "@/store";


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
  { path: '/:notFound(.*)', component: NotFoundPage },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
  linkActiveClass: 'active'
})



function isValidAccessToken(accessToken) {
  console.log(accessToken)
  if (!accessToken)
    return false
  console.log(accessToken)
  const decodedToken = jwtDecode(accessToken)
  const expiresIn = decodedToken.exp;
  const currentTime = Math.floor(Date.now() / 1000);

  return accessToken && (expiresIn > currentTime)
}

function getRole(accessToken) {
  const decoded = jwtDecode(accessToken)
  return decoded.roles[0].authority
}

router.beforeEach((to, from, next) => {
  const accessToken = store.state.accessToken;
  if (!to.meta.requiresAuth) {
    next()
  } else if (to.meta?.requiresAuth && !isValidAccessToken(accessToken)) {
    next({ name: 'loginPage' });
  }  else if (isValidAccessToken(accessToken)) {
    const role = getRole(accessToken)

    if (role === 'ROLE_CUSTOMER' && !to.path.includes('customer')) {
      next({name: 'homePage'})
    } else if (role !== 'ROLE_CUSTOMER' && to.path.includes('customer')) {
      next({name: 'userHomePage'})
    } else next()
  } else {
    return false
  }
});


export default router
