<template>
    <v-bottom-navigation
        color="teal"
        grow
        fixed
    >
        <v-btn @click="btnNovoPaciente()">
            <span>Home</span>
            <v-icon>mdi-home</v-icon>
        </v-btn>
        <v-btn  @click="btnCancela()">
            <span>Novo</span>
            <v-icon>mdi-account-plus</v-icon>
        </v-btn>
        <v-btn  @click="btnCancela()">
            <span>Novo</span>
            <v-icon>mdi-account-minus</v-icon>
        </v-btn>
        <v-btn  @click="btnFinaliza()">
            <span>Finalizar</span>
            <v-icon>mdi-cloud-upload</v-icon>
        </v-btn>
    </v-bottom-navigation>
</template>
<script>
  export default {
    name: 'ButtonBar',
    props: {
        botaoVolta: Boolean,
        botaoContinua:  Boolean,
        botaoCancela: Boolean,
        botaoFinaliza: Boolean
    },
    data() {
        return {
        }
    },
    created() {
        this.visivel = false;
    },
    methods: {
        btnVolta() {
            this.$emit('funcaoVolta')
        }, 
        btnContinua() {
            this.$emit('funcaoContinua')
        },
        btnCancela() {
            this.$emit('funcaoCancela')
        },
        btnFinaliza() {
            this.$emit('funcaoFinaliza')
        }
    }
  }
</script>