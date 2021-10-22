<template>
    <v-flex>
        <v-expansion-panels focusable v-model="abrePainel">
            <v-expansion-panel class="pt-0 mt-0 " >
                <v-expansion-panel-header class="blue-grey lighten-5 teal--text px-3">
                    <v-row no-gutters>
                        <v-col cols="12">
                        PESQUISA POR NOME
                        </v-col>
                        <v-col
                        cols="1"
                        class="text--secondary"
                        >
                        <v-fade-transition leave-absolute>
                            <span
                            key="0"
                            >
                            </span>
                        </v-fade-transition>
                        </v-col>
                    </v-row>
                </v-expansion-panel-header>
                <v-expansion-panel-content>
                    <v-autocomplete class="pt-1"
                        dense
                        placeholder="Nome do Cidadão"
                        clearable
                        :items="pacientes"
                        :search-input.sync="sincronizaPaciente"
                        item-value="id"
                        item-text="nome"
                        hide-no-data
                        :loading="isLoading"
                        v-model="pacienteId"
                    ></v-autocomplete>
                    <v-card-actions class="pt-2 pb-0">
                        <v-spacer></v-spacer>
                        <v-btn text small color="teal lighten-2" :disabled="pacienteId == null || !habilitaPesquisa || isLoading" @click="busca"> Buscar </v-btn>
                    </v-card-actions>
                </v-expansion-panel-content>
            </v-expansion-panel>
        </v-expansion-panels>
    </v-flex>
</template>
<script>
    import mainService from '../services/mainService'

  export default {
        props: {
            aberto: Boolean,
            habilitaPesquisa: Boolean
        },
        data() {
            return {
                pacienteId: null,
                abrePainel: 0,
                isLoading: false,

                pacientes: [],

                cidadePadrao: '',
                
                tipoMensagem: 0,
                mensagem: '',
                mensagemAguarde: '',
            }
        },
        created() {
            this.cidadePadrao = this.$store.getters.cidadePadrao
        },
        watch: {
            aberto(v) {
                if (v) {
                    if (this.abrePainel == null) {
                        this.abrePainel = 0
                    }
                        
                } else {
                    if (this.abrePainel == 0){
                        this.abrePainel = null
                    }
                }
            },
            abrePainel(v) {
                this.$emit('cbAbriu', v == null ? false : true)
            },
        },
        computed: {
            sincronizaPaciente: {
                get () {
                    return ''
                },
                set (searchInput) {
                    if ((searchInput) && (searchInput.length >= 3)) {
                        this.listaPacientePorNome(this.cidadePadrao.id, searchInput)
                    } else 
                        this.pacientes = []
                }
            },
        },
        methods: {
            busca() {
                this.$emit('cbBusca', this.pacienteId, 'Nome do Paciente')
            },
            isEmpty(value) {
                return (value == null || value === '');
            },
            async listaPacientePorNome(cidadeId, parteNome) {
                const param = {cidadeId: cidadeId, nome: parteNome}
                const resp = await mainService.listaPacientes(param)
                this.isLoading = true
                if (resp.status == 200) 
                    this.pacientes = resp.data
                else 
                    this.pacientes = []
                this.isLoading = false
            },
        }
    }
</script>
