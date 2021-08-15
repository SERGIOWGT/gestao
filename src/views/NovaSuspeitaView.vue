<template>
  <v-container>
    <StepBar :etapa="etapaAtual.stepBar"/>
    <v-container fluid style="height: 100vmax;" class="pa-1">
      <v-flex v-if="etapaAtual.posicao < numeroEtapas">
        <p class="text-h6">{{etapaAtual.nome}}</p> 
        <p class="text-body-2"  v-if="etapaAtual.obs != ''">{{etapaAtual.obs}}</p>
        <v-card flat class="pa-0">
          <p class="text-body-2" v-show="etapaAtual.obs2 !== ''">{{etapaAtual.obs2}}</p>
          <v-card-text class="ma-0 pa-0">
            <v-form ref="form" class="mx-2" v-model="formularioValido">
              <v-row>
                <v-col cols="12" class="pa-2">

<!--            IDENTIFICACAO DO CIDADAO -->
                  <v-flex v-if="etapaAtual.posicao == enumCadastro.identificacaoCidadao" >
                    <p class="pt-0 mt-0 pb-5 mb-5">
                      É através do <span class="nota_texto">CPF</span> e da <span class="nota_texto">Data de Nascimento</span> que identificamos o cidadão.
                      <br>
                      Preencha os campos abaixo e clique no <span class="nota_botao">botão consultar</span> logo abaixo.
                    </p>
                    <v-text-field class="mt-4" @keypress="entradaCpf($event)"
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
                    <v-text-field class="pt-5 mt-4" 
                      required
                      type="date"
                      label="Data de Nascimento"
                      dense
                      :rules="[regras.Basicas.obrigatorio()]"
                      v-model="infoPaciente.dataNascimento"
                    ></v-text-field>
                  </v-flex>

<!--            CONFIRMA IDENTIFICACAO-->                  
                  <v-flex v-if="etapaAtual.posicao == enumCadastro.confirmaIdentificacao" >
                    <p>
                      O cidadão está em nosso cadastro com os seguintes dados:
                      <br>
                      <span class="green--text text-body-2">
                        Nome: {{infoPaciente.nome}} <br>CPF: {{infoPaciente.cpf}} <br>Data de Nascimento: {{infoPaciente.dataNascimento}}
                      </span>
                    </p>
                    <p class="mt-4">
                      Caso esses dados não sejam do cidadão, você deve &nbsp;<a href="#">clicar aqui</a> ou no <span class="nota_botao">botão voltar</span> logo abaixo
                      e informar novamente os dados para identificação do cidadão. Caso seja o próprio cidadão, <a href="#">clique aqui</a> ou no <span class="nota_botao">botão continuar</span> logo abaixo e vamos atualizar os dados.
                    </p>
                  </v-flex>

<!--            DADOS CADASTRAIS -->                                    
                  <v-flex v-if="etapaAtual.posicao == enumCadastro.dadosCadastrais">
                    <p class="pt-0 mt-0 pb-5">
                      Além do <span class="nota_texto">CPF</span> e da <span class="nota_texto">Data de Nascimento</span> já informados, precisamos de outros dados cadastrais.
                      <br><br>
                      Preencha os campos abaixo e clique no <span class="nota_botao">botão continuar</span> logo abaixo.
                    </p>
                    <v-text-field
                      dense
                      label="Nome Completo"
                      required
                      clearable
                      v-model="infoPaciente.nome"
                      :rules="[regras.Basicas.obrigatorio(), regras.Basicas.min(10), regras.Basicas.max(100)]"
                      counter
                      maxlength="100"
                    ></v-text-field>
                    <v-text-field class="mt-4" 
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
                  </v-flex>

<!--            DADOS CONTATOS -->                                                      
                  <v-flex v-if="etapaAtual.posicao == enumCadastro.dadosContato">
                     <p class="pt-0 mt-0 pb-5 mb-5">
                      Precisamos dos seus dados de contato abaixo e só utilizaremos caso seja necessário. 
                      Em caso de dúvidas, clique no nosso &nbsp;<a href="#">Termo de Confidencialidade</a> para saber mais.
                    </p>
                    <v-text-field
                      dense
                      label="Email"
                      required
                      clearable
                      v-model="infoPaciente.eMail"
                      counter
                      maxlength="100"
                      :rules="[regras.Basicas.obrigatorio()]"
                    ></v-text-field>
                    <v-row>
                    <v-col cols="6"> 
                      <v-text-field class="mt-4" @keypress="entradaCelular($event)"
                        dense
                        label="Celular"
                        required
                        clearable
                        v-model="infoPaciente.celular"
                        :rules="[regras.Celular.valido(true)]"
                        counter
                        maxlength="13"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="6">
                      <v-text-field class="mt-4" @keypress="entradaCelular($event)"
                        dense
                        label="Celular 2"
                        required
                        clearable
                        v-model="infoPaciente.celular2"
                        :rules="[regras.Celular.valido(false)]"
                        counter
                        maxlength="13"
                      ></v-text-field>
                    </v-col>
                    </v-row>
                  </v-flex>

