<template>
  <div class="btn">
    <router-link to="/">
      <v-btn text large color="white">
        <v-icon left>mdi-receipt</v-icon>
        <span class="mr-2">ARS</span>
      </v-btn>
    </router-link>

    <router-link to="/relatorio">
      <v-btn text large color="white">
        <v-icon left>mdi-android-debug-bridge</v-icon>
        <span class="mr-2">Bot</span>
      </v-btn>
    </router-link>

        <router-link to="/relatorio_erros">
      <v-btn text large color="white">
        <v-icon left>mdi-android-debug-bridge</v-icon>
        <span class="mr-2">Relatório Erros</span>
      </v-btn>
    </router-link>

    <router-link to="/setores">
      <v-btn text large color="white">
        <v-icon left>mdi-view-dashboard</v-icon>
        <span class="mr-2">Setor</span>
      </v-btn>
    </router-link>

    <router-link to="/usuarios">
      <v-btn text large color="white">
        <v-icon left>mdi-account-plus</v-icon>
        <span class="mr-2">Usuario</span>
      </v-btn>
    </router-link>

    <router-link to="/login">
      <v-btn text large color="white" @click="sair">
        <v-icon left>mdi-arrow-right-bold-box</v-icon>
        <span class="mr-2">Sair</span>
      </v-btn>
    </router-link>
  </div>
</template>

<script>
export default {
  data: () => ({
    drawer: false,
  }),
  methods: {
    sair() {
      this.$store.dispatch("sair");
    },
  },
};
</script>

<style lang="css" scoped>
@media screen and (max-width: 880px) {
  .btn .v-btn {
    display: none;
  }
}
</style> scoped>

</style>