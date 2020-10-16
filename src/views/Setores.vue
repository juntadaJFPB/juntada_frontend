<template>
  <a-row type="flex" justify="space-around" align="middle" style="margin-top: 30px;">
    <a-col :span="20">
      <v-layout align-start>
          <v-flex>
              <v-data-table :headers="headers" :items="setores" :search="search" class="elevation-1">
                  
                  <template v-slot:[`item.ativo`]="{ item }">
                      <samp style="color: #49D907; font-weight: bold;" v-if="item.ativo == 1"> Ativo</samp>
                      <samp style="color: #F24607; font-weight: bold;" v-if="item.ativo == 0"> Desativado</samp>
                  </template>

                  <template v-slot:top>
                      <v-toolbar flat color="white">
                          <v-toolbar-title>Setores</v-toolbar-title>

                          <v-spacer></v-spacer>

                          <v-text-field class="text-xs-center" v-model="search" label="Pesquisa" single-line hide-details></v-text-field>

                          <v-spacer></v-spacer>
                          <app-cadastroSetor @addSetor="listarSetores"></app-cadastroSetor>

                          <a-modal centered v-model="adModal" :title="adAccion == 2 ? 'Desativar' : 'Ativar'">
                              <p>
                                  Deseja {{ adAccion==2 ? 'desativar' : 'ativar' }}
                                  o setor: <strong>{{ addescricao }}</strong>
                              </p>

                              <template slot="footer">
                                  <a-button key="back" @click="encerrar()">Cancelar</a-button>
                                  <a-button type="primary" key="submit" @click="adAccion==2 ? desativar() : ativar()">
                                      {{ adAccion == 2 ? 'Desativar' : 'Ativar' }}
                                  </a-button>
                              </template>
                          </a-modal>
                      </v-toolbar>
                  </template>
                  <template v-slot:[`item.action`]="{ item }">
                  
                      <a-tooltip placement="left" v-if="item.ativo == 1">
                          <template slot="title">
                              <span>Desativar</span>
                          </template>
                          
                          <v-icon big class="mr-2" @click="ativarDesativar(item)" style="color: #F24607;">
                              mdi-close-thick
                          </v-icon>
                      </a-tooltip>

                      <a-tooltip placement="left" v-else>
                          <template slot="title">
                              <span>Ativar</span>
                          </template>
                          
                          <v-icon big class="mr-2" @click="ativarDesativar(item)" style="color: #49D907; ">
                              mdi-check-bold
                          </v-icon>
                      </a-tooltip>

                      <a-tooltip placement="right">
                         <Span>----</Span>
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
                      <v-btn color="primary" @click="listarSetores()">Recarregar</v-btn>
                  </template>
              </v-data-table>
          </v-flex>

          <a-modal
              title="Editar Setor"
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

                      <a-col :span="24">
                          <a-form-item label="Endereço">
                              <a-input v-model="editItem.endereco"></a-input>
                          </a-form-item>
                      </a-col>


                    <!--
                      <a-col :span="12">
                          <a-form-item has-feedback label="Tipo">
                              <a-select
                                  v-model="editItem.setorTipoId"
                                  placeholder="Tipo"
                              >
                                  <a-select-option 
                                      v-for="tipo in itemTipo"
                                      :key="tipo.value"
                                      :value="tipo.value"
                                  >
                                      {{tipo.text}}
                                  </a-select-option>
                              </a-select>
                          </a-form-item>
                      </a-col>

                      -->
                  </a-row>
              </a-form>

              <template slot="footer">
                  <a-button key="back" @click="cancelarEdicao">
                      Cancelar
                  </a-button>

                  <a-button key="submit" type="primary"  @click="alterar">
                      Alterar
                  </a-button>
              </template>
          </a-modal>
      </v-layout>
    </a-col>
  </a-row>
</template>

<script>
import axios from "axios";
import cadastroSetor from '@/components/Cadastro/cadastroSetor'

export default {
    data() {
        return {
            atualiza: 0,
            dialog: false,

            search: "",
            setores: [],
            headers: [
                { text: "Opções", value: "action", sortable: false },
                { text: "Descrição", value: "descricao", sortable: true },
                { text: "Endereço", value: "endereco", sortable: false },
                { text: "Status", value: "ativo", sortable: true }
            ],
            ativo: "",
            descricao: "",

            adModal: false,
            adAccion: 0,
            addescricao: "",
            adId: "",

            editItem: {
                id: '',
                descricao: '',
                endereco: '',
               // setorTipoId: '',
            },
            editVisible: false,
            itemTipo: [
                { text: 'Comum', value: 1 },
                { text: 'Super', value: 2 },
            ],

            configuration: { 
                headers: { 
                    Token: this.$store.state.portarias_token 
                }
            },
        }
    },

    computed: {

    },

    watch: {
        dialog(val) {
            val || this.close();
        }
    },

    created() {
        this.listarSetores()
    },

    components: {
        'app-cadastroSetor': cadastroSetor
    },

    methods: {
        listarSetores() {
            let me = this
            
            axios.get("/setores/", this.configuration )
            .then(response => {
                me.setores = response.data.setores
            })
            .catch(function (error) { // eslint-disable-line no-unused-vars
                
            })
        },

        close() {
            //      this.limpar();
            //      this.dialog = false;
        },

        ativarDesativar(item) {
            this.adId = item.id
            let me = this
            this.$confirm({
                title: `Deseja ${item.ativo ? 'desativar':'ativar'} este setor?`,
                content: `${item.descricao}`,
                okText: 'Sim',
                cancelText: 'Não',
                onOk() {
                    item.ativo ? me.desativar() : me.ativar()
                },
            });
        },

        encerrar() {
            this.adModal = false
        },

        ativar() {
            let me = this

            this.axios.put(`/setores/activate/${this.adId}`, {}, this.configuration )
            .then((res) => {
                if(res.data.success){
                    me.$message.success("Setor ativado!")
                }
                me.limpar()
                me.listarSetores()
            })
            .catch(function (error) { // eslint-disable-line no-unused-vars
                
            })
        },

        desativar() {
            let me = this

            this.axios.put(`/setores/deactivate/${this.adId}`, {}, this.configuration )
            .then((res) => {
                if(res.data.success){
                    me.$message.success("Setor desativado!")
                }
                me.limpar()
                me.listarSetores()
            })
            .catch(function (error) { // eslint-disable-line no-unused-vars
                
            })
        },

        editar(item) {
            this.editVisible = true;
            this.editItem.id = item.id;
            this.editItem.descricao = item.descricao;
            this.editItem.endereco = item.endereco;
            //this.editItem.setorTipoId = item.setorTipoId;
        },

        alterar() {
            let me = this;
            this.axios.put(`/setores/${this.editItem.id}`, this.editItem, this.configuration)
            .then(res => {
                if(res.data.success) {
                    me.$message.success("Setor atualizada!");
                }
                me.editVisible = false;
               
                me.listarSetores();
            })
            .catch(function (error) { // eslint-disable-line no-unused-vars
                
            })
        },

        cancelarEdicao() {
            this.editVisible = false;
           
        },

        limpar() {
            this.adModal = false
            this.adAccion = 0
            this.adNombre = ""
            this.adId = ""
        },
    }
}
</script>

<style scoped>

</style>
