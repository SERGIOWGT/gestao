  <v-container  class="pt-0 mt-0"> 
    <StepBar :etapa="etapaAtual.stepBar"/>
    <v-container fluid style="height: 100vmax;" class="pa-1">
      <v-flex v-if="etapaAtual.posicao < numeroEtapas">
        <p class="text-h6">{{etapaAtual.nome}}</p> 
        <v-card flat class="pa-0 mt-0">
          <v-card-text class="ma-0 pa-0">
            <v-form ref="form" class="mx-2" v-model="formularioValido">
              <v-row>
                <v-col cols="12" class="px-2 pb-0 pt-0">
<!--            IDENTIFICACAO DO CIDADAO -->
                  <v-flex v-if="etapaAtual.posicao == enumCadastro.identificacaoCidadao" >
                    <p class="paragrafo1">
                      É através do <span class="nota_texto">CPF</span> e da <span class="nota_texto">Data de Nascimento</span> que identificamos o cidadão.
                      Preencha os campos abaixo e clique no <span class="nota_botao">botão consultar</span> logo abaixo.
                    </p>
                    <v-text-field class="pt-5 mt-4" @keypress="entradaCpf($event)"
                      dense
                      label="CPF"
                      persistent-hint
                      required
                      clearable
                      v-model="infoPaciente.cpf"
                      :rules="[regras.Basicas.obrigatorio(), regras.Cpf.valido()]"
                      counter
                      maxlength="14"
                    ></v-text-field>
                    <v-text-field class="pt-4" 
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
                      Caso esses dados não sejam do cidadão, você deve clicar no <span class="nota_botao">botão voltar</span> logo abaixo
                      e informar novamente os dados para identificação do cidadão. Caso seja o próprio cidadão, clique no <span class="nota_botao">botão continuar</span> logo abaixo e vamos atualizar os dados.
                    </p>
                  </v-flex>

<!--            DADOS CADASTRAIS -->                                    
                  <v-flex v-if="etapaAtual.posicao == enumCadastro.dadosCadastrais">
                    <p class="paragrafo1">
                      Além do <span class="nota_texto">CPF</span> e da <span class="nota_texto">Data de Nascimento</span> já informados, precisamos de outros dados cadastrais.
                      <br>
                      Preencha os campos abaixo e clique no <span class="nota_botao">botão continuar</span> logo abaixo.
                    </p>
                    <v-text-field class="mt-5 pt-2" 
                      dense
                      label="Nome Completo"
                      required
                      clearable
                      v-model="infoPaciente.nome"
                      :rules="[regras.Basicas.obrigatorio(), regras.Basicas.min(10), regras.Basicas.max(100)]"
                      counter
                      maxlength="100"
                    ></v-text-field>
                    <v-text-field class="pt-4" 
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
                    <v-radio-group dense v-model="infoPaciente.sexo" row required>
                      <v-col cols="6"><v-radio value="F" label="Feminino"></v-radio></v-col>
                      <v-col cols="6"><v-radio value="M" label="Masculino"></v-radio></v-col>
                    </v-radio-group>
<!--                     <p class="obs_campo mt-5">
                      (*) O número do SUS é composto por 15 números separados por espaço em branco. Exemplo do número SUS: 123 4567 8900 1234
                    </p> -->
                  </v-flex>
<!--            DADOS CONTATOS -->                                                      
                  <v-flex v-if="etapaAtual.posicao == enumCadastro.dadosContato">
                     <p class="paragrafo1">
                      Precisamos dos seus dados de contato abaixo e só utilizaremos caso seja necessário. 
                      Em caso de dúvidas, clique no nosso &nbsp;<a href="#">Termo de Confidencialidade</a>.
                    </p>
                    <v-text-field class="mt-5 pt-2"
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
                    <p class="obs_campo">(*) O campo celular aceita 8 ou 9 digitos mais o DDD que é obrigatório</p>
                  </v-flex>

