<template>
    <div>
    <v-stepper v-model="etapa">
      <v-stepper-header>
        <v-stepper-step step="1" :complete="etapa > 1">
          Identificação
        </v-stepper-step>
        <v-divider></v-divider>
        <v-stepper-step step="2" :complete="etapa > 2">
          Residência
        </v-stepper-step>
        <v-divider></v-divider>
        <v-stepper-step step="3" :complete="etapa > 3">
          Comorbidades
        </v-stepper-step>
        <v-divider></v-divider>
        <v-stepper-step step="4" :complete="etapa > 4">
          Sintomas
        </v-stepper-step>
      </v-stepper-header>
    </v-stepper>
  </div>
</template>
<script>
  export default {
    name: 'StepBar',
    props: {
        etapa: Number
    },
    data() {
      return {
      }
    }
  }
</script>npm run serve