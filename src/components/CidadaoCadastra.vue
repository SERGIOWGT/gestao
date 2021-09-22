<template>
  <v-container  class="pa-1 mt-0"> 
    <v-container fluid style="height: 100vmax;" class="pa-0">
      <v-flex>
        <v-card flat class="pa-3 mt-1">
          <v-card-text class="ma-0 pa-0">
            <v-row>
              <v-col cols="12" class="px-0 py-0 pt-0">
                <v-flex class="py-0 my-0" v-if="etapaCadastro == enumEtapaCadastro.dadosCidadao">
                  <v-card-title class="py-2 primary white--text  justify-center"><h6>CADASTRO DE CIDADÃOS</h6></v-card-title>
                  <v-expansion-panels focusable class="pt-0 mt-0">
                    <v-expansion-panel>
                      <v-expansion-panel-header>
                          <div class="d-flex align-center">
                              <v-icon :color="corIconePainel(enumPaineis.dadosCadastrais)">{{iconePainel(enumPaineis.dadosCadastrais)}}</v-icon><span class="ml-2 "> <b>Informe aqui os dados cadastrais</b></span>
                          </div>
                      </v-expansion-panel-header>
                      <v-expansion-panel-content class="pt-2">
                          <v-form v-model="painelValido[enumPaineis.dadosCadastrais]">
                              <v-text-field class="mt-2 pt-1" 
                                  dense required clearable
                                  label="Nome Completo*"
                                  v-model="infoPaciente.nome"
                                  :rules="[regras.Basicas.obrigatorio(), regras.Basicas.min(10), regras.Basicas.max(100)]"
                                  counter
                                  maxlength="100"
                              ></v-text-field>
                              <v-text-field class="mt-2 pt-1" 
                                  dense required clearable
                                  label="Data de Nascimento"
                                  v-model="infoPaciente.dataNascimento"
                                  v-mask="'##/##/####'"
                                  :rules="[regras.Data.valida(true)]"
                              ></v-text-field>
                              <v-text-field class="mt-2 pt-1"
                                  dense required clearable
                                  label="CPF"
                                  v-model="infoPaciente.cpf"
                                  v-mask="'###.###.###-##'" 
                                  :rules="[regras.Cpf.valido(true)]"
                              ></v-text-field>
                              <small>Sexo*</small>
                              <v-radio-group  class="py-0 my-0" dense v-model="infoPaciente.sexo" row :rules="[regras.Basicas.obrigatorio()]">
                                  <v-col cols="4" class="py-1 my-1 pl-0"><v-radio value="F" label="Femin."></v-radio></v-col>
                                  <v-col cols="4" class="py-1 my-1"><v-radio value="M" label="Mascul."></v-radio></v-col>
                                  <v-col cols="3" class="py-1 my-1"><v-radio value="O" label="Outros"></v-radio></v-col>
                              </v-radio-group>
                              <small>*campo obrigatório</small>
                          </v-form>
                      </v-expansion-panel-content>
                    </v-expansion-panel>
                    <v-expansion-panel>
                      <v-expansion-panel-header>
                          <div class="d-flex align-center">
                              <v-icon :color="corIconePainel(enumPaineis.dadosContato)">{{iconePainel(enumPaineis.dadosContato)}}</v-icon><span class="ml-2 "> <b>Informe aqui os dados para contato</b></span>
                          </div>
                      </v-expansion-panel-header>
                      <v-expansion-panel-content class="pt-2">
                          <v-form v-model="painelValido[enumPaineis.dadosContato]">
                          <v-text-field class="mt-2 pt-1"
                              dense
                              label="Email*"
                              required
                              clearable
                              v-model="infoPaciente.eMail"
                              counter
                              maxlength="100"
                              :rules="[regras.Basicas.obrigatorio()]"
                            ></v-text-field>
                            <v-text-field class="mt-4" @keypress="entradaCelular($event)"
                              dense
                              label="Celular*"
                              required
                              clearable
                              v-model="infoPaciente.celular"
                              :rules="[regras.Celular.valido(true)]"
                              maxlength="13"
                            ></v-text-field>
                            <v-text-field class="mt-4" @keypress="entradaCelular($event)"
                              dense
                              label="Celular 2"
                              required
                              clearable
                              v-model="infoPaciente.celular2"
                              :rules="[regras.Celular.valido(false)]"
                              maxlength="13"
                            ></v-text-field>
                            <small>*campo obrigatório</small>
                          </v-form>
                      </v-expansion-panel-content>
                    </v-expansion-panel>
                    <v-expansion-panel>
                      <v-expansion-panel-header>
                          <div class="d-flex align-center">
                              <v-icon :color="corIconePainel(enumPaineis.endereco)">{{iconePainel(enumPaineis.endereco)}}</v-icon><span class="ml-2 "> <b>Informe aqui o endereço</b></span>
                          </div>
                      </v-expansion-panel-header>
                      <v-expansion-panel-content class="pt-2">
                        <v-form v-model="painelValido[enumPaineis.endereco]">
                          <v-autocomplete class="mt-1 pt-2" @input="setaBairro"
                            dense hide-no-data
                            label="Bairro*"
                            v-model="infoPaciente.bairro"
                            :items="infoPesquisa.allBairros"
                            item-value="id"
                            item-text="nome"
                            return-object
                            :rules="[required]"
                          ></v-autocomplete> 
                          <v-autocomplete class="mt-5"
                            dense hide-no-data
                            label="Nome da rua*"
                            :disabled="infoPaciente.bairro.id === 0 || infoPesquisa.allBairros.length === 0 "
                            v-model="infoPaciente.logradouro"
                            :items="infoPesquisa.logradouros"
                            item-value="id"
                            item-text="nome"
                            return-object
                            :rules="[required]"
                          ></v-autocomplete>
                          <v-row class="mt-1">
                            <v-col cols="8"> 
                                <v-text-field class="mt-3"
                                dense
                                label="Número do sua residência*"
                                :disabled="infoPaciente.semNumeroEndereco === true "
                                required
                                clearable
                                v-model="infoPaciente.numeroEndereco"
                                counter
                                maxlength="10"
                                ></v-text-field>
                            </v-col>
                            <v-col cols="4"> 
                                <v-switch class="mt-0"
                                @change="liberaSemNumero()"
                                v-model="infoPaciente.semNumeroEndereco" 
                                label="Sem número"
                                color="primary"
                                hide-details
                                />
                            </v-col>
                          </v-row>
                          <v-row class="mt-1">
                            <v-col cols="8"> 
                              <v-text-field class="mt-1"
                                dense
                                label="Complemento*"
                                :disabled="infoPaciente.semComplemento === true "
                                required
                                clearable
                                v-model="infoPaciente.complemento"
                                counter
                                maxlength="50"
                              ></v-text-field>
                            </v-col>
                            <v-col cols="4"> 
                              <v-switch class="mt-0"
                                @change="liberaSemComplemento()"
                                v-model="infoPaciente.semComplemento" 
                                label="Sem Compl."
                                color="primary"
                                hide-details
                              />
                            </v-col>
                          </v-row>
                          <small class="pt-2">*campo obrigatório</small>
                        </v-form>
                      </v-expansion-panel-content>
                    </v-expansion-panel>
                    <v-expansion-panel>
                      <v-expansion-panel-header>
                          <div class="d-flex align-center">
                              <v-icon :color="corIconePainel(enumPaineis.unidadeSaude)">{{iconePainel(enumPaineis.unidadeSaude)}}</v-icon><span class="ml-2 "> <b>Informe a Unidade de Saúde</b></span>
                          </div>
                      </v-expansion-panel-header>
                      <v-expansion-panel-content class="pt-2">
                          <v-form v-model="painelValido[enumPaineis.unidadeSaude]">
                              <v-text-field class="mt-2 pt-1"
                                  dense persistent-hint clearable
                                  label="Número do Sus"
                                  v-mask="'### #### #### ####'"
                                  v-model="infoPaciente.cartaoSUS"
                                  maxlength="18"
                              ></v-text-field>
                              <v-autocomplete @input="setaUnidadeSaude" class="mt-2 pt-1"
                                  dense hide-no-data
                                  label="Unidade de Saúde*"
                                  :items="infoPesquisa.allUnidadesSaude"
                                  v-model="infoPaciente.unidadeSaude"
                                  item-value="id"
                                  item-text="nome"
                                  return-object
                                  :rules="[required]"
                              ></v-autocomplete> 
                              <v-autocomplete class="mt-2 pt-1"
                                  dense hide-no-data
                                  label="Micro Área*"
                                  :disabled="infoPaciente.unidadeSaude.id === 0 || infoPesquisa.allUnidadesSaude.length === 0 "
                                  v-model="infoPaciente.microArea"
                                  :items="infoPesquisa.microAreas"
                                  item-value="id"
                                  item-text="nome"
                                  return-object
                                  :rules="[required]"
                              ></v-autocomplete>
                              <small>*campo obrigatório</small>
                          </v-form>
                      </v-expansion-panel-content>
                    </v-expansion-panel>
                    <v-expansion-panel>
                      <v-expansion-panel-header>
                          <div class="d-flex align-center">
                              <v-icon :color="corIconePainel(enumPaineis.comorbidades)">{{iconePainel(enumPaineis.comorbidades)}}</v-icon><span class="ml-2 "> <b>Comorbidades</b></span>
                          </div>
                      </v-expansion-panel-header>
                      <v-expansion-panel-content class="pt-2">
                          <v-flex>
                              <v-container class = "pa-0 ma-0" v-for="(item, index) in infoPesquisa.comorbidadesTela" :key="item.id" >
                                  <v-switch class="py-1 ma-0"  v-model="infoPesquisa.comorbidadesTela[index].selecionado"> 
                                          <template v-slot:label  >
                                          <span v-bind:class="(item.id == -1)?'input__label':''">{{item.nome}}</span>
                                          </template>
                                  </v-switch>
                              </v-container>
                          </v-flex>
                      </v-expansion-panel-content>
                    </v-expansion-panel>
                    <v-expansion-panel class="px-0">
                      <v-expansion-panel-header>
                          <div class="d-flex align-center">
                              <v-icon :color="corIconePainel(enumPaineis.sintomas)">{{iconePainel(enumPaineis.sintomas)}}</v-icon><span class="ml-2 "> <b>Sintomas</b></span>
                          </div>
                      </v-expansion-panel-header>
                      <v-expansion-panel-content class="pt-2 ">
                              <v-container class="pa-0 ma-0" v-for="(item, index) in infoPesquisa.sintomasTela" :key="item.id" >
                                  <v-row class="pa-1"> 
                                    <v-col cols="9"> 
                                        <v-switch class="pa-0 mt-0"  v-model="infoPesquisa.sintomasTela[index].selecionado" >
                                            <template v-slot:label>
                                            <span v-bind:class="(item.id == -1)?'input__label':''">{{item.nome}}</span>
                                            </template>
                                        </v-switch>
                                    </v-col>
                                    <v-col cols="3" class="">
                                        <v-text-field  class="pa-0"  @focus="$event.target.select()" 
                                            type="number"
                                            label="dias"
                                            dense
                                            v-model="infoPesquisa.allSintomas[index].dias"
                                            v-show="infoPesquisa.allSintomas[index].selecionado == true"
                                            :rules="[regras.Basicas.obrigatorio()]"
                                        ></v-text-field> 
                                    </v-col>
                                  </v-row>
                              </v-container>
                              <p>.</p>
                      </v-expansion-panel-content>
                    </v-expansion-panel>
                  </v-expansion-panels>
                </v-flex>  
                <v-flex v-if="etapaCadastro == enumEtapaCadastro.proximoCidadao" >
                  <p>
                    Os dados do cidadão foram salvos com sucesso!!!! 
                  </p>
                  <p>
                    Caso ainda tenha mais alguém para cadastrar, clique no <span class="nota_botao">botão Novo Cidadão</span> logo abaixo. 
                  </p>
                </v-flex>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-flex>
    </v-container>
    <BottomBar 
        :temBotaoAnterior="infoBotoes.temBotaoAnterior"
        :temBotaoProximo= "infoBotoes.temBotaoProximo"
        :temBotaoCancela= "infoBotoes.temBotaoCancela"
        :temBotaoFinaliza= "infoBotoes.temBotaoFinaliza"
        :temBotaoSalva= "infoBotoes.temBotaoSalva"
        :temBotaoVerifica= "infoBotoes.temBotaoVerifica"
        :temBotaoNovo= "infoBotoes.temBotaoNovo"
        :podeVoltar="infoBotoes.podeVoltar"
        :podeContinuar= "false"
        :podeCancelar= "infoBotoes.podeCancelar"
        :podeVerificar= "false"
        :podeSalvar= "podeSalvar"
        @funcaoRetorno= 'cbClickBotao'
    />
  </v-container>