<!--            UNIDADE DE SAUDE -->                                    
                  <v-flex v-if="etapaAtual.posicao == enumCadastro.unidadeSaude">
                    <p class="paragrafo1">
                      Informe a Unidade de Saúde e a Micro Região do cidadão.
                    </p>
                    <v-select @input="setaUnidadeSaude" class="mt-5 pt-2"
                      required
                      dense
                      label="Unidade de Saúde"
                      :items="infoPesquisa.unidadesSaude"
                      v-model="infoPaciente.unidadeSaude"
                      item-value="id"
                      item-text="nome"
                      return-object
                    ></v-select> 
                    <v-select class="pt-4"
                      dense
                      label="Micro Área"
                      :disabled="infoPaciente.unidadeSaude.id === 0 || infoPesquisa.unidadesSaude.length === 0 "
                      v-model="infoPaciente.microArea"
                      :items="infoPesquisa.microAreas"
                      item-value="id"
                      item-text="nome"
                      return-object
                    ></v-select>
                  </v-flex>

<!--            BAIRRO RESIDENCIA -->                                    
                  <v-flex v-if="etapaAtual.posicao == enumCadastro.bairroResidencia">
                    <p class="paragrafo1">
                      Essa informação também é muito importante para o nosso planejamento                     
                    </p>
                    <v-select class="mt-5 pt-2" @input="setaBairro"
                      required
                      dense
                      v-model="infoPaciente.bairro"
                      label="Bairro"
                      :items="infoPesquisa.bairros"
                      item-value="id"
                      item-text="nome"
                      return-object
                    ></v-select> 
                    <v-select class="mt-5"
                      dense
                      label="Nome da rua"
                      :disabled="infoPaciente.bairro.id === 0 || infoPesquisa.bairros.length === 0 "
                      v-model="infoPaciente.logradouro"
                      :items="infoPesquisa.logradouros"
                      item-value="id"
                      item-text="nome"
                      return-object
                    ></v-select>
                  </v-flex>
<!--            ENDERECO -->                                    
                  <v-flex v-if="etapaAtual.posicao == enumCadastro.endereco">
                    <p class="paragrafo1">
                      Essa informação também é muito importante para o nosso planejamento e acompanhamento domiciliar
                    </p>
                    <v-text-field class="mt-5 pt-2"
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
                    <v-flex v-if="(infoPaciente.id == 0) || (infoPaciente.comorbidades.length == 0)">
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
                     <v-flex v-else>
                      <p>
                        Os dados cadastrais e de contato foram salvos com sucesso. Agora precisamos atualizar as <span class="nota_texto">doenças crônicas</span>, também chamadas de <span class="nota_texto">comorbidades</span>, do cidadão. 
                      </p>
                    </v-flex>
                  </v-flex>

<!--            CADASTRA COMORBIDADES -->               
                  <v-flex v-if="etapaAtual.posicao == enumCadastro.comorbidades" >
                    <p>
                      Marque as doenças crônicas que o cidadão possui. 
                    </p>
                      <v-container class = "pa-0 ma-0" v-for="(item, index) in infoPesquisa.comorbidades" :key="item.id" >
                          <v-switch class="py-1 ma-0"  v-model="infoPesquisa.comorbidades[index].selecionado" 
                          v-if="(index >= (infoPesquisa.numeroMaximoCheckBoxes * (etapas[etapaAtual.posicao].subEtapaAtual-1))) && (index < (infoPesquisa.numeroMaximoCheckBoxes * (etapas[etapaAtual.posicao].subEtapaAtual))) "> 
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
                      Agora que as <span class="nota_texto">doenças crônicas (comorbidades)</span> foram informadas, precisamos salvar essas informações.
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
                    <v-flex v-if="(infoPaciente.id == 0) || (infoPaciente.sintomas.length == 0)">
                      <p> Agora precisamos cadastrar as seus sintomas atuais. </p>
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
                    <v-flex v-else>
                      <p> Agora precisamos que os seus sintomas sejam atualizados. </p> 
                    </v-flex>
                  </v-flex>

