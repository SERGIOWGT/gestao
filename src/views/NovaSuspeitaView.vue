<template>
  <v-container>
    <StepBar :etapa="etapaAtual.stepBar"/>
    <v-container fluid style="height: 100vmax;" class="pa-1">
      <v-flex v-if="etapaAtual.posicao < numeroEtapas">
        <p class="text-h6">{{etapaAtual.nome}}</p> 
          <p class="text-body-2">{{etapaAtual.obs}}</p>
<!--           {{infoPaciente.unidadeSaude.id}} {{infoPaciente.unidadeSaude.nome}} <br>
          {{infoPaciente.bairro.id}} {{infoPaciente.bairro.nome}} <br>
          {{infoPaciente.logradouro.id}} {{infoPaciente.logradouro.nome}} <br>
 -->        <v-card flat class="pa-0">
          <p class="text-body-2" v-show="etapaAtual.obs2 !== ''">{{etapaAtual.obs2}}</p>
          <v-card-text class="ma-0 pa-0">
            <v-form ref="form" class="mx-2" v-model="formularioValido">
              <v-row>
                <v-col cols="12" class="pa-2">
                  <v-text-field class="pt-5 mt-4" v-if="etapaAtual.posicao == enumCadastro.identificacaoCidadao" @keypress="entradaCpf($event)"
                    dense
                    label="CPF"
                    hint="formato 999.999.999-99"
                    persistent-hint
                    required
                    clearable
                    v-model="infoPaciente.cpf"
                    :rules="[regras.Basicas.obrigatorio(), regras.Cpf.valido()]"
                    counter
                    maxlength="14"
                  ></v-text-field>
                  <v-text-field class="pt-5 mt-4" v-if="etapaAtual.posicao == enumCadastro.identificacaoCidadao"
                    required
                    type="date"
                    label="Data de Nascimento"
                    dense
                    :rules="[regras.Basicas.obrigatorio()]"
                    v-model="infoPaciente.dataNascimento"
                  ></v-text-field>
                  <p class="bule--text text-body-2"  v-if="etapaAtual.posicao == enumCadastro.confirmaIdentificacao">
                    O cidadão já está em nosso cadastro:<br>Nome: {{infoPaciente.nome}} <br>CPF: {{infoPaciente.cpf}} <br>Data de Nascimento: {{infoPaciente.dataNascimento}}
                  </p>
                  <p class="mt-4"  v-if="etapaAtual.posicao == enumCadastro.confirmaIdentificacao">
                    Caso não seja esse cidadão, você deve clicar no botão voltar logo abaixo
                    e pedir novamente os dados para identificação. Caso seja o próprio cidadão, clique no botão continuar e vamos atualizar seus dados
                  </p>
                  <v-text-field class="pt-5 mt-4"  v-if="etapaAtual.posicao == enumCadastro.dadosCadastrais"
                    dense
                    label="Nome Completo"
                    required
                    clearable
                    v-model="infoPaciente.nome"
                    :rules="[regras.Basicas.obrigatorio(), regras.Basicas.min(10), regras.Basicas.max(100)]"
                    counter
                    maxlength="100"
                  ></v-text-field>
                  <v-text-field class="mt-4" v-if="etapaAtual.posicao == enumCadastro.dadosCadastrais" @keypress="entradaCpf($event)"
                    dense
                    label="CPF"
                    hint="999.999.999-99"
                    persistent-hint
                    required
                    clearable
                    v-model="infoPaciente.cpf"
                    :rules="[regras.Basicas.obrigatorio(), regras.Cpf.valido()]"
                    counter
                    maxlength="14"
                  ></v-text-field>
                  <v-text-field class="mt-4" v-if="etapaAtual.posicao == enumCadastro.dadosCadastrais"
                    required
                    type="date"
                    label="Data de Nascimento"
                    dense
                    :rules="[regras.Basicas.obrigatorio()]"
                    v-model="infoPaciente.dataNascimento"
                  ></v-text-field>
                  <v-text-field class="mt-4" v-if="etapaAtual.posicao == enumCadastro.dadosCadastrais"
                    dense
                    label="Número do Sus"
                    hint="formato 999 9999 9999 9999"
                    persistent-hint
                    required
                    clearable
                    v-model="infoPaciente.cartaoSUS"
                    :rules="[regras.NumeroSus.valido(false)]"
                    counter
                    maxlength="18"
                  ></v-text-field>
                  <v-text-field class="pt-5 mt-4"  v-if="etapaAtual.posicao == enumCadastro.dadosContato"
                    dense
                    label="Email"
                    required
                    clearable
                    v-model="infoPaciente.eMail"
                    counter
                    maxlength="100"
                    :rules="[regras.Basicas.obrigatorio()]"
                  ></v-text-field>
                  <v-text-field class="mt-4" v-if="etapaAtual.posicao == enumCadastro.dadosContato" @keypress="entradaCelular($event)"
                    dense
                    label="Celular (99 ?9999-9999)"
                    required
                    clearable
                    v-model="infoPaciente.celular"
                    :rules="[regras.Celular.valido(true)]"
                    counter
                    maxlength="13"
                  ></v-text-field>
                  <v-text-field class="mt-4" v-if="etapaAtual.posicao == enumCadastro.dadosContato" @keypress="entradaCelular($event)"
                    dense
                    label="Celular 2 (99 ?9999-9999)"
                    required
                    clearable
                    v-model="infoPaciente.celular2"
                    :rules="[regras.Celular.valido(false)]"
                    counter
                    maxlength="13"
                  ></v-text-field>
                  <div v-if="etapaAtual.posicao == enumCadastro.dadosContato">
                    <a ref="#">Dúvidas sobre o termo de confidencialidade</a>
                  </div>
                  <v-combobox class="pt-5 mt-4" v-if="etapaAtual.posicao == enumCadastro.bairroResidencia"  @input="setaUnidadeSaude"
                    required
                    dense
                    label="Unidade de Saúde"
                    :items="unidadesSaude"
                    v-model="infoPaciente.unidadeSaude"
                    item-value="id"
                    item-text="nome"
                  ></v-combobox> 
                  <v-combobox class="mt-5" v-if="etapaAtual.posicao == enumCadastro.bairroResidencia" @input="setaBairro"
                    required
                    dense
                    v-model="infoPaciente.bairro"
                    label="Bairro"
                    :items="bairros"
                    item-value="id"
                    item-text="nome"
                  ></v-combobox> 
                  <v-combobox class="mt-5" v-if="etapaAtual.posicao == enumCadastro.bairroResidencia"
                    dense
                    label="Nome da rua"
                    :disabled="infoPaciente.bairroId === 0"
                    v-model="infoPaciente.logradouro"
                    :items="logradouros"
                    item-value="id"
                    item-text="nome"
                  ></v-combobox>
                  <v-text-field class="pt-5 mt-5" v-if="etapaAtual.posicao == enumCadastro.endereco"
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
                  <v-switch class="mt-4 mb-5" v-if="etapaAtual.posicao == enumCadastro.endereco" 
                    @change="liberaSemNumero()"
                    v-model="infoPaciente.semNumeroEndereco" 
                    label="Imóvel sem número"
                    color="primary"
                    hide-details
                  />
                  <v-text-field class="mt-4" v-if="etapaAtual.posicao == enumCadastro.endereco"
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
                  <v-switch class="mt-4 mb-5" v-if="etapaAtual.posicao == enumCadastro.endereco" 
                    @change="liberaSemComplemento()"
                    v-model="infoPaciente.semComplemento" 
                    label="Endereço sem complemento"
                    color="primary"
                    hide-details
                  />
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
            <v-row class="justify-center" v-if="mensagemErro">
              <v-alert class="mt-5" type="error" smaller dense outlined>
                {{mensagemErro}}
              </v-alert>
            </v-row> 
            <v-col class="pt-5 mt-5 text-subtitle-1 text-center" v-if="mensagemBusca != ''">
                {{mensagemBusca}}
            </v-col>
            <v-col>
              <v-progress-linear v-if="mensagemBusca != ''"
                color="primary accent-4"
                indeterminate
                rounded
                height="6"
              ></v-progress-linear>
            </v-col>

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
        :temBotaoSalva= "temBotaoSalva"
        :temBotaoVerifica= "temBotaoVerifica"
        :podeVoltar="podeVoltar"
        :podeContinuar= "podeContinuar"
        :podeCancelar= "podeCancelar"
        :podeFinalizar= "podeFinalizar"
        :podeVerificar= "podeVerificar"
        @funcaoRetorno= 'cmdBotao'
    />
  </v-container>
