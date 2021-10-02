import Vue from 'vue';
import Vuetify from 'vuetify/lib/framework';
import colors from 'vuetify/es5/util/colors'
Vue.use(Vuetify);

export default new Vuetify({
    theme: {
        themes: {
            primary: colors.green.base, // #4CAF50

            secondary: colors.red.lighten4, // #FFCDD2
            
            accent: colors.indigo.base, // #3F51B5
            
            search: colors.grey.lighten2, // #E0E0E0
            
            searchButton: colors.green.lighten3,  // #A5D6A7
            
            newsBlock: colors.grey.lighten4, // #F5F5F5
        }
    }
});


