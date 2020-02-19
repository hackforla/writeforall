<script>
  export let source;
</script>

<style>
  .iframe-wrapper {
    border: #727272 dotted 1px;
    margin: 2rem 2rem 2rem 2rem;
    height: 78vh;
    background-color: white;
  }
  iframe {
    height: 100%;
    width: 100%;
  }
</style>

<div class="iframe-wrapper">
  <iframe src={source} frameborder="0" />
</div>
