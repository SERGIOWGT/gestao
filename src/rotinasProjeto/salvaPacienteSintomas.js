import formataValores from '../bibliotecas/formataValores'
import mainService from '../services/MainService'
export default {
    data() {
    },
    async salvaSintomas(pacienteId, sintomas, mostraMensagem, mostraErro, callback){ 
        let _sintomas = []
        const _dataHoje = new Date()
        const _dataInicio = new Date()
        
        for (let i = 0;  i < sintomas.length; i++) {
            if (sintomas[i].selecionado) {
                let item = {}

                _dataInicio.setDate(_dataHoje.getDate() - sintomas[i].dias)
                item.id = sintomas[i].id
                item.dataInicio = formataValores.dataYYYYMMDD(_dataInicio)
                
                console.log('coloquei', i, sintomas[i].dias, item.dataInicio)
                _sintomas.push (item)
            }
        }
        // Não há sintomas
        if (_sintomas.lenght == 0) {
            mostraErro('Nenhum sintoma foi selecionado. [erroId=01.001.001]')
            return
        } 
        mostraMensagem("Aguarde... Salvando os Sintomas")
        await mainService.salvaPacienteSintomas(pacienteId, _sintomas)
            .then(resposta => {
                console.log('salvaPacienteSintomas', '.then', resposta)
                    mostraMensagem('')
                    if (resposta.status == 200) {
                        callback()
                    } else {
                        mostraMensagem(resposta.message)
                    }
                })
            .catch(response => {mainService.catchPadrao(response)}) 
    },
    async listaPacientePorNome(cidadeId, parteNome) {

        //console.log('async listaPacientePorNome - I')
        const param = {
            'tipo': 3,
            'cidadeId': cidadeId,
            'nome': parteNome
        }
        const retorno = await mainService.listaPacientes(param)
        return retorno
    }
}
