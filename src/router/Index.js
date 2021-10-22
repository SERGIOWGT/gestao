import Vue from 'vue'
import Router from 'vue-router'

import store from '../store.js'
import loginView from '../views/LoginView.vue'
import homeView from '../views/HomeView.vue'
import visitaView from '../views/VisitaView.vue'
import cadastroBasicoView from '../views/CadastroBasicoView.vue'
import cidadaoView from '../views/CidadaoView.vue'
import visitaConsultaView from '../views/VisitaConsultaView.vue'
import usuarioView from '../views/UsuarioView.vue'

Vue.use(Router)

const routes = [
    {
        path: '/login',
        name: 'loginView',
        component: loginView
    },
    {
        path: '/home',
        name: 'homeView',
        component: homeView
    },
    {
        path: '/cidadao',
        name: 'cidadaoView',
        component: cidadaoView
    },
    {
        path: '/visita',
        name: 'visitaView',
        component: visitaView
    },
    {
        path: '/cadastroBasico',
        name: 'cadastroBasicoView',
        component: cadastroBasicoView
    },
    {
        path: '/visitaConsulta',
        name: 'visitaConsultaView',
        component: visitaConsultaView
    },
    {
        path: '/usuario',
        name: 'usuarioView',
        component: usuarioView
    }
]

//
const RotasApp = new Router({routes})


RotasApp.beforeEach((to, from, next) => {
    //console.log("from", from.path)
    //console.log("to", to.path)
    //console.log(`from => ${from.path}, to => ${to.path},  estaLogado => ${store.getters.estaLogado}`)

/*     if (to.path == '/')
        next()
    else { */
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
/*     } */
    
  })

export default RotasApp