<template>
  <div class="home">
    <div
      style="
      max-width:500px;
      margin: 20% auto;
      border-radius: 10px;
      padding: 40px;
      border: 1px solid #d9d9d9;
      background: #fff;
      margin-top: 80px;
    "
    >
      <div>
        <a-row :gutter="20" style="margin-left: -10px;margin-right: -90px;">
          <a-col :span="12">
            <a-card :bordered="false">
              <img
                slot="cover"
                style="width: 259px; margin-left: -62px;"
                src="../assets/jfpb.png"
                alt="JF"
              />
            </a-card>
          </a-col>
          <a-col :span="12" style="width: 290px;
    margin-left: -98px;">
            <a-card :bordered="false">
              <a-form
                id="components-form-demo-normal-login"
                :form="form"
                class="login-form"
                @submit="handleSubmit"
              >
                <a-form-item>
                  <a-input
                    v-decorator="[ 'userName', { 
                        rules: [{ 
                            required: true, 
                            message: 'Por favor, insira seu nome de usuário.' 
                        }]
                    }]"
                    placeholder="Usuário"
                  >
                    <a-icon slot="prefix" type="user" style="color: rgba(0,0,0,.25)" />
                  </a-input>
                </a-form-item>

                <a-form-item>
                  <a-input
                    v-decorator="[ 'password', { 
                        rules: [{ required: true, message: 'Por favor, insira sua senha.' }] 
                    }]"
                    type="password"
                    placeholder="Senha"
                  >
                    <a-icon slot="prefix" type="lock" style="color: rgba(0,0,0,.25); " />
                  </a-input>
                </a-form-item>

                <a-form-item style="display:flex;justify-content:space-between">
                  <a-button type="primary" html-type="submit" class="login-form-button">Log in</a-button>
                </a-form-item>
              </a-form>
            </a-card>
          </a-col>
        </a-row>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  beforeCreate() {
    this.form = this.$form.createForm(this, {
      name: "normal_login",
    });
  },

  methods: {
    handleSubmit(e) {
      e.preventDefault();

      this.form.validateFields((err, values) => {
        if (!err) {
          this.axios
            .post("usuarios/login", {
              username: values.userName,
              senha: values.password,
            })
            .then((res) => {
              this.$store.dispatch("guardarToken", res.data.token);
              this.$store.dispatch("guardarUsuario", res.data.usuario);
              this.$router.push({ name: "Home" });
            })
            .catch((errorLogin) => {
              if (errorLogin.response.status == 400) {
                this.$message.info(
                  "Usuario não encontrado ou senha incorreta."
                );
              } else if (errorLogin.response.status == 401) {
                this.$message.warning(
                  "O usuário está desativado. Entre em contato com administrador do sistema."
                );
              } else {
                this.$message.info("Erro no Servidor.");
              }
            });
        }
      });
    },
  },
};
</script>

<style >
.login-form-button {
  width: 100px;
  padding: 4px;
  margin-left: 10px;
}

.ant-form-item {
  margin: 0;
}
</style>