// admin.js: Handle admin login and fetching reports
document.getElementById('loginForm').addEventListener('submit', function(e) {
  e.preventDefault();
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;
  fetch('/admin/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password })
  })
  .then(res => {
    if (!res.ok) {
      throw new Error('Login failed');
    }
    return res.json();
  })
  .then(data => {
    // Hide login form and show reports section
    document.getElementById('loginForm').style.display = 'none';
    document.getElementById('reportsSection').style.display = 'block';
    // Fetch and display reports
    fetchReports();
  })
  .catch(error => {
    alert(error.message);
  });
});

function fetchReports() {
  fetch('/reports')
    .then(res => res.json())
    .then(data => {
      const table = document.getElementById('reportsTable');
      data.forEach(report => {
        const row = table.insertRow();
        row.insertCell().innerText = report.name;
        row.insertCell().innerText = report.location;
        row.insertCell().innerText = report.quality;
        row.insertCell().innerText = report.description;
        const imgCell = row.insertCell();
        const img = document.createElement('img');
        img.src = report.imageUrl;
        img.className = 'thumbnail';
        imgCell.appendChild(img);
      });
    })
    .catch(error => console.error('Error fetching reports:', error));
}
