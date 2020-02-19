<script>
  export let application; // allow application to be passed in as prop
</script>

<style>
  nav {
    background-color: #e8e8e8;
    height: 10vh;
  }

  .app-title {
    color: #d9d9d9;
    text-shadow: -1px -1px 1px rgba(255, 255, 255, 0.1),
      1px 1px 1px rgba(0, 0, 0, 0.5);
  }

  .nav-link {
    color: #919191;
  }

  i {
    color: #c4c4c4;
    background: #e8e8e8;
    text-shadow: -1px -1px 1px rgba(255, 255, 255, 0.1),
      1px 1px 1px rgba(0, 0, 0, 0.5);
  }
</style>

<nav class="navbar">
  <h1 class="app-title">
    <i class="fas fa-search" />
    {application}
  </h1>
  <a href="#" class="nav-link">Register | Login</a>
</nav>
