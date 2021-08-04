<template>
  <v-container >
    <StepBar :etapa="etapaAtual.stepBar"/>
    <v-container fluid style="height: 100vmax;" class="pa-1">
      <v-flex v-if="etapaAtual.posicao < numeroEtapas">
        <p class="text-h6">{{etapaAtual.nome}}</p> 
          <p class="text-body-2">{{etapaAtual.obs}}
              <span v-show="etapaAtual.obs2 !== ''"><br>{{etapaAtual.obs2}} </span>                     
          </p>
        <v-card flat class="pa-0">
          <v-card-text class="ma-0 pa-0">
            <v-form ref="form" class="mx-2" v-model="formularioValido">
              <v-row>
                <v-col cols="12">
  <!--                 <v-combobox v-if="etapaAtual.posicao == 0"
                    v-model="select"
                    :items="estados"
                    label="Estado"
                    dense
                  ></v-combobox>
                  <v-combobox v-if="etapaAtual.posicao == 0"
                    v-model="select"
                    :items="municipios"
                    label="Município"
                    dense
                  ></v-combobox>
  -->                
                  <v-combobox class="mt-4" v-if="etapaAtual.posicao == 0" @input="setaUnidadeSaude"
                    required
                    dense
                    label="Unidade de Saúde"
                    :items="unidadesSaude"
                    item-value="id"
                    item-text="nome"
                  ></v-combobox> 
                  <v-combobox class="mt-5" v-if="etapaAtual.posicao == 0" @input="setaBairro"
                    required
                    dense
                    label="Bairro"
                    :items="bairros"
                    item-value="id"
                    item-text="nome"
                  ></v-combobox> 
                  <v-combobox class="mt-5" v-if="etapaAtual.posicao == 0" @input="setaLogradouro"
                    dense
                    label="Nome da rua"
                    :disabled="infoPaciente.bairroId === 0"
                    :items="logradouros"
                    item-value="id"
                    item-text="nome"
                  ></v-combobox>

                  <v-text-field class="pt-5 mt-5" v-if="etapaAtual.posicao == 1"
                    dense
                    label="Número do seu imóvel"
                    required
                    clearable
                    v-model="infoPaciente.numero"
                    counter
                    maxlength="10"
                    :rules="[regras.Basicas.obrigatorio()]"
                  ></v-text-field>
                   <v-text-field class="mt-4" v-if="etapaAtual.posicao == 1"
                    dense
                    label="Complemento do seu endereço"
                    required
                    clearable
                    v-model="infoPaciente.complemento"
                    counter
                    maxlength="50"
                    :rules="[regras.Basicas.obrigatorio()]"
                  ></v-text-field>
                  <v-row class="py-5" v-if="etapaAtual.posicao == 1"></v-row>
                  <v-switch class="mt-4 mb-5" v-if="etapaAtual.posicao == 1"
                    color="red darken-1"
                    value="red darken-1"
                    hide-details
                  >
                    <template v-slot:label>
                      <span class="input__label"><h5>Imóvel sem número</h5></span>
                    </template>
                  </v-switch>   
                  <v-switch class="mt-4 mb-5" v-if="etapaAtual.posicao == 1"
                    color="red darken-1"
                    value="red darken-1"
                    hide-details
                  >
                    <template v-slot:label>
                      <span class="input__label"><h5>Endereço sem complemento</h5></span>
                    </template>
                  ></v-switch>   
                  <v-text-field class="pt-5 mt-4"  v-if="etapaAtual.posicao == 2"
                    dense
                    label="Nome Completo"
                    required
                    clearable
                    v-model="infoPaciente.nome"
                    :rules="[regras.Basicas.obrigatorio(), regras.Basicas.min(10), regras.Basicas.max(100)]"
                    counter
                    maxlength="100"

                  ></v-text-field>
                  <v-text-field class="mt-4" v-if="etapaAtual.posicao == 2"
                    dense
                    label="CPF (999.999.999-99)"
                    required
                    clearable
                    v-model="infoPaciente.cpf"
                    :rules="[regras.Basicas.obrigatorio(), regras.Cpf.valido()]"
                    counter
                    maxlength="14"
                  ></v-text-field>
                  <v-text-field class="mt-4" v-if="etapaAtual.posicao == 2"
                    required
                    label="Data de Nascimento"
                    dense
                    clearable
                    v-model="infoPaciente.dataNascimento"
                  ></v-text-field>
                  <v-text-field class="mt-4" v-if="etapaAtual.posicao == 2"
                    dense
                    label="Número do Sus (999 9999 9999 9999)"
                    required
                    clearable
                    v-model="infoPaciente.numeroSus"
                    :rules="[regras.NumeroSus.valido(false)]"
                    counter
                    maxlength="18"
                  ></v-text-field>
                  <v-text-field class="pt-5 mt-4"  v-if="etapaAtual.posicao == 3"
                    dense
                    label="Email"
                    required
                    clearable
                    v-model="infoPaciente.eMail"
                    counter
                    maxlength="100"
                    :rules="[regras.Basicas.obrigatorio()]"
                  ></v-text-field>
                  <v-text-field class="mt-4" v-if="etapaAtual.posicao == 3"
                    dense
                    label="Celular (99 ?9999-9999)"
                    required
                    clearable
                    v-model="infoPaciente.celular"
                    :rules="[regras.Celular.valido(true)]"
                    counter
                    maxlength="13"
                  ></v-text-field>
                  <v-text-field class="mt-4" v-if="etapaAtual.posicao == 3"
                    dense
                    label="Celular 2 (99 ?9999-9999)"
                    required
                    clearable
                    v-model="infoPaciente.celular2"
                    :rules="[regras.Celular.valido(false)]"
                    counter
                    maxlength="13"
                  ></v-text-field>

                  <div v-if="etapaAtual.posicao == 3">
                    <a ref="#">Dúvidas sobre o termo de confidencialidade</a>
                  </div>
                </v-col>
              </v-row>
              <v-row v-if="etapaAtual.posicao == 4">
                <v-col cols="12" >
                  <v-sheet v-for="(item, index) in comorbidades" :key="item.id" >
                    <v-switch class="pt-1 mt-0"  v-model="comorbidades[index].selecionado"> 
                      <template v-slot:label >
                        <span v-bind:class="(item.id == -1)?'input__label':''">{{item.nome}}</span>
                      </template>
                    </v-switch>
                  </v-sheet>
                </v-col>
              </v-row>
              <v-row v-if="etapaAtual.posicao == 5">
                <v-col cols="12">
                  <v-sheet v-for="(item, index) in sintomas" :key="item.id" >
                    <v-switch class="pt-1 mt-0"  v-model="sintomas[index].selecionado">
                      <template v-slot:label>
                        <span v-bind:class="(item.id == -1)?'input__label':''">{{item.nome}}</span>
                      </template>
                    </v-switch>
                  </v-sheet>
                </v-col>
              </v-row>
              <v-row v-if="etapaAtual.posicao == 6" >
                <v-col cols="12">
                  <v-sheet class="pl" v-for="(item) in comorbidadesSelecionadas" :key="item.id" >
                        {{item.nome}}
                  </v-sheet>
                </v-col>
                <v-col cols="12">
                  <v-sheet class="pl" v-for="(item) in sintomasSelecionados" :key="item.id" >
                        {{item.nome}}
                  </v-sheet>
                </v-col>
              </v-row>

            </v-form>
          </v-card-text>
        </v-card>
      </v-flex>
      <v-flex fill-height v-else >
        <v-layout align-center>
        Nessa tela, devemos agradecer ao cidadão pela participação. Enaltecer a prefeitura e informar os próximos passos"
        </v-layout>
      </v-flex>
    </v-container>
    <BottomBar 
        :temBotaoAnterior="temBotaoAnterior"
        :temBotaoProximo= "temBotaoProximo"
        :temBotaoCancela= "temBotaoCancela"
        :temBotaoFinaliza= "temBotaoFinaliza"
        :podeVoltar="podeVoltar"
        :podeContinuar= "podeContinuar"
        :podeCancelar= "podeCancelar"
        :podeFinalizar= "podeFinalizar"
        @funcaoAnterior= 'cmdAnterior'
        @funcaoProximo = 'cmdProximo'
        @funcaoCancela= 'cmdCancela'
        @funcaoFinaliza = 'cmdFinaliza'
    />
  </v-container>
