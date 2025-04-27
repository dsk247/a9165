// guest.js: Handle form submission for report
document.getElementById('reportForm').addEventListener('submit', function(e) {
  e.preventDefault();
  const form = this;
  const formData = new FormData(form);
  fetch('/submit-report', {
    method: 'POST',
    body: formData
  })
  .then(res => res.json())
  .then(data => {
    if (data.message) {
      alert(data.message);
      form.reset(); // Clear the form on success
    } else if (data.error) {
      alert('Error: ' + data.error);
    }
  })
  .catch(error => console.error('Error submitting report:', error));
});
