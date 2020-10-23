<template>
  <div>
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
              :items="persons"
              :search="search"
              class="elevation-1"
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

              <template v-slot:[`item.papel_id`]="{ item }">
                <samp v-if="item.papel_id == 1">Super</samp>
                <samp v-if="item.papel_id == 2">Admin</samp>
                <samp v-if="item.papel_id == 3">Usuário</samp>
              </template>

              <template v-slot:top>
                <v-toolbar flat color="white">
                  <v-toolbar-title>Usuários</v-toolbar-title>

                  <v-spacer></v-spacer>

                  <v-text-field
                    class="text-xs-center"
                    v-model="search"
                    label="Pesquisa"
                    single-line
                    hide-details
                  ></v-text-field>

                  <v-spacer></v-spacer>

                  <app-cadastraUsuario @addUsuario="listar">
                  </app-cadastraUsuario>
                </v-toolbar>
              </template>

              <template v-slot:[`item.action`]="{ item }">
                <a-tooltip placement="left" v-if="item.ativo == 1">
                  <template slot="title">
                    <span>Desativar</span>
                  </template>

                  <v-icon
                    big
                    size="22"
                    class="mr-2"
                    @click="ativarDesativar(item)"
                    style="color: #F24607;"
                  >
                    mdi-close-thick
                  </v-icon>
                </a-tooltip>

                <a-tooltip placement="left" v-else>
                  <template slot="title">
                    <span>Ativar</span>
                  </template>

                  <v-icon
                    big
                    size ="22"
                    class="mr-2"
                    @click="ativarDesativar(item)"
                    style="color: #49D907; "
                  >
                    mdi-check-bold
                  </v-icon>
                </a-tooltip>

                <a-tooltip placement="right">
                  <Span>-</Span>
                </a-tooltip>

                <a-tooltip placement="right">
                  <template slot="title">
                    <span>Editar</span>
                  </template>

                  <v-icon @click="editar(item)">
                    mdi-table-edit
                  </v-icon>
                </a-tooltip>
              </template>

              <template v-slot:no-data>
                <v-btn color="primary" @click="listar()">Recarregar</v-btn>
              </template>
            </v-data-table>
          </v-flex>

          <a-modal
            title="Editar Usuário"
            :visible="visible"
            centered
            @cancel="cancelarEdicao"
          >
            <a-form>
              <a-row :gutter="24">
                <a-col :span="24">
                  <a-form-item label="Nome">
                    <a-input v-model="editUsuario.nome"></a-input>
                  </a-form-item>
                </a-col>

                <a-col :span="24">
                  <a-form-item label="Usuário">
                    <a-input v-model="editUsuario.usuario"></a-input>
                  </a-form-item>
                </a-col>
                <!--
                      <a-col :span="12" v-if="usuario.papel.descricao=='super'">
                        apagar a-col de baixo e usar essse
                        -->
                <a-col :span="12">
                  <a-form-item has-feedback label="Papel">
                    <a-select
                      v-model="editUsuario.papel_id"
                      placeholder="Papel"
                    >
                      <a-select-option
                        v-for="papel in itemPapeis"
                        :key="papel.value"
                        :value="papel.value"
                      >
                        {{ papel.text }}
                      </a-select-option>
                    </a-select>
                  </a-form-item>
                </a-col>
                <!--
                      <a-col :span="12" v-if="usuario.papel.descricao=='super'">
                        apagar a-col de baixo e usar essse
                        -->
                <a-col :span="12">
                  <a-form-item label="Setor">
                    <a-select v-model="editUsuario.setorId" placeholder="Setor">
                      <a-select-option
                        v-for="setor in itemSetores"
                        :key="setor.value"
                        :value="setor.value"
                      >
                        {{ setor.text }}
                      </a-select-option>
                    </a-select>
                  </a-form-item>
                </a-col>

                
                  <a-col :span="24">
                    <a-form-item has-feedback label="Perfil">
                      <a-select
                        v-model="editUsuario.perfil_id"
                        placeholder="Perfil"
                      >
                        <a-select-option
                          v-for="perfil in listaPerfis"
                          :key="perfil.value"
                          :value="perfil.value"
                        >
                          {{ perfil.text }}
                        </a-select-option>
                      </a-select>
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
        </v-layout>
      </a-col>
    </a-row>
  </div>
</template>

<script>
import cadastroUsuario from "@/components/Cadastro/cadastroUsuario";
import axios from "axios";

