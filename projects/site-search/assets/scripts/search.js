function init() {
  let params = new URLSearchParams(window.location.search);
  document.getElementById("sites").innerHTML = params.get("sites") || "www.example.com"
  document.getElementById("words").innerHTML = params.get("words") || "actress\nairman\nanchorman\nbellboy\nbusinessman\ncaveman\nchairman\nclergyman\ncouncilman\ncommitteeman\ncongressman\ncraftsman\ndoorman\neveryman\nfireman\nfreshman\ngentleman\nlayman\nlineman\nmailman\nmankind\nman-made\nmanhole\nmanpower\nmiddleman\nnewsman\nombudsman\npoliceman\npostman\nspokesman\nstatesman\nstewardess\n";
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function uploadFileToElementId(input, elementId) {
  if ('files' in input && input.files.length > 0) {
      placeFileContent(
      document.getElementById(elementId),
      input.files[0])
  }
}

function placeFileContent(target, file) {
    readFileContent(file).then(content => {
      target.value = content
  }).catch(error => console.log(error))
}

function readFileContent(file) {
    const reader = new FileReader()
  return new Promise((resolve, reject) => {
    reader.onload = event => resolve(event.target.result)
    reader.onerror = error => reject(error)
    reader.readAsText(file)
  })
}

window.addEventListener("load",function() {
  init();
  document.getElementById('sites-input-file').addEventListener('change', function(event){ uploadFileToElementId(event.target, 'sites'); }, false);
  document.getElementById('words-input-file').addEventListener('change', function(event){ uploadFileToElementId(event.target, 'words'); }, false);
  document.getElementById('searcher').addEventListener("submit",function(e) {
    e.preventDefault(); // before the code
    let sites = document.getElementById("sites").value.trim().split(/[\n\r\t ,]+/)
    let words = document.getElementById("words").value.trim().replace(/\n/g, " ").replace(/,/g, " ").replace(/\t/g, " ").replace(/  +/g, " ").split(" ");
    let terms = " ( " + words.map(word => "intext:" + word).join(" | ") + " )"
    for (site of sites) {
      let query = "site:" + site + terms;
      let uri = "https://www.google.com/search?q=" + encodeURIComponent(query);
      window.open(uri);
    }
  });
});
