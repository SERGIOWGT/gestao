<template>
    <v-bottom-navigation
        color="primary"
        grow
        fixed
    >
        <v-btn v-if="temBotaoAnterior" @click="btnFuncao('VO')" :disabled="podeVoltar === false">
            <span>Voltar</span>
            <v-icon>mdi-arrow-left</v-icon>
        </v-btn>
        <v-btn v-if="temBotaoCancela" @click="btnFuncao('CA')" :disabled="podeCancelar===false">
            <span>Cancela</span>
            <v-icon>mdi-cancel</v-icon>
        </v-btn>
        <v-btn exact v-if="temBotaoProximo" @click="btnFuncao('PX')" :disabled="podeContinuar===false">
            <span>Continuar</span>
            <v-icon>mdi-arrow-right</v-icon>
        </v-btn>
        <v-btn v-if="temBotaoSalva" @click="btnFuncao('SV')">
            <span>Salvar</span>
            <v-icon>mdi-cloud-upload</v-icon>
        </v-btn>
        <v-btn v-if="temBotaoVerifica" @click="btnFuncao('VF')" :disabled="podeVerificar===false">
            <span>Consultar</span>
            <v-icon>mdi-account-search</v-icon>
        </v-btn>
        <v-btn v-if="temBotaoFinaliza" @click="btnFuncao('FM')">
            <span>Finalizado</span>
            <v-icon>mdi-account-off</v-icon>
        </v-btn>
        <v-btn v-if="temBotaoNovo" @click="btnFuncao('NP')">
            <span>Novo Monitorado</span>
            <v-icon>mdi-account-plus</v-icon>
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
        temBotaoSalva: Boolean,
        temBotaoVerifica: Boolean,
        temBotaoNovo: Boolean,
        podeVoltar: Boolean,
        podeContinuar:  Boolean,
        podeCancelar: Boolean,
        podeVerificar: Boolean
    },
    data() {
        return {
        }
    },
    created() {
        this.visivel = false;
    },
    methods: {
        btnFuncao(val) {
            this.$emit('funcaoRetorno', val)
        } 
    }
  }
</script>