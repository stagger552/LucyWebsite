// WebSocket URL
const wsUrl = 'wss://lucy.kprs-ai.online/LivaData';

// Open WebSocket connection
const socket = new WebSocket(wsUrl);

// Define the DOM elements
const baseDataRow = document.getElementById('baseDataRow');
const callDataRows = document.getElementById('callDataRows');

// Function to update base data table
function updateBaseData(data) {
    baseDataRow.innerHTML = `
        <td>${data.ActiveCalls}</td>
        <td>${data.Calls24Hours}</td>
        <td>${data.Calls8Hours}</td>
        <td>${data.CallsHours}</td>
        <td>${data.SuccesfulCalls}</td>
        <td>${data.DoorgestuurdAmount}</td>
        <td>${data.WebsocketServer}</td>
        <td>${data.Datetime}</td>
    `;
}

// Function to update call data table
function updateCallData(callId, callData) {
    const newRow = document.createElement('tr');
    newRow.innerHTML = `
        <td>${callId}</td>
        <td>${callData.callinfo}</td>
        <td>${callData.FromNumberr}</td>
        <td>${callData.ToNumberr}</td>
        <td>${callData.Twillio.Duration} seconds</td>
        <td>${callData.Twillio.StartTime}</td>
        <td><a href="${callData.Twillio.RecordingURL}" target="_blank">Recording</a></td>
    `;
    callDataRows.appendChild(newRow);
}

// Listen to WebSocket messages
socket.onmessage = function(event) {
    const data = JSON.parse(event.data);

    // Update base data
    if (data.type === "callData" && data.data) {
        const baseData = data.data;
        updateBaseData(baseData);

        // Loop through all call IDs and update the table
        for (let callId in baseData.callId) {
            const callData = baseData.callId[callId];
            updateCallData(callId, callData);
        }
    }
};

// Handle WebSocket errors
socket.onerror = function(error) {
    console.log('WebSocket Error: ' + error);
};

// Handle WebSocket connection close
socket.onclose = function() {
    console.log('WebSocket connection closed');
};
