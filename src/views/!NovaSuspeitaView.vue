<template>
  <v-container >
    <StepBar :etapa="etapaAtual.stepBar"/>
    <v-container fluid style="height: 100vmax;">
      <v-flex v-if="etapaAtual.posicao < numeroEtapas">
        <h4>{{etapaAtual.nome}}</h4>
          <display-1>{{etapaAtual.obs}}</display-1><br><body-2>{{etapaAtual.obs2}}</body-2>
        <v-card flat >
          <v-card-text class="ma-0 px-0">
            <v-row>
              <v-col cols="12">
                <v-combobox v-if="etapaAtual.posicao == 0"
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
                <v-combobox v-if="etapaAtual.posicao == 1"
                  v-model="select"
                  :items="bairros"
                  label="Bairro"
                  dense
                ></v-combobox>
                <v-combobox v-if="etapaAtual.posicao == 1"
                  v-model="select"
                  label="Nome da sua rua"
                  dense
                ></v-combobox>
                <v-text-field v-if="etapaAtual.posicao == 1"
                  label="Número do seu imóvel"
                  dense
                  required
                  clearable
                ></v-text-field>
                <v-text-field v-if="etapaAtual.posicao == 1"
                  label="Complemento do seu endereço"
                  dense
                  required
                  clearable
                ></v-text-field>
                <v-text-field v-if="etapaAtual.posicao == 2"
                  label="CPF"
                  dense
                  required
                  clearable
                ></v-text-field>
                <v-text-field v-if="etapaAtual.posicao == 2"
                  label="Nome"
                  dense
                  required
                  clearable
                ></v-text-field>
                <v-text-field v-if="etapaAtual.posicao == 2"
                  label="Data de Nascimento"
                  required
                  dense
                  clearable
                ></v-text-field>
                <v-text-field v-if="etapaAtual.posicao == 2"
                  label="Número do Sus"
                  dense
                  required
                  clearable
                ></v-text-field>
                <v-text-field v-if="etapaAtual.posicao == 2"
                  label="Email"
                  required
                  dense
                  clearable
                ></v-text-field>
                <v-text-field v-if="etapaAtual.posicao == 2"
                  label="Celular"
                  dense
                  required
                  clearable
                ></v-text-field>
                <div v-if="etapaAtual.posicao == 2">
                  <a ref="#">Dúvidas sobre o termo de confidencialidade</a>
                </div>
              </v-col>
              <v-list two-line v-if="etapaAtual.posicao == 3">
                 <template v-for="(item, index) in dbTurmaAlunos">
            <v-list-tile avatar ripple v-bind:key="index" @click="atualizaPresenca(item.CD_ALUNO, item.IN_PRESENCA)">
              <v-list-tile-content>
                <v-list-tile-title>{{ item.NO_ALUNO }} - {{ item.DE_IDADE}}</v-list-tile-title>
                <v-list-tile-sub-title class="grey--text text--darken-4">{{ item.NO_MAE }}</v-list-tile-sub-title>

                <v-list-tile-sub-title v-if="item.IN_TIPO_AULA == 'EX'" class="red--text">{{ item.DE_PRESENCA }}</v-list-tile-sub-title>
                <v-list-tile-sub-title v-else-if="item.IN_TIPO_AULA == 'RP'" class="green--text">{{ item.DE_PRESENCA }}</v-list-tile-sub-title>
                <v-list-tile-sub-title v-else>{{ item.DE_PRESENCA }}</v-list-tile-sub-title>

              </v-list-tile-content>
              <v-list-tile-action>
                <v-icon v-if="item.IN_PRESENCA == 'S'" color="green">face</v-icon>
                <v-icon v-else color="red">face</v-icon>
              </v-list-tile-action>
            </v-list-tile>
          </template>
              </v-list>
            </v-row>
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
        :botaoVolta="botaoVolta"
        :botaoContinua= "botaoContinua"
        :botaoCancela= "botaoCancela"
        :botaoFinaliza= "botaoFinaliza"
        @funcaoVolta= 'cmdVolta'
        @funcaoContinua = 'cmdContinua'
        @funcaoCancela= 'cmdCancela'
        @funcaoFinaliza = 'cmdFinaliza'
    />
  </v-container>
</template>
<script>
    import StepBar from '../components/StepBar';
    import BottomBar from '../components/StepBottomBar';

    export default {
        name: 'SuspeitaCovid',
        components: {
            StepBar, BottomBar
        },
        data() {
          return {
            sintomas: [ {nome: 'Dor de cabeça', tipo:'S'}, 
                        {nome: 'Dor de cabeça', tipo:'S'}, 
                        {nome: 'Dor de cabeça', tipo:'S'}, 
                        {nome: 'Dor de cabeça', tipo:'S'}, 
                        {nome: 'Dor de cabeça', tipo:'S'}
                      ],

            botaoVolta: true,
            botaoContinua: true,
            botaoCancela: false,
            botaoFinaliza: false,
            etapaAtual: {posicao: 0, nome: '', obs: '', obs2: '', stepBar: 0},
            etapas: [{stepBar: 1, nome: 'Qual cidade você reside?', obs: 'Bem vindo a nossa plataforma!!!', obs2: 'Primeiro precisamos saber qual cidade você reside.'},
                     {stepBar: 1, nome: 'Onde fica sua residência?', obs: 'Parabéns, seu municipio está muito preocupado com a COVID-19', obs2: 'Para melhorar nossas ações, precisamos saber onde você mora. '},
                     {stepBar: 2, nome: 'Agora seus dados pessoais', obs: 'Fique tranquilo seus dados são confidenciais e somente serão utilizados conforme nosso termo de confidencialidade.', obs2: ''},
                     {stepBar: 3, nome: 'Vamos aos Sintomas', obs: 'Calma! Essa é a última etapa, estamos quase no fim', obs2: 'Precisamos que informe os seus sintomas e desde quando você está sentindo.'},
            ],
            estados: [
              'Minas Gerais',
              'Rio de Janeiro',
              'Rio Grande do Sul',
              'São Paulo',
            ],
            municipios: [
              'Bicas',
              'Descoberto',
              'Guarará',
              'Mar de Espanha',
              'Maripá de Minas',
              'Pequeri',
              'Rochedo de Minas',
              'Senador Cortes',
              'São João Nepomuceno',
            ],
            bairros: [
              'Centro',
              'Bairro 1',
              'Bairro 2',
              'Bairro 3'
            ]
          }
        },
        created() {
          this.etapaAtual.posicao = 0;
          this.setaEtapaAtual(0);
          this.numeroEtapas = this.etapas.length;
        },

        methods: {
          setaEtapaAtual(posicao) {
            this.etapaAtual.stepBar = this.etapas[posicao].stepBar;
            this.etapaAtual.nome = this.etapas[posicao].nome;
            this.etapaAtual.obs = this.etapas[posicao].obs;
            this.etapaAtual.obs2 = this.etapas[posicao].obs2;
          },
          cmdVolta() {
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
          cmdContinua() {
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
              ++this.etapaAtual.posicao;
          }
        }
    }
</script>
<style scoped>
  @media(max-width: 2000px) {
    display-1 {font-size: 0.8rem}
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

