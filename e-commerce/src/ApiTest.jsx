import React, { useEffect } from "react";
import { getProducts } from "./services/productApi";

function ApiTest() {

  useEffect(() => {

    getProducts()
      .then((response) => {
        console.log("Backend Products:", response.data);
      })
      .catch((error) => {
        console.error("Backend Error:", error);
      });

  }, []);

  return (
    <div>
      <h2>Backend API Test</h2>
      <p>Check browser console</p>
    </div>
  );
}

export default ApiTest;