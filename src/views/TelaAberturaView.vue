<template>
  <v-container fill-height class="pink">
    <transition name="fade" mode="out-in">
      <TelaAbertura :mensagem="'Rolando uma animação com o logo'" v-if="!saiTela"/>
    </transition>
  </v-container>
</template>
<script>

  import TelaAbertura from '../components/TelaAbertura.vue'
  export default {
    components:{
      TelaAbertura
    },
    data() {
      return {
        saiTela: false,
        mensagem: 'Aguarde um instante...'
      }
    },
    mounted: function() {
      setTimeout(() =>  {
        this.saiTela = true;
        this.$router.push('/login'); }
      , 3000);
    }
  }
</script>
<style scoped>

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.fade-enter-active, 
.fade-leave-active {
  transition: opacity 3s ease;
}

</style>