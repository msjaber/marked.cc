import Vue from 'vue'
import App from './App.vue'
import Landing from './components/pages/Landing.vue'
import Home from './components/pages/Home.vue'

import VueRouter from 'vue-router'

Vue.config.productionTip = false

Vue.use(VueRouter)

// Register a global custom directive called `v-focus`
const router = new VueRouter({
  mode: 'history',
  routes: [
    {
      path: '/landing',
      name: 'Landing',
      component: Landing
    },

    {
	    path: '/',
	    name: 'Home',
	    component: Home	
    }
  ]
})

new Vue({
  render: h => h(App),
  router,
  components: { App }
}).$mount('#app')

