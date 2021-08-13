export default {
    cpf(val){
        return val.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4') // eslint-disable-line
    },
    cnpj(){
    },
    celular(val){
        return ((val.length == 11) ? val.toString().replace(/(\d{2})(\d{5})(\d{4})/, '$1 $2-$3') : val.toString().replace(/(\d{2})(\d{4})(\d{4})/, '$1 $2-$3')) 
    },
    data(val) {
        if (!val) return null;
        console.log(val)

        const [year, month, day] = val.split('-')
        return `${day}/${month}/${year}`

        //return val.toString().replace(/(\d{4})\-(\d{2})\-(\d{2})/,'$3/$2/$1'); // eslint-disable-line
    }


    /*
    formatDate (date) {
        if (!date) return null

        const [year, month, day] = date.split('-')
        return `${month}/${day}/${year}`
      },
      parseDate (date) {
        if (!date) return null

        const [month, day, year] = date.split('/')
        return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`
      },
      */

}