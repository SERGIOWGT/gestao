import Vue from 'vue'
import Router from 'vue-router'

import store from '../store.js'
import loginView from '../views/LoginView.vue'
import homeView from '../views/HomeView.vue'
import telaAberturaView from '../views/TelaAberturaView.vue'
import emDesenvolvimentoView from '../views/EmDesenvolvimentoView.vue'
import novaSuspeitaView from '../views/NovaSuspeitaView.vue'
import novaSuspeitaView2 from '../views/NovaSuspeitaView2.vue'
import visitaView from '../views/VisitaView.vue'
import cadastrosView from '../views/CadastrosView.vue'
import identificacaoCidadaoView from '../views/IdentificacaoCidadaoView.vue'

Vue.use(Router)

const routes = [
    {
        path: '/',
        name: 'telaAberturaView',
        component: telaAberturaView
    },
    {
        path: '/login',
        name: 'loginView',
        component: loginView
    },
    {
        path: '/Home',
        name: 'homeView',
        component: homeView
    },
    {
        path: '/emDesenvolvimento',
        name: 'emDesenvolvimentoView',
        component: emDesenvolvimentoView
    },
    {
        path: '/novaSuspeita',
        name: 'novaSuspeitaView',
        component: novaSuspeitaView
    },
    {
        path: '/novaSuspeita2',
        name: 'novaSuspeitaView2',
        component: novaSuspeitaView2
    },
    {
        path: '/identificacaoCidadao',
        name: 'identificacaoCidadao',
        component: identificacaoCidadaoView
    },
    {
        path: '/visita',
        name: 'visitaView',
        component: visitaView
    },
    {
        path: '/cadastros',
        name: 'cadastrosView',
        component: cadastrosView
    }
]

//
const RotasApp = new Router({routes})


RotasApp.beforeEach((to, from, next) => {
    //console.log("from", from.path)
    //console.log("to", to.path)
    console.log(`from => ${from.path}, to => ${to.path},  estaLogado => ${store.getters.estaLogado}`)

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