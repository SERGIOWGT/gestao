<template>
    <v-container class="pt-0 mt-0"> 
        <v-container fluid style="height: 100vmax;" class="pa-1 grey lighten-5">
            <!-- INICIO -->
            <v-card flat class="pa-0 mt-0">
                <v-row justify="center"><h4>Selecione os cidadãos em visitação</h4></v-row>
                <v-card-text class="mt-4 ma-0 pa-0">
                    <v-expansion-panels class="mt-5">
                        <v-expansion-panel>
                        <v-expansion-panel-header>
                            <template v-slot:default="{ open }">
                            <v-row no-gutters>
                                <v-col cols="4">
                                Nome do Cidadão
                                </v-col>
                                <v-col
                                cols="8"
                                class="text--secondary"
                                >
                                <v-fade-transition leave-absolute>
                                    <span
                                    v-if="open"
                                    key="0"
                                    >
                                    Informe o nome do cidadão
                                    </span>
                                    <span
                                    v-else
                                    key="1"
                                    >
                                    {{ trip.name }}
                                    </span>
                                </v-fade-transition>
                                </v-col>
                            </v-row>
                            </template>
                        </v-expansion-panel-header>
                        <v-expansion-panel-content>
                            <v-text-field
                            v-model="trip.name"
                            placeholder="Nome do Cidadão"
                            ></v-text-field>
                        </v-expansion-panel-content>
                        </v-expansion-panel>

                        <v-expansion-panel>
                        <v-expansion-panel-header v-slot="{ open }">
                            <v-row no-gutters>
                            <v-col cols="4">
                                Endereço
                            </v-col>
                            <v-col
                                cols="8"
                                class="text--secondary"
                            >
                                <v-fade-transition leave-absolute>
                                <span
                                    v-if="open"
                                    key="0"
                                >
                                    Select trip destination
                                </span>
                                <span
                                    v-else
                                    key="1"
                                >
                                    {{ trip.location }}
                                </span>
                                </v-fade-transition>
                            </v-col>
                            </v-row>
                        </v-expansion-panel-header>
                        <v-expansion-panel-content>
                            <v-row no-gutters>
                            <v-spacer></v-spacer>
                            <v-col cols="5">
                                <v-select
                                v-model="trip.location"
                                :items="locations"
                                chips
                                flat
                                solo
                                ></v-select>
                            </v-col>

                            <v-divider
                                vertical
                                class="mx-4"
                            ></v-divider>

                            <v-col cols="3">
                                Select your destination of choice
                                <br>
                            </v-col>
                            </v-row>
                            <v-card-actions>
                            <v-spacer></v-spacer>
                            <v-btn
                                text
                                color="secondary"
                            >
                                Cancel
                            </v-btn>
                            <v-btn
                                text
                                color="primary"
                            >
                                Pesquisar
                            </v-btn>
                            </v-card-actions>
                        </v-expansion-panel-content>
                        </v-expansion-panel>

                        <v-expansion-panel>
                        <v-expansion-panel-header v-slot="{ open }">
                            <v-row no-gutters>
                            <v-col cols="6">
                                Datas Inicial e Final de xxxxx
                            </v-col>
                            <v-col
                                cols="6"
                                class="text--secondary"
                            >
                                <v-fade-transition leave-absolute>
                                <span v-if="open">Qual periodo de?</span>
                                <v-row
                                    v-else
                                    no-gutters
                                    style="width: 100%"
                                >
                                    <v-col cols="6">
                                    Data Inicial: {{ trip.start || 'Not set' }}
                                    </v-col>
                                    <v-col cols="6">
                                    Data Final: {{ trip.end || 'Not set' }}
                                    </v-col>
                                </v-row>
                                </v-fade-transition>
                            </v-col>
                            </v-row>
                        </v-expansion-panel-header>
                        <v-expansion-panel-content>
                            <v-row
                            justify="space-around"
                            no-gutters
                            >
                            <v-col cols="3">
                                <v-menu
                                ref="startMenu"
                                :close-on-content-click="false"
                                :return-value.sync="trip.start"
                                offset-y
                                min-width="290px"
                                >
                                <template v-slot:activator="{ on, attrs }">
                                    <v-text-field
                                    v-model="trip.start"
                                    label="Data Inicial"
                                    prepend-icon="mdi-calendar"
                                    readonly
                                    v-bind="attrs"
                                    v-on="on"
                                    ></v-text-field>
                                </template>
                                <v-date-picker
                                    v-model="date"
                                    no-title
                                    scrollable
                                >
                                    <v-spacer></v-spacer>
                                    <v-btn
                                    text
                                    color="primary"
                                    @click="$refs.startMenu.isActive = false"
                                    >
                                    Cancel
                                    </v-btn>
                                    <v-btn
                                    text
                                    color="primary"
                                    @click="$refs.startMenu.save(date)"
                                    >
                                    OK
                                    </v-btn>
                                </v-date-picker>
                                </v-menu>
                            </v-col>

                            <v-col cols="3">
                                <v-menu
                                ref="endMenu"
                                :close-on-content-click="false"
                                :return-value.sync="trip.end"
                                offset-y
                                min-width="290px"
                                >
                                <template v-slot:activator="{ on, attrs }">
                                    <v-text-field
                                    v-model="trip.end"
                                    label="End date"
                                    prepend-icon="mdi-calendar"
                                    readonly
                                    v-bind="attrs"
                                    v-on="on"
                                    ></v-text-field>
                                </template>
                                <v-date-picker
                                    v-model="date"
                                    no-title
                                    scrollable
                                >
                                    <v-spacer></v-spacer>
                                    <v-btn
                                    text
                                    color="primary"
                                    @click="$refs.endMenu.isActive = false"
                                    >
                                    Cancel
                                    </v-btn>
                                    <v-btn
                                    text
                                    color="primary"
                                    @click="$refs.endMenu.save(date)"
                                    >
                                    OK
                                    </v-btn>
                                </v-date-picker>
                                </v-menu>
                            </v-col>
                            </v-row>
                        </v-expansion-panel-content>
                        </v-expansion-panel>
                    </v-expansion-panels>
                </v-card-text>
            </v-card>

