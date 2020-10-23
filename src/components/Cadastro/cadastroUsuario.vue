<template>
  <div>
    <a-button type="primary" @click="showDrawer">
      <a-icon type="plus" /> Cadastrar Usuário
    </a-button>
    <a-modal
      :width="650"
      title="Cadastrar Usuário"
      :visible="visible"
      v-model="visible"
      centered
    >
      <a-form :form="form" layout="vertical" hideRequiredMark>
        <a-row :gutter="16">
          <a-col :span="24">
            <a-form-item has-feedback label="Nome">
              <a-input
                v-decorator="[
                  'nome',
                  {
                    rules: [
                      {
                        required: true,
                        type: 'regexp',
                        pattern: new RegExp(`^[A-Z a-z]`),
                        message: 'Informe o nome do usuário.',
                      },
                    ],
                  },
                ]"
                placeholder="Nome do Usuário"
              />
            </a-form-item>
          </a-col>
        </a-row>

        <a-row :gutter="16">
          <a-col :span="24">
            <a-form-item has-feedback label="Login">
              <a-input
                v-decorator="[
                  'usuario',
                  {
                    rules: [
                      {
                        required: true,
                        message: 'Informe o login do usuário.',
                      },
                    ],
                  },
                ]"
                placeholder="Login"
              />
            </a-form-item>
          </a-col>
        </a-row>

        <a-row :gutter="16">
          <a-col :span="12">
            <a-form-item has-feedback label="Papel">
              <a-select
                v-decorator="[
                  'papel',
                  {
                    rules: [
                      {
                        required: true,
                        message: 'Informe o papel do usuário.',
                      },
                    ],
                  },
                ]"
                placeholder="Papel"
              >
                <!--
                                <a-select-option 
                                    value='1' 
                                    v-if="usuarioLogado.papel.descricao == 'super'"
                                    apagar esse a-select-option de baixo e usar esse
                                >
                                -->
                <a-select-option value="1">
                  Super
                </a-select-option>
                <!--
                                <a-select-option 
                                    value='2' 
                                    v-if="usuarioLogado.papel.descricao == 'super'"
                                    apagar o a-select de baixo e usar esse 
                                >
                                -->
                <a-select-option value="2">
                  Admin
                </a-select-option>

                <a-select-option value="3">
                  Usuário
                </a-select-option>
              </a-select>
            </a-form-item>
          </a-col>

          <a-col :span="12">
            <a-form-item has-feedback label="Setor">
              <a-select
                v-decorator="[
                  'setor',
                  {
                    rules: [
                      {
                        required: true,
                        message: 'Informe o setor.',
                      },
                    ],
                  },
                ]"
                placeholder="Setor"
              >
                <a-select-option
                  v-for="classe in listaSetores"
                  :key="classe.value"
                  :value="classe.value"
                >
                  {{ classe.text }}
                </a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
        </a-row>

        <a-row :gutter="16">
          <a-col :span="24">
            <a-form-item has-feedback label="Perfil">
              <a-select
                v-decorator="[
                  'perfil',
                  {
                    rules: [
                      {
                        required: true,
                        message: 'Informe o perfil.',
                      },
                    ],
                  },
                ]"
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
        <a-button :style="{ marginRight: '8px' }" @click="onClose">
          Cancelar
        </a-button>

        <a-button @click="cadastrarUsuario" type="primary">
          Cadastrar
        </a-button>
      </template>
    </a-modal>
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
      usuarioLogado: this.$store.state.usuario,

      form: this.$form.createForm(this),
      visible: false,
      listaSetores: [],
      listaPerfis: [],
    };
  },

  created() {
    this.listarSetores();
    this.listarPerfil();
  },

  methods: {
    handleReset() {
      this.form.resetFields();
    },

    listarSetores() {
      let me = this;
      let setores = [];
      let rota = "/setores";

      // if (this.usuarioLogado.papel.descricao !== 'super') {
      //   rota = `/setores/${this.usuarioLogado.setor.id}`
      // }

      this.axios
        .get(rota, this.configuration)
        .then((res) => {
          // if (this.usuarioLogado.papel.descricao !== 'super') {
          //   setores.push(res.data.setor)
          //} else {
          setores = res.data.setores;

          // }
          for (let setor of setores) {
            me.listaSetores.push({
              text: setor.descricao,
              value: setor.id,
            });
          }
        })
        .catch((error) => {
          // eslint-disable-line no-unused-vars
        });
    },
    listarPerfil() {
      let me = this;
      let perfil = [];
      let rota = "/perfil";
      me.axios
        .get(rota, this.configuration)
        .then((res) => {
          perfil = res.data.perfil;
          for (let pef of perfil) {
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
    //Add Usuario
    cadastrarUsuario(e) {
      e.preventDefault();
      this.form.validateFields((err, values) => {
        if (!err) {
          this.axios
            .post(
              "/usuarios",
              {
                nome: values.nome,
                usuario: values.usuario,
                // perfil: values.perfil,
                setor_id: values.setor,
                papel_id: values.papel,
                perfil_id: values.perfil,
              },
              this.configuration
            )
            .then(() => {
              this.handleReset();
              this.visible = false;
              this.success();
              this.$emit("addUsuario", 1);
            })
            .catch((e) => {
              // eslint-disable-line no-unused-vars
            });
        } else {
          this.info();
        }
      });
    },

    success() {
      this.$message.success("Usuario cadastrado com sucesso.");
    },

    info() {
      this.$message.info("Preencha todos os campos.");
    },

    showDrawer() {
      this.visible = true;
    },

    onClose() {
      this.handleReset();
      this.visible = false;
    },
  },
};
</script>
