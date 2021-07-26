<template>
  <v-container>
    <v-row class="text-left">
      <v-col class="mb-2 text-left">
        <h2 class="font-weight-bold mb-2">
          Bem vindo ao Painel Saúde
        </h2>
        <p class="mb-1 font-weight-regular">
          Somos uma plataforma criada para apoiar os municipios parceiros a se prepararem no combate ao Covid-19, auxiliando no planejamento e implementação das ações das redes de atenção básica de saúde.
          <br><br>Será que sua prefeitura já utiliza nossa plataforma?
        </p>
      </v-col>
      <v-col 
        class="mb-0 pt-0 mt-0"
        cols="12"
      >
        <p class="subheading font-weight-regular">
         <a href="#" v-on:click="showScheduleForm=true">Quero saber como funciona</a>
        </p>
        <p class="subheading font-weight-regular">
         <a href="#" v-on:click="showScheduleForm=true">Minha prefeitura está participando?</a>
        </p>
      </v-col>
      <v-col
        class="mb-5 pt-0"
        cols="12"
      >
        <h4 class="font-weight-bold mb-3 text-center"> A sua cidade conta com você. Vamos começar? </h4>
          <v-row class="pt-5 mt-5 justify-center" >
            <v-btn class="primary" v-on:click="proximaTela(1)">Estou com suspeita de covid</v-btn>
          </v-row>
          <v-row class="pt-5 mt-5 justify-center" >
            <v-btn class="primary" v-on:click="proximaTela(2)">Já estou em acompanhamento</v-btn>
          </v-row>
          <v-row class="pt-5 mt-5 justify-center" >
            <v-btn class="primary" v-on:click="proximaTela(3)">Área do Cidadão</v-btn>
          </v-row>
<!--         <v-row justify="left" v-for="(link, i) in funcionalidades" :key="i">
          {{ link.mensagem }}
          <a
            :href="link.href"
            class="subheading mx-3"
            target="_blank"
          >
            {{ link.text }}
          </a>
        </v-row> -->
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
  export default {
    name: 'HelloWorld',
    data() {
      return {
      }
    },
    methods: {
      proximaTela(tela) {
        console.log(tela)
        if (tela == 1)
            this.$router.push('/suspeitaCovid');
        else if (tela == 2)
            this.$router.push('/emDesenvolvimento');
        else if (tela == 3)
            this.$router.push('/emDesenvolvimento');

      },
    }
  }
</script>
<style scoped>
  .v-btn{
      width: 90%;
  } 
  @media(max-width: 2000px) {
    p {font-size: 0.8rem}
    h2 {font-size: 1.2rem}
    h4 {font-size: 0.9rem}
    .v-btn {
      font-size: 0.8rem
    }
  }
</style>

