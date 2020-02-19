<script>
  import Navbar from "./Navbar.svelte";
  import Sidebar from "./Sidebar.svelte";
  import Form from "./Form.svelte";
  import Info from "./Info.svelte";
  import Frame from "./Frame.svelte";

  let application = "Equity Audit Tool";
  let description = `${application} aims to put an end to sexism in language by taking in a website URL and scraping it for gender-marked terms. For example, "fireman" or "mankind" would be considered marked for their referral to men specifically, and could be replaced with "firefighter" or "humankind" respectively.`;
  let source = "//www.youtube.com";

  const scrape = e => {
    const newSource = e.detail; // detail is what we dispatched in addplayer
    console.log(e.detail);
    source = newSource; // players is immutable (like state in react), so we have to spread out a copy and add the new thing to it
  };
</script>

<style>
  .App {
    padding: 0;
    background-color: #fdfdfd;
  }
  .content-wrapper {
    height: 100vh;
    padding: 0 2rem 0 2rem;
  }
  .left,
  .right {
    padding: 0;
  }
</style>

<div class="App container-fluid">
  <Navbar {application} />
  <div class="content-wrapper row">
    <div class="col-lg-5 left">
      <div class="col-lg-12 right">
        <Form {application} {description} {source} />
      </div>
      <div class="col-lg-12">
        <Info on:scrape{scrape} />
      </div>
    </div>
    <div class="col-lg-7">
      <Frame {source} />
    </div>
  </div>
</div>