<!--            BAIRRO RESIDENCIA -->                                    
                  <v-flex v-if="etapaAtual.posicao == enumCadastro.bairroResidencia">
                    <p class="pt-0 mt-0 pb-5 mb-5">
                      Essa informação também é muito importante para o nosso planejamento                     
                    </p>
                    <v-combobox @input="setaUnidadeSaude"
                      required
                      dense
                      label="Unidade de Saúde"
                      :items="unidadesSaude"
                      v-model="infoPaciente.unidadeSaude"
                      item-value="id"
                      item-text="nome"
                    ></v-combobox> 
                    <v-combobox class="mt-5" @input="setaBairro"
                      required
                      dense
                      v-model="infoPaciente.bairro"
                      label="Bairro"
                      :items="bairros"
                      item-value="id"
                      item-text="nome"
                    ></v-combobox> 
                    <v-combobox class="mt-5"
                      dense
                      label="Nome da rua"
                      :disabled="infoPaciente.bairroId === 0"
                      v-model="infoPaciente.logradouro"
                      :items="logradouros"
                      item-value="id"
                      item-text="nome"
                    ></v-combobox>
                  </v-flex>

<!--            ENDERECO -->                                    
                  <v-flex v-if="etapaAtual.posicao == enumCadastro.endereco">
                    <p class="pt-0 mt-0 pb-5 mb-5">
                      Essa informação também é muito importante para o nosso planejamento e acompanhamento domiciliar
                    </p>
                    <v-text-field
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
                    <v-switch class="mt-2"
                      @change="liberaSemNumero()"
                      v-model="infoPaciente.semNumeroEndereco" 
                      label="Imóvel sem número"
                      color="primary"
                      hide-details
                    />
                    <v-text-field class="pt-5 mt-4"
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
                    <v-switch class="mt-2"
                      @change="liberaSemComplemento()"
                      v-model="infoPaciente.semComplemento" 
                      label="Endereço sem complemento"
                      color="primary"
                      hide-details
                    />
                  </v-flex>

<!--            SALVA DADOS DOS PACIENTE --> 
                  <v-flex v-if="etapaAtual.posicao == enumCadastro.salvaDadosPaciente" >
                    <p>
                      Agora que já temos todos os dados cadastrais, podemos salvar essas informações.
                      <br> <br>
                      Clique no <span class="nota_botao">botão salvar</span> logo abaixo e aguarde enquanto salvamos as informações.
                    </p>
                    <v-progress-linear v-if="salvandoDadosPaciente"
                      color="primary accent-4"
                      indeterminate
                      rounded
                      height="6"
                    ></v-progress-linear>
                  </v-flex>

<!--            PREPARA COMORBIDADES  -->               
                  <v-flex v-if="etapaAtual.posicao == enumCadastro.inicioComorbidades" >
                    <p>
                      Os dados cadastrais e de contato foram salvos com sucesso. Agora precisamos cadastrar as <span class="nota_texto">doenças crônicas</span>, também chamadas de <span class="nota_texto">comorbidades</span>, do cidadão. 
                    </p>
                    <p class="mt-4">
                      Caso o cidadão não tenha nenhuma <span class="nota_texto">doença crônica</span> , marque a opção abaixo <span class="nota_texto">sem evidência de doenças crônicas</span>'.
                    </p>

                    <v-switch class="pt-5"
                      v-model="infoPaciente.semComorbidade" 
                      label="sem evidência de doenças crônicas"
                      color="primary"
                      hide-details
                    />

                  </v-flex>

