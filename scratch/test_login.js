async function testLogin() {
  try {
    const response = await fetch('http://localhost:5000/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        username: 'admin',
        password: 'password123'
      })
    });
    
    const data = await response.json();
    console.log('Login Status:', response.status, data);
  } catch (err) {
    console.error('Network Error:', err.message);
  }
}

testLogin();
