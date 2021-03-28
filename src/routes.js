import React from 'react';

const CodeEditors = React.lazy(() => import('./views/editors/code-editors/CodeEditors'));
const TextEditors = React.lazy(() => import('./views/editors/text-editors/TextEditors'));

const Invoice = React.lazy(() => import('./views/apps/invoicing/Invoice'));

const AdvancedForms = React.lazy(() => import('./views/forms/advanced-forms/AdvancedForms'));
const BasicForms = React.lazy(() => import('./views/forms/basic-forms/BasicForms'));
const ValidationForms = React.lazy(() => import('./views/forms/validation-forms/ValidationForms'));
const GoogleMaps = React.lazy(() => import('./views/google-maps/GoogleMaps'));
const Toaster = React.lazy(() => import('./views/notifications/toaster/Toaster'));
const Calendar = React.lazy(() => import('./views/plugins/calendar/Calendar'));
const Draggable = React.lazy(() => import('./views/plugins/draggable/Draggable'));
const Spinners = React.lazy(() => import('./views/plugins/spinners/Spinners'));
//const Tables = React.lazy(() => import('./views/tables/tables/Tables'));
//const LoadingButtons = React.lazy(() => import('./views/buttons/loading-buttons'));

const Breadcrumbs = React.lazy(() => import('./views/base/breadcrumbs/Breadcrumbs'));
const Cards = React.lazy(() => import('./views/base/cards/Cards'));
const Carousels = React.lazy(() => import('./views/base/carousels/Carousels'));
const Collapses = React.lazy(() => import('./views/base/collapses/Collapses'));

const Jumbotrons = React.lazy(() => import('./views/base/jumbotrons/Jumbotrons'));
const ListGroups = React.lazy(() => import('./views/base/list-groups/ListGroups'));
const Navbars = React.lazy(() => import('./views/base/navbars/Navbars'));
const Navs = React.lazy(() => import('./views/base/navs/Navs'));
const Paginations = React.lazy(() => import('./views/base/paginations/Pagnations'));
const Popovers = React.lazy(() => import('./views/base/popovers/Popovers'));
const ProgressBar = React.lazy(() => import('./views/base/progress-bar/ProgressBar'));
const Switches = React.lazy(() => import('./views/base/switches/Switches'));

const Tabs = React.lazy(() => import('./views/base/tabs/Tabs'));
const Tooltips = React.lazy(() => import('./views/base/tooltips/Tooltips'));
const BrandButtons = React.lazy(() => import('./views/buttons/brand-buttons/BrandButtons'));
const ButtonDropdowns = React.lazy(() => import('./views/buttons/button-dropdowns/ButtonDropdowns'));
const ButtonGroups = React.lazy(() => import('./views/buttons/button-groups/ButtonGroups'));
const Buttons = React.lazy(() => import('./views/buttons/buttons/Buttons'));
const Charts = React.lazy(() => import('./views/charts/Charts'));
const Dashboard = React.lazy(() => import('./views/dashboard/Dashboard'));
const CoreUIIcons = React.lazy(() => import('./views/icons/coreui-icons/CoreUIIcons'));
const Flags = React.lazy(() => import('./views/icons/flags/Flags'));
const Brands = React.lazy(() => import('./views/icons/brands/Brands'));
const Alerts = React.lazy(() => import('./views/notifications/alerts/Alerts'));
const Badges = React.lazy(() => import('./views/notifications/badges/Badges'));
const Modals = React.lazy(() => import('./views/notifications/modals/Modals'));
const Colors = React.lazy(() => import('./views/theme/colors/Colors'));
const Typography = React.lazy(() => import('./views/theme/typography/Typography'));
const Widgets = React.lazy(() => import('./views/widgets/Widgets'));
const Users = React.lazy(() => import('./views/users/Users'));
const Overpasses = React.lazy(() => import('./views/overpass/Overpasses'));
const MappingOverpass = React.lazy(() => import('./views/mapping-overpass/MappingList'));
const MappingOverpassAdd = React.lazy(() => import('./views/mapping-overpass/MappingForms'));
const MappingOverpassEdit = React.lazy(() => import('./views/mapping-overpass/MappingForms'));
const Maps = React.lazy(() => import('./views/maps/Maps'));
const Repairs = React.lazy(() => import('./views/repairs/Repairs'));
const RepairDetail = React.lazy(() => import('./views/repairs/RepairDetail'));
const BulbLight = React.lazy(() => import('./views/bulb/BulbLight'));