</template>
<script>
    import BottomBar from '../components/StepBottomBar'
    import mainService from '../services/MainService'
    import regrasCampos from '../bibliotecas/regrasCampos'
    import formataValores from '../bibliotecas/formataValores'
    import entradaText from '../bibliotecas/entradaText'
    import store from '../store'
    //import StepBar from '../components/StepBar';
    import rotinasPadrao from '../rotinasProjeto/rotinasProjeto'

    export default {
        name: 'SuspeitaCovid',
        components: {
            BottomBar //, StepBar
        },
        props: {
          pacienteId: Number,
        },
        data() {
          return {

            // funcoes
            entradaCelular: entradaText.celular,
            regras: regrasCampos,

            // dados
            enumEtapaCadastro: {
              dadosCidadao: 0,
              proximoCidadao: 1
            },
            etapaCadastro: 0,
            enumPaineis: {
                dadosCadastrais: 0,
                dadosContato: 1,
                endereco: 2,
                unidadeSaude: 3,
                comorbidades: 4,
                sintomas: 5
            },
            enumpainelValido: {
                disabled: 0,
                enabled: 1,
                valid: 2
            },
            painelValido: [false, false, false, false, false, false],
            cidadeId: 0,

            infoPaciente: {
              id: 0,
              nome: '',
              nomeMae: '',
              cpf: '',
              dataNascimento: '',
              cartaoSUS: '',              
              eMail: '',
              celular: '',
              celular2: '',
              sexo: '',
              numeroEndereco: null,
              semNumeroEndereco: null,
              complemento: null,
              semComplemento: null,
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
              microArea: {
                id: 0,
                nome: ''
              },
              sintomas: [],
              comorbidades: []
            },
            salvandoDadosPaciente: false,
          
            infoPesquisa: {
              listasCarregadas: false,
              allSintomas: [],
              allComorbidades: [],
              allBairros: [],
              allUnidadesSaude: [],
              microAreas: [],
              logradouros: [],

              sintomasTela: [],
              comorbidadesTela: []
            },       

            infoBotoes: {
              carregandoDados: false,

              temBotaoAnterior: false,
              temBotaoProximo: false,
              temBotaoCancela: false,
              temBotaoFinaliza: false,
              temBotaoSalva: false,
              temBotaoVerifica: false,
              temBotaoNovo: false,

              podeVoltar: false,
              podeCancelar: false,
            },
            
          }
        },
        created() {
          console.log('CidadaoCadastra-create-I', this.pacienteId)          
          this.cidadeId = store.getters.cidadeId
          this.infoPesquisa.listasCarregadas = false
          console.log('CidadaoCadastra-create-F')          
        },
        mounted() {
          console.log('CidadaoCadastra-Mounted-I', this.pacienteId)      
          this.infoPaciente.id = this.pacienteId = (this.pacienteId == null) ? 0 : this.pacienteId
          
          if (this.infoPesquisa.listasCarregadas == false) {
            this.buscaDadosIniciais(this.pacienteId)
          } 
          console.log('CidadaoCadastra-Mounted-F', this.pacienteId)      
        },
        computed: {
          comorbidadesOrdenadas: function () {
            return this.infoPesquisa.allComorbidades.Sort(function(a, b) {a.ordem - b.ordem})
          },
          sintomasOrdenadas: function () {
            return this.infoPesquisa.allSintomas.Sort(function(a, b) {a.ordem - b.ordem})
          },
          iconePainel() {
            return  pos => (pos >= this.enumPaineis.comorbidades) ? 'mdi-alert-outline' : this.painelValido[pos] ? 'mdi-check' :  'mdi-alert-circle-outline'
          },
          corIconePainel() {
            return  pos => (pos >= this.enumPaineis.comorbidades) ? 'orange darken-2' : this.painelValido[pos] ? 'teal' : 'red'
          },
          podeVoltar() {
            return true
          },
          podeSalvar() {
            return this.painelValido[0] && this.painelValido[1] && this.painelValido[2] && this.painelValido[3];
          }
        },
        methods: {
          mensagemBusca (msg) {
            this.$emit('cbMensagemBusca', msg)
          },
          mensagemErro (msg) {
            this.$emit('cbMensagemErro', msg)
          },
          fimCadastro () {
            this.$emit('cbfimCadastro')
          },
          required(value) {
            if (value instanceof Array && value.length == 0) 
              return 'Required.'

            if (('id' in value) == false)
              return 'Required.'

            if (value.id == 0) 
              return 'Required.'

            return !!value || 'Required.';
          },
          async buscaDadosIniciais(pacienteId) {
            console.log('buscaDadosIniciais.promise.inicio')
            this.limpaDadosPaciente()

            this.mensagemBusca('Buscando sintomas! Aguarde...')
            console.log('buscaDadosIniciais.sintomas-I')
            let resp = await mainService.listaSintomas().catch (err => {this.mensagemErro(mainService.catchPadrao(err)); return;});
            console.log('buscaDadosIniciais.sintomas-f', resp.data)
            this.infoPesquisa.allSintomas = resp.status == 200 ? resp.data : []

            this.mensagemBusca('Buscando unidades de saude! Aguarde...')
            console.log('buscaDadosIniciais.US-I')
            resp = await mainService.listaUnidadesSaude(this.cidadeId, '').catch (err => {this.mensagemErro(mainService.catchPadrao(err)); return;});
            this.infoPesquisa.allUnidadesSaude = resp.status == 200 ? resp.data : []

            this.mensagemBusca('Buscando bairros! Aguarde...')
            console.log('buscaDadosIniciais.Bairros-I')
            resp = await mainService.listaBairros(this.cidadeId).catch (err => {this.mensagemErro(mainService.catchPadrao(err)); return;});
            console.log('buscaDadosIniciais.Bairros-F')
            this.infoPesquisa.allBairros = resp.status == 200 ? resp.data : []

            this.mensagemBusca('Buscando comorbidades! Aguarde...')
            console.log('buscaDadosIniciais.Comorbidades-I')
            resp = await mainService.listaComorbidades().catch(err => {this.mensagemErro(mainService.catchPadrao(err)); return;});
            this.infoPesquisa.allComorbidades = resp.status == 200 ? resp.data : []

            if (pacienteId != 0) {
              this.mensagemBusca('Buscando dados do paciente! Aguarde...')
              console.log('buscaDadosIniciais.Pacientes-I')
              resp = await mainService.listaPaciente(pacienteId).catch(err => {this.mensagemErro(mainService.catchPadrao(err)); return;});
              console.log('buscaDadosIniciais.Pacientes-F', resp)
              if (resp.status == 200) {
                const dadosPaciente = resp.data[0]
                console.log(dadosPaciente)
                this.setaInfoPaciente (dadosPaciente)
              }
  
              this.mensagemBusca('Buscando as comorbidades do Paciente! Aguarde...')
              console.log('buscaDadosIniciais.ComorbidadesPacientes-I')
              resp = await mainService.listaPacienteComorbidades(pacienteId)
              this.infoPaciente.comorbidades = resp.status == 200 ? resp.data : []

              this.mensagemBusca('Buscando os sintomas do Paciente! Aguarde...')
              console.log('buscaDadosIniciais.SintomasPacientes-I')
              resp = await mainService.listaPacienteSintomas(pacienteId).catch(err => {this.mensagemErro(mainService.catchPadrao(err)); return;});
              this.infoPaciente.sintomas = resp.status == 200 ? resp.data : []

              console.log('buscaDadosIniciais.listaLogradouros-I')
              this.mensagemBusca('Buscando logradouros! Aguarde...')
              resp = await mainService.listaLogradouros(this.infoPaciente.bairro.id).catch(err => {this.mensagemErro(mainService.catchPadrao(err)); return;});
              console.log('buscaDadosIniciais.listaLogradouros-f')
              this.infoPesquisa.logradouros = resp.status == 200 ? resp.data : []

              console.log('buscaDadosIniciais.listaMicroAreas-I')
              this.mensagemBusca('Buscando logradouros! Aguarde...')
              resp = await mainService.listaMicroAreas(this.infoPaciente.unidadeSaude.id).catch(err => {this.mensagemErro(mainService.catchPadrao(err)); return;});
              console.log('buscaDadosIniciais.listaMicroAreas-F')
              this.infoPesquisa.microAreas = resp.status == 200 ? resp.data : []

              
              console.log('this.infoPesquisa.sintomasTela', this.infoPesquisa.sintomasTela)
            } else {
              this.infoPesquisa.comorbidadesTela = rotinasPadrao.ordenaComorbidades(this.infoPesquisa.allComorbidades, this.infoPaciente.comorbidades)
              this.infoPesquisa.sintomasTela = rotinasPadrao.ordenaSintomas(this.infoPesquisa.allSintomas, this.infoPaciente.sintomas)
            }

            this.infoPesquisa.listasCarregadas = true
            this.mensagemBusca('')
            this.vaPara(this.etapaCadastro)
            console.log('buscaDadosIniciais.promise.fim')
          },
          limpaDadosPaciente() {
            console.log('limpaDadosPaciente-I')
            this.infoPaciente.nome = ''
            this.infoPaciente.cartaoSUS= ''
            this.infoPaciente.eMail= ''
            this.infoPaciente.celular= ''
            this.infoPaciente.celular2= ''
            this.infoPaciente.sexo= ''
            this.infoPaciente.semComorbidade= false
            this.infoPaciente.assintomatico= false
            this.infoPaciente.sintomas= []
            this.infoPaciente.comorbidades= []
            this.infoPaciente.unidadeSaude.id = 0
            this.infoPaciente.unidadeSaude.nome = ''
            this.infoPaciente.microArea.id = 0
            this.infoPaciente.microArea.nome = ''
            this.infoPaciente.bairro.id = 0
            this.infoPaciente.bairro.nome = ''
            this.infoPaciente.logradouro.id = 0
            this.infoPaciente.bairro.nome = ''
            this.infoPaciente.numeroEndereco = ''
            this.infoPaciente.semNumeroEndereco = false
            this.infoPaciente.complemento = ''
            this.infoPaciente.semComplemento = false
            console.log('limpaDadosPaciente-F')
          },
          cbClickBotao(val) {
            console.log('cbClickBotao', val)
            switch (val) {
              case 'VO':
                this.fimCadastro()
                break;
              case 'SV':
                if (this.etapaCadastro == this.enumEtapaCadastro.dadosCidadao )
                  this.salva()
                else
                  this.salvaOutros()
                break;
            }
          },
          /* REVISAR             */
          async salvaOutros() {
            console.log('salvaOutros-Fim')

            this.mensagemBusca('Salvando as Comorbidades. Aguarde...')
            let _comorbidades = []
            let resp = await mainService.salvaPacienteComorbidades(this.infoPaciente.id, _comorbidades).catch(err => {this.mensagemErro(mainService.catchPadrao(err)); return;});
            if (resp.status != 200) {
                this.mensagemErro(resp.message)
                return;
            }

            this.mensagemBusca('Salvando os Sintomas. Aguarde...')
            let _sintomas = []
            let _dataHoje = new Date()
            let _dataInicio = new Date()
            for (let i = 0;  i < this.infoPesquisa.sintomasTela.length; i++) {
              if (this.infoPesquisa.sintomasTela[i].selecionado) {
                let item = {}

                _dataInicio.setDate(_dataHoje.getDate() - this.infoPesquisa.sintomasTela[i].dias)
                item.id = this.infoPesquisa.sintomasTela[i].id
                item.dataInicio = formataValores.dataYYYYMMDD(_dataInicio)
                _sintomas.push (item)
              }
            }
            resp = await mainService.salvaPacienteSintomas(this.infoPaciente.id, _sintomas).catch(err => {this.mensagemErro(mainService.catchPadrao(err)); return;});
            if (resp.status != 200) {
                this.mensagemErro(resp.message)
                return;
            }
            this.vaPara(this.etapaCadastro = this.enumEtapaCadastro.proximoCidadao)
            this.mensagemBusca('')
            console.log('salvaOutros-Fim')
          },
          async salva() {
            this.mensagemBusca("Salvando dados do paciente. Aguarde...")
            let resp = await mainService.salvaPaciente(this.infoPaciente).catch(err => {this.mensagemErro(mainService.catchPadrao(err)); return;});
            if (resp.status != 200) {
                this.mensagemErro(resp.message)
                return;
            }

            this.mensagemBusca('Salvando as Comorbidades. Aguarde...')
            let _comorbidades = []
            for (let i = 0;  i < this.infoPesquisa.comorbidadesTela.length; i++) {
              if (this.infoPesquisa.comorbidadesTela[i].selecionado) {
                const item = {
                  id: this.infoPesquisa.comorbidadesTela[i].id
                }
                _comorbidades.push (item)
              }
            }
            resp = await mainService.salvaPacienteComorbidades(this.infoPaciente.id, _comorbidades).catch(err => {this.mensagemErro(mainService.catchPadrao(err)); return;});
            if (resp.status != 200) {
                this.mensagemErro(resp.message)
                return;
            }

            this.mensagemBusca('Salvando os Sintomas. Aguarde...')
            let _sintomas = []
            let _dataHoje = new Date()
            let _dataInicio = new Date()
            for (let i = 0;  i < this.infoPesquisa.sintomasTela.length; i++) {
              if (this.infoPesquisa.sintomasTela[i].selecionado) {
                let item = {}

                _dataInicio.setDate(_dataHoje.getDate() - this.infoPesquisa.sintomasTela[i].dias)
                item.id = this.infoPesquisa.sintomasTela[i].id
                item.dataInicio = formataValores.dataYYYYMMDD(_dataInicio)
                _sintomas.push (item)
              }
            }
            resp = await mainService.salvaPacienteSintomas(this.infoPaciente.id, _sintomas).catch(err => {this.mensagemErro(mainService.catchPadrao(err)); return;});
            if (resp.status != 200) {
                this.mensagemErro(resp.message)
                return;
            }


            
            this.etapaCadastro = this.enumEtapaCadastro.proximoCidadao
            this.vaPara(this.etapaCadastro)
            console.log('mainService.salvaPaciente', resp)

            this.mensagemBusca('')
            console.log('salva-Fim')

          },
          liberaSemNumero() {
            this.formularioValido = this.infoPaciente.semNumeroEndereco === true
          },
          liberaSemComplemento() {
            this.formularioValido = this.infoPaciente.semComplemento === true
          },
          async setaBairro(value) {
            this.infoPaciente.bairro.id = value.id;
            this.infoPaciente.logradouro.id = 0;
            this.infoPaciente.logradouro.nome = ''

            this.mensagemBusca("Aguarde... Buscando Logradouros")
            const resp = await mainService.listaLogradouros(this.infoPaciente.bairro.id)
            .catch(err => {mainService.catchPadrao(err); return})

            this.mensagemBusca('')
            if (resp.status == 200) {
              this.infoPesquisa.logradouros = resp.data;
            } else {
              this.mensagemErro=resp.message
            }
          },
          setaInfoPaciente (dadosPaciente) {
            this.infoPaciente.id = dadosPaciente.id
            this.infoPaciente.nome = dadosPaciente.nome
            this.infoPaciente.cartaoSUS = dadosPaciente.cartaoSUS
            this.infoPaciente.eMail = dadosPaciente.eMail 

            this.infoPaciente.unidadeSaude.id = dadosPaciente.unidadeSaudeId

            this.infoPaciente.semNumeroEndereco = (dadosPaciente.numeroEndereco == '') 
            this.infoPaciente.semComplemento = (dadosPaciente.complementoEndereco == '')
            this.infoPaciente.numeroEndereco = dadosPaciente.numeroEndereco
            this.infoPaciente.complemento = dadosPaciente.complementoEndereco
            this.infoPaciente.sexo = dadosPaciente.sexo

            this.infoPaciente.nomeunidadeSaude = ''

            this.infoPaciente.bairro.id = dadosPaciente.bairroId
            this.infoPaciente.bairro.nome = dadosPaciente.nomeBairro

            this.infoPaciente.logradouro.id = dadosPaciente.logradouroId
            this.infoPaciente.logradouro.nome = dadosPaciente.nomeLogradouro

            this.infoPaciente.microArea.id = dadosPaciente.microAreaId
            this.infoPaciente.microArea.nome = dadosPaciente.nomeMicroArea

            console.log('dadosPaciente.dataNascimento', dadosPaciente.dataNascimento)
            const _dataNascimento = dadosPaciente.dataNascimento.substring(0, 10)
            this.infoPaciente.dataNascimento = _dataNascimento.substring(8, 10) + '/' + _dataNascimento.substring(5, 7) + '/' + _dataNascimento.substring(0, 4)

            this.infoPaciente.celular = formataValores.celular(dadosPaciente.celular)
            if (dadosPaciente.celular2) 
              this.infoPaciente.celular2 = formataValores.celular(dadosPaciente.celular2)
            else 
              this.infoPaciente.celular2 = '' 
                            
            this.infoPaciente.cpf = formataValores.cpf(dadosPaciente.cpf)

            // Guarda a unidade de saude selecionadea
            this.infoPesquisa.allUnidadesSaude.forEach ((elemento) => {
              if (elemento.id == this.infoPaciente.unidadeSaude.id)
                this.infoPaciente.unidadeSaude.nome = elemento.nome
              }
            )
          },
          setaLogradouro(value) {
            this.infoPaciente.logradouro.id = value.id;
          },
          async setaUnidadeSaude(value) {
            this.infoPaciente.unidadeSaude.id = value.id;
            this.infoPaciente.microArea.id = 0;
            this.infoPaciente.microArea.nome = ''

            this.mensagemBusca('Aguarde... Buscando Micro Áreas')
            const resp = await mainService.listaMicroAreas(this.infoPaciente.unidadeSaude.id).catch(err => {mainService.catchPadrao(err); return;})
            this.mensagemBusca('')
            if (resp.status == 200) {
              this.infoPesquisa.microAreas = resp.data;
            } else {
              this.mensagemErro=resp.message
            }
          },
          vaPara(posicaoCadastro) {
            console.log('vaPara-inicio', posicaoCadastro)
            this.mensagemErro=''

            this.infoBotoes.temBotaoAnterior = false
            this.infoBotoes.temBotaoProximo = false
            this.infoBotoes.temBotaoCancela = false
            this.infoBotoes.temBotaoFinaliza = false
            this.infoBotoes.temBotaoSalva = false
            this.infoBotoes.temBotaoVerifica = false
            this.infoBotoes.temBotaoNovo = false

            switch (posicaoCadastro) {
              case this.enumEtapaCadastro.dadosCidadao:
                this.infoBotoes.podeVoltar = true
                this.infoBotoes.temBotaoAnterior = true
                this.infoBotoes.temBotaoSalva = true
                break

              case this.enumEtapaCadastro.proximoCidadao:
                this.infoBotoes.temBotaoFinaliza = this.infoBotoes.temBotaoNovo = true
                break

              case this.enumEtapaCadastro.outros:
                this.infoBotoes.podeVoltar = false
                this.infoBotoes.temBotaoAnterior = true
                this.infoBotoes.temBotaoSalva = true
                break
            } 
            this.etapaCadastro = posicaoCadastro;
            console.log('vaPara-fim', posicaoCadastro)
          }
        }
    }
</script>
<style scoped>
  .paragrafo1 {
    padding: 0px;
    margin: 0px;
  }
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
  .obs_campo {
    margin-top: 20px;
    color:green;
    font-size: 0.6rem;
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
  .right-input input {
    text-align: right
  }
</style>

