import axios from 'axios'

axios.defaults.headers.common['Access-Control-Allow-Origin'] = '*';

const http = axios.create({
    baseURL: 'http://apipainelsaude.azurewebsites.net/api/'
})

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
        console.log(_erros)
    } else {
        _erros = {erros: [{
            'chave': '000.0000',
            'mensagem': error
        }]}
    }

    return Promise.reject(_erros)
})

export default {
    salvaPaciente: (token, infoPaciente) => {
        var _numeroEndereco = (infoPaciente.semNumeroEndereco ? '' : infoPaciente.numeroEndereco)
        var _cpf = infoPaciente.cpf.toString().replace(/\.|-/gm,'');
        var _complemento = (infoPaciente.semComplemento ? '' : infoPaciente.complemento)
        var _celular =  infoPaciente.celular.toString().replace(/\s|-/gm,'');
        var _celular2 =  infoPaciente.celular2.toString().replace(/\s|-/gm,'');
        /* var _dataNascimento = infoPaciente.dataNascimento.substring(6, 10) + '-' + 
                                infoPaciente.dataNascimento.substring(3, 5) + '-' + 
                                infoPaciente.dataNascimento.substring(0, 2)  */

        let _params = {
            'Id' : infoPaciente.id,
            'Nome' : infoPaciente.nome,
            'DataNascimento' : infoPaciente.dataNascimento,
            'CPF': _cpf,
            'CartaoSUS': infoPaciente.cartaoSUS,
            'Celular' : _celular,
            'Celular2' : _celular2,
            'EMail' : infoPaciente.eMail,
            'Sexo' : 'M',
            'TipoEstadoSaudeId': 1,
            'UnidadeSaudeId': infoPaciente.unidadeSaude.id,
            'LogradouroId' : infoPaciente.logradouro.id,
            'NumeroEndereco' : _numeroEndereco,
            'ComplementoEndereco' : _complemento,
            'DescricaoEndereco' : ''
       }
       console.log('apiService.salvaPaciente', _params)
       var _url = (infoPaciente.id == 0) ? 'pacientes' : `pacientes/${infoPaciente.id}`
       console.log('apiService.salvaPaciente ==> url', _url)

       return (infoPaciente.id == 0) ?
                    http.post(_url, _params, { headers: { 'Authorization': `bearer ${token}`}}) 
                        : http.put(_url, _params, { headers: { 'Authorization': `bearer ${token}`}});
    },
    listaPacientes: (token, param) => {
        console.log('apiService.listaPacientes', param)
        var _url = 'pacientes?'
        
        if (param.tipo == 1) {
            var _cpf = param.cpf.toString().replace(/\.|-/gm,'')
            //var _cartaoSUS = param.cartaoSUS.toString()
            var _dataNascimento = param.dataNascimento.toString()
             _dataNascimento = _dataNascimento.substring(6, 10) + '-' + _dataNascimento.substring(3, 5) + '-' + _dataNascimento.substring(0, 2) 
            
            _url += `cpf=${_cpf}&dataNascimento=${_dataNascimento}`
        }
        console.log('apiService.listaPacientes', _url);

        return http.get(_url, {
            headers: {
                'Authorization': `bearer ${token}`
            }
        })
    },
    listaPaciente: (token, pacienteId) => {
        var _url = `pacientes/${pacienteId}`

        console.log('listaPaciente', _url);

        return http.get(_url, {
            headers: {
                'Authorization': `bearer ${token}`
            }
        })
    },
    listaComorbidades: (token) => {
        var _url = 'tipoComorbidades'

        return http.get(_url, {
            headers: {
                'Authorization': `bearer ${token}`
            }
        })
    },
    listaSintomas: (token) => {
        var _url = 'tipoSintomas'
        return http.get(_url, {
            headers: {
                'Authorization': `bearer ${token}`
            }
        })
    },
    listaBairros: (token,cidadeId) => {
        var _url = `bairros?cidadeId=${cidadeId}`
        return http.get(_url, {
            headers: {
                'Authorization': `bearer ${token}`
            }
        })
    },
    listaUnidadesSaude: (token,cidadeId) => {
        var _url = `unidadeSaudes?cidadeId=${cidadeId}`

        return http.get(_url, {
            headers: {
                'Authorization': `bearer ${token}`
            }
        })
    },
    listaLogradouros: (token,cidadeId) => {
        var _url = `logradouros?bairroId=${cidadeId}`

        return http.get(_url, {
            headers: {
                'Authorization': `bearer ${token}`
            }
        })
    },
    autentica: (signKey, usuarioGuid) => {
        var _url = `ApiAcessos/ValidarAcesso?signkey=${signKey}&userKey=${usuarioGuid}`
        return http.get(_url)
    },
}