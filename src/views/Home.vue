<template>
  <div id="teste">
    <v-container>
      <v-data-table
        :search="search"
        :headers="headers"
        :items="correspondencia"
        class="elevation-1"
      >
        <!-- Campo Pesquisa e Filtragem de processos -->
        <template v-slot:[`item.anexo`]="{ item }">
          <span v-if="item.anexo.length > 0">
            <v-icon style="color: #49D907; ">
              mdi-checkbox-marked-circle-outline
            </v-icon>
          </span>
          <span v-else>
            <v-icon style="color: #F24607;">
              mdi-checkbox-blank-circle-outline
            </v-icon>
          </span>
        </template>

        <template v-slot:[`item.action`]="{ item }">
          <a-tooltip placement="left" v-if="item.ativo == 1">
            <template slot="title">
              <span>Excluir</span>
            </template>

            <v-icon
              big
              class="mr-2"
              @click="excluir(item)"
              style="color: #F24607;"
            >
              mdi-close-thick
            </v-icon>
          </a-tooltip>
        </template>
        <template v-slot:top>
          <v-toolbar flat>
            <v-toolbar-title>Processos</v-toolbar-title>

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
              Adicionar Correspondencia <a-icon type="plus" />
            </a-button>
          </v-toolbar>
        </template>

        <!-- ADICIONAR ANEXO E DOWNLOAD -->
        <template v-slot:[`item.anexos`]="{ item }">
          <a-tooltip placement="top">
            <template slot="title">
              <span>Adicionar Anexo</span>
            </template>

            <a-button
              size="small"
              @click="showUpload(item)"
              v-if="item.anexo.length == 0"
            >
              <a-icon type="plus" />
            </a-button>
          </a-tooltip>

          <a-tooltip placement="top">
            <span style="padding: 2px"> | </span>
            <template slot="title">
              <span>Download Anexo</span>
            </template>

            <a-button
              @click="showAnexoModal(item.anexo)"
              size="small"
              v-if="item.anexo.length != 0"
            >
              <a-icon type="download"></a-icon>
            </a-button>
          </a-tooltip>

          <a-tooltip placement="top">
            <span style="padding: 2px"> | </span>
            <template slot="title">
              <span>Atualizar Informações </span>
            </template>
            <!-- v-if="item.anexo.length != 0" -->
            <a-button @click="editar(item)" size="small">
              <a-icon type="edit"></a-icon>
            </a-button>
          </a-tooltip>
        </template>

        <!-- MODAL ANEXO -->
      </v-data-table>
    </v-container>
    <a-modal
      title="Anexando arquivos"
      v-model="uploadVisible"
      :visible="uploadVisible"
      centered
    >
      <a-form :form="form">
        <a-form-item>
          <p>Escolha um arquivo para ser anexado a movimentação</p>
          <a-input
            v-model="arquivo_upload"
            @change="setFile"
            type="file"
            style="padding:2px"
          />
        </a-form-item>
        <!-- <a-form-item label="Observações:">
            <a-textarea
              v-model="anexoModalObs"
              :rows="2"
              placeholder="Identifique o arquivo."
            />
          </a-form-item> -->
        <!-- <a-radio-group v-model="value" @change="onChange">
          <p>Cumprido:</p>
          <a-radio :value="1">
            Sim
          </a-radio>
          <a-radio :value="0">
            Não
          </a-radio>
        </a-radio-group> -->
        <a-form-item label="Cumprido:">
          <a-radio-group v-model="check" @change="onChange">
            <a-radio :value="1">Sim</a-radio>
            <a-radio :value="0">Não</a-radio>
          </a-radio-group>
        </a-form-item>
      </a-form>
      <template slot="footer">
        <a-button key="back" @click="cancelUpload">
          Cancelar
        </a-button>

        <a-button key="submit" type="primary" @click="send">
          Upload
        </a-button>
      </template>
    </a-modal>

    <a-modal
      title="Download de Arquivos"
      v-model="anexoVisible"
      :visible="anexoVisible"
      centered
      :footer="false"
    >
      <a-list bordered :data-source="anexos">
        <a-list-item slot="renderItem" slot-scope="item">
          {{ new Date(item.created_at).toLocaleDateString() }} -
          <a
            :href="
              `${host}/correspondencia/retrieve/${item.arquivo}/${configuration.headers.Token}`
            "
            target="_blank"
          >
            <a-button style="margin:5px">
              <a-icon type="file-pdf" /> {{ item.anexo }}
            </a-button>
          </a>
        </a-list-item>
      </a-list>
    </a-modal>

    <a-modal
      v-model="visibleAdd"
      :visible="visibleAdd"
      @ok="adicionarCorrespondencia"
      okText="Adicionar"
      cancelText="Cancelar"
      @cancel="cancel()"
      centered
    >
      <!--   -->
      <a-form :form="form" style="padding: 10px;" hideRequiredMark>
        <a-form-item label="Numero do Processo">
          <a-input
            placeholder="Numero Processo"
            v-model="numero_processo"
            v-mask="'#######-##.####.#.##.####'"
            v-decorator="[
              'numero_processo',
              {
                rules: [
                  { required: true, message: 'Informe o numero do processo.' },
                ],
              },
            ]"
          />
        </a-form-item>
        <a-form-item label="Destinatario">
          <a-input
            placeholder="Destinatario"
            v-model="destinatario"
            v-decorator="[
              'destinatario',
              {
                rules: [{ required: true, message: 'Informe o destinatario.' }],
              },
            ]"
          />
        </a-form-item>
        <a-form-item label="Data">
          <a-input
            placeholder="Data - DD/MM/YYYY"
            v-model="data"
            v-mask="'##/##/####'"
            v-decorator="[
              'data',
              {
                rules: [{ required: true, message: 'Data necessaria.' }],
              },
            ]"
          />
          <!-- <a-date-picker
            v-model="data"
            :locale="locale"
            :format="dateFormat"
            v-decorator="[
              'data',
              { rules: [{ required: true, message: 'Data necessaria' }] },
            ]"
          /> -->
        </a-form-item>
      </a-form>
    </a-modal>
    <!-- EDITAR INFORMAÇÕES -->
    <a-modal
      title="Editar Correspondencia"
      :visible="visible"
      centered
      @cancel="cancelarEdicao"
    >
      <a-form>
        <a-row :gutter="24">
          <a-col :span="24">
            <a-form-item label="Descrição">
              <a-input v-model="editSetor.numero_processo"></a-input>
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item label="Endereço">
              <a-input v-model="editSetor.destinatario"></a-input>
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item label="Data">
              <a-input v-model="editSetor.data"></a-input>
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item label="Status BOT">
              <!-- <a-input v-model="editSetor.status_bot"></a-input> -->
              <a-select v-model="editSetor.status_bot">
                <a-select-option
                  v-for="statusb in status_bot"
                  :key="statusb"
                  :value="statusb"
                >
                  {{ statusb }}
                </a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>

      <template slot="footer">
        <a-button key="back" @click="cancelarEdicao">Cancelar</a-button>
        <a-button key="submit" type="primary" @click="alterar"
          >Alterar</a-button
        >
      </template>
    </a-modal>
  </div>
