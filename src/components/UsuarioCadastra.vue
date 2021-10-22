<template>
    <v-bottom-sheet v-model="mostraDialog" inset  max-width="500px">
        <v-sheet class="text-center">
            <v-card tile class="pa-0 ma-0">
                <v-card-title class="pa-2 teal lighten-2" >
                    <span class="white--text subtitle-1">Novo Usuário do Sistema</span>
                </v-card-title>
                <v-divider></v-divider>
                <v-card-text class="pa-0">
                    <v-form ref="myForm" class="mx-3" v-model="formularioValido">
                        <v-text-field class="pt-2" dense clearable 
                            v-model="nome"
                            label="Nome*"
                        />
                        <v-text-field dense clearable
                            v-model="email"
                            label="Email*"
                            prepend-icon="mdi-email"
                        />
                        <v-text-field dense clearable
                            label="Senha"
                            prepend-icon="mdi-lock"
                        />
                        <v-text-field dense clearable
                            label="Repita a Senha"
                            prepend-icon="mdi-lock"
                        />
                        <v-autocomplete class="pt-0" dense hide-no-data required
                            label="Perfil do Usuário*"
                            item-value="id"
                            item-text="nome"
                            prepend-icon="mdi-account-key"
                            return-object
                        ></v-autocomplete> 
                        <v-autocomplete class="pt-0" dense hide-no-data required
                            label="Cidade*"
                            item-value="id"
                            item-text="nome"
                            return-object
                            prepend-icon="mdi-home-city"
                        ></v-autocomplete> 
                        <v-autocomplete class="pt-0"
                            dense hide-no-data required
                            label="Unidade de Saúde*"
                            item-value="id"
                            item-text="nome"
                            prepend-icon="mdi-plus"
                            return-object
                        ></v-autocomplete> 
                        <v-autocomplete class="pt-0"
                            dense hide-no-data required
                            label="Micro Área*"
                            item-value="id"
                            item-text="nome"
                            prepend-icon="mdi-human-capacity-increase"
                            return-object
                        ></v-autocomplete> 
                    </v-form>
                </v-card-text>
                <v-card-actions class="pa-0 ma-0 pr-2 pb-5">
                    <v-spacer></v-spacer>
                    <v-btn text small color="secundary" @click="mostraDialog=false">Fechar </v-btn>
                    <v-btn text small color="error" v-if="eExclusao == true" @click="exclui()">Excluir</v-btn>
                    <v-btn text small color="primary" v-if="eExclusao == false" @click="salva()">Salvar</v-btn>
                </v-card-actions>
            </v-card>
        </v-sheet>
    </v-bottom-sheet>
</template>
<script>
    //import regrasCampos from '../bibliotecas/regrasCampos'
    //import RotinasLogin from '../lasTec.Login/bibliotecas/rotinasLogin'

    export default {
        props: {
            mostra: Boolean
        },
        data() {
            return {
                formularioValido: false,

                eExclusao: false,

                mostraDialog: false,

                nome: '',
                email: '',
            }
        },
        watch: {
            mostra (val) {
                this.mostraDialog = val
            },
            mostraDialog(val) {
                console.log('mostraDialog(val)', val)
                if (val == false) 
                    this.fechaDialog();
            }
        },
        methods: {
            exclui() {

            },
            fechaDialog() {
                this.$emit('cbfimCadastro')
                
            },
            salva() {

            },
        }
    }
</script>