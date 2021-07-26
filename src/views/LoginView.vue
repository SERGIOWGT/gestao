<template>
  <v-container fill-height>
    <transition name="slide-fade" mode="in-out">
      <LoginComponent 
        :tokenSistema="'F27E3934-F5C6-4A20-B978-1638005116C0'"
        @autenticado='autenticado'
        @registraUsuario='registraUsuario'
        @setaConfiguracaoSistema='setaConfiguracaoSistema'
        @trocaSenha='trocaSenha'
      />
    </transition>
  </v-container>
  
</template>
<script>
  //import AppBar from '../components/AppBar.vue'
  import LoginComponent from  '../lasTec.Login/components/LoginComponent'
  //import TelaAbertura from '../components/TelaAbertura.vue'

  export default {inject: {
      theme: {
        default: { isDark: false },
      },
    },
    components:{
      LoginComponent //, TelaAbertura
    },
    data() {
      return {
        ssoPronto: false,
        emAbertura: true,
        nomeSistema: ''       
      }
    },
    methods: {
      setaConfiguracaoSistema (value) {
        this.nomeSistema = value.nomeSistema
        this.$store.commit('setaConfiguracaoSistema', value)
        this.ssoPronto = true;
      },
      autenticado(obj) {   
        this.$store.commit('autenticado', obj)
        this.$router.push('/Home')
        console.log('LoginView.Autenticado')
        //var _url = 'http://localhost:58733/Default.aspx?'
        //var _parms = `sistemaId=${obj.sistemaId}&nomeUsuario=${obj.nomeUsuario}&emailUsuario=${obj.email}&token=${obj.token}`
        //var _encoded = encodeURI(_url + _parms);
        //console.log(_encoded);
        //window.location= _encoded;
      },
      trocaSenha() {   
        this.$router.push('/trocaSenha')
      },
      registraUsuario() {
        this.$router.push('/registraUsuario')
      }
    }
  }
</script>
<style scoped>
 
  .login-fade-leave-active {
    transition: opacity 2s ease;
  }
  .login-fade-enter, .login-fade-leave-to
  /* .component-fade-leave-active for <2.1.8 */ {
    opacity: 0;
  }
</style>