</template>

<script>
import locale from "ant-design-vue/es/date-picker/locale/pt_BR";
import axios from "axios";

export default {
  data() {
    return {
      configuration: {
        headers: {
          Token: this.$store.state.portarias_token,
        },
      },
      check: null,
      host: this.axios.defaults.baseURL,
      usuario: this.$store.state.usuario,
      locale,
      dateFormat: "DD/MM/YYYY",
      search: "",
      correspondencia: [],
      expanded: [],
      arquivo_upload: "",
      headers: [
        { text: "Excluir", value: "action", sortable: false },
        { text: "Número ", value: "numero_processo" },
        { text: "Destinatario", value: "destinatario" },
        { text: "Data", value: "data" },
        { text: "Status", value: "anexo" },
        { text: "Status BOT", value: "status_bot" },
        { text: "Ações", value: "anexos" },
      ],

      uploadVisible: false,
      idUpload: "",
      file: null,

      // Anexos
      anexoVisible: false,
      anexos: [],

      visibleAdd: false,
      form: this.$form.createForm(this),
      numero_processo: "",
      destinatario: "",
      data: "",

      visible: false,

      status_bot: ["Ainda nao houve tentativa", "Houve Tentativa", "Sucesso"],

      editSetor: {
        id: "",
        numero_processo: "",
        destinatario: "",
        data: "",
        status_bot: "",
      },
      idExcluir: ""
    };
  },

  created() {
    this.listaCorrespondencia();
  },

  methods: {
    onChange(e) {
      console.log("radio checked", e.target.value);
      var checkbox = e.target.value;
      this.check = checkbox;
    },
    listaCorrespondencia() {
      let rota = "/correspondencia";
      // if (this.usuario.papel.descricao !== "super" && this.usuario.setor.tipo.descricao == "comum") {
      //     rota = `/processos/setor/${this.usuario.setor.id}`;
      // }
      this.axios
        .get(rota, this.configuration)
        .then((res) => {
          this.correspondencia = res.data.correspondencia;
          console.log(res.data);
          // for (let pro of this.correspondencia) {
          //   pro.data = new Date(pro.data).toLocaleDateString();
          // }
        })
        .catch((e) => {
          // eslint-disable-line no-unused-vars
        });
    },

    adicionarCorrespondencia(e) {
      const me = this;
      let data = new FormData();
      // data.append("arquivo", this.file);
      // data.append("usuario_id", this.$store.state.usuario.id);

      this.form.validateFields((err, values) => {
        if (!err) {
          console.log(this.data);
          this.axios
            .post(
              "/correspondencia/",
              {
                numero_processo: this.numero_processo,
                destinatario: this.destinatario,
                data: this.data,
                usuario_id: this.usuario.id,
              },
              /* data,*/ this.configuration
            )
            .then((res) => {
              this.visibleAdd = false;
              this.listaCorrespondencia();
              this.cancel();
            });
        }
      });
    },

    showAnexoModal(anexos) {
      this.anexoVisible = true;
      this.anexos = anexos;
    },

    showModal() {
      this.visibleAdd = true;
    },

    cancel() {
      this.form.resetFields();
    },

    cancelAnexoModal() {
      this.anexoVisible = false;
      this.anexos = [];
    },

    setFile(e) {
      var files = e.target.files;
      this.file = files[0];
    },

    send() {
      let me = this;
      let data = new FormData();

      data.append("anexo", this.file);
      data.append("cumprido", this.check);
      // data.append("observacoes", this.anexoModalObs);

      this.axios
        .post(
          `/correspondencia/upload/${this.idUpload}`,
          data,
          this.configuration
        )
        .then((res) => {
          if (res.data.success) {
            this.$message.success("Arquivo anexado a movimentação!");
          }
          me.limparEdicao();
          me.cancelUpload();
          me.listaCorrespondencia();
          me.handleReset();
        });
    },

    download(id) {
      var downloadLink = document.createElement("a");
      downloadLink.target = "_blank";
      downloadLink.download = `anexo_movimentacao_${id}.pdf`;

      var downloadUrl = `${this.host}/correspondencia/retrieve/${id}`;
      downloadLink.href = downloadUrl;
      document.body.append(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
      URL.revokeObjectURL(downloadUrl);
    },

    showUpload(item) {
      this.uploadVisible = true;
      this.idUpload = item.id;
    },

    cancelUpload() {
      this.uploadVisible = false;
      this.idUpload = "";
      this.file = null;
      this.anexoModalObs = "";
    },

    editar(item) {
      this.visible = true;
      this.editSetor.numero_processo = item.numero_processo;
      this.editSetor.destinatario = item.destinatario;
      this.editSetor.status_bot = item.status_bot;
      this.editSetor.id = item.id;
      this.editSetor.data = item.data;
    },

    cancelarEdicao() {
      this.visible = false;
    },

    alterar() {
      let me = this;
      me.axios
        .put(
          `/correspondencia/${me.editSetor.id}`,
          me.editSetor,
          me.configuration
        )
        .then((res) => {
          if (res.data.success) {
            this.$message.success("Correspondencia Atualizada!");
          }
          me.limparEdicao();
          me.listaCorrespondencia();
        })
        .catch(function(error) {
          // eslint-disable-line no-unused-vars
        });
    },
    limparEdicao() {
      this.visible = false;
      this.formNome = "";
      this.formUsuario = "";
      this.formId = "";
      this.check = "";
      this.arquivo_upload = "";
    },
    handleReset() {
      this.form.resetFields();
    },

    excluir(item){
      const me = this

      this.$confirm({
        title: "Deseja excluir esse item?",
        onOk() {
          me.axios.delete(`correspondencia/delete/${item.id}`, this.configuration)
          .then((response) =>{
             if (response.data.success) {
              this.$message.success("Correspondencia Removida!");
          }
          me.listaCorrespondencia()
          })
        },
      })
    }
  },
};
</script>

<style>
#header {
  display: block;
  background-color: #ffffff;
  max-width: 768px;
  margin: 0 auto;
  text-align: center;
  font-weight: bold;
  font-size: 25px;
  color: #2a3d29;
}

#header img {
  margin: 30px;
}

.home {
  padding: 0 10px;
}

.ant-table-thead > tr > th {
  background: #7fa07d !important;
  font-weight: bold !important;
}

.ant-table-thead
  > tr.ant-table-row-hover:not(.ant-table-expanded-row):not(.ant-table-row-selected)
  > td,
.ant-table-tbody
  > tr.ant-table-row-hover:not(.ant-table-expanded-row):not(.ant-table-row-selected)
  > td,
.ant-table-thead
  > tr:hover:not(.ant-table-expanded-row):not(.ant-table-row-selected)
  > td,
.ant-table-tbody
  > tr:hover:not(.ant-table-expanded-row):not(.ant-table-row-selected)
  > td {
  background: #eaf9ec !important;
}

.ant-table-title {
  background: #6b8669;
}

.ant-btn:hover,
.ant-btn:focus {
  color: #7fa07d !important;
  border-color: #7fa07d !important;
}

.ant-btn-primary {
  color: #fff !important;
  background-color: #7fa07d !important;
  border-color: #6b8669 !important;
}

.ant-btn-primary:hover,
.ant-btn-primary:focus {
  color: #fff !important;
  background-color: #a4c3a3 !important;
  border-color: #7fa07d !important;
}
</style>
