import AdminInfo from "./AdminInfo";
import { Link, Outlet } from "react-router-dom";
import Actions from "../../components/Actions";
import Modal from "../../components/Modal";
import AddUserForm from "../../components/AddUserForm";

import AddSector from "./AdminComponents/AddSector";
import AddSubSector from "./AdminComponents/AddSubSector";
import AddDesk from "./AdminComponents/AddDesk";

import { useState } from "react";

function AdminDashboard() {
  const [showForm, setShowForm] = useState({});

  function toggleForm(id) {
    setShowForm((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  }

  return (
    <div>
      <AdminInfo />
      {showForm[1] && (
        <Modal toggleForm={toggleForm} id={1}>
          <AddUserForm />
        </Modal>
      )}

      {showForm[2] && (
        <Modal toggleForm={toggleForm} id={2}>
          <AddSector />
        </Modal>
      )}
      {showForm[3] && (
        <Modal toggleForm={toggleForm} id={3}>
          <AddSubSector />
        </Modal>
      )}
      {showForm[4] && (
        <Modal toggleForm={toggleForm} id={4}>
          <AddDesk />
        </Modal>
      )}

      <div className="grid grid-cols-4">
        <div className="col-start-1 col-end-4">
          <Outlet />
        </div>

        <Actions toggleForm={toggleForm} />
      </div>
    </div>
  );
}

export default AdminDashboard;