<!--            CADASTRA COMORBIDADES -->               
                  <v-flex v-if="etapaAtual.posicao == enumCadastro.comorbidades" >
                    <p>
                      Marque as doenças crônicas que o cidadão possui. 
                    </p>
                      <v-container class = "pa-0 ma-0" v-for="(item, index) in comorbidades" :key="item.id" >
                          <v-switch class="py-1 ma-0"  v-model="comorbidades[index].selecionado" 
                          v-if="(index >= (numeroMaximoCheckBoxes * (etapas[etapaAtual.posicao].subEtapaAtual-1))) && (index < (numeroMaximoCheckBoxes * (etapas[etapaAtual.posicao].subEtapaAtual))) "> 
                                <template v-slot:label  >
                                  <span v-bind:class="(item.id == -1)?'input__label':''">{{item.nome}}</span>
                                </template>
                          </v-switch>
                      </v-container>
                  </v-flex>

<!--            SALVA COMORBIDADES --> 
                  <v-flex v-if="etapaAtual.posicao == enumCadastro.salvaComorbidades" >
                    <p v-if="infoPaciente.semComorbidade == true">
                       Mesmo tendo informado que o cidadão não tem evidências de <span class="nota_texto">doença crônica (comorbidade)</span>, temos que salvar essa informação. 
                    </p>
                    <p v-else >
                      Agora que as <span class="nota_texto">doenças crônicas (comorbidades)</span> foram informadas, precisamos salvar as informações.
                    </p>
                    <p>
                      Clique no <span class="nota_botao">botão salvar</span> logo abaixo e aguarde enquanto salvamos as informações.
                    </p>
                    <v-progress-linear v-if="salvandoDadosPaciente"
                      color="primary accent-4"
                      indeterminate
                      rounded
                      height="6"
                    ></v-progress-linear>
                  </v-flex>

<!--            PREPARA SINTOMAS -->               
                  <v-flex v-if="etapaAtual.posicao == enumCadastro.inicioSintomas" >
                    <p>
                      Agora precisamos cadastrar as seus sintomas atuais. 
                    </p>
                    <p class="mt-4">
                      Caso o cidadão não tenha nenhum sintoma, marque a opção abaixo <span class="nota_texto">Cidadão assintomático</span>.
                    </p>
                    <v-switch class="pt-5"
                      v-model="infoPaciente.assintomatico" 
                      label="Cidadão assintomático"
                      color="primary"
                      hide-details
                    />
                  </v-flex>

<!--            CADASTRA SINTOMAS --> 
                  <v-flex v-if="etapaAtual.posicao == enumCadastro.sintomas" >
                    <v-container class="pa-1 my-0" v-for="(item, index) in sintomas" :key="item.id" >
                      <v-row class="pa-0"  v-if="(index >= (numeroMaximoCheckBoxes * (etapas[etapaAtual.posicao].subEtapaAtual-1))) && (index < (numeroMaximoCheckBoxes * (etapas[etapaAtual.posicao].subEtapaAtual))) "> 
                        <v-col cols="10"> 
                          <v-switch class="pa-0 mt-0"  v-model="sintomas[index].selecionado" >
                              <template v-slot:label>
                                <span v-bind:class="(item.id == -1)?'input__label':''">{{item.nome}}</span>
                              </template>
                            </v-switch>
                        </v-col>
                        <v-col cols="2">
                          <v-text-field 
                              type="number"
                              label="dias"
                              dense
                              v-model="sintomas[index].dias"
                              v-if="sintomas[index].selecionado == true"
                              :rules="[regras.Basicas.obrigatorio()]"
                            ></v-text-field> 
                        </v-col>
                      </v-row>
                    </v-container>
                  </v-flex>

<!--            SALVA SINTOMAS --> 
                  <v-flex v-if="etapaAtual.posicao == enumCadastro.salvaSintomas" >
                    <p v-if="infoPaciente.assintomatico == true">
                       Mesmo tendo informado que o cidadão é <span class="nota_texto">assintomático</span>, temos que salvar essa informação. 
                    </p>
                    <p v-else >
                      Agora que os <span class="nota_texto">sintomas</span> foram informadas, precisamos salvar as informações.
                    </p>
                    <p>
                      Clique no <span class="nota_botao">botão salvar</span> logo abaixo e aguarde enquanto salvamos as informações.
                    </p>
                    <v-progress-linear v-if="salvandoDadosPaciente"
                      color="primary accent-4"
                      indeterminate
                      rounded
                      height="6"
                    ></v-progress-linear>
                  </v-flex>