<!--            CADASTRA SINTOMAS --> 
                  <v-flex v-if="etapaAtual.posicao == enumCadastro.sintomas" >
                    <v-container class="pa-0 my-0" v-for="(item, index) in infoPesquisa.sintomas" :key="item.id" >
                      <v-row class="pa-1"  v-if="(index >= (infoPesquisa.numeroMaximoCheckBoxes * (etapas[etapaAtual.posicao].subEtapaAtual-1))) && (index < (infoPesquisa.numeroMaximoCheckBoxes * (etapas[etapaAtual.posicao].subEtapaAtual))) "> 
                        <v-col cols="10"> 
                          <v-switch class="pa-0 mt-0"  v-model="infoPesquisa.sintomas[index].selecionado" >
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
                              v-model="infoPesquisa.sintomas[index].dias"
                              v-if="infoPesquisa.sintomas[index].selecionado == true"
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
                      Agora que os <span class="nota_texto">sintomas</span> foram informadas, precisamos salvar essas informações.
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
        :temBotaoAnterior="infoBotoes.temBotaoAnterior"
        :temBotaoProximo= "infoBotoes.temBotaoProximo"
        :temBotaoCancela= "infoBotoes.temBotaoCancela"
        :temBotaoFinaliza= "infoBotoes.temBotaoFinaliza"
        :temBotaoSalva= "infoBotoes.temBotaoSalva"
        :temBotaoVerifica= "infoBotoes.temBotaoVerifica"
        :temBotaoNovo= "infoBotoes.temBotaoNovo"
        :podeVoltar="infoBotoes.podeVoltar"
        :podeContinuar= "podeContinuar"
        :podeCancelar= "infoBotoes.podeCancelar"
        :podeVerificar= "infoBotoes.podeVerificar"
        :carregando="infoBotoes.carregandoDados"
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
            regras: regrasCampos,

            // dados
            enumCadastro: {
              identificacaoCidadao: 0,
              confirmaIdentificacao: 1,
              dadosCadastrais: 2,
              dadosContato: 3,
              unidadeSaude: 4,
              bairroResidencia: 5,
              endereco: 6,
              salvaDadosPaciente: 7,
              inicioComorbidades: 8,
              comorbidades: 9,
              salvaComorbidades: 10,
              inicioSintomas: 11,
              sintomas: 12,
              salvaSintomas: 13,
              proximoPaciente: 14
            },


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
              sexo: '',
              mesmaResidencia: false,
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
              microArea: {
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
            
            numeroEtapas: 0,
            etapaAtual: {posicao: 0, nome: '', stepBar: 0},
            etapas: [ {stepBar: 1, nome: 'Identificação do Cidadão', totalSubEtapas: 0, subEtapaAtual: 0},
                      {stepBar: 1, nome: 'Confirma identificação do Cidadão', totalSubEtapas: 0, subEtapaAtual: 0},
                      {stepBar: 2, nome: 'Dados cadastrais', totalSubEtapas: 0, subEtapaAtual: 0},            
                      {stepBar: 2, nome: 'Dados de Contato', totalSubEtapas: 0, subEtapaAtual: 0},          
                      {stepBar: 2, nome: 'Unidade de saúde', totalSubEtapas: 0, subEtapaAtual: 0},          
                      {stepBar: 2, nome: 'Onde reside o Cidadão', totalSubEtapas: 0, subEtapaAtual: 0},
                      {stepBar: 2, nome: 'Identificação da residência', totalSubEtapas: 0, subEtapaAtual: 0},
                      {stepBar: 2, nome: 'Salvando os dados do Cidadão', totalSubEtapas: 0, subEtapaAtual: 0},                      
                      {stepBar: 3, nome: 'Como anda sua saúde?', totalSubEtapas: 0, subEtapaAtual: 0},
                      {stepBar: 3, nome: 'Doenças Crônicas', totalSubEtapas: 0, subEtapaAtual: 0},
                      {stepBar: 3, nome: 'Salvando as doenças crônicas', totalSubEtapas: 0, subEtapaAtual: 0},                      
                      {stepBar: 4, nome: 'Quais são os sintomas atualmente?', totalSubEtapas: 0, subEtapaAtual: 0},
                      {stepBar: 4, nome: 'Sintomas atuais', totalSubEtapas: 0, subEtapaAtual: 0},
                      {stepBar: 4, nome: 'Salvando os Sintomas Atuais', totalSubEtapas: 0, subEtapaAtual: 0}                     ,
                      {stepBar: 5, nome: 'Fim do cadastro', totalSubEtapas: 0, subEtapaAtual: 0}                     
            ],

            infoPesquisa: {
              numeroMaximoCheckBoxes: 6,
              listasCarregadas: false,
              sintomasOriginal: [],
              comorbidadesOriginal: [],
              sintomas: [],
              comorbidades: [],
              bairros: [],
              logradouros: [],
              unidadesSaude: [],
              microAreas: []
            }
          }
        },
        created() {
          console.log('created')
          this.infoPesquisa.listasCarregadas = false
          this.etapaAtual.posicao = -1
          this.numeroEtapas = this.etapas.length

          this.novoMonitorado(false)
        },
        mounted() {
          console.log('mounted', 'this.infoPesquisa.listasCarregadas', this.infoPesquisa.listasCarregadas)
          if (this.infoPesquisa.listasCarregadas == false) {
            this.etapaAtual.posicao = -1
            this.buscaDadosIniciais()
          } else {
            this.vaPara(this.enumCadastro.identificacaoCidadao)
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
              case this.enumCadastro.dadosCadastrais:
                _retorno = this.formularioValido && (this.infoPaciente.sexo == 'M' || this.infoPaciente.sexo == 'F')
                break;

              case this.enumCadastro.unidadeSaude:
                _retorno = (this.infoPaciente.unidadeSaude.id !=0) && (this.infoPaciente.microArea.id !=0) 
                break;

              case this.enumCadastro.bairroResidencia:
                _retorno = (this.infoPaciente.bairro.id !=0) && (this.infoPaciente.logradouro.id != 0)
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
          comorbidadesOrdenadas: function () {
            return this.infoPesquisa.comorbidades.Sort(function(a, b) {a.ordem - b.ordem})
          },
          sintomasOrdenadas: function () {
            return this.infoPesquisa.sintomas.Sort(function(a, b) {a.ordem - b.ordem})
          },
        },
        methods: {
          buscaDadosIniciais() {
            console.log('buscaDadosIniciais.promise.inicio')
            this.mensagemBusca = 'Buscando alguns dados! Aguarde...'
            this.infoBotoes.carregandoDados = true;
            Promise.all([
              mainService.listaUnidadesSaude(this.cidadeId),
              mainService.listaBairros(this.cidadeId),
              mainService.listaSintomas(),
              mainService.listaComorbidades()   
            ]).then(([_UnidadeSaude, _Bairro, _Sintoma, _Comorbidade]) => {

              console.log('buscaDadosIniciais.promise.then')
              this.mensagemBusca = ''
              this.infoBotoes.carregandoDados = false;
              if (_UnidadeSaude.status == 200)  
                this.infoPesquisa.unidadesSaude = _UnidadeSaude.data

              if (_Bairro.status == 200)  
                this.infoPesquisa.bairros = _Bairro.data
             
              if (_Sintoma.status == 200) {
                this.infoPesquisa.sintomas = []
                this.infoPesquisa.sintomasOriginal = []
                for (let i=0; i < _Sintoma.data.length; ++i) {
                  let _elemAux = {}
                  _elemAux.id = _Sintoma.data[i].id
                  _elemAux.nome = _Sintoma.data[i].nome
                  _elemAux.selecionado = false
                  _elemAux.dias = 0
                  _elemAux.ordem = 1000+i
                  this.infoPesquisa.sintomas.push(_elemAux)
                  this.infoPesquisa.sintomasOriginal.push(_elemAux)
                }
                this.etapas[this.enumCadastro.sintomas].totalSubEtapas = Math.ceil(_Sintoma.data.length / this.infoPesquisa.numeroMaximoCheckBoxes)
                this.etapas[this.enumCadastro.sintomas].subEtapaAtual = 1
              }
               
              if (_Comorbidade.status == 200) {
                this.infoPesquisa.comorbidades = [] 
                this.infoPesquisa.comorbidadesOriginal = [] 
                for (let i=0; i < _Comorbidade.data.length; ++i) {
                  let _elemAux = {}
                  _elemAux.id = _Comorbidade.data[i].id
                  _elemAux.nome = _Comorbidade.data[i].nome
                  _elemAux.selecionado = false
                  _elemAux.ordem = 1000+i
                  this.infoPesquisa.comorbidades.push(_elemAux)
                  this.infoPesquisa.comorbidadesOriginal.push(_elemAux)
                }
                this.etapas[this.enumCadastro.comorbidades].totalSubEtapas = Math.ceil(_Comorbidade.data.length / this.infoPesquisa.numeroMaximoCheckBoxes)
                this.etapas[this.enumCadastro.comorbidades].subEtapaAtual = 1
              }
              this.listasCarregadas = true
              this.vaPara(this.enumCadastro.identificacaoCidadao);
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
                this.fim()
                break;
              case 'NP':
                this.novoMonitorado(true)
                this.vaPara(this.enumCadastro.identificacaoCidadao)
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
            else if ((this.etapaAtual.posicao == this.enumCadastro.salvaDadosPaciente) && (this.infoPaciente.mesmaResidencia == true)) {
              this.vaPara(this.enumCadastro.dadosContato)
            }
            else if (this.etapaAtual.posicao == this.enumCadastro.identificacaoCidadao) {
              this.fim()
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
            this.fim()
          },
          cmdProximo() {
            console.log('cmdProximo-Inicio', this.etapaAtual.posicao, this.etapas[this.etapaAtual.posicao].nome, this.etapas[this.etapaAtual.posicao].totalSubEtapas, this.etapas[this.etapaAtual.posicao].subEtapaAtual, this.infoPaciente.semComorbidade)
            if ((this.etapaAtual.posicao == this.enumCadastro.inicioComorbidades) && (this.infoPaciente.semComorbidade == true)) {
              this.vaPara(this.enumCadastro.salvaComorbidades)
            } 
            else if ((this.etapaAtual.posicao == this.enumCadastro.inicioSintomas) && (this.infoPaciente.assintomatico == true)) {
              this.vaPara(this.enumCadastro.salvaSintomas)
            }
            else if ((this.etapaAtual.posicao == this.enumCadastro.dadosContato) && (this.infoPaciente.mesmaResidencia == true)) {
              this.vaPara(this.enumCadastro.salvaDadosPaciente)
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
          fim() {
            this.$router.push('/home');
          },
          liberaSemNumero() {
            this.formularioValido = this.infoPaciente.semNumeroEndereco === true
          },
          liberaSemComplemento() {
            this.formularioValido = this.infoPaciente.semComplemento === true
          },
          reiniciaVetores() {
            this.infoPesquisa.comorbidades = []
            this.infoPesquisa.sintomas = []

            this.infoPesquisa.comorbidadesOriginal.forEach((item) => {
              item.selecionado = false
              this.infoPesquisa.comorbidades.push(item)
            })

            this.infoPesquisa.sintomasOriginal.forEach((item) => {
              item.selecionado = false
              item.dias = 0
              this.infoPesquisa.sintomas.push(item)
            })
            this.etapas.forEach(function(item) {
              item.subEtapaAtual = false
            })
          },
          setaInfoPaciente (pacienteId, dadosPaciente) {
            this.infoPaciente.id = pacienteId
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

            this.infoPaciente.dataNascimento = dadosPaciente.dataNascimento.substring(0, 10)

            this.infoPaciente.celular = formataValores.celular(dadosPaciente.celular)
            if (dadosPaciente.celular2) 
              this.infoPaciente.celular2 = formataValores.celular(dadosPaciente.celular2)
            else 
              this.infoPaciente.celular2 = '' 
                            
            this.infoPaciente.cpf = formataValores.cpf(dadosPaciente.cpf)

            // Guarda a unidade de saude selecionadea
            this.infoPesquisa.unidadesSaude.forEach ((elemento) => {
            if (elemento.id == this.infoPaciente.unidadeSaude.id)
              this.infoPaciente.unidadeSaude.nome = elemento.nome
            })
          },
          listaPaciente(pacienteId) {
            console.log('listaPaciente-Entrei ==> [PacienteId', pacienteId, ']')

            Promise.all([
              mainService.listaPaciente(pacienteId),
              mainService.listaPacienteComorbidades(pacienteId),
              mainService.listaPacienteSintomas(pacienteId),
            ]).then(([_paciente, _pacienteComorbidades, _pacienteSintomas]) => {
              console.log('listaPaciente-then', _paciente, _pacienteComorbidades,_pacienteSintomas)
              if (_paciente.status == 200) {
                this.setaInfoPaciente(pacienteId, _paciente.data[0])
              } else {
                console.log('Erro', _paciente.message)
                this.mensagemErro = _paciente.message
              }

              this.infoPesquisa.comorbidades = []
              if (_pacienteComorbidades.status == 200) {
                let _posAchou = -1
                this.infoPaciente.comorbidades = _pacienteComorbidades.data

                // acha os elementos e joga o indice no vetor posicoes
                let _posicoes = [];
                for (let i=0; i < this.infoPaciente.comorbidades.length; ++i) {
                   _posAchou = -1
                  for (let j=0; j < this.infoPesquisa.comorbidadesOriginal.length; ++j) {
                    if (this.infoPaciente.comorbidades[i].id == this.infoPesquisa.comorbidadesOriginal[j].id) {
                      _posAchou = j
                      break
                    }
                  }
                  if (_posAchou != -1) {
                    _posicoes.push(_posAchou)
                  }
                }

                // Percorre todo o vetor de comorbidades
                for (let j=0; j < _posicoes.length; ++j) {
                  let _item = {}
                  let _posicao = _posicoes[j]

                  _item.id = this.infoPesquisa.comorbidadesOriginal[_posicao].id
                  _item.nome = this.infoPesquisa.comorbidadesOriginal[_posicao].nome
                  _item.dataInicio = null
                  _item.selecionado = true
                  this.infoPesquisa.comorbidades.push(_item)
                }

                for (let j=0; j < this.infoPesquisa.comorbidadesOriginal.length; ++j) {
                  if (!_posicoes.includes(j)) {
                    let _item = {}

                    _item.id = this.infoPesquisa.comorbidadesOriginal[j].id
                    _item.nome = this.infoPesquisa.comorbidadesOriginal[j].nome
                    _item.selecionado = false
                    _item.dataInicio = null

                    this.infoPesquisa.comorbidades.push(_item)
                  }
                }
              } else {
                this.infoBotoes.carregandoDados = false
                console.log('Erro', _paciente.message)
                this.mensagemErro = _paciente.message
                return
              }

              this.infoPesquisa.sintomas = []
              if (_pacienteSintomas.status == 200) {
                let _dataHoje = new Date()
                let _posAchou = -1
                this.infoPaciente.sintomas = _pacienteSintomas.data

                // acha os elementos e joga o indice no vetor posicoes
                let _posicoes = [];
                for (let i=0; i < this.infoPaciente.sintomas.length; ++i) {
                   _posAchou = -1
                  for (let j=0; j < this.infoPesquisa.sintomasOriginal.length; ++j) {
                    if (this.infoPaciente.sintomas[i].id == this.infoPesquisa.sintomasOriginal[j].id) {
                      _posAchou = j
                      break
                    }
                  }
                  if (_posAchou != -1) {
                    _posicoes.push(_posAchou)
                  }
                }
                
                // Percorre todo o vetor de comorbidades
                for (let j=0; j < _posicoes.length; ++j) {
                  let _item = {}
                  let _posicao = _posicoes[j]
                  let _dataSintoma = new Date(this.infoPaciente.sintomas[j].dataInicio)

                  _item.id = this.infoPesquisa.sintomasOriginal[_posicao].id
                  _item.nome = this.infoPesquisa.sintomasOriginal[_posicao].nome
                  _item.dias = parseInt((_dataHoje - _dataSintoma) / (1000 * 60 * 60 * 24), 10); 
                  _item.selecionado = true
                  this.infoPesquisa.sintomas.push(_item)
                }

                for (let j=0; j < this.infoPesquisa.sintomasOriginal.length; ++j) {
                  if (!_posicoes.includes(j)) {
                    let _item = {}

                    _item.id = this.infoPesquisa.sintomasOriginal[j].id
                    _item.nome = this.infoPesquisa.sintomasOriginal[j].nome
                    _item.selecionado = false
                    _item.dias = 0

                    this.infoPesquisa.sintomas.push(_item)
                  }
                }
              } else {
                this.infoBotoes.carregandoDados = false
                console.log('Erro', _paciente.message)
                this.mensagemErro = _paciente.message
                return
              }
              this.listaCombosPaciente()
            })
          },
          salvaComorbidades() {
            console.log('salvaComorbidades-Inicio')
            let _comorbidades = []
            for (let i = 0;  i < this.infoPesquisa.comorbidades.length; i++) {
              if (this.infoPesquisa.comorbidades[i].selecionado) {
                let item = {}
                item.id = this.infoPesquisa.comorbidades[i].id
                item.dataInicio = this.infoPesquisa.comorbidades[i].dataInicio
                _comorbidades.push (item)
              }
            }

            this.mensagemBusca = "Aguarde... Salvando as Comorbidades"
            this.infoBotoes.carregandoDados = true
            mainService.salvaPacienteComorbidades(this.infoPaciente.id, _comorbidades).then(resposta => {
              console.log('salvaPacienteComorbidades', '.then', resposta)
              this.infoBotoes.carregandoDados = false
                this.mensagemBusca = ""
                if (resposta.status == 200) {
                  this.vaPara(this.enumCadastro.inicioSintomas)
                } else {
                  console.log('Erro', resposta.message)
                  this.mensagemErro = resposta.message
                }
              })
              .catch(response => {
                this.infoBotoes.carregandoDados = false
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
          novoMonitorado(mesmaResidencia) {
              this.infoPaciente.id = 0
              this.infoPaciente.nome = ''
              this.infoPaciente.cpf = ''
              this.infoPaciente.dataNascimento= ''
              this.infoPaciente.cartaoSUS= ''
              this.infoPaciente.eMail= ''
              this.infoPaciente.celular= ''
              this.infoPaciente.celular2= ''
              this.infoPaciente.sexo= ''
              this.infoPaciente.semComorbidade= false
              this.infoPaciente.assintomatico= false
              this.infoPaciente.sintomas= []
              this.infoPaciente.comorbidades= []
              this.infoPaciente.mesmaResidencia = mesmaResidencia

              if (this.infoPaciente.mesmaResidencia == false) {
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
              }
              this.reiniciaVetores()
          },
          salvaPaciente() {
            this.mensagemBusca = "Aguarde..."
            this.infoBotoes.carregandoDados = true
            mainService.salvaPaciente(this.infoPaciente).then(resposta => {
              this.infoBotoes.carregandoDados = false
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
                this.infoBotoes.carregandoDados = false
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
            let _dataHoje = new Date()
            let _dataInicio = new Date()
            for (let i = 0;  i < this.infoPesquisa.sintomas.length; i++) {
              if (this.infoPesquisa.sintomas[i].selecionado) {
                let item = {}

                _dataInicio.setDate(_dataHoje.getDate() - this.infoPesquisa.sintomas[i].dias)
                item.id = this.infoPesquisa.sintomas[i].id
                item.dataInicio = formataValores.dataYYYYMMDD(_dataInicio)
                _sintomas.push (item)
              }
            }

            // Não há sintomas
            if (_sintomas.lenght == 0) {
              this.message.mensagemErro = 'Nenhum sintoma foi selecionado. [erroId=01.001.001]'
              return
            } 
            this.mensagemBusca = "Aguarde... Salvando os Sintomas"
            this.infoBotoes.carregandoDados = true
            mainService.salvaPacienteSintomas(this.infoPaciente.id, _sintomas).then(resposta => {
              console.log('salvaPacienteSintomas', '.then', resposta)
              this.infoBotoes.carregandoDados = false
                this.mensagemBusca = ""
                if (resposta.status == 200) {
                  this.vaPara(this.enumCadastro.proximoPaciente)
                } else {
                  console.log('Erro', resposta.message)
                  this.mensagemErro = resposta.message
                }
              })
              .catch(response => {
                this.infoBotoes.carregandoDados = false
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
            this.infoPaciente.bairro.id = value.id;
            this.infoPaciente.logradouro.id = 0;
            this.infoPaciente.logradouro.nome = ''

            this.infoBotoes.carregandoDados = true
            mainService.listaLogradouros(this.infoPaciente.bairro.id).then(resposta => {
              this.infoBotoes.carregandoDados = false
              if (resposta.status == 200) {
                this.infoPesquisa.logradouros = resposta.data;
              } else {
                console.log('Erro', resposta.message)
                this.mensagemErro = resposta.message
              }
            })
          },
          setaLogradouro(value) {
            this.infoPaciente.logradouro.id = value.id;
          },
          listaCombosPaciente() {
            console.log('listaCombosPaciente')
            Promise.all([
              mainService.listaMicroAreas(this.infoPaciente.unidadeSaude.id),
              mainService.listaLogradouros(this.infoPaciente.bairro.id)
            ]).then(([_microAreas, _logradouros]) => {
              console.log('listaCombosPaciente-then')
              
              this.vaPara(this.enumCadastro.confirmaIdentificacao)
              this.infoBotoes.carregandoDados = false
              if (_microAreas.status == 200) {
                this.infoPesquisa.microAreas = _microAreas.data;
              } else {
                console.log('Erro', _microAreas.message)
                this.mensagemErro = _microAreas.message
              }
              if (_logradouros.status == 200) {
                this.infoPesquisa.logradouros = _logradouros.data;
              } else {
                console.log('Erro', _logradouros.message)
                this.mensagemErro = _logradouros.message
              }
              this.vaPara(this.enumCadastro.confirmaIdentificacao)
            })
          },
          setaUnidadeSaude(value) {
            console.log('setaUnidadeSaude.inicio')
            this.infoPaciente.unidadeSaude.id = value.id;
            this.infoBotoes.carregandoDados = true
            this.infoPaciente.microArea.id = 0;
            this.infoPaciente.microArea.nome = ''

            mainService.listaMicroAreas(this.infoPaciente.unidadeSaude.id).then(resposta => {
              console.log('setaUnidadeSaude.then')
              this.infoBotoes.carregandoDados = false
              if (resposta.status == 200) {
                this.infoPesquisa.microAreas = resposta.data;
              } else {
                console.log('Erro', resposta.message)
                this.mensagemErro = resposta.message
              }
            })
          },
          vaPara(posicaoCadastro) {
            this.mensagemErro = ''
            this.mensagemBusca = ''

            this.infoBotoes.temBotaoAnterior = false
            this.infoBotoes.temBotaoProximo = false
            this.infoBotoes.temBotaoCancela = false
            this.infoBotoes.temBotaoFinaliza = false
            this.infoBotoes.temBotaoSalva = false
            this.infoBotoes.temBotaoVerifica = false
            this.infoBotoes.temBotaoNovo = false

            switch (posicaoCadastro) {
              case this.enumCadastro.identificacaoCidadao: 
                this.infoBotoes.podeVoltar = true
                this.infoBotoes.temBotaoAnterior = true
                this.infoBotoes.temBotaoVerifica = true
                break;
              case this.enumCadastro.confirmaIdentificacao:
              case this.enumCadastro.dadosCadastrais:
              case this.enumCadastro.dadosContato:
              case this.enumCadastro.unidadeSaude:
              case this.enumCadastro.bairroResidencia:
              case this.enumCadastro.endereco:
              case this.enumCadastro.comorbidades:
              case this.enumCadastro.sintomas:
                this.infoBotoes.podeVoltar = true
                this.infoBotoes.temBotaoAnterior = this.infoBotoes.temBotaoProximo = true
                break
              case this.enumCadastro.proximoPaciente:
                this.infoBotoes.temBotaoFinaliza = this.infoBotoes.temBotaoNovo = true
                break
              case this.enumCadastro.salvaDadosPaciente:
              case this.enumCadastro.salvaComorbidades:
              case this.enumCadastro.salvaSintomas:
                this.infoBotoes.podeVoltar = true
                this.infoBotoes.temBotaoAnterior = true;
                this.infoBotoes.temBotaoSalva = true;
                break

              case this.enumCadastro.inicioComorbidades: 
              case this.enumCadastro.inicioSintomas: 
                this.infoBotoes.podeVoltar = false
                this.infoBotoes.temBotaoAnterior = true
                this.infoBotoes.temBotaoProximo = true
                break;

            } 
            this.etapaAtual.posicao = posicaoCadastro;
            this.etapaAtual.stepBar = this.etapas[this.etapaAtual.posicao].stepBar;
            this.etapaAtual.nome = this.etapas[this.etapaAtual.posicao].nome;
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
            this.mensagemBusca = 'Consultando dados do cidadão! Aguarde...'
            this.infoBotoes.carregandoDados = true
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
                  this.infoBotoes.carregandoDados = false
                  this.infoPaciente.id = 0
                  this.vaPara(this.enumCadastro.dadosCadastrais)
                }
              } else {
                console.log('Erro', resposta.message)
                this.mensagemErro = resposta.message
              }
            })
            .catch(response => {
                this.infoBotoes.carregandoDados = false
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
</style>

