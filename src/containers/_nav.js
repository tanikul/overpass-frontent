const _nav = [
  {
    _tag: "CSidebarNavTitle",
    name: "เมนูการใช้งาน",
    _children: ["เมนูการใช้งาน"],
    roles: ['SUPER_ADMIN', 'ADMIN']
  },
  {
    _tag: "CSidebarNavItem",
    name: "แผงงานวิเคราะห์ข้อมูล",
    to: "/dashboard",
    icon: 'cil-map',
    roles: ['USER', 'SUPER_ADMIN', 'ADMIN']
  },
  {
    _tag: 'CSidebarNavItem',
    name: 'เขตพื้นที่และอุปกรณ์',
    to: '/maps',
    icon: 'cil-globe-alt',
    roles: ['USER', 'SUPER_ADMIN', 'ADMIN']
  },
  {
    _tag: "CSidebarNavItem",
    name: "รายงาน",
    to: "/",
    icon: "cil-chart-pie",
    roles: ['USER', 'SUPER_ADMIN', 'ADMIN']
  },
  {
    _tag: "CSidebarNavItem",
    name: "รายการแจ้งซ่อม",
    to: "/repairs",
    icon: "cil-asterisk",
    roles: ['USER', 'SUPER_ADMIN', 'ADMIN']
  },
  {
    _tag: "CSidebarNavTitle",
    name: "ผู้ดูแลระบบ",
    _children: ["ผู้ดูแลระบบ"],
    roles: ['SUPER_ADMIN', 'ADMIN']
  },
  {
    _tag: "CSidebarNavItem",
    name: "ตั้งค่าหลอดไฟ",
    to: "/light-bulb",
    icon: "cil-lightbulb",
    roles: ['SUPER_ADMIN', 'ADMIN']
  },
  {
    _tag: 'CSidebarNavItem',
    name: 'จัดการสะพานลอย',
    to: '/overpass',
    icon: 'cil-notes',
    roles: ['SUPER_ADMIN', 'ADMIN']
  },
  {
    _tag: "CSidebarNavItem",
    name: "จับกลุ่มสะพานลอย",
    to: "/mapping-overpass",
    icon: "cil-list-rich",
    roles: ['SUPER_ADMIN', 'ADMIN']
  },
  {
    _tag: "CSidebarNavItem",
    name: "จัดการผู้ใช้งานระบบ",
    to: "/users",
    icon: "cil-people",
    roles: ['SUPER_ADMIN', 'ADMIN']
  },
  
  /*{
    _tag: "CSidebarNavItem",
    name: "จับกลุมผู้ใช้งานระบบ",
    to: "/mapping-overpass/users",
    icon: "cil-people",
    roles: ['SUPER_ADMIN', 'ADMIN']
  },*/
];

export default _nav;