<!--            PRÓXIMO PACIENTE --> 
                  <v-flex v-if="etapaAtual.posicao == enumCadastro.proximoPaciente" >
                    <p>
                      Ufa, terminamos o cadastro do cidadão!!!! Porém será necessário cadastrar todos os cidadãos que moram na mesma residência, pois todos devem ser monitorados.
                    </p>
                    <p>
                      Caso ainda tenha mais alguém para cadastrar, clique no <span class="nota_botao">botão Novo Monitorado</span> logo abaixo.
                    </p>
                    <p>
                      Caso tenha cadastrado <span class="nota_texto">TODOS</span> que moram na mesma residência com o cidadão, <span class="nota_texto">parabéns</span>!!! Clique no <span class="nota_botao">botão Finalizado</span>. 
                    </p>
                  </v-flex>
                </v-col>
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
        :temBotaoNovo= "temBotaoNovo"
        :podeVoltar="podeVoltar"
        :podeContinuar= "podeContinuar"
        :podeCancelar= "podeCancelar"
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
              identificacaoCidadao: 0,
              confirmaIdentificacao: 1,
              dadosCadastrais: 2,
              dadosContato: 3,
              bairroResidencia: 4,
              endereco: 5,
              salvaDadosPaciente: 6,
              inicioComorbidades: 7,
              comorbidades: 8,
              salvaComorbidades: 9,
              inicioSintomas: 10,
              sintomas: 11,
              salvaSintomas: 12,
              proximoPaciente: 13
            },

            regras: regrasCampos,
            formularioValido: false,

            infoPaciente: {
              id: 0,
              nome: '',
              cpf: '01834522757',
              dataNascimento: '1971-11-03',
              cartaoSUS: '',              
              eMail: '',
              celular: '',
              celular2: '',
              numeroEndereco: null,
              semNumeroEndereco: null,
              complemento: null,
              semComplemento: null,
              semComorbidade: false,
              assintomatico: true,
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
              sintomas: [],
              comorbidades: []
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
            temBotaoNovo: false,

            podeVoltar: false,
            podeCancelar: false,
            
            numeroEtapas: 0,
            etapaAtual: {posicao: 0, nome: '', obs: '', obs2: '', stepBar: 0},
            etapas: [ {stepBar: 1, nome: 'Identificação do Cidadão', obs: '', obs2: '', totalSubEtapas: 0, subEtapaAtual: 0},
                      {stepBar: 1, nome: 'Confirma Identificação do Cidadão', obs: '', obs2: '', totalSubEtapas: 0, subEtapaAtual: 0},
                      {stepBar: 2, nome: 'Dados cadastrais', obs: '', obs2: '', totalSubEtapas: 0, subEtapaAtual: 0},            
                      {stepBar: 2, nome: 'Dados para Contato', obs: '', obs2: '', totalSubEtapas: 0, subEtapaAtual: 0},            
                      {stepBar: 2, nome: 'Onde reside o cidadão', obs: '', obs2: '', totalSubEtapas: 0, subEtapaAtual: 0},
                      {stepBar: 2, nome: 'Identificação da residência', obs: '', obs2: '', totalSubEtapas: 0, subEtapaAtual: 0},
                      {stepBar: 2, nome: 'Salvando os dados do Paciente', obs: '', obs2: '', totalSubEtapas: 0, subEtapaAtual: 0},                      
                      {stepBar: 3, nome: 'Como anda sua saúde?', obs: '', obs2: '', totalSubEtapas: 0, subEtapaAtual: 0},
                      {stepBar: 3, nome: 'Doenças Crônicas', obs: '', obs2: '', totalSubEtapas: 0, subEtapaAtual: 0},
                      {stepBar: 3, nome: 'Salvandos as doenças crônicas', obs: '', obs2: '', totalSubEtapas: 0, subEtapaAtual: 0},                      
                      {stepBar: 4, nome: 'Quais são os sintomas agora?', obs: '', obs2: '', totalSubEtapas: 0, subEtapaAtual: 0},
                      {stepBar: 4, nome: 'Sintomas atuais', obs: '', obs2: '', totalSubEtapas: 0, subEtapaAtual: 0},
                      {stepBar: 4, nome: 'Salvando os Sintomas Atuais', obs: '', obs2: '', totalSubEtapas: 0, subEtapaAtual: 0}                     ,
                      {stepBar: 5, nome: 'FIm do cadastro', obs: '', obs2: '', totalSubEtapas: 0, subEtapaAtual: 0}                     
            ],

            opcoesPosCadastro: [
              {
                  textColor: 'blue--text', 
                  text: 'Tem mais pessoas que devem ser monitoradas', 
                  icon: 'mdi-account-plus', 
                  iconColor: 'blue', 
                  func: 'proximoCidadao()' 
              }, {   
                  textColor: 'blue--text', 
                  text: 'Não há mais ninguem para ser monitorado ', 
                  icon: 'mdi-account-off', 
                  iconColor: 'blue', 
                  func: 'cmdCancela()'
              }
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
          if (this.listasCarregadas == false) {
            this.buscaDadosIniciais()
          }
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
          buscaDadosIniciais() {
            console.log('buscaDadosIniciais.promise.inicio')
            this.mensagemBusca = 'Buscando alguns dados! Aguarde..'
            Promise.all([
              mainService.listaUnidadesSaude(this.cidadeId),
              mainService.listaBairros(this.cidadeId),
              mainService.listaSintomas(),
              mainService.listaComorbidades()   
            ]).then(([_UnidadeSaude, _Bairro, _Sintoma, _Comorbidade]) => {

              console.log('buscaDadosIniciais.promise.then')
              this.mensagemBusca = ''
              if (_UnidadeSaude.status == 200)  
                this.unidadesSaude = _UnidadeSaude.data

              if (_Bairro.status == 200)  
                this.bairros = _Bairro.data
             
              if (_Sintoma.status == 200) {
                this.sintomas = []
                for (let i=0; i < _Sintoma.data.length; ++i) {
                  let _elemAux = {}
                  _elemAux.id = _Sintoma.data[i].id
                  _elemAux.nome = _Sintoma.data[i].nome
                  _elemAux.selecionado = false
                  _elemAux.dias = 0
                  this.sintomas.push(_elemAux)
                }
                this.etapas[this.enumCadastro.sintomas].totalSubEtapas = Math.ceil(_Sintoma.data.length / this.numeroMaximoCheckBoxes)
                this.etapas[this.enumCadastro.sintomas].subEtapaAtual = 1
              }
               
              if (_Comorbidade.status == 200) {
                this.comorbidades = [] 
                for (let i=0; i < _Comorbidade.data.length; ++i) {
                  let _elemAux = {}
                  _elemAux.id = _Comorbidade.data[i].id
                  _elemAux.nome = _Comorbidade.data[i].nome
                  _elemAux.selecionado = false
                  this.comorbidades.push(_elemAux)
                }
                this.etapas[this.enumCadastro.comorbidades].totalSubEtapas = Math.ceil(_Comorbidade.data.length / this.numeroMaximoCheckBoxes)
                this.etapas[this.enumCadastro.comorbidades].subEtapaAtual = 1
              }
              this.listasCarregadas = true
              this.vaPara(this.enumCadastro.identificacaoCidadao)
            });
            console.log('buscaDadosIniciais.promise.fim')
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
          cmdAnterior() {
            console.log('cmdAnterior-inicial', this.etapaAtual.posicao, this.etapas[this.etapaAtual.posicao].totalSubEtapas, this.etapas[this.etapaAtual.posicao].subEtapaAtual)

            if ((this.etapaAtual.posicao == this.enumCadastro.salvaComorbidades) && (this.infoPaciente.semComorbidade == true)) {
              this.vaPara(this.enumCadastro.inicioComorbidades)
            } else
            if ((this.etapaAtual.posicao == this.enumCadastro.salvaSintomas) && (this.infoPaciente.assintomatico == true)) {
              this.vaPara(this.enumCadastro.inicioSintomas)
            }
            else if (this.etapaAtual.posicao == this.enumCadastro.identificacaoCidadao) {
              this.$router.push('/home');
            } else if ((this.etapaAtual.posicao == this.enumCadastro.confirmaIdentificacao) || (this.etapaAtual.posicao == this.enumCadastro.dadosCadastrais)) {
              this.vaPara(this.enumCadastro.identificacaoCidadao)
            } else {
              if (this.etapas[this.etapaAtual.posicao].totalSubEtapas > 0) {
                
                // se a primeira subetapa
                if (this.etapas[this.etapaAtual.posicao].subEtapaAtual == 1) {
                    this.vaPara(--this.etapaAtual.posicao)
                } else {
                  // volta subEtapa
                  this.etapas[this.etapaAtual.posicao].subEtapaAtual--
                }
              } else {
                this.vaPara(--this.etapaAtual.posicao)
              }
            }
            console.log('cmdAnterior-final', this.etapaAtual.posicao, this.etapas[this.etapaAtual.posicao].totalSubEtapas, this.etapas[this.etapaAtual.posicao].subEtapaAtual)
          }, 
          cmdCancela() {
            this.$router.push('/home');
          },
          cmdFinaliza() {
            this.salvaPaciente();
          },
          cmdProximo() {
            console.log('cmdProximo-Inicio', this.etapaAtual.posicao, this.etapas[this.etapaAtual.posicao].nome, this.etapas[this.etapaAtual.posicao].totalSubEtapas, this.etapas[this.etapaAtual.posicao].subEtapaAtual, this.infoPaciente.semComorbidade)
            if ((this.etapaAtual.posicao == this.enumCadastro.inicioComorbidades) && (this.infoPaciente.semComorbidade == true)) {
              this.vaPara(this.enumCadastro.salvaComorbidades)
            } 
            else if ((this.etapaAtual.posicao == this.enumCadastro.inicioSintomas) && (this.infoPaciente.assintomatico == true)) {
              this.vaPara(this.enumCadastro.salvaSintomas)
            }
            else {
            // tem subEtapa
              if (this.etapas[this.etapaAtual.posicao].totalSubEtapas > 0) {
                if (this.etapas[this.etapaAtual.posicao].subEtapaAtual < this.etapas[this.etapaAtual.posicao].totalSubEtapas)
                  this.etapas[this.etapaAtual.posicao].subEtapaAtual++
                else {
                  this.vaPara(++this.etapaAtual.posicao)
                }
                //console.log('cmdProximo-Fim1', this.etapaAtual.posicao, this.etapas[this.etapaAtual.posicao].totalSubEtapas, this.etapas[this.etapaAtual.posicao].subEtapaAtual)
                return
              }
              this.vaPara(++this.etapaAtual.posicao)
            }



            console.log('cmdProximo-Fim', this.etapaAtual.posicao, this.etapas[this.etapaAtual.posicao].totalSubEtapas, this.etapas[this.etapaAtual.posicao].subEtapaAtual)
          },
          cmdSalva() {
            console.log('cmdSalva-Inicio', this.etapaAtual.posicao)
            if (this.etapaAtual.posicao == this.enumCadastro.salvaDadosPaciente) {
              console.log('cmdSalva', 'this.salvaPaciente()')
              this.salvaPaciente();
            }
            else if (this.etapaAtual.posicao == this.enumCadastro.salvaComorbidades) {
              console.log('cmdSalva', 'this.salvaComorbidades()')
              this.salvaComorbidades();
            }
            else if (this.etapaAtual.posicao == this.enumCadastro.salvaSintomas) {
              console.log('cmdSalva', 'this.salvaSintomas()')
              this.salvaPacienteSintomas();
            }
            console.log('cmdSalva-fim')
          },
          cmdVerifica() {
            this.verificaPaciente()
          },
          liberaSemNumero() {
            this.formularioValido = this.infoPaciente.semNumeroEndereco === true
          },
          liberaSemComplemento() {
            this.formularioValido = this.infoPaciente.semComplemento === true
          },
          listaPaciente(pacienteId) {
            console.log('listaPaciente-Entrei ==> [PacienteId', pacienteId, ']')

            Promise.all([
              mainService.listaPaciente(pacienteId),
              mainService.listaPacienteComorbidades(pacienteId),
              mainService.listaPacienteSintomas(pacienteId),
            ]).then(([_paciente, _pacienteComorbidades, _pacienteSintomas]) => {

              console.log('listaPaciente-then', _paciente, _pacienteSintomas)
              if (_paciente.status == 200) {
                var _dadosPaciente = _paciente.data[0];
                this.infoPaciente.id = pacienteId
                this.infoPaciente.nome = _dadosPaciente.nome
                this.infoPaciente.cartaoSUS = _dadosPaciente.cartaoSUS
                this.infoPaciente.eMail = _dadosPaciente.eMail 

                this.infoPaciente.unidadeSaude.id = _dadosPaciente.unidadeSaudeId

                this.infoPaciente.semNumeroEndereco = (_dadosPaciente.numeroEndereco == '') 
                this.infoPaciente.semComplemento = (_dadosPaciente.complementoEndereco == '')
                this.infoPaciente.numeroEndereco = _dadosPaciente.numeroEndereco
                this.infoPaciente.complemento = _dadosPaciente.complementoEndereco

                this.infoPaciente.nomeunidadeSaude = ''

                this.infoPaciente.bairro.id = _dadosPaciente.bairroId
                this.infoPaciente.bairro.nome = _dadosPaciente.nomeBairro

                this.infoPaciente.logradouro.id = _dadosPaciente.logradouroId
                this.infoPaciente.logradouro.nome = _dadosPaciente.nomeLogradouro

                this.infoPaciente.dataNascimento = _dadosPaciente.dataNascimento.substring(0, 10)

                this.infoPaciente.celular = formataValores.celular(_dadosPaciente.celular)
                if (_dadosPaciente.celular2) 
                  this.infoPaciente.celular2 = formataValores.celular(_dadosPaciente.celular2)
                else 
                  this.infoPaciente.celular2 = '' 
                                
                this.infoPaciente.cpf = formataValores.cpf(_dadosPaciente.cpf)

                // Guarda a unidade de saude selecionadea
                this.unidadesSaude.forEach ((elemento) => {
                if (elemento.id == this.infoPaciente.unidadeSaude.id)
                  this.infoPaciente.unidadeSaude.nome = elemento.nome
                })
                // this.vaPara(this.enumCadastro.confirmaIdentificacao)
              } else {
                console.log('Erro', _paciente.message)
                this.mensagemErro = _paciente.message
              }

              var _dataHoje = new Date()
              var posAchou = -1
              if (_pacienteComorbidades.status == 200) {
                this.infoPaciente.comorbidades = _pacienteComorbidades.data
                console.log('PacienteComorbidade.infoPaciente.comorbidades', this.infoPaciente.sintomas)
                console.log('PacienteComorbidade.comorbidades',  this.sintomas.length)

                for (let i=0; i < this.infoPaciente.comorbidades.length; ++i) {
                   posAchou = -1
                  for (let j=0; j < this.comorbidades.length; ++j) {
                    console.log(i, j, this.infoPaciente.comorbidades[i].id, this.comorbidades[j].id, this.infoPaciente.comorbidades[i].dataInicio)
                    if (this.infoPaciente.comorbidades[i].id == this.comorbidades[j].id) {
                      posAchou = j
                      break
                    }
                  }
                  console.log(posAchou)
                  if (posAchou != -1) {
                    this.comorbidades[posAchou].selecionado = true;
                    this.comorbidades[posAchou].dataInicio = this.infoPaciente.comorbidades[i].dataInicio; 
                  }
                }

                if (_pacienteSintomas.status == 200) {
                  this.infoPaciente.sintomas = _pacienteSintomas.data
                  console.log('PacienteSintoma.infoPaciente.sintomas', this.infoPaciente.sintomas)
                  console.log('PacienteSintoma.sintomas',  this.sintomas.length)

                  for (let i=0; i < this.infoPaciente.sintomas.length; ++i) {
                    posAchou = -1
                    for (let j=0; j < this.sintomas.length; ++j) {
                      console.log(i, j, this.infoPaciente.sintomas[i].id, this.sintomas[j].id, this.infoPaciente.sintomas[i].dataInicio)
                      if (this.infoPaciente.sintomas[i].id == this.sintomas[j].id) {
                        posAchou = j
                        break
                      }
                    }
                    console.log(posAchou)
                    if (posAchou != -1) {
                      var _dataSintoma = new Date(this.infoPaciente.sintomas[i].dataInicio)
                      this.sintomas[posAchou].selecionado = true;
                      this.sintomas[posAchou].dias = parseInt((_dataHoje - _dataSintoma) / (1000 * 60 * 60 * 24), 10); 
                    }
                  }
                }
                // Va para
                this.vaPara(this.enumCadastro.confirmaIdentificacao)
              } else {
                console.log('Erro', _paciente.message)
                this.mensagemErro = _paciente.message
              }
            })
          },
          salvaComorbidades() {
            console.log('salvaComorbidades-Inicio')
            let _comorbidades = []
            for (let i = 0;  i < this.comorbidades.length; i++) {
              if (this.comorbidades[i].selecionado) {
                let item = {}
                item.id = this.comorbidades[i].id
                item.dataInicio = this.comorbidades[i].dataInicio
                console.log('4', item.dataInicio)
                _comorbidades.push (item)
              }
            }

            this.mensagemBusca = "Aguarde... Salvando as Comorbidades"
            mainService.salvaPacienteComorbidades(this.infoPaciente.id, _comorbidades).then(resposta => {
              console.log('salvaPacienteComorbidades', '.then', resposta)
                this.mensagemBusca = ""
                if (resposta.status == 200) {
                  this.vaPara(this.enumCadastro.inicioSintomas)
                } else {
                  console.log('Erro', resposta.message)
                  this.mensagemErro = resposta.message
                }
              })
              .catch(response => {
                console.log('salvaPacienteComorbidades', '.catch((response)', response)
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
            console.log('salvaComorbidades-Fim')
          },
          salvaPaciente() {
            this.mensagemBusca = "Aguarde...."
            mainService.salvaPaciente(this.infoPaciente).then(resposta => {
              console.log('salvaPaciente', '.then', resposta)
                this.mensagemBusca = ""
                if (resposta.status == 200) {
                  this.vaPara(this.enumCadastro.inicioComorbidades)
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
          salvaPacienteSintomas() {
            console.log('salvaPacienteSintomas-Inicio')
            let _sintomas = []
            var _dataHoje = new Date()
            var _dataInicio = new Date()
            for (let i = 0;  i < this.sintomas.length; i++) {
              if (this.sintomas[i].selecionado) {
                console.log('1', formataValores.dataYYYYMMDD(_dataInicio), formataValores.dataYYYYMMDD(_dataHoje))
                _dataInicio.setDate(_dataHoje.getDate() - this.sintomas[i].dias)
                console.log('2', formataValores.dataYYYYMMDD(_dataInicio), formataValores.dataYYYYMMDD(_dataHoje))
                console.log('3', formataValores.dataYYYYMMDD(_dataInicio))

                let item = {}
                item.id = this.sintomas[i].id
                item.dataInicio = formataValores.dataYYYYMMDD(_dataInicio)
                console.log('4', item.dataInicio)
                _sintomas.push (item)
              }
            }

            // Não há sintomas
            if (_sintomas.lenght == 0) {
              this.message.mensagemErro = 'Nenhum sintoma foi selecionado. [erroId=01.001.001]'
              return
            } 
            this.mensagemBusca = "Aguarde... Salvandos Sintomas"
            mainService.salvaPacienteSintomas(this.infoPaciente.id, _sintomas).then(resposta => {
              console.log('salvaPacienteSintomas', '.then', resposta)
                this.mensagemBusca = ""
                if (resposta.status == 200) {
                  this.vaPara(this.enumCadastro.proximoPaciente)
                } else {
                  console.log('Erro', resposta.message)
                  this.mensagemErro = resposta.message
                }
              })
              .catch(response => {
                console.log('salvaPacienteSintomas', '.catch((response)', response)
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
            console.log('salvaPacienteSintomas-Fim')
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
          vaPara(posicaoCadastro) {
            this.mensagemErro = ''
            this.mensagemBusca = ''


            this.temBotaoAnterior = false
            this.temBotaoProximo = false
            this.temBotaoCancela = false
            this.temBotaoFinaliza = false
            this.temBotaoSalva = false
            this.temBotaoVerifica = false
            this.temBotaoNovo = false

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
                this.podeVoltar = true
                this.temBotaoAnterior = this.temBotaoProximo = true
                break
              case this.enumCadastro.proximoPaciente:
                this.temBotaoFinaliza = this.temBotaoNovo = true
                break
              case this.enumCadastro.salvaDadosPaciente:
              case this.enumCadastro.salvaComorbidades:
              case this.enumCadastro.salvaSintomas:
                this.podeVoltar = true
                this.temBotaoAnterior = true;
                this.temBotaoSalva = true;
                break

              case this.enumCadastro.inicioComorbidades: 
              case this.enumCadastro.inicioSintomas: 
                this.podeVoltar = false
                this.temBotaoAnterior = true
                this.temBotaoProximo = true
                break;

            } 
            this.etapaAtual.posicao = posicaoCadastro;
            this.etapaAtual.stepBar = this.etapas[this.etapaAtual.posicao].stepBar;
            this.etapaAtual.nome = this.etapas[this.etapaAtual.posicao].nome;
            this.etapaAtual.obs = this.etapas[this.etapaAtual.posicao].obs;
            this.etapaAtual.obs2 = this.etapas[this.etapaAtual.posicao].obs2;
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

                // Tem paciente
                if (_pacientes.length > 0) {
                  this.infoPaciente.id = _pacientes[0].id
                  this.listaPaciente(this.infoPaciente.id)
                } else {
                  this.infoPaciente.id = 0
                  this.vaPara(this.enumCadastro.dadosCadastrais)
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
        }
    }
</script>
<style scoped>
  .input__label {
    color: blue;
  }
  .nota_texto {
    color:goldenrod;
    font-weight: bold;
    font-style: italic;
  }
  .nota_botao {
    color:green;
    font-weight: bold;
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

