<template>
  <div>
    <v-container>
      <v-data-table
        :search="search"
        class="elevation-1"
        :headers="headers"
        :items="perfis"
      >
        <template v-slot:[`item.ativo`]="{ item }">
          <samp
            style="color: #49D907; font-weight: bold;"
            v-if="item.ativo == 1"
          >
            Ativo</samp
          >
          <samp
            style="color: #F24607; font-weight: bold;"
            v-if="item.ativo == 0"
          >
            Desativado</samp
          >
        </template>
        <template v-slot:top>
          <v-toolbar flat>
            <v-toolbar-title>Perfis</v-toolbar-title>

            <v-spacer></v-spacer>

            <v-text-field
              class="text-xs-center"
              v-model="search"
              label="Pesquisa"
              single-line
              hide-details
            ></v-text-field>

            <v-spacer></v-spacer>
            <a-button type="primary" @click="showModal">
              Adicionar Perfil <a-icon type="plus" />
            </a-button>
          </v-toolbar>
        </template>
        <template v-slot:[`item.action`]="{ item }">
          <a-tooltip placement="right">
            <template slot="title">
              <span>Editar</span>
            </template>

            <v-icon @click="editar(item)">
              mdi-table-edit
            </v-icon>
          </a-tooltip>
        </template>
      </v-data-table>
      <!-- MODAL ADICIONAR -->
      <a-modal
        v-model="visibleAdd"
        :visible="visibleAdd"
        @ok="adicionarPerfil"
        okText="Adicionar"
        cancelText="Cancelar"
        title="Adicionar Perfil"
        @cancel="cancel()"
      >
        <a-form :form="form" style="padding: 10px;" hideRequiredMark>
          <a-form-item label="Nome do Perfil">
            <a-input
              placeholder="Nome do Perfil"
              v-model="nome_perfil"
              v-decorator="[
                'nome_perfil',
                {
                  rules: [
                    {
                      required: true,
                      message: 'Informe o nome do perfil.',
                    },
                  ],
                },
              ]"
            />
          </a-form-item>
        </a-form>
      </a-modal>

      <a-modal
        title="Editar setor"
        :visible="editVisible"
        centered
        @cancel="cancelarEdicao"
      >
        <a-form>
          <a-row :gutter="24">
            <a-col :span="24">
              <a-form-item label="Descricao">
                <a-input v-model="editItem.descricao"></a-input>
              </a-form-item>
            </a-col>
          </a-row>
        </a-form>
        <template slot="footer">
          <a-button key="back" @click="cancelarEdicao">
            Cancelar
          </a-button>

          <a-button key="submit" type="primary" @click="alterar">
            Alterar
          </a-button>
        </template>
      </a-modal>
    </v-container>
  </div>
</template>

<script>
import axios from "axios";
export default {
  data() {
    return {
      configuration: {
        headers: {
          Token: this.$store.state.portarias_token,
        },
      },
      search: "",
      headers: [
        { text: "Editar", value: "action" },
        { text: "Descrição", value: "descricao", sortable: true },
        { text: "Status", value: "ativo", sortable: true },
      ],
      perfis: [],
      visibleAdd: false,
      nome_perfil: "",
      form: this.$form.createForm(this),
      editItem: {
        id: "",
        descricao: "",
      },
      editVisible: false,
      adId: "",
    };
  },
  created() {
    this.listarPerfil();
  },
  methods: {
    listarPerfil() {
      let me = this;

      me.axios
        .get("/perfil/" , this.configuration)
        .then((response) => {
          me.perfis = response.data.perfil;
        })
        .catch(function(error) {
          // eslint-disable-line no-unused-vars
        });
    },
    showModal() {
      this.visibleAdd = true;
    },
    cancel() {
      this.form.resetFields();
    },
    adicionarPerfil(e) {
      const me = this;
      let data = new FormData();
      this.form.validateFields((err, values) => {
        if (!err) {
          console.log(this.data);
          this.axios
            .post(
              "/perfil/",
              {
                descricao: this.nome_perfil,
              },
              /* data,*/ this.configuration
            )
            .then((res) => {
              this.visibleAdd = false;
              this.listarPerfil();
              this.cancel();
            });
        }
      });
    },

    editar(item) {
      this.editVisible = true;
      this.editItem.id = item.id;
      this.editItem.descricao = item.descricao;
    },
    alterar() {
      let me = this;
      this.axios
        .put(`/perfil/${this.editItem.id}`, this.editItem, this.configuration)
        .then((res) => {
          if (res.data.success) {
            me.$message.success("Perfil atualizada!");
          }
          me.editVisible = false;

          me.listarPerfil();
        })
        .catch(function(error) {
          // eslint-disable-line no-unused-vars
        });
    },

    cancelarEdicao() {
      this.editVisible = false;
    },
  },
};
</script>