</template>
<script>
    import StepBar from '../components/StepBar';
    import BottomBar from '../components/StepBottomBar'
    import mainService from '../services/MainService'
    import regrasCampos from '../bibliotecas/regrasCampos'

    export default {
        name: 'SuspeitaCovid',
        components: {
            StepBar, BottomBar
        },
        data() {
          return {
            regras: regrasCampos,
            formularioValido: false,
            infoPaciente: {
              nome: null,
              cpf: null,
              dataNascimento: '03/11/1971',
              numeroSus: '',              
              eMail: null,
              celular: null,
              celular2: '',
              bairroId: 0,
              logradouroId: 0,
              unidadeSaudeId: 0,
              numero: null,
              complemento: null
            },
            cidadeId: 1,

            sintomas: [ 
                        {"id": 1, "nome": 'Diarréia', "selecionado": false}, 
                        {"id": 2, "nome": 'Febre', "selecionado": false}, 
                        {"id": 3, "nome": 'Dor de cabeça', "selecionado": false}, 
                        {"id": 4, "nome": 'Dor de garganta', "selecionado": false}, 
                        {"id": 5, "nome": 'Dispinéia', "selecionado": false}, 
                        {"id": 6, "nome": 'Tosse', "selecionado": false}, 
                        {"id": 7, "nome": 'Coriza', "selecionado": false}, 
                        {"id": 8, "nome": 'Perda de paladar', "selecionado": false}, 
                        {"id": 9, "nome": 'Perda de olfato', "selecionado": false},
                        {"id": -1, "nome": 'Assintomático', "selecionado": false}
            ],
            comorbidades: [
                        {"id": 1, "nome": 'Doença cardio vascular crônica', "selecionado": false},
                        {"id": 2, "nome": 'Doença hepática crônica', "selecionado": false},
                        {"id": 3, "nome": 'Doença neurológica crônica', "selecionado": false},
                        {"id": 4, "nome": 'Doença renal crônica', "selecionado": false},
                        {"id": 5, "nome": 'Doença hematológica crônica', "selecionado": false},
                        {"id": 6, "nome": 'Asma', "selecionado": false},
                        {"id": 7, "nome": 'Outra pneumopatia crónica', "selecionado": false},
                        {"id": 8, "nome": 'Puérperas (até 45 dias do parto)', "selecionado": false},
                        {"id": 9, "nome": 'Sindrome de Down', "selecionado": false},
                        {"id": 10, "nome": 'Diabetes mellitus', "selecionado": false},
                        {"id": 11, "nome": 'Imonudeficiência/Imonudepressão', "selecionado": false},
                        {"id": -1, "nome": 'Nenhuma das alternativas acima', "selecionado": false}
            ],

            temBotaoAnterior: true,
            temBotaoProximo: true,
            temBotaoCancela: false,
            temBotaoFinaliza: false,

            podeVoltar: true,
            podeCancelar: false,
            podeFinalizar: false,
            
            numeroEtapas: 0,
            etapaAtual: {posicao: 0, nome: '', obs: '', obs2: '', stepBar: 0},
            etapas: [{stepBar: 1, nome: 'Onde fica a residência?', obs: 'Precisamos saber onde mora o cidadão monitorado.', obs2: ''},
                     {stepBar: 2, nome: 'Qual o número da sua residência?', obs: 'sd skd jlksjdl kjs.', obs2: ''},
                     {stepBar: 3, nome: 'Agora seus dados pessoais', obs: 'Fique tranquilo seus dados são confidenciais e somente só serão utilizados conforme nosso termo de confidencialidade.', obs2: ''},
                     {stepBar: 4, nome: 'Como entramos em contato com você?', obs: 'Fique tranquilo seus dados são confidenciais e somente só serão utilizados conforme nosso termo de confidencialidade.', obs2: ''},
                     {stepBar: 5, nome: 'Como anda sua saúde?', obs: 'A indicação das suas principais doenças crônicas nos ajudarão muito no nosso planejamento.', obs2: ''},
                     {stepBar: 6, nome: 'Como você está se sentindo agora?', obs: 'Marque abaixo cada sintoma que você está sentindo agora e quando começou', obs2: ''},
                     {stepBar: 7, nome: 'Obrigado', obs: 'Obrigado', obs2: ''}                     
            ],
            bairros: [],
            logradouros: [],
            unidadesSaude: []
          }
        },
        created() {
          this.etapaAtual.posicao = 0
          this.setaEtapaAtual(0)
          this.numeroEtapas = this.etapas.length
        },
        mounted() {
          this.buscaDadosIniciais();
          console.log('mounted')
        },
        computed: {
          podeContinuar: function() {
            var _retorno = true;
            if (this.etapaAtual.posicao == 0) {
              console.log(this.etapaAtual.posicao, this.infoPaciente.bairroId, this.infoPaciente.logradouroId)
              _retorno = (this.infoPaciente.unidadeSaudeId !=0) && (this.infoPaciente.bairroId !=0) && (this.infoPaciente.logradouroId != 0)
            } else 
              _retorno =  this.formularioValido

            return _retorno;
          },
          comorbidadesSelecionadas: function () {
            return this.comorbidades.filter(i => i.selecionado === true)
          },
          sintomasSelecionados: function () {
            return this.sintomas.filter(i => i.selecionado === true)
          },
        },
        methods: {
          setaBairro(value) {
            this.infoPaciente.bairroId = value.id;

            mainService.listaLogradouros(this.infoPaciente.bairroId).then(resposta => {
              if (resposta.status == 200) {
                this.logradouros = resposta.data;
              } else {
                console.log('Erro', resposta.message)
                this.mensagemErro = resposta.message
              }
            })
          },
          setaLogradouro(value) {
            this.infoPaciente.logradouroId = value.id;
          },
          setaUnidadeSaude(value) {
            this.infoPaciente.unidadeSaudeId = value.id;
          },
          buscaDadosIniciais() {
            Promise.all([
              mainService.listaUnidadesSaude(this.cidadeId),
              mainService.listaBairros(this.cidadeId) 
            ]).then(([_resultadoUnidadeSaude, _resultadoBairro]) => {
              if (_resultadoUnidadeSaude.status == 200) 
                this.unidadesSaude = _resultadoUnidadeSaude.data
              
              if (_resultadoUnidadeSaude.status == 200) 
                this.bairros = _resultadoBairro.data
            });
            /*
            mainService.listaBairros(this.cidadeId).then(resposta => {
              if (resposta.status == 200) {
                this.bairros = resposta.data;
              } else {
                console.log('Erro', resposta.message)
                this.mensagemErro = resposta.message
              }
              })
              .catch((response) => {
                if (response) {
                  this.mensagemErro = "";
                  response.erros.forEach(el => {
                    this.mensagemErro += el.mensagem;
                  });
                } else {
                  // Something happened in setting up the request that triggered an Error
                  console.log('Erro', response.message);
                  this.mensagemErro = response.message;
                }
            })
            */
          },
          salvaPaciente() {
              mainService.salvaPaciente(this.infoPaciente).then(resposta => {
              if (resposta.status == 200) {
                this.bairros = resposta.data;
              } else {
                console.log('Erro', resposta.message)
                this.mensagemErro = resposta.message
              }
              })
              .catch((response) => {
                if (response) {
                  this.mensagemErro = "";
                  response.erros.forEach(el => {
                    this.mensagemErro += el.mensagem;
                  });
                } else {
                  // Something happened in setting up the request that triggered an Error
                  console.log('Erro', response.message);
                  this.mensagemErro = response.message;
                }
            })
          }, 
 
          setaEtapaAtual(posicao) {
            this.etapaAtual.stepBar = this.etapas[posicao].stepBar;
            this.etapaAtual.nome = this.etapas[posicao].nome;
            this.etapaAtual.obs = this.etapas[posicao].obs;
            this.etapaAtual.obs2 = this.etapas[posicao].obs2;
          },
          cmdAnterior() {
            if (this.etapaAtual.posicao > 0) {
              this.setaEtapaAtual(--this.etapaAtual.posicao);
              if (this.etapaAtual.posicao != (this.etapas.length-1)) {
                this.botaoContinua = true;
                this.botaoFinaliza = false;
              }
            } else {
              this.$router.push('/home');
            }
          }, 
          cmdProximo() {
            if (this.etapaAtual.posicao < (this.numeroEtapas-2)) {
              this.setaEtapaAtual(++this.etapaAtual.posicao)
            }
            else if (this.etapaAtual.posicao == (this.numeroEtapas-2)) {
              this.botaoContinua = false;
              this.botaoFinaliza = true;
              this.setaEtapaAtual(++this.etapaAtual.posicao)
            }
          },
          cmdCancela() {
            alert('cmdCancela')
          },
          cmdFinaliza() {
            if (this.etapaAtual.posicao == 3) {
/*               mainService.salvaPaciente(this.infoPaciente).then(resposta => {
                if (resposta.status == 200) {
                  ++this.etapaAtual.posicao;
                  this.logradouros = resposta.data;
                } else {
                  console.log('Erro', resposta.message)
                  this.mensagemErro = resposta.message
                }
              }) */
            }
            ++this.etapaAtual.posicao;
          }
        }
    }
</script>
<style scoped>
  .input__label {
    color: red;
  }
  
  @media(max-width: 2000px) {
    display-1 {font-size: 0.8rem}
    display-2 {font-size: 0.8rem}
    body-2 {font-size: 0.8rem}
    p {font-size: 0.8rem}
    h2 {font-size: 1.2rem}
    h4 {font-size: 0.9rem}
    .v-text-field input {
      font-size: 5.2em;
    }
    .v-combobox-field {
     font-size: 2.2em;
    }
  }
</style>

