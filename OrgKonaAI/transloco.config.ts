import {TranslocoGlobalConfig} from '@jsverse/transloco-utils';
    
const config: TranslocoGlobalConfig = {
  rootTranslationsPath: 'src/assets/i18n/',
  langs: [ 'en', 'es', 'de', 'ja'],
  keysManager: {
    defaultValue: 'TODO: translate {{key}}',
    unflat: true,
    replace: false,
  },
};
    
export default config;