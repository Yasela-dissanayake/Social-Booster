export default function TestAdmin() {
  return (
    <div style={{ 
      padding: '20px', 
      fontFamily: 'Arial, sans-serif',
      minHeight: '100vh',
      backgroundColor: '#f5f5f5',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <div style={{
        backgroundColor: 'white',
        padding: '40px',
        borderRadius: '8px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
        maxWidth: '400px',
        width: '100%'
      }}>
        <h1 style={{ textAlign: 'center', marginBottom: '30px', color: '#333' }}>
          Admin Login
        </h1>
        
        <form onSubmit={async (e) => {
          e.preventDefault();
          const formData = new FormData(e.target as HTMLFormElement);
          const username = formData.get('username') as string;
          const password = formData.get('password') as string;
          
          try {
            const response = await fetch('https://srv885171.hstgr.cloud/api/admin/login', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ username, password })
            });
            
            const data = await response.json();
            
            if (data.success) {
              localStorage.setItem('adminToken', data.token);
              window.location.href = '/admin';
            } else {
              alert(data.error || 'Login failed');
            }
          } catch (err) {
            alert('Connection error');
          }
        }}>
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
              Username:
            </label>
            <input 
              name="username"
              type="text" 
              defaultValue="admin"
              style={{ 
                width: '100%', 
                padding: '10px', 
                border: '1px solid #ddd', 
                borderRadius: '4px',
                boxSizing: 'border-box'
              }} 
            />
          </div>
          
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
              Password:
            </label>
            <input 
              name="password"
              type="password" 
              defaultValue="3QnWtSd0CynWzoEf"
              style={{ 
                width: '100%', 
                padding: '10px', 
                border: '1px solid #ddd', 
                borderRadius: '4px',
                boxSizing: 'border-box'
              }} 
            />
          </div>
          
          <button 
            type="submit"
            style={{ 
              width: '100%', 
              padding: '12px', 
              backgroundColor: '#007cba', 
              color: 'white', 
              border: 'none', 
              borderRadius: '4px', 
              fontSize: '16px',
              cursor: 'pointer'
            }}
          >
            Login to Admin Panel
          </button>
        </form>
        
        <div style={{
          marginTop: '20px',
          padding: '15px',
          backgroundColor: '#e7f3ff',
          borderRadius: '4px',
          fontSize: '14px'
        }}>
          <strong>Current Password:</strong> 3QnWtSd0CynWzoEf<br/>
          (Check server console for updates)
        </div>
      </div>
    </div>
  );
}