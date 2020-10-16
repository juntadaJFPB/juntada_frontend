<template>
  <a-row
    type="flex"
    justify="space-around"
    align="middle"
    style="margin-top: 30px;"
  >
    <a-col :span="20">
      <v-layout align-start>
        <v-flex>
          <v-data-table
            :headers="headers"
            :items="relatorio"
            :search="search"
            class="elevation-1"
          >
            <template v-slot:top>
              <v-toolbar flat color="white">
                <v-toolbar-title>Relatorio-Erros</v-toolbar-title>

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

            <template v-slot:no-data>
              <v-btn color="primary" @click="listaRelatorio()"
                >Recarregar</v-btn
              >
            </template>
          </v-data-table>
        </v-flex>
      </v-layout>
    </a-col>
  </a-row>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      atualiza: 0,
      dialog: false,

      search: "",
      relatorio: [],
      headers: [
        { text: "Numero Processo",value: "numero_processo",sortable: true,},
        { text: "Data da Correspodencia",value: "data_hora",sortable: true,},
        { text: "Data e Hora Juntada", value: "data_hora", sortable: false },
        { text: "Descrição do Erro", value: "descricao", sortable: true },
      ],
      ativo: "",
      descricao: "",

      adModal: false,
      adAccion: 0,
      addescricao: "",
      adId: "",

      editVisible: false,

      configuration: {
        headers: {
          Token: this.$store.state.portarias_token,
        },
      },
    };
  },

  created() {
    this.listaRelatorio();
  },

  methods: {
    listaRelatorio() {
      let me = this;

      axios
        .get("/relatorio_erros/", this.configuration)
        .then((response) => {
          me.relatorio = response.data.relatorio_erros;
        })
        .catch(function(error) {
          // eslint-disable-line no-unused-vars
        });
    },
  },
};
</script>

<style scoped></style>
