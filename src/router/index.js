import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '../views/HomeView.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
      meta: {
        title: "Home"
      }
    },
    {
      path: '/settings',
      name: 'Settings',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/SettingsView.vue'),
      meta: {
        title: "Settings"
      },
      children: [
        {
          path: '',
          name: 'Settings-Core',
          component: () => import('../views/Settings-Core.vue'),
          meta: {
            title: "Core - Settings",
            tabName: "Core",
            tabIndex: 1,
            transitionName: 'slide-right'
          }
        },
        {
          name: 'Settings-Appearance',
          path: 'appearance',
          component: () => import('../views/Settings-Appearance.vue'),
          meta: {
            title: "Appearance - Settings",
            tabName: "Appearance",
            tabIndex: 2,
            transitionName: 'slide-right'
          }
        },
        {
          name: 'Settings-Feed',
          path: 'feed',
          component: () => import('../views/Settings-Feed.vue'),
          meta: {
            title: "Feed - Settings",
            tabName: "Feed",
            tabIndex: 3,
            transitionName: 'slide-right'
          }
        }
      ]
    }
  ]
})

router.beforeEach((to, from, next) => {
  document.title = `${to.meta.title} - OwlFlux`;
  // console.log('Switching to:' + document.title, to.meta.transitionName);
  next();
})

router.afterEach((to, from) => {
  // console.log('After', to, from);
  // console.log('Old', to.meta.transitionName);
  if (to.meta.tabIndex > from.meta.tabIndex) {
    to.meta.transitionName = 'slide-right';
  } else {
    to.meta.transitionName = 'slide-left';
  }
  // console.log('New', to.meta.transitionName);
})

export default router
