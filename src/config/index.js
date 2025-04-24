import { GiAccordion } from 'react-icons/gi';
import { RoomIcon } from '../icons';

export const URL_DASHBOARD = [
  {
    icon: <RoomIcon />,
    url: '/room-management',
    title: 'Manage Room',
  },
  {
    icon: <GiAccordion />,
    url: '/account-management',
    title: 'Manage Account',
  },
  {
    icon: <GiAccordion />,
    url: '/team-management',
    title: 'Manage Team',
  },
  {
    icon: <GiAccordion />,
    url: '/project-management',
    title: 'Manage Project',
  },
];

export const INTRODUCES_USER = [
  {
    id: 1,
    title: 'Xem tổng quan',
    description: 'Tổng số người dùng, ghế và ghế trống được hiển thị ở góc phải.',
    targetSelector: '#over-view',
  },
  {
    id: 2,
    title: 'Hover vào ghế',
    description: 'Di chuột lên ghế để xem chi tiết thông tin.',
    targetSelector: '#seat-hover-area',
  },
];
export const INTRODUCES = [
  {
    id: 1,
    title: 'Xem tổng quan',
    description: 'Tổng số người dùng, ghế và ghế trống được hiển thị ở góc phải.',
    targetSelector: '#over-view',
  },
  {
    id: 2,
    title: 'Chèn sơ đồ bằng hình ảnh',
    description: 'Nhấn vào nút "Upload background" để chèn sơ đồ bằng hình ảnh',
    targetSelector: '#upload-background',
  },
  {
    id: 3,
    title: 'Ẩn sơ đồ',
    description: 'Nhấn vào nút "Hide background" để ẩn sơ đồ',
    targetSelector: '#hide-background',
  },
  {
    id: 4,
    title: 'Hiện sơ đồ',
    description: 'Nhấn vào nút "Visible background" để hiện sơ đồ',
    targetSelector: '#visible-background',
  },
  {
    id: 5,
    title: 'Xóa sơ đồ',
    description: 'Nhấn vào nút "Remove background" để hiện sơ đồ',
    targetSelector: '#remove-background',
  },
  {
    id: 6,
    title: 'Sửa đổi bố cục',
    description: 'Nhấp vào nút đây để sửa đổi bố cục của phòng làm việc',
    targetSelector: '#edit-layout',
  },
  {
    id: 7,
    title: 'Tiếp tục chỉnh sửa bố cục',
    description: 'Nhấp vào nút đây để tiếp tục chỉnh sửa bố cục của phòng làm việc',
    targetSelector: '#continue-draft-layout',
  },
  {
    id: 8,
    title: 'Xem layout hiện tại',
    description: 'Nhấp vào nút đây để xem layout hiện tại của phòng làm việc',
    targetSelector: '#current-layout',
  },
  // end overview

  // start edit layout
  {
    id: 9,
    title: 'Tìm kiếm loại ghế',
    description: 'Nhập tên loại ghế vào ô tìm kiếm để tìm loại ghế bạn muốn',
    targetSelector: '#search-seat-type',
  },
  {
    id: 10,
    title: 'Thêm loại ghế',
    description: "Nhấp vào nút 'Add type seat' để thêm loại ghế mới.",
    targetSelector: '#add-type-seat',
  },
  {
    id: 11,
    title: 'Tạo ghế mới',
    description: 'Kéo type seat vào layout để tạo ghế mới',
    targetSelector: '#add-seat',
  },

  // seats
  {
    id: 12,
    title: 'Hover vào ghế',
    description: 'Di chuột lên ghế để xem chi tiết thông tin.',
    targetSelector: '#seat-hover-area',
  },
  {
    id: 13,
    title: 'Nhấn giữ ghế và kéo thả đến vị trí mới',
    description: 'Nhấn giữ ghế và kéo thả đến vị trí mới',
    targetSelector: '#seat-hover-area',
  },
  {
    id: 14,
    title: 'Chuột phải vào ghế',
    description: 'Nhấp chuột phải để mở menu tùy chọn (Assign, Reassign, Unassign, Remove).',
    targetSelector: '#seat-hover-area',
  },
  {
    id: 15,
    title: 'Assign Seat',
    description: 'Chọn "Assign" để gán ghế cho user mới.',
    targetSelector: '#context-assign',
  },
  {
    id: 16,
    title: 'Reassign Seat',
    description: 'Chọn "Reassign" để đổi ghế cho user cũ.',
    targetSelector: '#context-reassign',
  },
  {
    id: 17,
    title: 'Unassign Seat',
    description: 'Chọn "Unassign" để bỏ ghế khỏi user đang chọn.',
    targetSelector: '#context-unassign',
  },
  {
    id: 18,
    title: 'Remove Seat',
    description: 'Chọn "Remove" để xóa ghế khỏi hệ thống.',
    targetSelector: '#context-remove',
  },
  // objects
  {
    id: 19,
    title: 'Tạo các thành phần tường, bàn, cửa...',
    description: 'Nhấn vào "Add new object" để tạo các thành phần này',
    targetSelector: '#add-object',
  },
  {
    id: 20,
    title: 'Kéo thả Object',
    description: 'Nhấn giữ object và kéo thả đến vị trí mới',
    targetSelector: '#drag-object',
  },
  {
    id: 21,
    title: 'Đổi tên Object',
    description: 'Nhấp vào chữ "OBJECT" để chỉnh sửa và đổi tên object.',
    targetSelector: '#object-name',
  },
  {
    id: 22,
    title: 'Đổi màu Object',
    description: 'Nhấp vào vùng nền xám để chọn màu sắc của object.',
    targetSelector: '#drag-object',
  },
  {
    id: 23,
    title: 'Xóa Object',
    description: 'Nhấp vào dấu "X" ở góc trái để xóa object.',
    targetSelector: '#object-delete',
  },

  // end edit layout
  {
    id: 24,
    title: 'Complete sửa đổi bố cục',
    description: 'Nhấp vào nút đây để hoàn thành sửa đổi bố cục của phòng làm việc',
    targetSelector: '#complete-request',
  },
  {
    id: 25,
    title: 'Save layout',
    description: 'Nhấn vào nút "Save layout" để lưu lại bố cục hiện tại',
    targetSelector: '#save-layout',
  },
  {
    id: 26,
    title: 'Gửi yêu cầu thay đổi bố cục',
    description: 'Nhấp vào nút đây để gửi yêu cầu thay đổi bố cục của phòng làm việc',
    targetSelector: '#send-request',
  },

  // actions objects and seats
];

export const URL_SERVER = 'https://seatmanage-be-v3.onrender.com/uploads/';
