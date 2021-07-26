<template>
    <v-bottom-navigation
        color="teal"
        grow
        fixed
    >
        <v-btn v-if="botaoVolta" @click="btnVolta()">
            <span>Voltar</span>
            <v-icon>mdi-arrow-left</v-icon>
        </v-btn>
        <v-btn v-if="botaoCancela" @click="btnCancela()">
            <span>Cancelar</span>
            <v-icon>mdi-cancel</v-icon>
        </v-btn>
        <v-btn v-if="botaoContinua" @click="btnContinua()">
            <span>Continuar</span>
            <v-icon>mdi-arrow-right</v-icon>
        </v-btn>
        <v-btn v-if="botaoFinaliza" @click="btnFinaliza()">
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