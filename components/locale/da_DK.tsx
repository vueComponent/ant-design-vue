import Pagination from '../vc-pagination/locale/da_DK';
import DatePicker from '../date-picker/locale/da_DK';
import TimePicker from '../time-picker/locale/da_DK';
import Calendar from '../calendar/locale/da_DK';
import type { Locale } from '../locale-provider';

const typeTemplate = '${label} er ikke en gyldig ${type}';

const localeValues: Locale = {
  locale: 'da',
  DatePicker,
  TimePicker,
  Calendar,
  Pagination,
  global: {
    placeholder: 'Vælg venligst',
  },
  Table: {
    filterTitle: 'Filtermenu',
    filterConfirm: 'OK',
    filterReset: 'Nulstil',
    filterEmptyText: 'Ingen filtre',
    emptyText: 'Ingen data',
    selectAll: 'Vælg nuværende side',
    selectInvert: 'Inverter nuværende side',
    selectNone: 'Ryd al data',
    selectionAll: 'Vælg al data',
    sortTitle: 'Sorter',
    expand: 'Udvid række',
    collapse: 'Skjul række',
    triggerDesc: 'Klik for at sortere faldende',
    triggerAsc: 'Klik for at sortere stigende',
    cancelSort: 'Klik for at nulstille sortering',
  },
  Modal: {
    okText: 'OK',
    cancelText: 'Afbryd',
    justOkText: 'OK',
  },
  Popconfirm: {
    okText: 'OK',
    cancelText: 'Afbryd',
  },
  Transfer: {
    titles: ['', ''],
    searchPlaceholder: 'Søg her',
    itemUnit: 'element',
    itemsUnit: 'elementer',
    remove: 'Fjern',
    selectCurrent: 'Vælg nuværende side',
    removeCurrent: 'Fjern nuværende side',
    selectAll: 'Vælg al data',
    removeAll: 'Ryd al data',
    selectInvert: 'Inverter nuværende side',
  },
  Upload: {
    uploading: 'Uploader...',
    removeFile: 'Fjern fil',
    uploadError: 'Fejl ved upload',
    previewFile: 'Forhåndsvisning',
    downloadFile: 'Hent fil',
  },
  Empty: {
    description: 'Ingen data',
  },
  Icon: {
    icon: 'ikon',
  },
  Text: {
    edit: 'Rediger',
    copy: 'Kopier',
    copied: 'Kopieret',
    expand: 'Udvid',
  },
  PageHeader: {
    back: 'Tilbage',
  },
  Form: {
    optional: '(ikke påkrævet)',
    defaultValidateMessages: {
      default: 'Feltvalideringsfejl for ${label}',
      required: 'Venligst udfyld ${label}',
      enum: '${label} skal være en af [${enum}]',
      whitespace: '${label} må ikke være et blankt tegn',
      date: {
        format: '${label} datoformatet er ugyldigt',
        parse: '${label} kan ikke konverteres til en dato',
        invalid: '${label} er en ugyldig dato',
      },
      types: {
        string: typeTemplate,
        method: typeTemplate,
        array: typeTemplate,
        object: typeTemplate,
        number: typeTemplate,
        date: typeTemplate,
        boolean: typeTemplate,
        integer: typeTemplate,
        float: typeTemplate,
        regexp: typeTemplate,
        email: typeTemplate,
        url: typeTemplate,
        hex: typeTemplate,
      },
      string: {
        len: '${label} skal være ${len} tegn',
        min: '${label} skal være mindst ${min} tegn',
        max: '${label} må højst være ${max} tegn',
        range: '${label} skal være mellem ${min}-${max} tegn',
      },
      number: {
        len: '${label} skal være lig med ${len}',
        min: '${label} skal være minimum ${min}',
        max: '${label} må højst være ${max}',
        range: '${label} skal være mellem ${min}-${max}',
      },
      array: {
        len: 'Skal være ${len} ${label}',
        min: 'Skal være mindst ${min} ${label}',
        max: 'Må højst være ${max} ${label}',
        range: 'Antallet af ${label} skal være mellem ${min}-${max}',
      },
      pattern: {
        mismatch: '${label} stemmer ikke overens med mønsteret ${pattern}',
      },
    },
  },
  Image: {
    preview: 'Forhåndsvisning',
  },
};

export default localeValues;