</template>
<script>
    import StepBar from '../components/StepBar';
    import BottomBar from '../components/StepBottomBar'
    import mainService from '../services/MainService'
    import regrasCampos from '../bibliotecas/regrasCampos'
    import formataValores from '../bibliotecas/formataValores'
    import entradaText from '../bibliotecas/entradaText'

    export default {
        name: 'SuspeitaCovid',
        components: {
            StepBar, BottomBar
        },
        data() {
          return {

            // funcoes
            entradaCpf: entradaText.cpf,
            entradaCelular: entradaText.celular,

            // dados
            enumCadastro: {
              identificacaoCidadao: 1,
              confirmaIdentificacao: 2,
              dadosCadastrais: 3,
              dadosContato: 4,
              bairroResidencia: 5,
              endereco: 6,
              salvaDadosPaciente: 7,
              comorbidades: 8,
              salvaComorbidades: 9,
              sintomas: 10,
              salvaSintomas: 11,
              proximoPaciente: 12
            },

            regras: regrasCampos,
            formularioValido: false,

            infoPaciente: {
              id: 0,
              nome: '',
              cpf: '000.000.000-00',
              dataNascimento: '1971-11-03',
              cartaoSUS: '',              
              eMail: '',
              celular: '',
              celular2: '',
              numeroEndereco: null,
              semNumeroEndereco: null,
              complemento: null,
              semComplemento: null,
              unidadeSaude: {
                id: 0,
                nome: ''
              },
              bairro: {
                id: 0,
                nome: ''
              },
              logradouro: {
                id: 0,
                nome: ''
              },
            },

            salvandoDadosPaciente: false,
            cidadeId: 1,

            mensagemErro: '',
            mensagemBusca: '',

            temBotaoAnterior: false,
            temBotaoProximo: false,
            temBotaoCancela: false,
            temBotaoFinaliza: false,
            temBotaoSalva: false,
            temBotaoVerifica: false,

            podeVoltar: false,
            podeCancelar: false,
            podeFinalizar: false,
            
            numeroEtapas: 0,
            etapaAtual: {posicao: 0, nome: '', obs: '', obs2: '', stepBar: 0},
            etapas: [ {stepBar: 1, nome: 'Identificação do Cidadão', obs: 'É através do CPF e data de nascimento que identificamos o cidadão.', obs2: 'Informe os campos abaixo e vamos começar!!!', totalSubEtapas: 0, subEtapaAtual: 0},
                      {stepBar: 1, nome: 'Confirma Identificação do Cidadão', obs: '.', obs2: '', totalSubEtapas: 0, subEtapaAtual: 0},
                      {stepBar: 2, nome: 'Dados cadastrais', obs: 'Vamos precisar de outros dados cadastrais', obs2: '', totalSubEtapas: 0, subEtapaAtual: 0},            
                      {stepBar: 2, nome: 'Dados para Contato', obs: '', obs2: '', totalSubEtapas: 0, subEtapaAtual: 0},            
                      {stepBar: 2, nome: 'Onde o cidadão reside?', obs: '', obs2: 'Essa informação também é muito importante para o nosso planejamento', totalSubEtapas: 0, subEtapaAtual: 0},
                      {stepBar: 2, nome: 'Identificação da residência', obs: 'Precisamos agora do número da rua e do complemento da sua residência. ', obs2: '', totalSubEtapas: 0, subEtapaAtual: 0},
                      {stepBar: 2, nome: 'Salvandos os dados do Paciente', obs: 'Agora que já temos todos os dados cadastrais, podemos salvar essas informações.', obs2: 'Clique no botão salvar abaixo e aguarde enquanto salvamos as informações.', totalSubEtapas: 0, subEtapaAtual: 0},                      
                      {stepBar: 3, nome: 'Como anda sua saúde?', obs: 'Os dados cadastrais e o endereço foram salvos com sucesso. ', obs2: 'A indicação das suas doenças crônicas é muito importante para o nosso planejamento', totalSubEtapas: 0, subEtapaAtual: 0},
                      {stepBar: 3, nome: 'Salvandos as doenças crônicas', obs: 'Agora que você preencheu as doenças crônicas, também chamadas de comorbidades, vamos salvar essas informações.', obs2: 'Clique no botão salvar abaixo e aguarde enquanto salvamos as informações.', totalSubEtapas: 0, subEtapaAtual: 0},                      
                      {stepBar: 4, nome: 'Como você está se sentindo agora?', obs: 'As informações sobre as doenças crônicas foram salvas com sucesso. ', obs2: 'Marque abaixo cada sintoma que o cidadão está sentindo agora e quando começou', totalSubEtapas: 0, subEtapaAtual: 0},
                      {stepBar: 4, nome: 'Salvando os Sintomas Atuais', obs: 'Ufa! Terminamos o preenchimento dos dados. ', obs2: 'Use o botão finalizar para salvar os seus dados', totalSubEtapas: 0, subEtapaAtual: 0}                     ,
                      {stepBar: 4, nome: 'Obrigado', obs: 'Obrigado', obs2: '', totalSubEtapas: 0, subEtapaAtual: 0}                     
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
          console.log('mounted')
          console.log(this.infoPaciente.dataNascimento)
          this.vaPara(this.enumCadastro.identificacaoCidadao)
        },
        watch: {
          dataFormatada: function() {
            return formataValores.data(this.infoPaciente.dataNascimento)
          }
        },
        computed: {
          podeVerificar: function() {
            var _retorno = true
            if (this.etapaAtual.posicao == this.enumCadastro.identificacaoCidadao) {
              _retorno =  this.formularioValido
            }
            return _retorno
          },
          podeContinuar: function() {
            var _retorno = false;
            switch (this.etapaAtual.posicao) {
              case this.enumCadastro.bairroResidencia:
                _retorno = (this.infoPaciente.unidadeSaudeId !=0) && (this.infoPaciente.bairroId !=0) && (this.infoPaciente.logradouroId != 0)
                break;
              
              case this.enumCadastro.endereco:
                _retorno = (((this.infoPaciente.semNumeroEndereco) || (this.infoPaciente.numeroEndereco != '')) &&
                           ((this.infoPaciente.semComplemento) || (this.infoPaciente.numeroEndereco != '')));
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
          verificaPaciente() {
            console.log('verificaPaciente-Entrei')
            let _param = {
              'tipo': 1,
              'cpf': this.infoPaciente.cpf,
              'dataNascimento': formataValores.data(this.infoPaciente.dataNascimento),
              'cartaoSUS': this.infoPaciente.cartaoSUS,
            }
            this.mensagemErro = ''
            this.mensagemBusca = 'Consultando o cidadão! Aguarde..'
            mainService.listaPacientes(_param).then(resposta => {
              console.log('verificaPaciente-then', resposta)
              if (resposta.status == 200) {
                var _pacientes = resposta.data;
                console.log('verificaPaciente-then - 2', _pacientes, _pacientes.length)
                if (_pacientes.length > 0) {
                  // Pega primeiro paciente da lista
                  this.infoPaciente.id = _pacientes[0].id
                  this.listaPaciente(this.infoPaciente.id)

                } else {
                  this.infoPaciente.id = 0
                  if (this.listasCarregadas == false)
                    this.buscaDadosIniciais()
                  else {
                    this.vaPara(this.enumCadastro.dadosCadastrais)
                  }
                }
              } else {
                console.log('Erro', resposta.message)
                this.mensagemErro = resposta.message
              }
            })
            .catch(response => {
                console.log('verificaPaciente-catch', '.catch((response)', response)
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
              }
            )
          },
          listaPaciente(pacienteId) {
            console.log('listaPaciente-Entrei ==> [PacienteId', pacienteId, ']')
            mainService.listaPaciente(pacienteId).then(resposta => {
              console.log('listaPaciente-then', resposta)
              if (resposta.status == 200) {
                var _paciente = resposta.data[0];
                this.infoPaciente.id = pacienteId
                this.infoPaciente.nome = _paciente.nome
                this.infoPaciente.cartaoSUS = _paciente.cartaoSUS
                this.infoPaciente.eMail = _paciente.eMail 

                this.infoPaciente.unidadeSaude.id = _paciente.unidadeSaudeId

                this.infoPaciente.semNumeroEndereco = (_paciente.numeroEndereco == '') 
                this.infoPaciente.semComplemento = (_paciente.complementoEndereco == '')
                this.infoPaciente.numeroEndereco = _paciente.numeroEndereco
                this.infoPaciente.complemento = _paciente.complementoEndereco

                this.infoPaciente.nomeunidadeSaude = ''

                this.infoPaciente.bairro.id = _paciente.bairroId
                this.infoPaciente.bairro.nome = _paciente.nomeBairro

                this.infoPaciente.logradouro.id = _paciente.logradouroId
                this.infoPaciente.logradouro.nome = _paciente.nomeLogradouro

                this.infoPaciente.dataNascimento = _paciente.dataNascimento.substring(0, 10)

                this.infoPaciente.celular = formataValores.celular(_paciente.celular)
                if (_paciente.celular2) 
                  this.infoPaciente.celular2 = formataValores.celular(_paciente.celular2)
                else 
                  this.infoPaciente.celular2 = '' 
                                
                this.infoPaciente.cpf = formataValores.cpf(_paciente.cpf)

                if (this.listasCarregadas == false)
                  this.buscaDadosIniciais()
                else {
                  this.vaPara(this.enumCadastro.confirmaIdentificacao)
                }
              } else {
                console.log('Erro', resposta.message)
                this.mensagemErro = resposta.message
              }
            })
          },
          vaPara(posicaoCadastro) {
            this.mensagemErro = ''
            this.mensagemBusca = ''

            this.temBotaoAnterior = false
            this.temBotaoProximo = false
            this.temBotaoCancela = false
            this.temBotaoFinaliza = false
            this.temBotaoSalva = false
            this.temBotaoVerifica = false
            switch (posicaoCadastro) {
                case this.enumCadastro.identificacaoCidadao: 
                  this.podeVoltar = true
                  this.temBotaoAnterior = true
                  this.temBotaoVerifica = true
                  break;
                case this.enumCadastro.confirmaIdentificacao:
                case this.enumCadastro.dadosCadastrais:
                case this.enumCadastro.dadosContato:
                case this.enumCadastro.bairroResidencia:
                case this.enumCadastro.endereco:
                case this.enumCadastro.comorbidades:
                case this.enumCadastro.sintomas:
                case this.enumCadastro.proximoPaciente:
                  this.temBotaoAnterior = this.temBotaoProximo = true
                  break
                case this.enumCadastro.salvaDadosPaciente:
                case this.enumCadastro.salvaComorbidades:
                case this.enumCadastro.salvaSintomas:
                  this.podeVoltar = true
                  this.temBotaoAnterior = true;
                  this.temBotaoSalva = true;
                  break
            } 
            this.etapaAtual.posicao = posicaoCadastro;
            this.etapaAtual.stepBar = this.etapas[this.etapaAtual.posicao-1].stepBar;
            this.etapaAtual.nome = this.etapas[this.etapaAtual.posicao-1].nome;
            this.etapaAtual.obs = this.etapas[this.etapaAtual.posicao-1].obs;
            this.etapaAtual.obs2 = this.etapas[this.etapaAtual.posicao-1].obs2;
          },
          buscaDadosIniciais() {
            console.log('buscaDadosIniciais.promise.inicio')
            this.mensagemBusca = 'Buscando alguns dados! Aguarde..'
            Promise.all([
              mainService.listaUnidadesSaude(this.cidadeId),
              mainService.listaBairros(this.cidadeId),
              mainService.listaSintomas() ,
              mainService.listaComorbidades()   
            ]).then(([_UnidadeSaude, _Bairro, _Sintoma, _Comorbidade]) => {
              console.log('buscaDadosIniciais.promise.then')
              this.mensagemBusca = ''
              if (_UnidadeSaude.status == 200) 
                this.unidadesSaude = _UnidadeSaude.data

             this.unidadesSaude.forEach ((elemento) => {
                console.log('this.unidadesSaude.forEach', elemento.id, this.infoPaciente.unidadeSaude.id)
                  if (elemento.id == this.infoPaciente.unidadeSaude.id)
                    this.infoPaciente.unidadeSaude.nome = elemento.nome
              })
              
              if (_Bairro.status == 200) 
                this.bairros = _Bairro.data
             
              if (_Sintoma.status == 200) 
                this.sintomas = _Sintoma.data
              
              if (_Comorbidade.status == 200)
                this.comorbidades = _Comorbidade.data 

              this.listasCarregadas = true
              if (this.infoPaciente.id != 0) 
                this.vaPara(this.enumCadastro.confirmaIdentificacao)
              else
                this.vaPara(this.enumCadastro.dadosCadastrais)
            });
            console.log('buscaDadosIniciais.promise.fim')
          },
          salvaComorbidades() {
            setTimeout(() => { this.vaPara(this.enumCadastro.sintomas)}, 300);
          },
          salvaSintomas() {
            setTimeout(() => { this.vaPara(this.enumCadastro.proximoPaciente)}, 300);
          },
          salvaPaciente() {
            this.mensagemBusca = "Aguarde...."
            mainService.salvaPaciente(this.infoPaciente).then(resposta => {
              console.log('salvaPaciente', '.then', resposta)
                this.mensagemBusca = ""
                if (resposta.status == 200) {
                  this.vaPara(this.enumCadastro.comorbidades)
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
              }
            )
          }, 
          cmdBotao(val) {
            switch (val) {
              case 'VO':
                this.cmdAnterior()
                break;
              case 'CA':
                this.cmdCancela()
                break;
              case 'PX':
                this.cmdProximo()
                break;
              case 'SV':
                this.cmdSalva()
                break;
              case 'VF':
                this.cmdVerifica()
                break;
              case 'FM':
                this.cmdFim()
                break;
            }
            
          },
          cmdVerifica() {
            this.verificaPaciente()
          },
          cmdAnterior() {
            //console.log('cmdAnterior-inicial', this.etapaAtual.posicao, this.etapas[this.etapaAtual.posicao-1].totalSubEtapas, this.etapas[this.etapaAtual.posicao-1].subEtapaAtual)

            if (this.etapaAtual.posicao == this.enumCadastro.identificacaoCidadao) {
              this.$router.push('/home');
            } else if ((this.etapaAtual.posicao == this.enumCadastro.confirmaIdentificacao) || (this.etapaAtual.posicao == this.enumCadastro.dadosCadastrais)) {
              this.vaPara(this.enumCadastro.identificacaoCidadao)
            } else {
              if (this.etapas[this.etapaAtual.posicao-1].totalSubEtapas > 0) {
                
                // se a primeira subetapa
                if (this.etapas[this.etapaAtual.posicao-1].subEtapaAtual == 1) {
                    this.vaPara(--this.etapaAtual.posicao)
                } else {
                  // volta subEtapa
                  this.etapas[this.etapaAtual.posicao-1].subEtapaAtual--
                }
              } else {
                this.vaPara(--this.etapaAtual.posicao)
              }
            }
            //console.log('cmdAnterior-final', this.etapaAtual.posicao, this.etapas[this.etapaAtual.posicao-1].totalSubEtapas, this.etapas[this.etapaAtual.posicao-1].subEtapaAtual)
          }, 
          cmdProximo() {
            //console.log('cmdProximo-Inicio', this.etapaAtual.posicao, this.etapas[this.etapaAtual.posicao-1].nome, this.etapas[this.etapaAtual.posicao-1].totalSubEtapas, this.etapas[this.etapaAtual.posicao-1].subEtapaAtual)

            // tem subEtapa
            if (this.etapas[this.etapaAtual.posicao-1].totalSubEtapas > 0) {
              if (this.etapas[this.etapaAtual.posicao-1].subEtapaAtual < this.etapas[this.etapaAtual.posicao-1].totalSubEtapas)
                this.etapas[this.etapaAtual.posicao-1].subEtapaAtual++
              else {
                this.vaPara(++this.etapaAtual.posicao)
              }
              //console.log('cmdProximo-Fim1', this.etapaAtual.posicao, this.etapas[this.etapaAtual.posicao-1].totalSubEtapas, this.etapas[this.etapaAtual.posicao-1].subEtapaAtual)
              return
            }
            this.vaPara(++this.etapaAtual.posicao)

            //console.log('cmdProximo-Fim', this.etapaAtual.posicao, this.etapas[this.etapaAtual.posicao-1].totalSubEtapas, this.etapas[this.etapaAtual.posicao-1].subEtapaAtual)
          },
          cmdCancela() {
            this.$router.push('/home');
          },
          cmdFinaliza() {
            this.salvaPaciente();
          },
          cmdSalva() {
            
            if (this.etapaAtual.posicao == this.enumCadastro.salvaDadosPaciente) {
              console.log('cmdSalva', 'this.salvaPaciente()')
              this.salvaPaciente();
            }
            else if (this.etapaAtual.posicao == this.enumCadastro.comorbidades) {
              console.log('cmdSalva', 'this.salvaComorbidades()')
              this.salvaComorbidades();
            }
            else if (this.etapaAtual.posicao == this.enumCadastro.sintomas) {
              console.log('cmdSalva', 'this.salvaSintomas()')
              this.salvaSintomas();
            }
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

