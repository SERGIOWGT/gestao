import axios from 'axios'

axios.defaults.headers.common['Access-Control-Allow-Origin'] = '*';

const http = axios.create({
    //baseURL: 'https://apipainelsaude.azurewebsites.net/api/'
    //baseURL: 'http://api.painelsaude.com.br/api/'
    baseURL: 'https://localhost:44308/api/'
})

http.interceptors.request.use(function (config) {
    const d = new Date().toUTCString();
    config.headers.dataEnvio =  d
    return config;
  });
http.interceptors.response.use(function (response) {
    return response
  }, function (error) {
    var _erros = ''
    if (error.response) {
        if (error.response.status == 400) {
            _erros = error.response.data
        } else if (error.response.status == 401) {
             _erros = {erros: [{
                'chave': '000.0401',
                'mensagem': 'Url não autorizada'
            }]}
    
        } else if (error.response.status == 404) {
            _erros = {erros: [{
                'chave': '000.0404',
                'mensagem': 'Url não encontrada'
            }]}

        } else {
            _erros = {erros: [{
                'chave': '000.0000',
                'mensagem': error
            }]}
        }
    } else {
        _erros = {erros: [{
            'chave': '000.0000',
            'mensagem': error
        }]}
    }

    return Promise.reject(_erros)
})
export default {
    autentica: (signKey, usuarioGuid) => {
        const _url = `Autenticacao/Autentica?signkey=${signKey}&userKey=${usuarioGuid}`
        return http.get(_url)
    },

    excluiBairro: (token, id) => {
        let _url = `Bairros/${id}`
        return http.delete(_url, { headers: { 'Authorization': `bearer ${token}`}});    
    },
    excluiMicroArea: (token, id) => {
        let _url = `microAreas/${id}`
        return http.delete(_url, { headers: { 'Authorization': `bearer ${token}`}});    
    },
    excluiLogradouro: (token, id) => {
        let _url = `logradouros/${id}`
        return http.delete(_url, { headers: { 'Authorization': `bearer ${token}`}});    
    }, 
    excluiUnidadeSaude: (token, id) => {
        let _url = `UnidadeSaudes/${id}`
        return http.delete(_url, { headers: { 'Authorization': `bearer ${token}`}});    
    },
    listaBairros: (token,cidadeId, id) => {
        let _url = `bairros?cidadeId=${cidadeId}`
        if (id) 
            _url += `&id=${id}`

        return http.get(_url, {headers: {'Authorization': `bearer ${token}`}})
    },
    listaComorbidades: (token) => {
        return http.get('tipoComorbidades', {headers: {'Authorization': `bearer ${token}`}})
    },
    listaDoencas: (token) => {
        return http.get('tipoDoencas', {headers: {'Authorization': `bearer ${token}`}})
    },
    listaLogradouros: (token, bairroId, id) => {
        let _url = `logradouros?bairroId=${bairroId}`
        if (id) 
            _url += `&id=${id}`

        return http.get(_url, {headers: {'Authorization': `bearer ${token}`}})
    },    
    listaMicroAreas: (token, unidadeSaudeId, id) => {
        let _url = `microAreas?unidadeSaudeId=${unidadeSaudeId}`
        if (id) 
            _url += `&id=${id}`

        return http.get(_url, {headers: {'Authorization': `bearer ${token}`}})
    },
    listaPaciente: (token, pacienteId) => {
        const _url = `pacientes/${pacienteId}`
        return http.get(_url, {headers: {'Authorization': `bearer ${token}`}})
    },
    listaPacientesCompleta (token, param) {
        let url = `pacientes/listaCompleta`

        let paramPost = {
            bairroId: 0,
            cartaoSUS: '',
            celular: '',
            celular2: '',
            cidadeId: 0,
            complementoEndereco: '',
            CPF: '',
            dataNascimento: '',
            dataVisitaInicio: '',
            dataVisitaFim: '',
            eMail: '',

            id: 0,
            logradouroId: 0,
            microAreaId: 0,
            nome: '',
            nomeMae: '',
            numeroEndereco: '',
            numeroMaxLinhas: 50,
            
            RG: '',
            sexo: '',

            comorbidades: [],
            sintomas: [],
            doencas: [],

            unidadeSaudeId: 0,
            telefoneContato: '',
            tipoEstadoSaudeId: 0,
            tipoMotivoVisitaAnaliticoId: 0,
        }

        if (param.ordenacao !== null)
            url += `?ordenacao=${param.ordenacao}`

        if (param.id)  
            paramPost.id = param.id
        else {
            if (param.cpf) 
                paramPost.CPF = param.cpf

            if (param.dataNascimento)
                paramPost.dataNascimento = param.dataNascimento

            if (param.unidadeSaudeId) 
                paramPost.unidadeSaudeId = param.unidadeSaudeId

            if (param.microAreaId) 
                paramPost.microAreaId = param.microAreaId

            if (param.logradouroId) 
                paramPost.logradouroId = param.logradouroId

            if (param.numeroEndereco) 
                paramPost.numeroEndereco = param.numeroEndereco

            if (param.complementoEndereco) 
                paramPost.complementoEndereco = param.complementoEndereco

            if (param.bairroId) 
                paramPost.bairroId = param.bairroId

            if (param.cartaoSUS) 
                paramPost.cartaoSUS = param.cartaoSUS

            if (param.sintomas) {
                paramPost.sintomas = param.sintomas
            }
            if (param.comorbidades) {
                paramPost.comorbidades = param.comorbidades
            }
            if (param.doencas) {
                paramPost.doencas = param.doencas
            }
            if (param.tipoMotivoVisitaAnaliticoId) {
                paramPost.tipoMotivoVisitaAnaliticoId = param.tipoMotivoVisitaAnaliticoId
            }
            if (param.dataInicioVisita) {
                let _dataInicio = param.dataInicioVisita.replace(/\//gm,'').toString()
                _dataInicio = _dataInicio.substring(4, 8) + '-' +  _dataInicio.substring(2, 4) + '-' + _dataInicio.substring(0, 2)

                paramPost.dataVisitaInicio = _dataInicio
            }
            if (param.dataFimVisita) {
                let _dataFim = param.dataFimVisita.replace(/\//gm,'').toString()
                _dataFim = _dataFim.substring(4, 8) + '-' +  _dataFim.substring(2, 4) + '-' + _dataFim.substring(0, 2)

                paramPost.dataVisitaFim = _dataFim
            }
        }
        return http.post(url, paramPost, {headers: {'Authorization': `bearer ${token}`} })

    },
    listaPacientes (token, param) {
        let _url = `pacientes?cidadeId=${param.cidadeId}`

        if (param.id)  
            _url += `&id=${param.id}`
        else {
            if (param.nome) 
                _url += `&nome=${param.nome}`

            if (param.cpf) 
                _url += `&cpf=${param.cpf}`

            if (param.dataNascimento)
                _url += `&dataNascimento=${param.dataNascimento}`

            if (param.unidadeSaudeId) 
                _url += `&unidadeSaudeId=${param.unidadeSaudeId}`

            if (param.microAreaId) 
                _url += `&microAreaId=${param.microAreaId}`

            if (param.logradouroId) 
                _url += `&logradouroId=${param.logradouroId}`

            if (param.bairroId) 
                _url += `&bairroId=${param.bairroId}`
        }
        
        return http.get(_url, {headers: {'Authorization': `bearer ${token}`}})
    },
    listaPacienteSintomas: (token, pacienteId) => {
        const _url = `pacienteSintomas/${pacienteId}`
        return http.get(_url, {headers: {'Authorization': `bearer ${token}`}})
    },
    listaPacienteComorbidades: (token, pacienteId) => {
        return http.get(`pacienteComorbidades/${pacienteId}`, {headers: {'Authorization': `bearer ${token}`}})

    },
    listaPacienteUltimaVisita (token, pacienteId) {
        const url = `pacienteVisitas/ListaUltimaVisita?pacienteId=${pacienteId}`
        return http.get(url, {headers: {'Authorization': `bearer ${token}`}})
    },
    listaPacienteVisita (token, id) {
        const url = `pacienteVisitas/ListaVisita?id=${id}`
        return http.get(url, {headers: {'Authorization': `bearer ${token}`}})
    },
    listaPacienteVisitas: (token, param) => {
        let url = `pacienteVisitas/ListaCompleta`
        
        let paramPost = {
            id: 0,
            pacienteId: 0,
            nomepaciente: null,
            tipoMotivoVisitaAnaliticoId: 0,
            tipoAcaoVisitaId: 0,
            TipoSolucaoVisitaId: 0,
            unidadeSaudeId: 0,
            microAreaId: 0,
            cidadeId: 0,
            bairroId: 0,
            logradouroId: 0,
            numeroEndereco: null,
            complementoEndereco: null,
            CPF: null,
            cartaoSUS: null,
            sexo: null,
            tipoEstadoSaudeId: 0,
            dataNascimento: null,
            dataVisitaInicio: null,
            dataVisitaFim: null,
            dataSolucaoInicio: null,
            dataSolucaoFim: null,
            numeroMaxLinhas: 50,
            sintomas: [],
            comorbidades: [],
            doencas: [],
        }
        if (param.id)  
            paramPost.id = param.id
        else {
            if (param.pacienteId) 
                paramPost.pacienteId = param.pacienteId

            if (param.nomepaciente) 
                paramPost.nomepaciente = param.nomepaciente

            if (param.tipoMotivoVisitaAnaliticoId) 
                paramPost.tipoMotivoVisitaAnaliticoId = param.tipoMotivoVisitaAnaliticoId

            if (param.tipoAcaoVisitaId) 
                paramPost.tipoAcaoVisitaId = param.tipoAcaoVisitaId

            if (param.TipoSolucaoVisitaId) 
                paramPost.TipoSolucaoVisitaId = param.TipoSolucaoVisitaId

            if (param.unidadeSaudeId) 
                paramPost.unidadeSaudeId = param.unidadeSaudeId

            if (param.microAreaId) 
                paramPost.microAreaId = param.microAreaId

            if (param.cidadeId) 
                paramPost.cidadeId = param.cidadeId

            if (param.bairroId) 
                paramPost.bairroId = param.bairroId

            if (param.logradouroId) 
                paramPost.logradouroId = param.logradouroId

            if (param.numeroEndereco) 
                paramPost.numeroEndereco = param.numeroEndereco

            if (param.complementoEndereco) 
                paramPost.complementoEndereco = param.complementoEndereco

            if (param.cpf) 
                paramPost.CPF = param.cpf

            if (param.cartaoSUS) 
                paramPost.cartaoSUS = param.cartaoSUS

            if (param.sexo) 
                paramPost.sexo = param.sexo

            if (param.tipoEstadoSaudeId) 
                paramPost.tipoEstadoSaudeId = param.tipoEstadoSaudeId
    
            if (param.dataNascimento)
                paramPost.dataNascimento = param.dataNascimento
    
            if (param.dataVisitaInicio)
                paramPost.dataVisitaInicio = param.dataVisitaInicio
            
            if (param.dataVisitaFim)
                paramPost.dataVisitaFim = param.dataVisitaFim
            
            if (param.dataSolucaoInicio)
                paramPost.dataSolucaoInicio = param.dataSolucaoInicio
            
            if (param.dataSolucaoFim)
                paramPost.dataSolucaoFim = param.dataSolucaoFim

            if (param.sintomas) {
                paramPost.sintomas = param.sintomas
            }
            if (param.comorbidades) {
                paramPost.comorbidades = param.comorbidades
            }
            if (param.doencas) {
                paramPost.doencas = param.doencas
            }
        }
        return http.post(url, paramPost, {headers: {'Authorization': `bearer ${token}`} })
    },
    listaPerfisSeguranca (token) {
        const url = 'perfisSeguranca/listaCompleta'
        return http.get(url, {headers: {'Authorization': `bearer ${token}`}})
    },
    listaSintomas (token) {
        const url = 'tipoSintomas'
        return http.get(url, {headers: {'Authorization': `bearer ${token}`}})
    },
    listaTipoAcaoVisita: (token) => {
        return http.get('tipoAcaoVisitas', {headers: {'Authorization': `bearer ${token}`}})
    },
    listaTipoMotivoVisita: (token, id) => {
        let _url = `TipoMotivoVisitas`
        if (id)
            _url += `?id=${id}`
        return http.get(_url, {headers: {'Authorization': `bearer ${token}`}})
    },
    listaTipoMotivoAnaliticoVisita: (token, tipoMotivoVisitaId) => {
        let _url = `TipoMotivoVisitaAnaliticos`
        if (tipoMotivoVisitaId)
            _url += `?tipoMotivoVisitaId=${tipoMotivoVisitaId}`
        return http.get(_url, {headers: {'Authorization': `bearer ${token}`}})
    },
    listaTipoSolucaoVisita: (token, cidadeId) => {
        return http.get(`TipoSolucaoVisitas?cidadeId=${cidadeId}`, {headers: {'Authorization': `bearer ${token}`}})
    },
    listaUnidadesSaude: (token, cidadeId, id, parteNome) => {
        let _url = `unidadeSaudes?cidadeId=${cidadeId}`

        if (id)
            _url += `&id=${id}`

        if (parteNome)
            _url += `&nome=${parteNome}`

        return http.get(_url, {headers: {'Authorization': `bearer ${token}`}})
    },
    listaUsuarios: (token, cidadeId) => {
        const _url = `Usuarios/ListaCompleta?cidadeId=${cidadeId}`
        return http.get(_url, {headers: {'Authorization': `bearer ${token}`}})
    },
    salvaBairro: (token, cidadeId, id, nome) => {
        let _params = {}
        _params.nome = nome
        _params.cidadeId = cidadeId
        let _url = (id == 0) ? 'Bairros' : `Bairros/${id}`

        return (id == 0) ?
        http.post(_url, _params, { headers: { 'Authorization': `bearer ${token}`}}) 
            : http.put(_url, _params, { headers: { 'Authorization': `bearer ${token}`}});
    },
    salvaPacienteComorbidades: (token, pacienteId, comorbidades) => {
        var _url = `pacienteComorbidades`
        let _params = {
            'PacienteId' : pacienteId,
            'TipoComorbidades': comorbidades
       }
       return http.post(_url, _params, { headers: { 'Authorization': `bearer ${token}`}}) 
    },
    salvaPaciente: (token, infoPaciente) => {
        const _numeroEndereco = (infoPaciente.semNumeroEndereco ? 'S/N' : infoPaciente.numeroEndereco)
        const _cpf = infoPaciente.cpf.toString().replace(/\.|-/gm,'');

        const _complemento = (infoPaciente.semComplemento ? '' : infoPaciente.complemento)
        const _celular =  (infoPaciente.celular == null) ? '' : infoPaciente.celular.toString().replace(/\s|-/gm,'')
        const _celular2 =  (infoPaciente.celular2 == null) ? '' : infoPaciente.celular2.toString().replace(/\s|-/gm,'')
        const _telefoneContato =  (infoPaciente.telefoneContato == null) ? '' : infoPaciente.telefoneContato.toString().replace(/\s|-/gm,'')
        const _cartaoSus = (infoPaciente.cartaoSUS == null) ? '' : infoPaciente.cartaoSUS.toString().replace(/\s/g, '')
        
        let _dataNascimento = infoPaciente.dataNascimento.toString().replace(/\//gm,'').toString()
         _dataNascimento = _dataNascimento.substring(4, 8) + '-' +  _dataNascimento.substring(2, 4) + '-' + _dataNascimento.substring(0, 2)

        let _params = {
            'Id' : infoPaciente.id,
            'Nome' : infoPaciente.nome,
            'NomeMae' : infoPaciente.nomeMae,
            'DataNascimento' : _dataNascimento,
            'CPF': _cpf,
            'RG': infoPaciente.RG,
            'CartaoSUS': _cartaoSus,
            'Celular' : _celular,
            'Celular2' : _celular2,
            'TelefoneContato' : _telefoneContato,
            'EMail' : infoPaciente.eMail,
            'Sexo' : infoPaciente.sexo,
            'TipoEstadoSaudeId': 1,
            'UnidadeSaudeId': infoPaciente.unidadeSaude.id,
            'LogradouroId' : infoPaciente.logradouro.id,
            'MicroAreaId' : infoPaciente.microArea.id,
            'NumeroEndereco' : _numeroEndereco,
            'ComplementoEndereco' : _complemento,
            'DescricaoEndereco' : ''
       }
       var _url = (infoPaciente.id == 0) ? 'pacientes' : `pacientes/${infoPaciente.id}`
       return (infoPaciente.id == 0) ?
                    http.post(_url, _params, { headers: { 'Authorization': `bearer ${token}`}}) 
                        : http.put(_url, _params, { headers: { 'Authorization': `bearer ${token}`}});
    },
    salvaVisita: (token, id, params) => {
        var _url = (id == 0) ? 'pacienteVisitas' : `pacienteVisitas/${id}`
        params.id = id
        
        return (id == 0) ?
                    http.post(_url, params, { headers: { 'Authorization': `bearer ${token}`}}) 
                        : http.put(_url, params, { headers: { 'Authorization': `bearer ${token}`}});
    },
    salvaVisitaBaixa: (token, id, params) => {
        var _url = `pacienteVisitas/${id}/baixa`
        params.id = id
        
        return http.put(_url, params, { headers: { 'Authorization': `bearer ${token}`}})
    },
    salvaPacienteSintomas: (token, pacienteId, sintomas) => {
        var _url = `pacienteSintomas`
        let _params = {
            'PacienteId' : pacienteId,
            'TipoSintomas': sintomas
       }
       return http.post(_url, _params, { headers: { 'Authorization': `bearer ${token}`}}) 
    },
    salvaUnidadeSaude: (token, cidadeId, id, nome) => {
        let _params = {}
        _params.nome = nome
        _params.cidadeId = cidadeId
        let _url = (id == 0) ? 'UnidadeSaudes' : `UnidadeSaudes/${id}`
        return (id == 0) ?
        http.post(_url, _params, { headers: { 'Authorization': `bearer ${token}`}}) 
            : http.put(_url, _params, { headers: { 'Authorization': `bearer ${token}`}});
    },
    salvaMicroArea: (token, unidadeSaudeId, id, nome) => {
        let _params = {}
        _params.nome = nome
        _params.unidadeSaudeId = unidadeSaudeId
        let _url = (id == 0) ? 'MicroAreas' : `MicroAreas/${id}`

        return (id == 0) ?
        http.post(_url, _params, { headers: { 'Authorization': `bearer ${token}`}}) 
            : http.put(_url, _params, { headers: { 'Authorization': `bearer ${token}`}});
    },
    salvaLogradouro: (token, bairroId, id, nome) => {
        let _params = {}
        _params.nome = nome
        _params.bairroId = bairroId
        let _url = (id == 0) ? 'logradouros' : `logradouros/${id}`

        return (id == 0) ?
        http.post(_url, _params, { headers: { 'Authorization': `bearer ${token}`}}) 
            : http.put(_url, _params, { headers: { 'Authorization': `bearer ${token}`}});
    },
    salvaUsuario: (token, id, param) => {
        let _url = (id == 0) ? 'Usuarios' : `Usuarios/${id}`

        return (id == 0) ?
        http.post(_url, param, { headers: { 'Authorization': `bearer ${token}`}}) 
            : http.put(_url, param, { headers: { 'Authorization': `bearer ${token}`}});
    },
}