import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Machines from "./pages/Machines";
import AddMachine from "./pages/AddMachine";
import EditMachine from "./pages/EditMachine";
import Technicians from "./pages/Technicians";
import Alerts from "./pages/Alerts";
import Reports from "./pages/Reports";

import PrivateRoute from "./utils/PrivateRoute";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        <Route path="/" element={<Login />} />

        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />

        <Route
          path="/machines"
          element={
            <PrivateRoute>
              <Machines />
            </PrivateRoute>
          }
        />

        <Route
          path="/machines/add"
          element={
            <PrivateRoute>
              <AddMachine />
            </PrivateRoute>
          }
        />

        <Route
          path="/machines/edit/:id"
          element={
            <PrivateRoute>
              <EditMachine />
            </PrivateRoute>
          }
        />

        <Route
          path="/technicians"
          element={
            <PrivateRoute>
              <Technicians />
            </PrivateRoute>
          }
        />

        <Route
          path="/alerts"
          element={
            <PrivateRoute>
              <Alerts />
            </PrivateRoute>
          }
        />

        <Route
          path="/reports"
          element={
            <PrivateRoute>
              <Reports />
            </PrivateRoute>
          }
        />

      </Routes>
    </BrowserRouter>
  );
}

export default App;
