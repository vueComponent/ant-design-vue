import { mount } from '@vue/test-utils';
import dayjs from 'dayjs';
import MockDate from 'mockdate';
import { sleep } from '../../../tests/utils';
import {
  Pagination,
  DatePicker,
  TimePicker,
  Calendar,
  Popconfirm,
  Table,
  Modal,
  Select,
  Transfer,
} from '../..';
import LocaleProvider from '..';
import arEG from '../../locale/ar_EG';
import bgBG from '../../locale/bg_BG';
import caES from '../../locale/ca_ES';
import csCZ from '../../locale/cs_CZ';
import daDK from '../../locale/da_DK';
import deDE from '../../locale/de_DE';
import elGR from '../../locale/el_GR';
import enGB from '../../locale/en_GB';
import enUS from '../../locale/en_US';
import esES from '../../locale/es_ES';
import etEE from '../../locale/et_EE';
import faIR from '../../locale/fa_IR';
import fiFI from '../../locale/fi_FI';
import frBE from '../../locale/fr_BE';
import frFR from '../../locale/fr_FR';
import heIL from '../../locale/he_IL';
import hiIN from '../../locale/hi_IN';
import hrHR from '../../locale/hr_HR';
import huHU from '../../locale/hu_HU';
import hyAM from '../../locale/hy_AM';
import isIS from '../../locale/is_IS';
import itIT from '../../locale/it_IT';
import jaJP from '../../locale/ja_JP';
import knIN from '../../locale/kn_IN';
import koKR from '../../locale/ko_KR';
import kuIQ from '../../locale/ku_IQ';
import mkMK from '../../locale/mk_MK';
import mnMN from '../../locale/mn_MN';
import msMY from '../../locale/ms_MY';
import nbNO from '../../locale/nb_NO';
import neNP from '../../locale/ne_NP';
import nlBE from '../../locale/nl_BE';
import nlNL from '../../locale/nl_NL';
import plPL from '../../locale/pl_PL';
import ptBR from '../../locale/pt_BR';
import ptPT from '../../locale/pt_PT';
import roRO from '../../locale/ro_RO';
import ruRU from '../../locale/ru_RU';
import skSK from '../../locale/sk_SK';
import slSI from '../../locale/sl_SI';
import srRS from '../../locale/sr_RS';
import svSE from '../../locale/sv_SE';
import taIN from '../../locale/ta_IN';
import thTH from '../../locale/th_TH';
import trTR from '../../locale/tr_TR';
import ukUA from '../../locale/uk_UA';
import viVN from '../../locale/vi_VN';
import idID from '../../locale/id_ID';
import lvLV from '../../locale/lv_LV';
import zhCN from '../../locale/zh_CN';
import zhTW from '../../locale/zh_TW';

const locales = [
  arEG,
  bgBG,
  caES,
  csCZ,
  daDK,
  deDE,
  elGR,
  enGB,
  enUS,
  esES,
  etEE,
  faIR,
  fiFI,
  frBE,
  frFR,
  heIL,
  hiIN,
  hrHR,
  huHU,
  hyAM,
  isIS,
  itIT,
  jaJP,
  knIN,
  koKR,
  kuIQ,
  mkMK,
  msMY,
  mnMN,
  nbNO,
  neNP,
  nlBE,
  nlNL,
  plPL,
  ptBR,
  ptPT,
  roRO,
  ruRU,
  skSK,
  slSI,
  srRS,
  svSE,
  taIN,
  thTH,
  trTR,
  ukUA,
  viVN,
  idID,
  lvLV,
  zhCN,
  zhTW,
];

const { Option } = Select;
const { RangePicker } = DatePicker;

const columns = [
  {
    title: 'Name',
    dataIndex: 'name',
    filters: [
      {
        text: 'filter1',
        value: 'filter1',
      },
    ],
  },
  {
    title: 'Age',
    dataIndex: 'age',
  },
];

const App = {
  render() {
    return (
      <div>
        <Pagination defaultCurrent={1} total={50} showSizeChanger />
        <Select showSearch style={{ width: '200px' }}>
          <Option value="jack">jack</Option>
          <Option value="lucy">lucy</Option>
        </Select>
        <DatePicker open />
        <TimePicker open defaultValue={dayjs()} />
        <RangePicker open style={{ width: '200px' }} />
        <Popconfirm title="Question?" visible>
          <a>Click to confirm</a>
        </Popconfirm>
        <Transfer dataSource={[]} showSearch targetKeys={[]} render={item => item.title} />
        <Calendar fullscreen={false} value={dayjs()} />
        <Table dataSource={[]} columns={columns} />
        <Modal title="Locale Modal" visible>
          <p>Locale Modal</p>
        </Modal>
      </div>
    );
  },
};

describe('Locale Provider', () => {
  beforeAll(() => {
    document.body.innerHTML = '';
    MockDate.set(dayjs('2017-09-18T03:30:07.795'));
  });

  afterAll(() => {
    MockDate.reset();
  });

  locales.forEach(locale => {
    it(`should display the text as ${locale.locale}`, async () => {
      const wrapper = mount(
        {
          render() {
            return (
              <LocaleProvider locale={locale}>
                <App />
              </LocaleProvider>
            );
          },
        },
        { sync: false, attachTo: 'body' },
      );
      await sleep();
      expect(wrapper.html()).toMatchSnapshot();
    });
  });

  xit('should change locale of Modal.xxx', async () => {
    const ModalDemo = {
      mounted() {
        Modal.confirm({
          title: 'Hello World!',
        });
      },
      render() {
        return null;
      },
    };
    for (const locale of locales) {
      document.body.innerHTML = '';
      mount(
        {
          render() {
            return (
              <LocaleProvider locale={locale}>
                <ModalDemo />
              </LocaleProvider>
            );
          },
        },
        { sync: false, attachTo: 'body' },
      );
      await sleep();
      const currentConfirmNode =
        document.querySelectorAll('.ant-modal-confirm')[
          document.querySelectorAll('.ant-modal-confirm').length - 1
        ];
      let cancelButtonText = currentConfirmNode.querySelectorAll(
        '.ant-btn:not(.ant-btn-primary) span',
      )[0].innerHTML;
      let okButtonText = currentConfirmNode.querySelectorAll('.ant-btn-primary span')[0].innerHTML;
      if (locale.locale === 'zh-cn') {
        cancelButtonText = cancelButtonText.replace(' ', '');
        okButtonText = okButtonText.replace(' ', '');
      }
      expect(cancelButtonText).toBe(locale.Modal.cancelText);
      expect(okButtonText).toBe(locale.Modal.okText);
    }
  });

  xit('set dayjs locale when locale changes', async () => {
    document.body.innerHTML = '';
    const Test = {
      data() {
        return {
          locale: zhCN,
        };
      },
      render() {
        return (
          <LocaleProvider locale={this.locale}>
            <div>
              <DatePicker defaultValue={dayjs()} open />
            </div>
          </LocaleProvider>
        );
      },
    };
    const wrapper = mount(Test, { sync: false, attachTo: 'body' });
    await sleep(50);
    expect(document.body.innerHTML).toMatchSnapshot();
    wrapper.vm.locale = frFR;
    await sleep(50);
    expect(document.body.innerHTML).toMatchSnapshot();
    wrapper.vm.locale = null;
    await sleep(50);
    expect(document.body.innerHTML).toMatchSnapshot();
  });
});
