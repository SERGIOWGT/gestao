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
                <v-col cols="12" >
                  <v-col class="pt-5 mt-5 text-subtitle-1 text-center" v-if="etapaAtual.posicao == enumCadastro.iniciando">
                    Carregandos os dados. Aguarde.....
                  </v-col>
                  <v-col>
                    <v-progress-linear v-if="etapaAtual.posicao == enumCadastro.iniciando"
                      color="primary accent-4"
                      indeterminate
                      rounded
                      height="6"
                    ></v-progress-linear>
                  </v-col>
                  <v-combobox class="mt-4" v-if="etapaAtual.posicao == enumCadastro.unidadeSaudeBairroRua" @input="setaUnidadeSaude"
                    required
                    dense
                    label="Unidade de Saúde"
                    :items="unidadesSaude"
                    item-value="id"
                    item-text="nome"
                  ></v-combobox> 
                  <v-combobox class="mt-5" v-if="etapaAtual.posicao == enumCadastro.unidadeSaudeBairroRua" @input="setaBairro"
                    required
                    dense
                    label="Bairro"
                    :items="bairros"
                    item-value="id"
                    item-text="nome"
                  ></v-combobox> 
                  <v-combobox class="mt-5" v-if="etapaAtual.posicao == enumCadastro.unidadeSaudeBairroRua" @input="setaLogradouro"
                    dense
                    label="Nome da rua"
                    :disabled="infoPaciente.bairroId === 0"
                    :items="logradouros"
                    item-value="id"
                    item-text="nome"
                  ></v-combobox>
                  <v-text-field class="pt-5 mt-5" v-if="etapaAtual.posicao == enumCadastro.numeroImovel"
                    dense
                    label="Número do seu imóvel"
                    :disabled="infoPaciente.semNumeroEndereco === true "
                    required
                    clearable
                    v-model="infoPaciente.numeroEndereco"
                    counter
                    maxlength="10"
                    :rules="[regras.Basicas.obrigatorio()]"
                  ></v-text-field>
                  <v-row class="py-5" v-if="etapaAtual.posicao == 1"></v-row>
                  <v-switch class="mt-4 mb-5" v-if="etapaAtual.posicao == enumCadastro.numeroImovel" 
                    @change="liberaSemNumero()"
                    v-model="infoPaciente.semNumeroEndereco" 
                    label="Imóvel sem número"
                    color="primary"
                    hide-details
                  />
                  <v-text-field class="mt-4" v-if="etapaAtual.posicao == enumCadastro.complementoEndereco"
                    dense
                    label="Complemento do seu endereço"
                    :disabled="infoPaciente.semComplemento === true "
                    required
                    clearable
                    v-model="infoPaciente.complemento"
                    counter
                    maxlength="50"
                    :rules="[regras.Basicas.obrigatorio()]"
                  ></v-text-field>
                  <v-switch class="mt-4 mb-5" v-if="etapaAtual.posicao == enumCadastro.complementoEndereco" 
                    @change="liberaSemComplemento()"
                    v-model="infoPaciente.semComplemento" 
                    label="Imóvel sem número"
                    color="primary"
                    hide-details
                  />
                  <v-text-field class="pt-5 mt-4"  v-if="etapaAtual.posicao == enumCadastro.dadosCadastrais1"
                    dense
                    label="Nome Completo"
                    required
                    clearable
                    v-model="infoPaciente.nome"
                    :rules="[regras.Basicas.obrigatorio(), regras.Basicas.min(10), regras.Basicas.max(100)]"
                    counter
                    maxlength="100"

                  ></v-text-field>
                  <v-text-field class="mt-4" v-if="etapaAtual.posicao == enumCadastro.dadosCadastrais1"
                    dense
                    label="CPF (999.999.999-99)"
                    required
                    clearable
                    v-model="infoPaciente.cpf"
                    :rules="[regras.Basicas.obrigatorio(), regras.Cpf.valido()]"
                    counter
                    maxlength="14"
                  ></v-text-field>
                  <v-text-field class="mt-4" v-if="etapaAtual.posicao == enumCadastro.dadosCadastrais1"
                    required
                    label="Data de Nascimento"
                    dense
                    clearable
                    v-model="infoPaciente.dataNascimento"
                  ></v-text-field>
                  <v-text-field class="mt-4" v-if="etapaAtual.posicao == enumCadastro.dadosCadastrais1"
                    dense
                    label="Número do Sus (999 9999 9999 9999)"
                    required
                    clearable
                    v-model="infoPaciente.numeroSus"
                    :rules="[regras.NumeroSus.valido(false)]"
                    counter
                    maxlength="18"
                  ></v-text-field>
                  <v-text-field class="pt-5 mt-4"  v-if="etapaAtual.posicao == enumCadastro.dadosCadastrais2"
                    dense
                    label="Email"
                    required
                    clearable
                    v-model="infoPaciente.eMail"
                    counter
                    maxlength="100"
                    :rules="[regras.Basicas.obrigatorio()]"
                  ></v-text-field>
                  <v-text-field class="mt-4" v-if="etapaAtual.posicao == enumCadastro.dadosCadastrais2"
                    dense
                    label="Celular (99 ?9999-9999)"
                    required
                    clearable
                    v-model="infoPaciente.celular"
                    :rules="[regras.Celular.valido(true)]"
                    counter
                    maxlength="13"
                  ></v-text-field>
                  <v-text-field class="mt-4" v-if="etapaAtual.posicao == enumCadastro.dadosCadastrais2"
                    dense
                    label="Celular 2 (99 ?9999-9999)"
                    required
                    clearable
                    v-model="infoPaciente.celular2"
                    :rules="[regras.Celular.valido(false)]"
                    counter
                    maxlength="13"
                  ></v-text-field>
                  <div v-if="etapaAtual.posicao == enumCadastro.dadosCadastrais2">
                    <a ref="#">Dúvidas sobre o termo de confidencialidade</a>
                  </div>
                </v-col>
              </v-row>
              <v-row v-if="etapaAtual.posicao == enumCadastro.comorbidades">
                <v-col cols="12" >
                  <v-sheet v-for="(item, index) in comorbidades" :key="item.id" >
                      <v-switch class="pt-1 mt-0"  v-model="comorbidades[index].selecionado" 
                      v-if="(index >= (numeroMaximoCheckBoxes * (etapas[etapaAtual.posicao-1].subEtapaAtual-1))) && (index < (numeroMaximoCheckBoxes * (etapas[etapaAtual.posicao-1].subEtapaAtual))) "> 
                            <template v-slot:label >
                              <span v-bind:class="(item.id == -1)?'input__label':''">{{item.nome}}</span>
                            </template>
                      </v-switch>
                  </v-sheet>
                </v-col>
              </v-row>
              <v-row v-if="etapaAtual.posicao == enumCadastro.sintomas">
                <v-col cols="12">
                  <v-sheet v-for="(item, index) in sintomas" :key="item.id" >
                    <v-switch class="pt-1 mt-0"  v-model="sintomas[index].selecionado"
                      v-if="(index >= (numeroMaximoCheckBoxes * (etapas[etapaAtual.posicao-1].subEtapaAtual-1))) && (index < (numeroMaximoCheckBoxes * (etapas[etapaAtual.posicao-1].subEtapaAtual))) "> 
                      <template v-slot:label>
                        <span v-bind:class="(item.id == -1)?'input__label':''">{{item.nome}}</span>
                      </template>
                    </v-switch>
                  </v-sheet>
                </v-col>
              </v-row>
              <v-row v-if="etapaAtual.posicao == enumCadastro.salvaDadosPaciente" >
                <v-progress-linear v-if="salvandoDadosPaciente"
                  color="primary accent-4"
                  indeterminate
                  rounded
                  height="6"
                ></v-progress-linear>
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
            enumCadastro: {
              iniciando: 0,
              unidadeSaudeBairroRua: 1,
              numeroImovel: 2,
              complementoEndereco: 3,
              dadosCadastrais1: 4,
              dadosCadastrais2: 5,
              comorbidades: 6,
              sintomas: 7,
              salvaDadosPaciente: 8,
              proximoPaciente: 9
            },
            regras: regrasCampos,
            formularioValido: false,
            infoPaciente: {
              id: 0,
              nome: 'SERGIO WELLINGTO',
              cpf: '018.345.227-57',
              dataNascimento: '03/11/1971',
              numeroSus: '',              
              eMail: '1@2.com.br',
              celular: '21 96404-9400',
              celular2: '',
              nomeBairro: '',
              bairroId: 0,
              logradouroId: 0,
              unidadeSaudeId: 0,
              nomeunidadeSaude: '',
              numeroEndereco: null,
              semNumeroEndereco: null,
              complemento: null,
              semComplemento: null
            },
            salvandoDadosPaciente: false,
            cidadeId: 1,

            temBotaoAnterior: false,
            temBotaoProximo: false,
            temBotaoCancela: true,
            temBotaoFinaliza: false,

            podeVoltar: false,
            podeCancelar: true,
            podeFinalizar: false,
            
            numeroEtapas: 0,
            etapaAtual: {posicao: 0, nome: '', obs: '', obs2: '', stepBar: 0},
            etapas: [ {stepBar: 1, nome: 'Onde reside o Monitorado?', obs: '.', obs2: '', totalSubEtapas: 0, subEtapaAtual: 0},
                      {stepBar: 2, nome: 'Qual o número sua residência?', obs: 'Precisamos agora somente do número da rua. Caso não tenha número, somente escolha a opção imóvel sem número.', obs2: '', totalSubEtapas: 0, subEtapaAtual: 0},
                      {stepBar: 3, nome: 'Qual o complemento da sua residência?', obs: 'Precisamos identifica o Imóvel, para isso, nos informe o complemento do endereço.', obs2: 'Caso não tenha complemento, escolha a opção Endereço sem complemento', totalSubEtapas: 0, subEtapaAtual: 0},
                      {stepBar: 4, nome: 'Agora seus dados pessoais', obs: 'Fique tranquilo seus dados são confidenciais e somente serão utilizados conforme nosso termo de confidencialidade.', obs2: '', totalSubEtapas: 0, subEtapaAtual: 0},
                      {stepBar: 5, nome: 'Como entramos em contato com você?', obs: 'Fique tranquilo seus dados são confidenciais e somente só serão utilizados conforme nosso termo de confidencialidade.', obs2: '', totalSubEtapas: 0, subEtapaAtual: 0},
                      {stepBar: 6, nome: 'Como anda sua saúde?', obs: 'A indicação das suas doenças crônicas é muito importante para o nosso planejamento. ', obs2: '', totalSubEtapas: 0, subEtapaAtual: 0},
                      {stepBar: 7, nome: 'Como você está se sentindo agora?', obs: 'Marque abaixo cada sintoma que você está sentindo agora e quando começou', obs2: '', totalSubEtapas: 0, subEtapaAtual: 0},
                      {stepBar: 8, nome: 'Salvando os dados', obs: 'Ufa! Terminamos o preenchimento dos dados. ', obs2: 'Use o botão finalizar para salvar os seus dados', totalSubEtapas: 0, subEtapaAtual: 0}                     ,
                      {stepBar: 9, nome: 'Obrigado', obs: 'Obrigado', obs2: '', totalSubEtapas: 0, subEtapaAtual: 0}                     
            ],
            listasCarregadas: false,
            numeroMaximoCheckBoxes: 6,
            sintomas: [],
            comorbidades: [],
            bairros: [],
            logradouros: [],
            unidadesSaude: []
          }
        },
        created() {
          this.listasCarregadas = false
          this.etapaAtual.posicao = 0
          this.numeroEtapas = this.etapas.length
        },
        mounted() {
          console.log('mounted', this.listasCarregadas)
          if (this.listasCarregadas == false)
            this.buscaDadosIniciais();
        },
        computed: {
          podeContinuar: function() {
            var _retorno = false;
            switch (this.etapaAtual.posicao) {
              case this.enumCadastro.unidadeSaudeBairroRua:
                _retorno = this.listasCarregadas && (this.infoPaciente.unidadeSaudeId !=0) && (this.infoPaciente.bairroId !=0) && (this.infoPaciente.logradouroId != 0)
                break;
              
              case this.enumCadastro.numeroImovel:
                _retorno = (this.infoPaciente.semNumeroEndereco) || this.formularioValido;
                break;

              case this.enumCadastro.complementoEndereco:
                _retorno = (this.infoPaciente.semComplemento) || this.formularioValido;
                break;

              default:
                  _retorno =  this.formularioValido
            }


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
          liberaSemNumero() {
            this.formularioValido = this.infoPaciente.semNumeroEndereco === true
          },
          liberaSemComplemento() {
            this.formularioValido = this.infoPaciente.semComplemento === true
          },
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
            console.log('buscaDadosIniciais.promise.inicio')
            Promise.all([
              mainService.listaUnidadesSaude(this.cidadeId),
              mainService.listaBairros(this.cidadeId),
              mainService.listaSintomas() ,
              mainService.listaComorbidades()   
            ]).then(([_UnidadeSaude, _Bairro, _Sintoma, _Comorbidade]) => {
              console.log('buscaDadosIniciais.promise.then')
              if (_UnidadeSaude.status == 200) 
                this.unidadesSaude = _UnidadeSaude.data
              
              if (_Bairro.status == 200) 
                this.bairros = _Bairro.data

              if (_Sintoma.status == 200) 
                this.sintomas = _Sintoma.data
              
              if (_Comorbidade.status == 200)
                this.comorbidades = _Comorbidade.data 

              this.podeVoltar = true
              this.temBotaoCancela = false
              this.temBotaoAnterior = true
              this.temBotaoProximo = true
              
              this.etapaAtual.posicao = this.enumCadastro.sintomas
              this.etapaAtual.stepBar = this.etapas[this.etapaAtual.posicao-1].stepBar
              this.etapaAtual.nome = this.etapas[this.etapaAtual.posicao-1].nome
              this.etapaAtual.obs = this.etapas[this.etapaAtual.posicao-1].obs
              this.etapaAtual.obs2 = this.etapas[this.etapaAtual.posicao-1].obs2

              this.listasCarregadas = true
              this.etapas[this.enumCadastro.sintomas-1].totalSubEtapas= Math.ceil(this.sintomas.length / this.numeroMaximoCheckBoxes)
              this.etapas[this.enumCadastro.sintomas-1].subEtapaAtual = 1
              this.etapas[this.enumCadastro.comorbidades-1].totalSubEtapas= Math.ceil(this.comorbidades.length / this.numeroMaximoCheckBoxes)
              this.etapas[this.enumCadastro.comorbidades-1].subEtapaAtual= 1
            });
            console.log('buscaDadosIniciais.promise.fim')
          },
          salvaPaciente() {
              mainService.salvaPaciente(this.infoPaciente).then(resposta => {
              console.log('salvaPaciente', '.then', resposta)
              if (resposta.status == 200) {
                this.etapaAtual.posicao++;
              } else {
                console.log('Erro', resposta.message)
                this.mensagemErro = resposta.message
              }
              })
              .catch(response => {
                console.log('salvaPaciente', '.catch((response)', response)
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
          cmdAnterior() {
            console.log('cmdAnterior-inicial', this.etapaAtual.posicao, this.etapas[this.etapaAtual.posicao-1].totalSubEtapas, this.etapas[this.etapaAtual.posicao-1].subEtapaAtual)

            // tem subEtapa
            if (this.etapas[this.etapaAtual.posicao-1].totalSubEtapas > 0) {

              // se a primeira subetapa
              if (this.etapas[this.etapaAtual.posicao-1].subEtapaAtual == 1) {
                if (this.etapaAtual.posicao == 0)
                  // vai para home
                  this.$router.push('/home');
                else {
                  this.etapaAtual.posicao--;  
                  this.etapaAtual.stepBar = this.etapas[this.etapaAtual.posicao-1].stepBar;
                  this.etapaAtual.nome = this.etapas[this.etapaAtual.posicao-1].nome;
                  this.etapaAtual.obs = this.etapas[this.etapaAtual.posicao-1].obs;
                  this.etapaAtual.obs2 = this.etapas[this.etapaAtual.posicao-1].obs2;
                }
              } else {
                // volta subEtapa
                this.etapas[this.etapaAtual.posicao-1].subEtapaAtual--
              }
              return;  
            }

            // se é o primeiro sem subetapa
            if (this.etapaAtual.posicao <= 1) {
              // volta para home
              this.$router.push('/home');
              return;
            }

            // volta Etapa
            this.etapaAtual.posicao--;  
            this.etapaAtual.stepBar = this.etapas[this.etapaAtual.posicao-1].stepBar;
            this.etapaAtual.nome = this.etapas[this.etapaAtual.posicao-1].nome;
            this.etapaAtual.obs = this.etapas[this.etapaAtual.posicao-1].obs;
            this.etapaAtual.obs2 = this.etapas[this.etapaAtual.posicao-1].obs2;
            
            console.log('cmdAnterior-final', this.etapaAtual.posicao, this.etapas[this.etapaAtual.posicao-1].totalSubEtapas, this.etapas[this.etapaAtual.posicao-1].subEtapaAtual)
          }, 
          cmdProximo() {
            console.log('cmdProximo-Inicio', this.etapaAtual.posicao, this.etapas[this.etapaAtual.posicao-1].nome, this.etapas[this.etapaAtual.posicao-1].totalSubEtapas, this.etapas[this.etapaAtual.posicao-1].subEtapaAtual)

            // tem subEtapa
            if (this.etapas[this.etapaAtual.posicao-1].totalSubEtapas > 0) {
              if (this.etapas[this.etapaAtual.posicao-1].subEtapaAtual < this.etapas[this.etapaAtual.posicao-1].totalSubEtapas)
                this.etapas[this.etapaAtual.posicao-1].subEtapaAtual++
              else {
                ++this.etapaAtual.posicao;
                this.etapaAtual.stepBar = this.etapas[this.etapaAtual.posicao-1].stepBar;
                this.etapaAtual.nome = this.etapas[this.etapaAtual.posicao-1].nome;
                this.etapaAtual.obs = this.etapas[this.etapaAtual.posicao-1].obs;
                this.etapaAtual.obs2 = this.etapas[this.etapaAtual.posicao-1].obs2;


                if (this.etapaAtual.posicao == this.enumCadastro.salvaDadosPaciente) {
                  this.temBotaoProximo = false;
                  this.temBotaoFinaliza = true;
                  this.podeFinalizar = true;
                } 
              }
              console.log('cmdProximo-Fim1', this.etapaAtual.posicao, this.etapas[this.etapaAtual.posicao-1].totalSubEtapas, this.etapas[this.etapaAtual.posicao-1].subEtapaAtual)
              return
            }

            // 
            if (this.etapaAtual.posicao == this.enumCadastro.salvaDadosPaciente) {
              this.temBotaoProximo = false;
              this.temBotaoFinaliza = true;
              this.botaoFinaliza = true;
            } 

            ++this.etapaAtual.posicao;
            this.etapaAtual.stepBar = this.etapas[this.etapaAtual.posicao-1].stepBar;
            this.etapaAtual.nome = this.etapas[this.etapaAtual.posicao-1].nome;
            this.etapaAtual.obs = this.etapas[this.etapaAtual.posicao-1].obs;
            this.etapaAtual.obs2 = this.etapas[this.etapaAtual.posicao-1].obs2;

            console.log('cmdProximo-Fim', this.etapaAtual.posicao, this.etapas[this.etapaAtual.posicao-1].totalSubEtapas, this.etapas[this.etapaAtual.posicao-1].subEtapaAtual)
          },
          cmdCancela() {
            this.$router.push('/home');
          },
          cmdFinaliza() {
            this.salvaPaciente();
          }
        }
    }
</script>
<style scoped>
  .input__label {
    color: blue;
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

