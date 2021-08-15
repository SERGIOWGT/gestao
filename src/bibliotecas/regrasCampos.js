export default {
    Basicas: {
      obrigatorio() {
        return v => !!v || 'Campo obrigatório'
      },
/*       meioObrigatorio(obrigatorio) {
        if (obrigatorio)
            return v => !!v || 'Campo obrigatório'  
        else 
            return v =>  !v || 'Campo obrigatório'  
      }, */
      max(tamanhoMaximo){
        return v => (v || '').length <= tamanhoMaximo || `Até ${tamanhoMaximo} caracteres`;
      },
      min(tamanhoMinimo){
        return v => (v || '').length >= tamanhoMinimo || `Pelo menos ${tamanhoMinimo} caracteres`;
      },
    },
    Cpf: {
      valido() {
        //return v => /^[0-9]{3}\.[0-9]{3}\.[0-9]{3}\-[0-9]{2}$/.test(v) || 'Use o formato (xxx.xxx.xxx-xx)'  // eslint-disable-line
        return v => /^[0-9]{3}[\.]?[0-9]{3}[\.]?[0-9]{3}[\-]?[0-9]{2}$/.test(v) || 'Use o formato (xxx.xxx.xxx-xx)'  // eslint-disable-line
      }
    }, 
    NumeroSus: {
      valido(obrigatorio) {
        if (obrigatorio)
            return v =>  /^[0-9]{3}[ ]?[0-9]{4}[ ]?[0-9]{4}[ ]?[0-9]{4}$/.test(v) || 'Campo com 18 números (999 9999 9999 9999)'  // eslint-disable-line
        else 
            return v =>  !v || /^[0-9]{3}[ ]?[0-9]{4}[ ]?[0-9]{4}[ ]?[0-9]{4}$/.test(v) || 'Campo com 18 números (999 9999 9999 9999)'  // eslint-disable-line
      }
    }, 
    Celular: {
        valido(obrigatorio) {
            if (obrigatorio)
                //return v =>  /^[1-9]{2} (?:[2-8]|9[1-9])[0-9]{3}\-[0-9]{4}$/.test(v) || 'Campo com 12 ou 13 números (99 ?9999-9999)'  // eslint-disable-line
                return v =>  /^[1-9]{2}[ ]?(?:[2-8]|9[1-9])[0-9]{3}[\-]?[0-9]{4}$/.test(v) || 'Campo com 12 ou 13 números (99 ?9999-9999)'  // eslint-disable-line
            else 
                //return v =>  !v || /^[1-9]{2} (?:[2-8]|9[1-9])[0-9]{3}\-[0-9]{4}$/.test(v) || 'Campo com 12 ou 13 números (99 ?9999-9999)'  // eslint-disable-line
                return v =>  !v || /^[1-9]{2}[ ]?(?:[2-8]|9[1-9])[0-9]{3}[\-]?[0-9]{4}$/.test(v) || 'Campo com 12 ou 13 números (99 ?9999-9999)'  // eslint-disable-line
        }
    }, 
    EmailRules: [
      v => !!v || 'E-mail é obrigatório',
      v => /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(v) || 'E-mail inválido' // eslint-disable-line
    ]
}