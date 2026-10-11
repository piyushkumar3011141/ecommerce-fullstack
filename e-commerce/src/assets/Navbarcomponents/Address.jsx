import React, { useState } from "react";
import "./Address.css";
import { useNavigate } from "react-router-dom";

import { useOrders } from "../../context/OrderContext";
import { useCart } from "../../context/CartContext";
import { getErrorMessage } from "../../services/axiosConfig";

const emptyForm = {
  name: "",
  phone: "",
  line1: "",
  city: "",
  state: "",
  pincode: ""
};

const Address = () => {

  const {
    addresses,
    addAddress,
    updateAddress,
    removeAddress
  } = useOrders();

  const { cartCount } = useCart();

  const navigate = useNavigate();

  const [form, setForm] =
    useState(emptyForm);

  const [showForm, setShowForm] =
    useState(false);

  // Edit hone wale address ki ID
  const [editingId, setEditingId] =
    useState(null);


  // =====================================
  // INPUT CHANGE
  // =====================================

  const handleChange = (e) => {

    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value
    }));

  };


  // =====================================
  // ADD / UPDATE ADDRESS
  // =====================================

  const handleSubmit = async (e) => {

    e.preventDefault();

    if (
      !form.name ||
      !form.phone ||
      !form.line1 ||
      !form.city ||
      !form.state ||
      !form.pincode
    ) {
      return;
    }

    try {

      // ==============================
      // UPDATE
      // ==============================

      if (editingId) {

        await updateAddress(
          editingId,
          form
        );

      }

      // ==============================
      // ADD
      // ==============================

      else {

        await addAddress(form);

      }


      // Form reset

      setForm(emptyForm);

      setEditingId(null);

      setShowForm(false);

    } catch (error) {

      console.error(
        "Address Save Error:",
        error
      );

      alert(
        getErrorMessage(error, "Address save nahi hua.")
      );

    }

  };


  // =====================================
  // EDIT ADDRESS
  // =====================================

  const handleEdit = (address) => {

    setForm({

      name:
        address.name || "",

      phone:
        address.phone || "",

      line1:
        address.line1 || "",

      city:
        address.city || "",

      state:
        address.state || "",

      pincode:
        address.pincode || ""

    });

    setEditingId(address.id);

    setShowForm(true);

  };


  // =====================================
  // DELETE ADDRESS
  // =====================================

  const handleRemove = async (id) => {

    try {

      await removeAddress(id);

    } catch (error) {

      console.error(
        "Address Delete Error:",
        error
      );

      alert(
        getErrorMessage(error, "Address delete nahi hua.")
      );

    }

  };


  // =====================================
  // DELIVER HERE
  // =====================================

  const goToPayment = (addressId) => {

    navigate(
      "/payment",
      {
        state: {
          addressId
        }
      }
    );

  };


  // =====================================
  // CANCEL EDIT / FORM
  // =====================================

  const handleCancel = () => {

    setForm(emptyForm);

    setEditingId(null);

    setShowForm(false);

  };


  return (

    <div
      className="container-fluid bg-light py-5"
    >

      <div className="container">

        <h2 className="fw-bold mb-4">
          Select Delivery Address
        </h2>


        {/* ================================= */}
        {/* SAVED ADDRESSES */}
        {/* ================================= */}

        <div className="row g-4">

          <div className="col-lg-7">

            {addresses.map((address) => (

              <div
                className="card border-0 shadow-sm mb-3"
                key={address.id}
              >

                <div className="card-body">


                  <div className="d-flex justify-content-between align-items-center flex-wrap">


                    {/* ADDRESS DETAILS */}

                    <div>

                      <strong>
                        {address.name}
                      </strong>

                      {" · "}

                      {address.phone}


                      <p className="text-secondary mb-0">

                        {address.line1},{" "}
                        {address.city},{" "}
                        {address.state} -{" "}
                        {address.pincode}

                      </p>

                    </div>


                    {/* BUTTONS */}

                    <div className="d-flex gap-2 mt-2 mt-md-0 flex-wrap">


                      {/* DELIVER HERE */}

                      <button
                        className="btn btn-danger btn-sm"
                        disabled={
                          cartCount === 0
                        }
                        onClick={() =>
                          goToPayment(
                            address.id
                          )
                        }
                      >

                        Deliver here

                      </button>


                      {/* EDIT */}

                      <button
                        className="btn btn-outline-primary btn-sm"
                        onClick={() =>
                          handleEdit(address)
                        }
                      >

                        Edit

                      </button>


                      {/* REMOVE */}

                      <button
                        className="btn btn-outline-secondary btn-sm"
                        onClick={() =>
                          handleRemove(
                            address.id
                          )
                        }
                      >

                        Remove

                      </button>

                    </div>

                  </div>

                </div>

              </div>

            ))}


            {/* ================================= */}
            {/* ADD NEW ADDRESS BUTTON */}
            {/* ================================= */}

            {!showForm && (

              <button
                className="btn btn-outline-danger"
                onClick={() =>
                  setShowForm(true)
                }
              >

                + Add a new address

              </button>

            )}


            {/* ================================= */}
            {/* ADDRESS FORM */}
            {/* ================================= */}

            {showForm && (

              <form
                className="card border-0 shadow-sm p-3"
                onSubmit={handleSubmit}
              >


                {/* FORM TITLE */}

                <h5 className="mb-3">

                  {editingId
                    ? "Edit Address"
                    : "New Address"}

                </h5>


                <div className="row g-2">


                  {/* NAME */}

                  <div className="col-md-6">

                    <input
                      className="form-control"
                      name="name"
                      placeholder="Full name"
                      value={form.name}
                      onChange={handleChange}
                      required
                    />

                  </div>


                  {/* PHONE */}

                  <div className="col-md-6">

                    <input
                      className="form-control"
                      name="phone"
                      placeholder="Phone number"
                      value={form.phone}
                      onChange={handleChange}
                      required
                    />

                  </div>


                  {/* ADDRESS */}

                  <div className="col-12">

                    <input
                      className="form-control"
                      name="line1"
                      placeholder="House no, street, area"
                      value={form.line1}
                      onChange={handleChange}
                      required
                    />

                  </div>


                  {/* CITY */}

                  <div className="col-md-4">

                    <input
                      className="form-control"
                      name="city"
                      placeholder="City"
                      value={form.city}
                      onChange={handleChange}
                      required
                    />

                  </div>


                  {/* STATE */}

                  <div className="col-md-4">

                    <input
                      className="form-control"
                      name="state"
                      placeholder="State"
                      value={form.state}
                      onChange={handleChange}
                      required
                    />

                  </div>


                  {/* PINCODE */}

                  <div className="col-md-4">

                    <input
                      className="form-control"
                      name="pincode"
                      placeholder="Pincode"
                      value={form.pincode}
                      onChange={handleChange}
                      required
                    />

                  </div>

                </div>


                {/* ================================= */}
                {/* FORM BUTTONS */}
                {/* ================================= */}

                <div className="d-flex gap-2 mt-3">


                  {/* SAVE */}

                  <button
                    className="btn btn-danger"
                    type="submit"
                  >

                    {editingId
                      ? "Update address"
                      : "Save address"}

                  </button>


                  {/* CANCEL */}

                  <button
                    className="btn btn-outline-secondary"
                    type="button"
                    onClick={handleCancel}
                  >

                    Cancel

                  </button>

                </div>

              </form>

            )}

          </div>

        </div>

      </div>

    </div>

  );

};

export default Address;