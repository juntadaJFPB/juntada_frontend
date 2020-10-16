<template>
    <div>
      <v-container>
      <v-data-table
        :search="search"
        :headers="headers"
        :items="movimentacoes"
        class="elevation-1"
      >
        <template v-slot:top>
          <v-toolbar flat>
            <v-toolbar-title>Relatório de Atividade do BOT</v-toolbar-title>
            <v-spacer></v-spacer>

            <v-text-field
              class="text-xs-center"
              v-model="search"
              label="Pesquisa"
              single-line
              hide-details
            ></v-text-field>
            <v-spacer></v-spacer>
          </v-toolbar>
        </template>

      </v-data-table>
      </v-container>
    </div>
</template>

<script>
export default {
  data() {
    return {
      configuration: {
        headers: {
          Token: this.$store.state.portarias_token,
        },
      },

      movimentacoes: [],
      search: "",
      headers: [
        { text: "ID", value: "id", sortable: true },
        { text: "Descrição", value: "descricao", sortable: true },
        { text: "Data Inicio", value: "created_at", sortable: true },
        { text: "Data Fim", value: "updated_at", sortable: true },
        { text: "Numeros de Juntadas", value: "numero_juntadas"},
        { text: "Usuario", value: "usuarios.usuario"}
      ],
    };
  },

  created() {
    this.listarRelatorios();
  },

  methods: {
    listarRelatorios() {
      let me = this;

      me.axios.get("/relatorio", me.configuration).then((response) => {
        me.movimentacoes = response.data.relatorio;
        for (let mov of this.movimentacoes) {
          mov.created_at = new Date(mov.created_at).toLocaleString('pt-BR', { timeZone: 'UTC' });
          mov.updated_at = new Date(mov.updated_at).toLocaleString('pt-BR', { timeZone: 'UTC' });
        }
      });
    },
  },
};
</script>
