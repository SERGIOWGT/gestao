export const rotinasCadastraPaciente = {
    stringToDate(_date,_format,_delimiter)
    {
        var formatLowerCase=_format.toLowerCase();
        var formatItems=formatLowerCase.split(_delimiter);
        var dateItems=_date.split(_delimiter);
        var monthIndex=formatItems.indexOf("mm");
        var dayIndex=formatItems.indexOf("dd");
        var yearIndex=formatItems.indexOf("yyyy");
        var month=parseInt(dateItems[monthIndex]);
        month-=1;
        var formatedDate = new Date(dateItems[yearIndex],month,dateItems[dayIndex]);
        return formatedDate;
    },
    ordenaComorbidades(todasComorbidades, ComorbidadesCidadao){
        let retorno=[]
        if (ComorbidadesCidadao == null) {
            todasComorbidades.forEach((linha ) => {
                const item = {
                    id: linha.id, 
                    nome: linha.nome,
                    selecionado: false
                }
                retorno.push(item)
            })
            return retorno
        }
        let aux =[]
        ComorbidadesCidadao.forEach(linha => {
            const index = todasComorbidades.findIndex( el => el.id === linha.id );
            if (index != -1) {
                aux.push(index)
            }
            
        });
        aux.sort((a, b) => {return a - b;});

        
        aux.forEach((linha) => {
            const item = {
                id: todasComorbidades[linha].id, 
                nome: todasComorbidades[linha].nome,
                selecionado: true
            }
            retorno.push(item)
        })

        todasComorbidades.forEach((linha, index) => {
            if (!aux.includes(index)) {
                const item = {
                    id: linha.id, 
                    nome: linha.nome,
                    selecionado: false
                }
                retorno.push(item)
            }
        })
        return retorno
    },
    ordenaSintomas(todosSintomas, sintomasCidadao){
        let retorno=[]
        if (sintomasCidadao == null) {
            todosSintomas.forEach((linha) => {
                const item = {
                    id: linha.id, 
                    nome: linha.nome,
                    dias: 0,
                    selecionado: false
                }
                retorno.push(item)
            })
            return retorno
        }

        let aux =[]
        sintomasCidadao.forEach(linha => {
            const index = todosSintomas.findIndex( el => el.id === linha.id );
            if (index != -1) {
                aux.push(index)
            }
            
        });
        aux.sort((a, b) => {return a - b;});

        const dataHoje = new Date()
        aux.forEach((linha, index) => {
            const dataSintoma = this.stringToDate(sintomasCidadao[index].dataInicio, 'yyyy-MM-dd', '-')
            const item = {
                id: todosSintomas[linha].id, 
                nome: todosSintomas[linha].nome,
                dias: parseInt((dataHoje - dataSintoma) / (1000 * 60 * 60 * 24), 10),
                selecionado: true
            }
            retorno.push(item)
        })

        todosSintomas.forEach((linha, index) => {
            if (!aux.includes(index)) {
                const item = {
                    id: linha.id, 
                    nome: linha.nome,
                    dias: 0,
                    selecionado: false
                }
                retorno.push(item)
            }
        })
        return retorno
    },
}
