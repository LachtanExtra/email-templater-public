<template>
  <div class="home-container">
    <h1 class="welcome-text">Welcome back!</h1>
    <div class="card-grid">
      <router-link to="/templates" class="nav-card">
        <h2>📄 Templates</h2>
        <p>View and manage your saved templates.</p>
      </router-link>
      <router-link to="/contacts" class="nav-card">
        <h2>👥 Contacts</h2>
        <p>Access and organize your contacts list.</p>
      </router-link>
    </div>
  </div>
</template>
  
<style scoped>
  .home-container {
    padding: 2rem;
    color: white;
    max-width: 960px;
    margin: auto;
  }
  
  .welcome-text {
    font-size: 2rem;
    margin-bottom: 2rem;
    text-align: center;
    text-shadow: 0 0 5px hsla(105, 100%, 50%, 0.5),
                 0 0 10px hsla(105, 100%, 50%, 0.3);
  }
  
  .card-grid {
    display: flex;
    flex-wrap: wrap;
    gap: 2rem;
    justify-content: center;
  }
  
  .nav-card {
    background-color: rgba(255, 255, 255, 0.05);
    padding: 1.5rem;
    border-radius: 12px;
    text-align: center;
    width: 240px;
    text-decoration: none;
    color: hsla(105, 100%, 50%, 1);
    box-shadow: 0 0 6px hsla(105, 100%, 50%, 0.2);
    transition: all 0.3s ease;
  }
  
  .nav-card:hover {
    background-color: rgba(255, 255, 255, 0.08);
    color: white;
    box-shadow: 0 0 12px hsla(105, 100%, 50%, 0.6),
                0 0 24px hsla(105, 100%, 50%, 0.3);
    transform: translateY(-4px);
  }
  
  .nav-card h2 {
    margin-bottom: 0.5rem;
    font-size: 1.4rem;
  }
  
  .nav-card p {
    font-size: 0.95rem;
    color: #ccc;
  }
</style>