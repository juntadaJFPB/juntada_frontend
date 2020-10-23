<template>
  <div>
    <a-button type="primary" @click="showDrawer">
      <a-icon type="plus" /> Cadastrar Setor
    </a-button>

    <a-modal
      title="Cadastrar Setor"
      @close="onClose"
      :visible="visible"
      v-model="visible"
      centered
    >
      <a-form :form="form" layout="vertical" hideRequiredMark>
        <a-row :gutter="16">
          <a-col :span="24">
            <a-form-item has-feedback label="Descrição">
              <a-input
                v-model="descricao"
                v-decorator="[
                  'setor',
                  {
                    rules: [
                      { required: true, message: 'Informe o nome do setor.' },
                    ],
                  },
                ]"
                placeholder="Descrição"
              />
            </a-form-item>
          </a-col>
        </a-row>

        <a-row :gutter="16">
          <a-col :span="24">
            <a-form-item has-feedback label="Endereço">
              <a-input
                v-model="endereco"
                v-decorator="[
                  'endereco',
                  {
                    rules: [
                      { required: true, message: 'Informe um endereço.' },
                    ],
                  },
                ]"
                placeholder="Endereço"
              />
            </a-form-item>
          </a-col>
        </a-row>
        <!--
            <a-row :gutter="16">
                <a-col :span="12">
                    <a-form-item has-feedback label="Tipo do Setor">
                        <a-select 
                            v-model="setorTipoId" 
                            v-decorator="['tipo', {
                                rules: [{ required: true, message: 'Informe o tipo do setor.' }]
                            }]"
                            placeholder="Tipo do Setor"
                        >
                            <a-select-option v-for="(classe) in this.itemTiposSetor" :key="classe.value" :value="classe.value">{{classe.text}}</a-select-option>
                        </a-select>
                    </a-form-item>
                </a-col>
            </a-row>
            -->
      </a-form>
      <template slot="footer">
        <a-button :style="{ marginRight: '8px' }" @click="onClose">
          Cancelar
        </a-button>
        <a-button @click="cadastrarSetor" type="primary">Cadastrar</a-button>
      </template>
    </a-modal>
  </div>
</template>

<script>
export default {
  data() {
    return {
      form: this.$form.createForm(this),
      visible: false,
      descricao: "",
      endereco: "",
      setorTipoId: "",
      itemTiposSetor: [],
      x: 1,

      configuration: {
        headers: {
          Token: this.$store.state.portarias_token,
        },
      },
    };
  },

  created() {
    this.listarTiposSetor();
  },

  props: {},

  methods: {
    handleReset() {
      this.form.resetFields();
    },

    //Metodo para o select setor tipo***********
    listarTiposSetor() {
      let me = this;
      let tiposSetorArray = [];

      this.axios
        .get("/tipos/", this.configuration)
        .then((response) => {
          tiposSetorArray = response.data.tipos;
          for (let tipo of tiposSetorArray) {
            me.itemTiposSetor.push({
              text: tipo.descricao,
              value: tipo.id,
            });
          }
        })
        .catch(function(error) {
          // eslint-disable-line no-unused-vars
        });
    },

    cadastrarSetor(e) {
      e.preventDefault();
      let me = this;

      this.form.validateFields((err) => {
        if (!err) {
          this.axios
            .post(
              "/setores",
              {
                descricao: this.descricao,
                endereco: this.endereco,
                // setorTipoId: this.setorTipoId
              },
              this.configuration
            )
            .then((res) => {
              me.idproc = res.data.id;
              me.handleReset();
              me.visible = false;
              me.success();
              me.$emit("addSetor", me.x);
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
      this.$message.success("Setor cadastrado com sucesso.");
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
