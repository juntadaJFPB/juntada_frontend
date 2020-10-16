<template>
  <div id="app">
    <v-layout class="mx-auto overflow-hidden" height="400" flat tile>
      <v-app-bar style="background-color: #7fa07d;">
        <v-app-bar-nav-icon @click="drawer = true" v-if="logado"></v-app-bar-nav-icon>

        <v-toolbar-title
               style="font-family: arial;font-size: 20px;color: black;
       text-transform: uppercase;"
        >          <img src="./assets/JFW.png" width="30" style="margin-right:10px" />
          <span style="color:black;" >Justiça Federal da 5ª Região</span></v-toolbar-title>
        <v-spacer></v-spacer>
        <div v-if="logado">
          <Menu />
        </div>
      </v-app-bar>

      <v-navigation-drawer v-model="drawer" absolute temporary>
        <v-list nav dense>
          <v-list-item-group v-model="group" active-class="deep-purple--text text--accent-4">
            <router-link to="/">
              <v-list-item>
                <v-list-item-icon>
                  <v-icon>mdi-receipt</v-icon>
                </v-list-item-icon>

                <v-list-item-title>ARS</v-list-item-title>
              </v-list-item>
            </router-link>

            <router-link to="/relatorio_erros">
              <v-list-item>
                <v-list-item-icon>
                  <v-icon>mdi-android-debug-bridge</v-icon>
                </v-list-item-icon>

                <v-list-item-title>BOT</v-list-item-title>
              </v-list-item>
            </router-link>

            <router-link to="/setores">
              <v-list-item>
                <v-list-item-icon>
                  <v-icon>mdi-view-dashboard</v-icon>
                </v-list-item-icon>

                <v-list-item-title>SETORES</v-list-item-title>
              </v-list-item>
            </router-link>

            <router-link to="/usuarios">
              <v-list-item>
                <v-list-item-icon>
                  <v-icon>mdi-account-plus</v-icon>
                </v-list-item-icon>

                <v-list-item-title>USUARIOS</v-list-item-title>
              </v-list-item>
            </router-link>

            <router-link to="/login">
              <v-list-item>
                <v-list-item-icon>
                  <v-icon>mdi-arrow-right-bold-box</v-icon>
                </v-list-item-icon>

                <v-list-item-title @click="sair">SAIR</v-list-item-title>
              </v-list-item>
            </router-link>
          </v-list-item-group>
        </v-list>
      </v-navigation-drawer>
    </v-layout>

    <a-layout-content>
      <transition name="fade" mode="out-in">
        <router-view></router-view>
      </transition>
    </a-layout-content>
  </div>
</template>

<script>
import Menu from "@/components/Menu.vue";

export default {
  data: () => ({
    drawer: false,
  }),

  components: {
    Menu,
  },

  computed: {
    logado() {
      return this.$store.state.usuario;
    },
  },
  methods: {
    sair() {
      this.$store.dispatch("sair");
    },
  },
};
</script>

<style>
body {
  padding: 0;
  margin: 0;
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
</style>


