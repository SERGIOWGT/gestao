<template>
  <v-row v-if="mostra"
        class="mt-5 fill-height"
        align-content="center"
        justify="center"
      >
        <v-col
          class="text-subtitle-1 text-center"
          cols="12"
        >
        {{ mensagem }}
        </v-col>
        <v-col cols="5">
          <v-progress-linear
            color="dark green accent-4"
            indeterminate
            rounded
            height="7"
          ></v-progress-linear>
        </v-col>
      </v-row>
</template>
<script>
  export default {
    props: ['mensagem', 'mostra']
  }
</script>

