<template>
    <v-bottom-navigation
        color="primary"
        grow
        fixed
    >
        <v-btn v-if="temBotaoAnterior" @click="btnVolta()" :disabled="podeVoltar === false">
            <span>Voltar</span>
            <v-icon>mdi-arrow-left</v-icon>
        </v-btn>
        <v-btn v-if="temBotaoCancela" @click="btnCancela()" :disabled="podeCancelar===false">
            <span>Cancelar</span>
            <v-icon>mdi-cancel</v-icon>
        </v-btn>
        <v-btn exact v-if="temBotaoProximo" @click="btnContinua()" :disabled="podeContinuar===false">
            <span>Continuar</span>
            <v-icon>mdi-arrow-right</v-icon>
        </v-btn>
        <v-btn v-if="temBotaoFinaliza" @click="btnFinaliza()" :disabled="podeFinalizar===false">
            <span>Finalizar</span>
            <v-icon>mdi-cloud-upload</v-icon>
        </v-btn>
    </v-bottom-navigation>
</template>
<script>
  export default {
    name: 'ButtonBar',
    props: {
        temBotaoAnterior: Boolean,
        temBotaoProximo:  Boolean,
        temBotaoCancela: Boolean,
        temBotaoFinaliza: Boolean,
        podeVoltar: Boolean,
        podeContinuar:  Boolean,
        podeCancelar: Boolean,
        podeFinalizar: Boolean
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
            this.$emit('funcaoAnterior')
        }, 
        btnContinua() {
            this.$emit('funcaoProximo')
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