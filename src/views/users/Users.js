import React, { useState, useEffect, useRef } from "react";
import {
  CBadge,
  CCard,
  CCardBody,
  CCol,
  CDataTable,
  CRow,
  CPagination,
  CButton,
  CButtonGroup,
  CForm,
  CLabel,
  CSelect,
  CInput,
  CFormGroup,
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
} from "@coreui/react";
import { TextMask, InputAdapter } from "react-text-mask-hoc";
import CIcon from "@coreui/icons-react";
import UserAddEdit from "./UserAddEdit";
import { deleteUser, getUsers } from "src/services/UserService";
import { LOGIN_FAILED_CODE, roleUserControl } from "src/config";
import { useDispatch, useSelector } from "react-redux";
import { Redirect } from "react-router-dom";
import { getPrefixes, getRoles, getStatuses } from "src/services/CommonService";
import { capitalize } from "src/utils/common";
import { setLoginExpired } from "src/actions/authen";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import "spinkit/spinkit.min.css";
import "./UserAddEdit.scss";

const MySwal = withReactContent(Swal);

const getBadge = (status) => {
  switch (status) {
    case "ACTIVE":
      return "success";
    case "INACTIVE":
      return "danger";
    default:
      return;
  }
};

const usePrevious = (value) => {
  const ref = useRef();
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
};

