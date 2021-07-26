<template>
  <v-container fill-height>
    <v-row justify="center">
      <transition name="fade">
        <v-img
          class="shrink mr-2"
          contain
          src="../assets/logoTelaAbertura.jpeg"
          width="300"
          transition="scale-transition"
        />
      </transition>
    </v-row>
    <v-row>
      <v-row
        class="fill-height"
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
    </v-row> 
  </v-container>
</template>
<script>
  export default {
    props: ['mensagem', 'mostra']
  }
</script>