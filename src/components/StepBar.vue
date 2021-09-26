<template>
    <v-flex>
      <v-stepper v-model="etapa">
        <v-stepper-header>
          <v-stepper-step step="1" :complete="etapa > 1">
            Identificação
          </v-stepper-step>
          <v-divider></v-divider>
          <v-stepper-step step="2" :complete="etapa > 2">
            Próximo Cidadão
          </v-stepper-step>
        </v-stepper-header>
      </v-stepper>
  </v-flex>
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
</script>