const Users = () => {
  const dispatch = useDispatch();
  const isAuth = useSelector((state) => state.authen.isAuth);
  const accessToken = useSelector((state) => state.authen.access_token);
  const userRole = useSelector((state) => state.authen.role);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [modal, setModal] = useState(false);
  const [action, setAction] = useState("add");
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [items, setItems] = useState([]);
  const [totalRecords, setTotalRecords] = useState(0);
  const [username, setUsername] = useState("");
  const [usernameShow, setUsernameShow] = useState("");
  const prevUsername = usePrevious(username);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [status, setStatus] = useState("");
  const [role, setRole] = useState("");
  const [email, setEmail] = useState("");
  const [lineId, setLineId] = useState("");
  const [mobileNo, setMobileNo] = useState("");
  const [itemDetail, setItemDetail] = useState({});
  const [roles, setRoles] = useState([]);
  const [statuses, setStatuses] = useState([]);
  const [prefixes, setPrefixes] = useState([]);
  const [deleteModal, setDeleteModal] = useState(false);
  const [userId, setUserId] = useState("");
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [sorterValue, setSorterValue] = useState({});

  const pageChange = (newPage) => {
    if (newPage - 1 >= 0 && page !== newPage - 1) {
      setPage(newPage - 1);
    }
  };
  const showModal = (action, item) => {
    setAction(action);
    setModal(!modal);
    if (action === "edit") {
      setItemDetail(item);
    }
  };

  const showDeleteModal = (item) => {
    setUserId(item.id);
    setUsernameShow(item.username);
    setDeleteModal(!deleteModal);
  };

  const handleClosedModal = () => {
    setUserId("");
    setUsername("");
    setDeleteModal(false);
  };

  const handleReset = () => {console.log('xxxxxx')
    setUsername("");
    setFirstName("");
    setLastName("");
    setStatus("");
    setRole("");
    setEmail("");
    setLineId("");
    setMobileNo("");
  };

  const handleSearch = () => {
    setLoading(true);
    let body = {
      page,
      limit: itemsPerPage,
      filter: {
        username,
        firstName,
        lastName,
        status: status ? status : undefined,
        role: role ? role : undefined,
        email,
        lineId,
        mobileNo,
      },
    };

    if (sorterValue && Object.keys(sorterValue).length !== 0) {
      const { column, asc } = sorterValue;
      body = { ...body, sort: column, order: asc ? "asc" : "desc" };
    }

    getUsers(accessToken, body).then((users) => {
      if (users.code && users.code === LOGIN_FAILED_CODE) {
        dispatch(setLoginExpired());
        return;
      }
      setItems(users.data);
      setItemsPerPage(itemsPerPage);
      setTotalRecords(Number(users.totalRecords));
      setLoading(false);
    });
  };

  const handleDeleteUser = () => {
    setDeleteLoading(true);
    deleteUser(accessToken, userId).then((response) => {
      if (response.status === 200) {
        setDeleteLoading(false);
        MySwal.fire({
          title: "Success",
          text: "ลบผู้ใช้งานสำเร็จ  ",
          icon: "success",
          didClose: () => {
            setDeleteModal(false);
            handleSearch();
          },
        });
      } else {
        setDeleteLoading(false);
        MySwal.fire({
          title: "Failed",
          text: "ไม่สามารถลบผูใช้งานระบบได้",
          icon: "error",
          didClose: () => {
            setDeleteModal(false);
          },
        });
      }
    });
  };

  useEffect(() => {
    getRoles(accessToken).then(({ status, data }) => {
      return status === 200 ? setRoles(data) : setRoles([]);
    });
    getStatuses(accessToken).then(({ status, data }) => {
      return status === 200 ? setStatuses(data) : setStatuses([]);
    });
    getPrefixes(accessToken).then(({ status, data }) => {
      return status === 200 ? setPrefixes(data) : setPrefixes([]);
    });
    handleSearch();
  }, [page, itemsPerPage, sorterValue]);

  if (!isAuth) {
    return <Redirect to="/" />;
  } else if (!["SUPER_ADMIN", "ADMIN"].includes(userRole)) {
    return <Redirect to="/dashboard" />;
  }

  return (
    <>
      <CRow>
        <CCol xs={6} md={6} sm={6} className="mb-3 d-flex align-items-center">
          <h2>ผู้ใช้งานระบบ</h2>
        </CCol>
        <CCol
          xs={6}
          md={6}
          sm={6}
          className="d-block d-sm-flex align-items-right justify-content-end mb-4"
        >
          <CButton color="primary" onClick={() => showModal("add")}>
            <CIcon size="sm" name="cil-user-plus" className=" mr-1" />
            เพิ่มผู้ใช้งาน
          </CButton>
        </CCol>
      </CRow>
      <CRow className="justify-content-center">
        <CCol>
          <CCard>
            <CCardBody>
              <CRow>
                <CCol className="mb-3 font-weight-bold">ค้นหา</CCol>
              </CRow>
              <CRow>
                <CCol xs={12} md={6} lg={3}>
                  <CFormGroup>
                    <CLabel htmlFor="username">Username:</CLabel>
                    <CInput
                      id="username"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                    />
                  </CFormGroup>
                </CCol>
                <CCol xs={12} md={6} lg={3}>
                  <CFormGroup>
                    <CLabel htmlFor="firstName">ชื่อ:</CLabel>
                    <CInput
                      id="firstName"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                    />
                  </CFormGroup>
                </CCol>
                <CCol xs={12} md={6} lg={3}>
                  <CFormGroup>
                    <CLabel htmlFor="lastName">นามสกุล:</CLabel>
                    <CInput
                      id="lastName"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                    />
                  </CFormGroup>
                </CCol>
                <CCol xs={12} md={6} lg={3}>
                  <CFormGroup>
                    <CLabel htmlFor="status">Status</CLabel>
                    <CSelect
                      custom
                      name="status"
                      id="status"
                      value={status}
                      onChange={(e) => setStatus(e.target.value)}
                    >
                      <option value="">Please Select</option>
                      {statuses.map((status) => (
                        <option key={status.key} value={status.key}>
                          {capitalize(status.value.toLowerCase())}
                        </option>
                      ))}
                    </CSelect>
                  </CFormGroup>
                </CCol>
                <CCol xs={12} md={6} lg={3}>
                  <CFormGroup>
                    <CLabel htmlFor="role">Role:</CLabel>
                    <CSelect
                      custom
                      name="role"
                      id="role"
                      value={role}
                      onChange={(e) => setRole(e.target.value)}
                    >
                      <option value="">Please Select</option>

                      {roles.map(
                        (role) =>
                          roleUserControl[userRole].includes(role.value) && (
                            <option key={role.key} value={role.key}>
                              {capitalize(role.value.toLowerCase())}
                            </option>
                          )
                      )}
                    </CSelect>
                  </CFormGroup>
                </CCol>
                <CCol xs={12} md={6} lg={3}>
                  <CFormGroup>
                    <CLabel htmlFor="email">Email:</CLabel>
                    <CInput
                      id="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </CFormGroup>
                </CCol>
                <CCol xs={12} md={6} lg={3}>
                  <CFormGroup>
                    <CLabel htmlFor="lineId">Line ID:</CLabel>
                    <CInput
                      id="lineId"
                      value={lineId}
                      onChange={(e) => setLineId(e.target.value)}
                    />
                  </CFormGroup>
                </CCol>
                <CCol xs={12} md={6} lg={3}>
                  <CFormGroup>
                    <CLabel htmlFor="mobileNo">Mobile No:</CLabel>
                    <TextMask
                      mask={[
                        /[0]/,
                        /\d/,
                        /\d/,
                        /\d/,
                        /\d/,
                        /\d/,
                        /\d/,
                        /\d/,
                        /\d/,
                        /\d/,
                      ]}
                      Component={InputAdapter}
                      className="form-control"
                      value={mobileNo}
                      onChange={(e) => setMobileNo(e.target.value)}
                    />
                  </CFormGroup>
                </CCol>
              </CRow>
              <CCol
                xs={12}
                md={12}
                lg={12}
                className="mt-3 d-block d-sm-flex justify-content-end"
              >
                <CFormGroup>
                  <CButton
                    variant="outline"
                    color="secondary"
                    className="px-4 text-black-50"
                    onClick={handleReset}
                  >
                    Reset
                  </CButton>
                  <CButton
                    variant="outline"
                    color="primary"
                    className="ml-3 px-3"
                    onClick={handleSearch}
                  >
                    Search
                    <CIcon size="sm" name="cil-search" className="ml-2" />
                  </CButton>
                </CFormGroup>
              </CCol>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
      <CRow>
        <CCol xs={12} md={12} lg={12}>
          <CCard>
            <CCardBody>
              <CDataTable
                loading={loading}
                items={items}
                fields={[
                  {
                    key: "username",
                    label: "Username",
                  },
                  {
                    key: "prefix",
                    label: "ชื่อนำหน้า",
                  },
                  {
                    key: "firstName",
                    label: "ชื่อ",
                  },
                  {
                    key: "lastName",
                    label: "นามสกุล",
                  },
                  {
                    key: "role",
                    label: "Role",
                  },
                  {
                    key: "status",
                    label: "Status",
                  },
                  {
                    key: "email",
                    label: "Email",
                  },
                  {
                    key: "lineId",
                    label: "Line ID",
                  },
                  {
                    key: "mobileNo",
                    label: "Mobile No",
                  },
                  {
                    key: "groupName",
                    label: "กลุ่มสะพานลอย",
                  },
                  {
                    key: "action",
                    label: "",
                    _style: { width: "1%" },
                    filter: false,
                  },
                ].filter((field) =>
                  userRole === "ADMIN" ? field : field !== "role"
                )}
                hover
                itemsPerPage={itemsPerPage}
                // clickableRows
                // onRowClick={(item) => history.push(`/users/${item.id}`)}

                scopedSlots={{
                  status: (item) => (
                    <td>
                      <CBadge color={getBadge(item.status)}>
                        {item.status}
                      </CBadge>
                    </td>
                  ),
                  email: (item) =>
                    item.email !== "null" ? <td>{item.email}</td> : "",
                  lineId: (item) =>
                    item.lineId !== "null" ? <td>{item.lineId}</td> : "",
                  mobileNo: (item) =>
                    item.mobileNo !== "null" ? <td>{item.mobileNo}</td> : "",

                  action: (item) => (
                    <td className="py-2">
                      <CButtonGroup className="mr-2">
                        <CButton
                          size="sm"
                          className="btn-github btn-brand mr-1 mb-1"
                          onClick={() => showModal("edit", item)}
                        >
                          <CIcon size="sm" name="cil-pencil" />
                        </CButton>
                        <CButton
                          size="sm"
                          className="btn-youtube btn-brand mr-1 mb-1"
                          onClick={() => showDeleteModal(item)}
                        >
                          <CIcon size="sm" name="cil-trash" />
                        </CButton>
                      </CButtonGroup>
                    </td>
                  ),
                }}
                sorter
                sorterValue={sorterValue}
                //onSorterValueChange={setSorterValue}
              />
              <CRow>
                <CCol xs={12} md={6}>
                  <CForm inline className="mt-2">
                    <CLabel className="mr-2">Show</CLabel>{" "}
                    <CSelect
                      size="sm"
                      value={itemsPerPage}
                      onChange={(e) => setItemsPerPage(Number(e.target.value))}
                    >
                      <option value="10">10</option>
                      <option value="25">25</option>
                      <option value="50">50</option>
                    </CSelect>
                    <CLabel className="ml-2">entries</CLabel>
                  </CForm>
                </CCol>
                <CCol xs={12} md={6}>
                  <CPagination
                    activePage={page + 1}
                    onActivePageChange={pageChange}
                    pages={Math.ceil(totalRecords / itemsPerPage)}
                    doubleArrows={false}
                    align="end"
                  />
                </CCol>
              </CRow>
              <UserAddEdit
                action={action}
                modal={modal}
                setModal={setModal}
                itemDetail={itemDetail}
                reloadData={handleSearch}
                roles={roles}
                statuses={statuses}
                prefixes={prefixes}
                handleReset={handleReset}
              />
              <CModal
                centered
                show={deleteModal}
                closeOnBackdrop={false}
                onClosed={handleClosedModal}
              >
                {deleteLoading && (
                  <div className={deleteLoading ? "spinner-container" : ""}>
                    <div className="position-absolute spinner-center">
                      <div className="sk-grid mx-auto">
                        <div className="sk-grid-cube"></div>
                        <div className="sk-grid-cube"></div>
                        <div className="sk-grid-cube"></div>
                        <div className="sk-grid-cube"></div>
                        <div className="sk-grid-cube"></div>
                        <div className="sk-grid-cube"></div>
                        <div className="sk-grid-cube"></div>
                        <div className="sk-grid-cube"></div>
                        <div className="sk-grid-cube"></div>
                      </div>
                      <div className="text-center">Loading....</div>
                    </div>
                  </div>
                )}
                <CModalHeader>
                  <h5>คุณต้องการลบ ?</h5>
                </CModalHeader>
                <CModalBody>
                  ลบผู้ใช้งาน <strong>{usernameShow}</strong>
                </CModalBody>
                <CModalFooter>
                  <CButton color="light" onClick={handleClosedModal}>
                    Cancel
                  </CButton>
                  <CButton
                    color="danger"
                    onClick={handleDeleteUser}
                    disabled={deleteLoading}
                  >
                    Confirm
                  </CButton>{" "}
                </CModalFooter>
              </CModal>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </>
  );
};

export default Users;