export default {
  data() {
    return {
      configuration: {
        headers: {
          Token: this.$store.state.portarias_token,
        },
      },
      usuario: this.$store.state.usuario,

      observacaoSaida: "",
      dialog: false,
      search: "",
      persons: [],
      headers: [
        { text: "Opções", value: "action", sortable: false },
        { text: "Nome", value: "nome", sortable: true },
        { text: "Login", value: "usuario", sortable: false },
        { text: "Papel", value: "papel_id", sortable: true },
        { text: "Setor", value: "setor.descricao", sortable: true },
        { text: "Perfil", value: "perfil.descricao", sortable: true },
        { text: "Status", value: "ativo", sortable: true },
      ],
      editedIndex: -1,

      papel_id: "",
      setorId: "",

      itemSetores: [],
      itemPapeis: [
        { text: "Super", value: 1 },
        { text: "Admin", value: 2 },
        { text: "Usuário", value: 3 },
      ],

      editUsuario: {
        id: "",
        nome: "",
        usuario: "",
        setorId: "",
        papel_id: "",
        perfil_id: "",
      },

      adModal: false,
      adAccion: 0,
      adNome: "",
      adId: "",
      visible: false,

      listaPerfis: [],
    };
  },

  computed: {
    formTitle() {
      return this.editedIndex === -1 ? "Novo Item" : "Editar Item";
    },
  },

  components: {
    "app-cadastraUsuario": cadastroUsuario,
  },

  watch: {
    dialog(val) {
      val || this.close();
    },
  },

  created() {
    this.listar();
    this.listarSetores();
    this.listarPerfil()
  },

  methods: {
    ativarDesativar(item) {
      this.adId = item.id;
      let me = this;
      this.$confirm({
        title: `Deseja ${item.ativo ? "desativar" : "ativar"} este usuário?`,
        content: `${item.nome}`,
        okText: "Sim",
        cancelText: "Não",
        onOk() {
          item.ativo ? me.desativar() : me.ativar();
        },
      });
    },

    editar(item) {
      this.visible = true;
      this.editUsuario.nome = item.nome;
      this.editUsuario.usuario = item.usuario;
      this.editUsuario.id = item.id;
      this.editUsuario.setorId = item.setor.id;
      this.editUsuario.papel_id = item.papel_id;
      this.editUsuario.perfil_id = item.perfil_id;
    },

    alterar() {
      let me = this;
      axios
        .put(
          `/usuarios/${this.editUsuario.id}`,
          this.editUsuario,
          this.configuration
        )
        .then((res) => {
          if (res.data.success) {
            this.$message.success("Usuário Atualizado!");
          }
          me.limparEdicao();
          me.listar();
        })
        .catch(function(error) {
          // eslint-disable-line no-unused-vars
        });
    },

    cancelarEdicao() {
      this.visible = false;
    },

    limparEdicao() {
      this.visible = false;
      this.formNome = "";
      this.formUsuario = "";
      this.formId = "";
      this.formSetorId = "";
      this.formPapelId = "";
    },

    listar() {
      const me = this;
      let rota = "/usuarios";
      // if (this.usuario.papel.descricao !== 'super') {
      //    rota = `/usuarios/setor/${this.usuario.setor.id}`
      // }
      axios
        .get(rota, this.configuration)
        .then(function(response) {
          me.persons = response.data.usuarios;
          // remove o usuario logado da lista para que ele não possa alterar seus dados
          // let arr = me.persons.filter((x) => {
          //   return x.nome !== me.usuario.nome;
          // });
          // me.persons = arr;
        })
        .catch(function(error) {
          // eslint-disable-line no-unused-vars
        });
    },
    listarPerfil() {
      let me = this;
      let perfil = [];
      let rota = "/perfil";
      me.axios
        .get(rota, me.configuration)
        .then((res) => {
          perfil = res.data.perfil;
         
          for (let pef of perfil) {
             console.log(pef)
            me.listaPerfis.push({
              text: pef.descricao,
              value: pef.id,
            });
          }
        })
        .catch(function(error) {
          // eslint-disable-line no-unused-vars
        });
    },
    listarSetores() {
      let me = this;
      let setores = [];
      let rota = "/setores";
      let user = this.$store.state.usuario;

      // if (user.papel.descricao !== 'super') {
      //   rota = `/setores/${user.setor.id}`
      // }

      this.axios
        .get(rota, me.configuration)
        .then(function(response) {
          if (user.papel.descricao !== "super") {
            setores.push(response.data.setor);
          } else {
            setores = response.data.setores;
          }
          for (let setor of setores) {
            me.itemSetores.push({
              text: setor.descricao,
              value: setor.id,
            });
          }
        })
        .catch(function(error) {
          // eslint-disable-line no-unused-vars
        });
    },

    close() {
      this.limpar();
      this.dialog = false;
    },

    ativar() {
      this.axios
        .put(`/usuarios/activate/${this.adId}`, {}, this.configuration)
        .then((response) => {
          if (response.data.success) {
            this.$message.success("Usuário ativado!");
          }
          this.limpar();
          this.listar();
        })
        .catch(function(error) {
          // eslint-disable-line no-unused-vars
        });
    },

    desativar() {
      this.axios
        .put(`/usuarios/deactivate/${this.adId}`, {}, this.configuration)
        .then((response) => {
          if (response.data.success) {
            this.$message.success("Usuário desativado!");
          }
          this.limpar();
          this.listar();
        })
        .catch(function(error) {
          // eslint-disable-line no-unused-vars
        });
    },

    limpar() {
      this.adId = "";
    },
  },
};
</script>
