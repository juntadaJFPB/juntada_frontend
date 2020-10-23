import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import store from '../store/index.js'
import Usuarios from '../views/Usuarios.vue'
import Setores from '../views/Setores.vue'
import Relatorio from '../views/Relatorio.vue'
import Relatorio_erros from '../views/Relatorio_erros.vue'
import Perfil from '../views/Perfil.vue'
Vue.use(VueRouter)

var router = new VueRouter({
    mode: "history",
    base: process.env.BASE_URL,
    routes: [
        {
            path: '/',
            name: 'Home',
            component: Home,
            meta: {
                admin: true,
                super: true,
                usuario: false,
            },

        },
        {
            path: '/usuarios',
            name: 'Usuarios',
            component: Usuarios,
            meta: {
                admin: true,
                super: true,
                usuario: false,
            },

        },
        {
            path: '/setores',
            name: 'Setores',
            component: Setores,
            meta: {
                admin: true,
                super: true,
                usuario: false,
            },

        },
        {
            path: '/relatorio',
            name: 'Relatorio',
            component: Relatorio,
            meta: {
                admin: true,
                super: true,
                usuario: false,
            },
        },
        {
            path: '/perfil',
            name: 'Perfil',
            component: Perfil,
            meta: {
                admin: true,
                super: true,
                usuario: false,
            },
        },
        {
            path: '/relatorio_erros',
            name: 'RelatorioErros',
            component: Relatorio_erros,
            meta: {
                admin: true,
                super: true,
                usuario: false,
            },
        },
        {
            path: '/login',
            name: 'Login',
            component: () => import(/* webpackChunkName: "about" */ '../views/Login.vue'),
            meta: {
                libre: true,
            },

        }
    ],
})

router.beforeEach((to, from, next) => {
    if (to.matched.some((record) => record.meta.libre)) {
        next()
    } else if (store.state.usuario && store.state.usuario.papel.descricao == "admin") {
        if (to.matched.some((record) => record.meta.admin)) {
            next()
        }
    } else if (store.state.usuario && store.state.usuario.papel.descricao == "super") {
        if (to.matched.some((record) => record.meta.super)) {
            next()
        }
    } else if (store.state.usuario && store.state.usuario.papel.descricao == "usuario") {
        if (to.matched.some((record) => record.meta.usuario)) {
            next()
        }
    } else {
        next({ name: "Login" })
    }
})






export default router
