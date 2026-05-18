const fetch = require('node-fetch') || fetch;

async function checkRole() {
  try {
    const res = await fetch('http://localhost:8080/api/v1/auth/debug-info');
    const data = await res.json();
    const krishRole = data.roles.find(r => r._id === "6a0575912441a312cf9fd8fc");
    console.log(JSON.stringify(krishRole, null, 2));
  } catch (err) {
    console.error('Fetch error:', err);
  }
}

checkRole();
