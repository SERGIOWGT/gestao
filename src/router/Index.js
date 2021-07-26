import Vue from 'vue'
import Router from 'vue-router'

//import store from '../store.js'
import HomeView from '../views/HomeView.vue'
import EmDesenvolvimentoView from '../views/EmDesenvolvimentoView.vue'

Vue.use(Router)

const routes = [
    {
        path: '/',
        name: 'homeView',
        component: HomeView
    },
    {
        path: '/emDesenvolvimento',
        name: 'emDesenvolvimentoView',
        component: EmDesenvolvimentoView
    }
]

//
const RotasApp = new Router({routes})

/* RotasApp.beforeEach((to, from, next) => {
    console.log("from", from.path)
    console.log("to", to.path)
    //console.log("from.path != '/'", from.path != '/')
    //console.log("!store.getters.estaLogado", !store.getters.estaLogado)

    if (to.path == '/')
        next()
    else {
        if (!store.getters.estaLogado) {
            if ((to.path == '/trocaSenha') || (to.path=='/registraUsuario')) {
                next()
            } else if (to.path != '/login') 
                next('/login') 
            else
                next()
        } else {
            next()
        }
    }
    
  }) */

export default RotasApp