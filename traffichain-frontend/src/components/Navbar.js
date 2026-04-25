import { NavLink } from "react-router-dom";

function Navbar() {
  const role = localStorage.getItem("role");

  return (
    <nav>
      <NavLink to="/dashboard">Dashboard</NavLink>

      {role === "admin" && (
        <>
          <NavLink to="/add-violation">Add Violation</NavLink>
          <NavLink to="/view-reports">View No Parking Reports</NavLink>
        </>
      )}

      <NavLink to="/logout">Logout</NavLink>
      <Link to="/reports">Reports</Link>
    </nav>
  );
}
alert("Violation added");
// stay on same page

<NavLink to="/admin">Admin Dashboard</NavLink>

{tab === "form" && <NoParkingReport />}
{tab === "view" && <ViewReports />}

<div className="navbar">
  <div>
    <NavLink to="/admin" className="nav-link">Dashboard</NavLink>
    <NavLink to="/reports" className="nav-link">Reports</NavLink>
    <NavLink to="/violations">View Violations</NavLink>
    <NavLink to="/report-no-parking">🚫 Report</NavLink>
<NavLink to="/view-reports">📄 View Reports</NavLink>
  </div>


  <button className="btn btn-delete">Logout</button>
</div>



export default Navbar;