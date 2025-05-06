import { createWebHistory, createRouter } from 'vue-router'
import { getAuth, onAuthStateChanged } from "firebase/auth"; 

import HomePage from '../views/HomePage.vue'
import LogInPage from '../views/LogInPage.vue'
import RegisterPage from '../views/RegisterPage.vue'
import ResetPassword from '@/views/ResetPassword.vue'
import TemplatesPage from '@/views/TemplatesPage.vue';
import ContactsPage from '@/views/ContactsPage.vue';
import UseTemplatePage from '@/views/UseTemplatePage.vue';
import NewPassword from '@/views/NewPassword.vue';

const routes = [
  { path: '/', component: HomePage, meta: { requiresAuth: true } },
  { path: '/login', component: LogInPage },
  { path: '/register', component: RegisterPage },
  { path: '/forgot-password', component: ResetPassword },
  { path: '/reset-password', component: NewPassword },
  { path: '/templates', component: TemplatesPage, meta: { requiresAuth: true } },
  { path: '/templates/:id/use', component: UseTemplatePage, meta: { requiresAuth: true } },
  { path: '/contacts', component: ContactsPage, meta: { requiresAuth: true } },
  { path: '/:pathMatch(.*)*', redirect: '/' },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

// Check auth
const getCurrentUser = () => {
  return new Promise((resolve, reject) => {
    const removeListener = onAuthStateChanged(
      getAuth(),
      (user) => {
        removeListener();
        resolve(user);
      },
      reject
    );
  });
};

// Preventing access to Register, Login and password resets if authenticated
router.beforeEach(async (to, from, next) => {
  const user = await getCurrentUser();
  const loggedIn = !!user;

  if (to.meta.requiresAuth && !loggedIn) {
    next('/login')
  } else if ((to.path === '/login' || to.path === '/register' ||
    to.path === '/forgot-password' || to.path === '/reset-password') && loggedIn) {
    next('/')
  } else {
    next()
  }
})

export default router