import Pagination from '../vc-pagination/locale/vi_VN';
import DatePicker from '../date-picker/locale/vi_VN';
import TimePicker from '../time-picker/locale/vi_VN';
import Calendar from '../calendar/locale/vi_VN';
import type { Locale } from '../locale-provider';

const localeValues: Locale = {
  locale: 'vi',
  Pagination,
  DatePicker,
  TimePicker,
  Calendar,
  Table: {
    filterTitle: 'Bộ ',
    filterConfirm: 'OK',
    filterReset: 'Tạo Lại',
    selectAll: 'Chọn Tất Cả',
    selectInvert: 'Chọn Ngược Lại',
  },
  Modal: {
    okText: 'OK',
    cancelText: 'Huỷ',
    justOkText: 'OK',
  },
  Popconfirm: {
    okText: 'OK',
    cancelText: 'Huỷ',
  },
  Transfer: {
    searchPlaceholder: 'Tìm ở đây',
    itemUnit: 'mục',
    itemsUnit: 'mục',
  },
  Upload: {
    uploading: 'Đang tải lên...',
    removeFile: 'Gỡ bỏ tập tin',
    uploadError: 'Lỗi tải lên',
    previewFile: 'Xem thử tập tin',
    downloadFile: 'Tải tập tin',
  },
  Empty: {
    description: 'Trống',
  },
  Icon: {
    icon: 'biểu tượng'
  },
  Text: {
    edit: 'Sửa',
    copy: 'Sao chép',
    copied: 'Đã sao chép',
    expand: 'Mở rộng'
  },
  PageHeader: {
    back: 'Quay lại'
  },
  Form: {
    optional: '(tuỳ chọn)',
    defaultValidateMessages: {
      default: 'Lỗi xác thực cho trường ${label}',
      required: 'Hãy nhập ${label}',
      enum: '${label} phải là mộ trong [${enum}]',
      whitespace: '${label} không thể là một ký tự trống',
      date: {
        format: '${label} định dạng ngày không hợp lệ',
        parse: '${label} không thể chuyển đổi sang định dạng ngày',
        invalid: '${label} là một ngày không hợp lệ',
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
        hex: typeTemplate
      },
      string: {
        len: '${label} phải là ${len} ký tự',
        min: '${label} phải có ít nhất ${min} ký tự',
        max: '${label} phải có tối đa ${max} ký tự',
        range: '${label} phải nằm trong khoảng ${min}-${max} ký tự'
      },
      number: {
        len: '${label} phải bằng ${len}',
        min: '${label} phải tối thiểu là ${min}',
        max: '${label} phải tối đa là ${max}',
        range: '${label} phải nằm trong khoảng từ ${min}-${max}'
      },
      array: {
        len: 'Phải là ${len} ${label}',
        min: 'Tối thiểu ${min} ${label}',
        max: 'Tối đa ${max} ${label}',
        range: 'Số lượng ${label} phải nằm trong khoảng ${min}-${max}'
      },
      pattern: {
        mismatch: '${label} không khớp với mẫu ${pattern}'
      },
    },
  },
  Image: {
    preview: 'Xem trước'
  }
};

export default localeValues;