<v-list three-line>
      <template v-for="(item, index) in items">
        <v-subheader
          v-if="item.header"
          :key="item.header"
          v-text="item.header"
        ></v-subheader>

        <v-divider
          v-else-if="item.divider"
          :key="index"
          :inset="item.inset"
        ></v-divider>

        <v-list-item
          v-else
          :key="item.title"
        >
          <v-list-item-avatar>
            <v-img :src="item.avatar"></v-img>
          </v-list-item-avatar>

          <v-list-item-content>
            <v-list-item-title v-html="item.title"></v-list-item-title>
            <v-list-item-subtitle v-html="item.subtitle"></v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
      </template>
    </v-list>

            <!-- Dfim -->
        </v-container>
    </v-container>
     <!-- <v-layout class="pa-0 ma-0 grey lighten-5" align-content-start justify-end row fill-height>
        <StepBar :etapa="1"/>
        <v-container class="pa-0">ccc
        </v-container>
    </v-layout> -->
</template>
<script>
    export default {
        name: 'SuspeitaCovid',
        components: {
        },
        data() {
          return {
                date: null,
                trip: {
                    name: '',
                    location: null,
                    start: null,
                    end: null,
                },
                locations: ['Australia', 'Barbados', 'Chile', 'Denmark', 'Ecuador', 'France'],
                items: [
        { header: 'Today' },
        {
          avatar: 'https://cdn.vuetifyjs.com/images/lists/1.jpg',
          title: 'Brunch this weekend?',
          subtitle: `<span class="text--primary">Ali Connors</span> &mdash; I'll be in your neighborhood doing errands this weekend. Do you want to hang out?`,
        },
        { divider: true, inset: true },
        {
          avatar: 'https://cdn.vuetifyjs.com/images/lists/2.jpg',
          title: 'Summer BBQ <span class="grey--text text--lighten-1">4</span>',
          subtitle: `<span class="text--primary">to Alex, Scott, Jennifer</span> &mdash; Wish I could come, but I'm out of town this weekend.`,
        },
        { divider: true, inset: true },
        {
          avatar: 'https://cdn.vuetifyjs.com/images/lists/3.jpg',
          title: 'Oui oui',
          subtitle: '<span class="text--primary">Sandra Adams</span> &mdash; Do you have Paris recommendations? Have you ever been?',
        },
        { divider: true, inset: true },
        {
          avatar: 'https://cdn.vuetifyjs.com/images/lists/4.jpg',
          title: 'Birthday gift',
          subtitle: '<span class="text--primary">Trevor Hansen</span> &mdash; Have any ideas about what we should get Heidi for her birthday?',
        },
        { divider: true, inset: true },
        {
          avatar: 'https://cdn.vuetifyjs.com/images/lists/5.jpg',
          title: 'Recipe to try',
          subtitle: '<span class="text--primary">Britta Holt</span> &mdash; We should eat this: Grate, Squash, Corn, and tomatillo Tacos.',
        },
        { divider: true, inset: true },
        {
          avatar: 'https://cdn.vuetifyjs.com/images/lists/5.jpg',
          title: 'Recipe to try',
          subtitle: '<span class="text--primary">Britta Holt</span> &mdash; We should eat this: Grate, Squash, Corn, and tomatillo Tacos.',
        },
        { divider: true, inset: true },
        {
          avatar: 'https://cdn.vuetifyjs.com/images/lists/5.jpg',
          title: 'Recipe to try',
          subtitle: '<span class="text--primary">Britta Holt</span> &mdash; We should eat this: Grate, Squash, Corn, and tomatillo Tacos.',
        },
        { divider: true, inset: true },
        {
          avatar: 'https://cdn.vuetifyjs.com/images/lists/5.jpg',
          title: 'Recipe to try',
          subtitle: '<span class="text--primary">Britta Holt</span> &mdash; We should eat this: Grate, Squash, Corn, and tomatillo Tacos.',
        },
      ],
            }
        }
    }
</script>
