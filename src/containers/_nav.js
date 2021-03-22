import React from "react";
import CIcon from "@coreui/icons-react";

const _nav = [
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
    icon: 'cil-map',
    roles: ['USER', 'SUPER_ADMIN', 'ADMIN']
  },
  {
    _tag: "CSidebarNavItem",
    name: "รายงาน",
    to: "/theme/colors",
    icon: "cil-chart-pie",
    roles: ['USER', 'SUPER_ADMIN', 'ADMIN']
  },
  {
    _tag: "CSidebarNavItem",
    name: "รายการแจ้งซ่อม",
    to: "/repairs",
    icon: "cil-chart-pie",
    roles: ['USER', 'SUPER_ADMIN', 'ADMIN']
  },
  {
    _tag: "CSidebarNavTitle",
    name: "Administrator",
    _children: ["Administrator"],
    roles: ['SUPER_ADMIN', 'ADMIN']
  },
  {
    _tag: "CSidebarNavItem",
    name: "จัดการผู้ใช้งานระบบ",
    to: "/users",
    icon: "cil-people",
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
    icon: "cil-people",
    roles: ['SUPER_ADMIN', 'ADMIN']
  },
];

export default _nav;
