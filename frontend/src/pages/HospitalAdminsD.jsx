import React, { useEffect, useState } from "react";
import { Button, Table, Modal, TextInput, Label, Spinner, FileInput } from "flowbite-react";
import { DashboardSidebar } from "../components/DashboardSidebar";
import { useHospitalAdmin } from "../hooks/useHospitalAdmin";
import { useAuthContext } from "../hooks/useAuthContext";

export default function HospitalAdminsD() {
  const {
    hospitalAdmins,
    loading,
    fetchHospitalAdmins,
    createHospitalAdmin,
    updateHospitalAdmin,
    deleteHospitalAdmin,
    activateDeactivateHospitalAdmin,
    fetchHospitalAdminsByHospitalId,
  } = useHospitalAdmin();

  const [openCreateModal, setOpenCreateModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [selectedAdmin, setSelectedAdmin] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [createErrors, setCreateErrors] = useState({});
  const [editErrors, setEditErrors] = useState({});
  const { user } = useAuthContext();

  const [adminData, setAdminData] = useState({
    email: "",
    firstName: "",
    lastName: "",
    phoneNumber: "",
    dob: "",
    address: "",
    nic: "",
    image: null,
    password: "",
  });

  const hospitalId = user?.userObj?._id || "";
  const Hospital = user?.role === "Hospital";
  const Manager = user?.role === "Manager";

  useEffect(() => {
    if (Hospital) {
      fetchHospitalAdminsByHospitalId(hospitalId);
    } else if (Manager) {
      fetchHospitalAdmins();
    }
  }, [fetchHospitalAdmins, fetchHospitalAdminsByHospitalId, hospitalId, Hospital, Manager]);

  // Validation function
  const validateForm = (data, isCreate = false) => {
    const errors = {};
    if (!data.email) errors.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) errors.email = "Invalid email format";
    if (!data.firstName) errors.firstName = "First name is required";
    if (!data.lastName) errors.lastName = "Last name is required";
    if (!data.phoneNumber) errors.phoneNumber = "Phone number is required";
    else if (!/^\+?\d{9,15}$/.test(data.phoneNumber)) errors.phoneNumber = "Phone number must be 9-15 digits (optional + prefix)";
    if (!data.dob) errors.dob = "Date of birth is required";
    else if (new Date(data.dob) >= new Date().setHours(0, 0, 0, 0)) errors.dob = "Date of birth must be in the past";
    if (!data.address) errors.address = "Address is required";
    if (!data.nic) errors.nic = "NIC is required";
    else if (!/^\d{9}[vV]?$|^\d{12}$/.test(data.nic)) errors.nic = "NIC must be 9 digits + optional 'v' or 12 digits";
    if (isCreate && !data.password) errors.password = "Password is required";
    else if (data.password && data.password.length < 6) errors.password = "Password must be at least 6 characters";
    if (data.image && !["image/jpeg", "image/png"].includes(data.image.type)) errors.image = "Image must be JPG or PNG";
    return errors;
  };

  const handleToggleStatus = async (id) => {
    setActionLoading(true);
    try {
      await activateDeactivateHospitalAdmin(id);
    } catch (err) {
      console.error("Error toggling status:", err);
    } finally {
      setActionLoading(false);
    }
  };

  // Handle text input changes
  const handleChange = (e) => {
    const { id, value } = e.target;
    setAdminData((prev) => ({ ...prev, [id]: value }));
  };

  // Handle image upload
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAdminData((prev) => ({ ...prev, image: file }));
    }
  };

  // Handle admin creation
  const handleCreate = async () => {
    const errors = validateForm(adminData, true);
    setCreateErrors(errors);
    if (Object.keys(errors).length > 0) return;

    setActionLoading(true);
    try {
      const formData = new FormData();
      formData.append("hospitalId", hospitalId);
      Object.keys(adminData).forEach((key) => {
        if (adminData[key] !== null && adminData[key] !== "") {
          formData.append(key, adminData[key]);
        }
      });
      await createHospitalAdmin(formData);
      setOpenCreateModal(false);
      resetAdminData();
    } catch (err) {
      console.error("Error creating admin:", err);
    } finally {
      setActionLoading(false);
    }
  };

  // Open edit modal with pre-filled data
  const handleEdit = (admin) => {
    setSelectedAdmin(admin);
    setAdminData({
      email: admin.email || "",
      firstName: admin.firstName || "",
      lastName: admin.lastName || "",
      phoneNumber: admin.phoneNumber || "",
      dob: admin.dob ? admin.dob.split("T")[0] : "",
      address: admin.address || "",
      nic: admin.nic || "",
      image: null, // Reset image for edit (re-upload required)
      password: "", // No pre-filled password
    });
    setEditErrors({});
    setOpenEditModal(true);
  };

  // Handle admin update
  const handleUpdate = async () => {
    if (!selectedAdmin) return;
    const errors = validateForm(adminData);
    setEditErrors(errors);
    if (Object.keys(errors).length > 0) return;

    setActionLoading(true);
    try {
      const formData = new FormData();
      Object.keys(adminData).forEach((key) => {
        if (adminData[key] !== null && adminData[key] !== "") {
          formData.append(key, adminData[key]);
        }
      });
      await updateHospitalAdmin(selectedAdmin._id, formData);
      setOpenEditModal(false);
      resetAdminData();
    } catch (err) {
      console.error("Error updating admin:", err);
    } finally {
      setActionLoading(false);
    }
  };

  // Open delete modal
  const handleDelete = (admin) => {
    setSelectedAdmin(admin);
    setOpenDeleteModal(true);
  };

  // Handle admin deletion
  const handleConfirmDelete = async () => {
    if (!selectedAdmin) return;
    setActionLoading(true);
    try {
      await deleteHospitalAdmin(selectedAdmin._id);
      setOpenDeleteModal(false);
    } catch (err) {
      console.error("Error deleting admin:", err);
    } finally {
      setActionLoading(false);
    }
  };

  // Reset form data
  const resetAdminData = () => {
    setAdminData({
      email: "",
      firstName: "",
      lastName: "",
      phoneNumber: "",
      dob: "",
      address: "",
      nic: "",
      image: null,
      password: "",
    });
    setCreateErrors({});
    setEditErrors({});
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <DashboardSidebar />
      <div className="flex-1 p-6">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold text-red-700">Hospital Admins</h1>
          <Button gradientDuoTone="redToPink" onClick={() => setOpenCreateModal(true)}>
            Add New Admin
          </Button>
        </div>

        {loading && <Spinner className="mb-4" />}

        <Table hoverable>
          <Table.Head>
            <Table.HeadCell>ID</Table.HeadCell>
            <Table.HeadCell>Name</Table.HeadCell>
            <Table.HeadCell>Email</Table.HeadCell>
            <Table.HeadCell>Phone</Table.HeadCell>
            <Table.HeadCell>Status</Table.HeadCell>
            <Table.HeadCell>Actions</Table.HeadCell>
          </Table.Head>
          <Table.Body>
            {hospitalAdmins.length > 0 ? (
              hospitalAdmins.map((admin) => (
                <Table.Row key={admin._id} className="bg-white">
                  <Table.Cell>{admin._id}</Table.Cell>
                  <Table.Cell>{`${admin.firstName} ${admin.lastName}`}</Table.Cell>
                  <Table.Cell>{admin.email}</Table.Cell>
                  <Table.Cell>{admin.phoneNumber || "N/A"}</Table.Cell>
                  <Table.Cell>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        admin.activeStatus ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                      }`}
                    >
                      {admin.activeStatus ? "Active" : "Inactive"}
                    </span>
                  </Table.Cell>
                  <Table.Cell className="space-x-2">
                    <Button
                      size="xs"
                      color={admin.activeStatus ? "failure" : "success"}
                      onClick={() => handleToggleStatus(admin._id)}
                      disabled={actionLoading}
                    >
                      {admin.activeStatus ? "Deactivate" : "Activate"}
                    </Button>
                    <Button
                      size="xs"
                      color="blue"
                      onClick={() => handleEdit(admin)}
                      disabled={actionLoading}
                    >
                      Edit
                    </Button>
                    <Button
                      size="xs"
                      color="failure"
                      onClick={() => handleDelete(admin)}
                      disabled={actionLoading}
                    >
                      Delete
                    </Button>
                  </Table.Cell>
                </Table.Row>
              ))
            ) : (
              <Table.Row>
                <Table.Cell colSpan="6" className="text-center py-4 text-gray-500">
                  No hospital admins found
                </Table.Cell>
              </Table.Row>
            )}
          </Table.Body>
        </Table>
      </div>

      {/* Create Admin Modal */}
      <Modal show={openCreateModal} onClose={() => setOpenCreateModal(false)}>
        <Modal.Header>Add New Hospital Admin</Modal.Header>
        <Modal.Body>
          <div className="space-y-4">
            <div>
              <Label htmlFor="email">Email</Label>
              <TextInput
                id="email"
                value={adminData.email}
                onChange={handleChange}
                required
                color={createErrors.email ? "failure" : "gray"}
              />
              {createErrors.email && <p className="text-red-600 text-sm mt-1">{createErrors.email}</p>}
            </div>
            <div>
              <Label htmlFor="firstName">First Name</Label>
              <TextInput
                id="firstName"
                value={adminData.firstName}
                onChange={handleChange}
                required
                color={createErrors.firstName ? "failure" : "gray"}
              />
              {createErrors.firstName && <p className="text-red-600 text-sm mt-1">{createErrors.firstName}</p>}
            </div>
            <div>
              <Label htmlFor="lastName">Last Name</Label>
              <TextInput
                id="lastName"
                value={adminData.lastName}
                onChange={handleChange}
                required
                color={createErrors.lastName ? "failure" : "gray"}
              />
              {createErrors.lastName && <p className="text-red-600 text-sm mt-1">{createErrors.lastName}</p>}
            </div>
            <div>
              <Label htmlFor="phoneNumber">Phone Number</Label>
              <TextInput
                id="phoneNumber"
                value={adminData.phoneNumber}
                onChange={handleChange}
                required
                color={createErrors.phoneNumber ? "failure" : "gray"}
              />
              {createErrors.phoneNumber && <p className="text-red-600 text-sm mt-1">{createErrors.phoneNumber}</p>}
            </div>
            <div>
              <Label htmlFor="dob">Date of Birth</Label>
              <TextInput
                id="dob"
                type="date"
                value={adminData.dob}
                onChange={handleChange}
                required
                color={createErrors.dob ? "failure" : "gray"}
              />
              {createErrors.dob && <p className="text-red-600 text-sm mt-1">{createErrors.dob}</p>}
            </div>
            <div>
              <Label htmlFor="address">Address</Label>
              <TextInput
                id="address"
                value={adminData.address}
                onChange={handleChange}
                required
                color={createErrors.address ? "failure" : "gray"}
              />
              {createErrors.address && <p className="text-red-600 text-sm mt-1">{createErrors.address}</p>}
            </div>
            <div>
              <Label htmlFor="nic">NIC</Label>
              <TextInput
                id="nic"
                value={adminData.nic}
                onChange={handleChange}
                required
                color={createErrors.nic ? "failure" : "gray"}
              />
              {createErrors.nic && <p className="text-red-600 text-sm mt-1">{createErrors.nic}</p>}
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <TextInput
                id="password"
                type="password"
                value={adminData.password}
                onChange={handleChange}
                required
                color={createErrors.password ? "failure" : "gray"}
              />
              {createErrors.password && <p className="text-red-600 text-sm mt-1">{createErrors.password}</p>}
            </div>
            <div>
              <Label htmlFor="image">Profile Image (Optional)</Label>
              <FileInput
                id="image"
                accept="image/jpeg,image/png"
                onChange={handleImageUpload}
                color={createErrors.image ? "failure" : "gray"}
              />
              {createErrors.image && <p className="text-red-600 text-sm mt-1">{createErrors.image}</p>}
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button
            gradientDuoTone="redToPink"
            onClick={handleCreate}
            disabled={actionLoading}
          >
            {actionLoading ? <Spinner size="sm" className="mr-2" /> : null}
            {actionLoading ? "Creating..." : "Create"}
          </Button>
          <Button
            color="gray"
            onClick={() => setOpenCreateModal(false)}
            disabled={actionLoading}
          >
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Edit Admin Modal */}
      <Modal show={openEditModal} onClose={() => setOpenEditModal(false)}>
        <Modal.Header>Edit Hospital Admin</Modal.Header>
        <Modal.Body>
          <div className="space-y-4">
            <div>
              <Label htmlFor="email">Email</Label>
              <TextInput
                id="email"
                value={adminData.email}
                onChange={handleChange}
                required
                color={editErrors.email ? "failure" : "gray"}
              />
              {editErrors.email && <p className="text-red-600 text-sm mt-1">{editErrors.email}</p>}
            </div>
            <div>
              <Label htmlFor="firstName">First Name</Label>
              <TextInput
                id="firstName"
                value={adminData.firstName}
                onChange={handleChange}
                required
                color={editErrors.firstName ? "failure" : "gray"}
              />
              {editErrors.firstName && <p className="text-red-600 text-sm mt-1">{editErrors.firstName}</p>}
            </div>
            <div>
              <Label htmlFor="lastName">Last Name</Label>
              <TextInput
                id="lastName"
                value={adminData.lastName}
                onChange={handleChange}
                required
                color={editErrors.lastName ? "failure" : "gray"}
              />
              {editErrors.lastName && <p className="text-red-600 text-sm mt-1">{editErrors.lastName}</p>}
            </div>
            <div>
              <Label htmlFor="phoneNumber">Phone Number</Label>
              <TextInput
                id="phoneNumber"
                value={adminData.phoneNumber}
                onChange={handleChange}
                required
                color={editErrors.phoneNumber ? "failure" : "gray"}
              />
              {editErrors.phoneNumber && <p className="text-red-600 text-sm mt-1">{editErrors.phoneNumber}</p>}
            </div>
            <div>
              <Label htmlFor="dob">Date of Birth</Label>
              <TextInput
                id="dob"
                type="date"
                value={adminData.dob}
                onChange={handleChange}
                required
                color={editErrors.dob ? "failure" : "gray"}
              />
              {editErrors.dob && <p className="text-red-600 text-sm mt-1">{editErrors.dob}</p>}
            </div>
            <div>
              <Label htmlFor="address">Address</Label>
              <TextInput
                id="address"
                value={adminData.address}
                onChange={handleChange}
                required
                color={editErrors.address ? "failure" : "gray"}
              />
              {editErrors.address && <p className="text-red-600 text-sm mt-1">{editErrors.address}</p>}
            </div>
            <div>
              <Label htmlFor="nic">NIC</Label>
              <TextInput
                id="nic"
                value={adminData.nic}
                onChange={handleChange}
                required
                color={editErrors.nic ? "failure" : "gray"}
              />
              {editErrors.nic && <p className="text-red-600 text-sm mt-1">{editErrors.nic}</p>}
            </div>
            <div>
              <Label htmlFor="password">Password (Leave blank to keep unchanged)</Label>
              <TextInput
                id="password"
                type="password"
                value={adminData.password}
                onChange={handleChange}
                color={editErrors.password ? "failure" : "gray"}
              />
              {editErrors.password && <p className="text-red-600 text-sm mt-1">{editErrors.password}</p>}
            </div>
            <div>
              <Label htmlFor="image">Profile Image (Upload to update)</Label>
              <FileInput
                id="image"
                accept="image/jpeg,image/png"
                onChange={handleImageUpload}
                color={editErrors.image ? "failure" : "gray"}
              />
              {editErrors.image && <p className="text-red-600 text-sm mt-1">{editErrors.image}</p>}
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button
            gradientDuoTone="redToPink"
            onClick={handleUpdate}
            disabled={actionLoading}
          >
            {actionLoading ? <Spinner size="sm" className="mr-2" /> : null}
            {actionLoading ? "Updating..." : "Update"}
          </Button>
          <Button
            color="gray"
            onClick={() => setOpenEditModal(false)}
            disabled={actionLoading}
          >
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Delete Admin Modal */}
      <Modal show={openDeleteModal} onClose={() => setOpenDeleteModal(false)}>
        <Modal.Header>Confirm Delete</Modal.Header>
        <Modal.Body>
          <p>
            Are you sure you want to delete {selectedAdmin?.firstName} {selectedAdmin?.lastName}?
          </p>
        </Modal.Body>
        <Modal.Footer>
          <Button
            gradientDuoTone="redToPink"
            onClick={handleConfirmDelete}
            disabled={actionLoading}
          >
            {actionLoading ? <Spinner size="sm" className="mr-2" /> : null}
            {actionLoading ? "Deleting..." : "Delete"}
          </Button>
          <Button
            color="gray"
            onClick={() => setOpenDeleteModal(false)}
            disabled={actionLoading}
          >
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}