const routes = [
  { path: '/', exact: true, name: 'หน้าแรก' },
  { path: '/dashboard', name: 'แผงงานวิเคราะห์ข้อมูล', component: Dashboard },
  { path: '/theme', name: 'Theme', component: Colors, exact: true },
  { path: '/theme/colors', name: 'Colors', component: Colors },
  { path: '/theme/typography', name: 'Typography', component: Typography },
  { path: '/base', name: 'Base', component: Cards, exact: true },
  { path: '/base/breadcrumbs', name: 'Breadcrumbs', component: Breadcrumbs },
  { path: '/base/cards', name: 'Cards', component: Cards },
  { path: '/base/carousels', name: 'Carousel', component: Carousels },
  { path: '/base/collapses', name: 'Collapse', component: Collapses },
  { path: '/base/jumbotrons', name: 'Jumbotrons', component: Jumbotrons },
  { path: '/base/list-groups', name: 'List Groups', component: ListGroups },
  { path: '/base/navbars', name: 'Navbars', component: Navbars },
  { path: '/base/navs', name: 'Navs', component: Navs },
  { path: '/base/paginations', name: 'Paginations', component: Paginations },
  { path: '/base/popovers', name: 'Popovers', component: Popovers },
  { path: '/base/progress-bar', name: 'Progress Bar', component: ProgressBar },
  { path: '/base/switches', name: 'Switches', component: Switches },
  { path: '/base/tabs', name: 'Tabs', component: Tabs },
  { path: '/base/tooltips', name: 'Tooltips', component: Tooltips },
  { path: '/buttons', name: 'Buttons', component: Buttons, exact: true },
  { path: '/buttons/buttons', name: 'Buttons', component: Buttons },
  { path: '/buttons/button-dropdowns', name: 'Dropdowns', component: ButtonDropdowns },
  { path: '/buttons/button-groups', name: 'Button Groups', component: ButtonGroups },
  { path: '/buttons/brand-buttons', name: 'Brand Buttons', component: BrandButtons },
  { path: '/charts', name: 'Charts', component: Charts },
  { path: '/editors', name: 'Editors', component: CodeEditors, exact: true },
  { path: '/editors/code-editors', name: 'Code Editors', component: CodeEditors },
  { path: '/editors/text-editors', name: 'Text Editors', component: TextEditors },
  //{ path: '/forms/overpass', name: 'Overpass Forms', component: OverpassForms, exact: true },
  { path: '/forms', name: 'Forms', component: BasicForms, exact: true },
  { path: '/forms/advanced-forms', name: 'Advanced Forms', component: AdvancedForms },
  { path: '/forms/basic-forms', name: 'Basic Forms', component: BasicForms },
  { path: '/forms/validation-forms', name: 'Form Validation', component: ValidationForms },
  { path: '/google-maps', name: 'Google Maps', component: GoogleMaps },
  { path: '/icons', exact: true, name: 'Icons', component: CoreUIIcons },
  { path: '/icons/coreui-icons', name: 'CoreUI Icons', component: CoreUIIcons },
  { path: '/icons/flags', name: 'Flags', component: Flags },
  { path: '/icons/brands', name: 'Brands', component: Brands },
  { path: '/notifications', name: 'Notifications', component: Alerts, exact: true },
  { path: '/notifications/alerts', name: 'Alerts', component: Alerts },
  { path: '/notifications/badges', name: 'Badges', component: Badges },
  { path: '/notifications/modals', name: 'Modals', component: Modals },
  { path: '/notifications/toaster', name: 'Toaster', component: Toaster },
  { path: '/plugins', name: 'Plugins', component: Calendar, exact: true },
  { path: '/plugins/calendar', name: 'Calendar', component: Calendar },
  { path: '/plugins/draggable', name: 'Draggable Cards', component: Draggable },
  { path: '/plugins/spinners', name: 'Spinners', component: Spinners },
  //{ path: '/tables', name: 'Tables', component: Tables, exact: true },
  //{ path: '/tables/advanced-tables', name: 'Advanced Tables', component: AdvancedTables },
  //{ path: '/tables/tables', name: 'Tables', component: Tables },
  { path: '/widgets', name: 'Widgets', component: Widgets },
  { path: '/apps', name: 'Apps', component: Invoice, exact: true },
  { path: '/apps/invoicing', name: 'Invoice', component: Invoice, exact: true },
  { path: '/apps/invoicing/invoice', name: 'Invoice', component: Invoice },
  { path: '/users', exact: true,  name: 'จัดการผู้ใช้งานในระบบ', component: Users },
  { path: '/apps/email/inbox', exact: true, name: 'Inbox' },
  { path: '/apps/email/compose', exact: true, name: 'Compose' },
  { path: '/apps/email/message', exact: true, name: 'Message' },
  { path: '/overpass', exact: true,  name: 'สะพานลอย', component: Overpasses },
  { path: '/mapping-overpass', exact: true,  name: 'จับกลุ่มสะพานลอย', component: MappingOverpass },
  { path: '/mapping-overpass/:mode', exact: true,  name: '', component: MappingOverpassAdd },
  { path: '/mapping-overpass/:mode/:id', exact: true,  name: '', component: MappingOverpassEdit },
  { path: '/maps', exact: true,  name: 'เขตพื้นที่และอุปกรณ์', component: Maps },
  { path: '/repairs', exact: true,  name: 'รายการแจ้งซ่อม', component: Repairs },
  { path: '/repairs/:id', exact: true,  name: '', component: RepairDetail },
  { path: '/light-bulb/', exact: true,  name: 'ตั้งค่าหลอดไฟ', component: BulbLight },
  
]

export default routes;
