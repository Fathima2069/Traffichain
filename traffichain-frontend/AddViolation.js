// src/pages/AddViolation.js
import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

<form onSubmit={handleSubmit}>
  <div>
    <label>Vehicle Number</label>
    <input type="text" value={vehicleNumber} onChange={(e) => setVehicleNumber(e.target.value)} required />
  </div>

  <div>
    <label>Violation Type</label>
    <input type="text" value={violationType} onChange={(e) => setViolationType(e.target.value)} required />
  </div>

  <div>
    <label>Location</label>
    <input type="text" value={location} onChange={(e) => setLocation(e.target.value)} required />
  </div>

  <div>
    <label>Fine Amount</label>
    <input type="number" value={fineAmount} onChange={(e) => setFineAmount(e.target.value)} required />
  </div>

  <div>
    <label>Upload Image (optional)</label>
    <input type="file" onChange={(e) => setImage(e.target.files[0])} />
  </div>

  <button type="submit">Add Violation</button>
</form>