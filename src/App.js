import "./App.css";
import axios from "axios";
import { useState } from "react";

function App() {
  const [flowState, setFlowState] = useState("CREATE-GATE");
  const [formDetails, setFormDetails] = useState({
    inBoundLanes: "",
    outBoundLanes: "",
    handlingLocations: "",
  });
  const [truckFormDetails, setTruckFormDetails] = useState({
    deliver: "",
    receive: "",
  });
  const [gateDetails, setGateDetails] = useState({
    DELIVER: "",
    RECEIVE: "",
  });
  const [truckDetails, setTruckDetails] = useState([]);

  // Api's
  const getReciverAndDeliver = () => {
    setInterval(function () {
      axios
        .get(`http://localhost:8080/api/trucks/gate`)
        .then((response) => setGateDetails(response.data));
    }, 1000);
  };

  const getTruckLocation = () => {
    setInterval(function () {
      axios
        .get(`http://localhost:8080/api/trucks/location`)
        .then((response) => {
          setTruckDetails(response.data);
        });
    }, 1000);
  };

  const createGate = () => {
    axios
      .post(`http://localhost:8080/api/gate/create`, {
        inBoundLanes: formDetails.inBoundLanes,
        outBoundLanes: formDetails.outBoundLanes,
        handlingLocations: formDetails.handlingLocations,
      })
      .then((response) => {
        setFlowState("ADDING-TRUCK");
      })
      .catch((err) => console.log(err));
  };

  const sendTrucks = ({ receive, deliver }) => {
    let arr = [];

    for (let i = 0; i < deliver; i++) {
      arr.push({ type: "DELIVER" });
    }

    for (let i = 0; i < receive; i++) {
      arr.push({ type: "RECEIVE" });
    }

    axios
      .post(`http://localhost:8080/api/trucks/send`, arr)
      .then((response) => {
        console.log(response);
      })
      .catch((err) => console.log(err));
  };

  // Handlers

  const handleGateChange = (event) => {
    setFormDetails({ ...formDetails, [event.target.id]: event.target.value });
  };

  const handleGateSubmit = (event) => {
    // prevents the submit button from refreshing the page
    event.preventDefault();
    createGate();
  };

  const handleTruckChange = (event) => {
    setTruckFormDetails({
      ...truckFormDetails,
      [event.target.id]: event.target.value,
    });
  };

  const handleTruckSubmit = (event) => {
    // prevents the submit button from refreshing the page
    event.preventDefault();
    sendTrucks(truckFormDetails);
    setFlowState("SIM-LAUNCHED");
    getTruckLocation();
    getReciverAndDeliver();
  };

  // Render functions

  const renderGateForm = () => {
    return (
      <div>
        <h2>Gate creation process</h2>
        <form onSubmit={handleGateSubmit} className="gate-form">
          <label htmlFor="inBoundLanes">Inbound lanes</label>
          <input
            id="inBoundLanes"
            required
            onChange={(e) => handleGateChange(e)}
            value={formDetails.inBoundLanes}
            disabled={flowState !== "CREATE-GATE"}
            type="number"
          ></input>
          <label htmlFor="outBoundLanes">Outbound lanes</label>
          <input
            id="outBoundLanes"
            required
            onChange={(e) => handleGateChange(e)}
            value={formDetails.outBoundLanes}
            disabled={flowState !== "CREATE-GATE"}
            type="number"
          ></input>
          <label htmlFor="handlingLocations">Handling locations</label>
          <input
            id="handlingLocations"
            required
            onChange={(e) => handleGateChange(e)}
            value={formDetails.handlingLocations}
            disabled={flowState !== "CREATE-GATE"}
            type="number"
          ></input>
          <button type="submit" disabled={flowState !== "CREATE-GATE"}>
            Create gate
          </button>
        </form>
      </div>
    );
  };

  const renderTruckForm = () => {
    return (
      <div>
        <h2>Truck sending process</h2>
        <form onSubmit={handleTruckSubmit} className="gate-form">
          <label htmlFor="deliver">Deliver Trucks</label>
          <input
            id="deliver"
            required
            onChange={(e) => handleTruckChange(e)}
            value={truckFormDetails.deliver}
            type="number"
          ></input>
          <label htmlFor="receive">Reciver Trucks</label>
          <input
            id="receive"
            required
            onChange={(e) => handleTruckChange(e)}
            value={truckFormDetails.receive}
            type="number"
          ></input>
          <button type="submit">Send trucks</button>
        </form>
      </div>
    );
  };

  const renderGateDetails = () => {
    if (flowState === "CREATE-GATE" || flowState === "ADDING-TRUCK") {
      return;
    }
    return (
      <div className="gate-details">
        <div className="gate-details-header">
          <p>Gate details</p>
        </div>
        <p>Deliver: {gateDetails.DELIVER}</p>
        <p>Reciver: {gateDetails.RECEIVE}</p>
      </div>
    );
  };

  const renderTruckTable = () => {
    if (truckDetails.length === 0) {
      return;
    }

    return (
      <div className="truck-table">
        <div className="table-header">
          <p>Truck ID</p>
          <p>Truck status</p>
        </div>

        <div className="table-body">
          {truckDetails.map((truck) => {
            const toLower = truck.truckLocation
              .toLowerCase()
              .replaceAll("_", " ");
            const firstLetter = toLower.charAt(0);
            const firstLetterCap = firstLetter.toUpperCase();
            const remainingLetters = toLower.slice(1);
            const capitalizedWord = firstLetterCap + remainingLetters;

            return (
              <>
                <div className="table-row">Truck {truck.id}</div>
                <div className="table-row">{capitalizedWord}</div>
              </>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="background">
      <div className="card">
        <h1>TBA terminal simulation</h1>
        <div className="formContainer">
          {renderGateForm()}
          {renderTruckForm()}
        </div>
        <div className="details-tab">
          {renderTruckTable()}
          {renderGateDetails()}
        </div>
      </div>
    </div>
  );
}

export default App;
