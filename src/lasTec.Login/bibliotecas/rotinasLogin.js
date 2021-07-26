export default {
    ChaveRules: {
      obrigatorio() {
        return v => !!v || 'Campo obrigatório'
      },
      valido(formato) {
        var strongRegex = new RegExp(formato); 
        return v => strongRegex.test(v) || 'Campo inválido'
      }
    },
    SenhaRules: {
      max(tamanhoMaximo){
        return v => (v || '').length <= tamanhoMaximo || `Senha com até ${tamanhoMaximo} caracteres`;
      },
      min(tamanhoMinimo){
        return v => (v || '').length >= tamanhoMinimo || `Senha com pelo menos  ${tamanhoMinimo} caracteres`;
      },
      valido(formato, mensagem) {
        var strongRegex = new RegExp(formato); 
        return v => strongRegex.test(v) || mensagem
      }
    }, 
    EmailRules: [
      v => !!v || 'E-mail é obrigatório',
      v => /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(v) || 'E-mail inválido' // eslint-disable-line
    ]
}