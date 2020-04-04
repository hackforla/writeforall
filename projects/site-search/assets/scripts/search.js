function defaultSites() {
  return [
    "apnews.com",
    "news.yahoo.com",
    "news.google.com",
    "cnn.com",
    "usatoday.com",
    "foxnews.com",
    "www.prnewswire.com",
  ].join("\n")
}

function defaultTerms() {
  return [
    "anchorman",
    "businessman",
    "cameraman",
    "chairman",
    "clergyman",
    "councilman",
    "committeeman",
    "congressman",
    "craftsman",
    "doorman",
    "everyman",
    "fireman",
    "fisherman",
    "freshman",
    "gentleman",
    "layman",
    "lineman",
    "mailman",
    "mankind",
    "manmade",
    "manhole",
    "manpower",
    "middleman",
    "newsman",
    "ombudsman",
    "policeman",
    "postman",
    "spokesman",
    "statesman",
    ].join("\n")
}

function getSitesAsText() {
  return document.getElementById("sites").value
}

function getTermsAsText() {
  return document.getElementById("terms").value
}

function parseSitesAsText(sitesAsText) {
  return sitesAsText.trim().split(/[\n\r\t ,]+/)
}

function parseTermsAsText(termsAsText) {
  return termsAsText.trim().replace(/,/g, " ").replace(/\t/g, " ").replace(/  +/g, " ").split(/ *\n */)
}

function formatSitesAsSearch(sites) {
  return "( " + sites.map(site => "site:" + site).join(" | ") + " )" 
}

function formatTermsAsSearch(terms) {
  return "( " + terms.map(word => "intext:" + word).join(" | ") + " )"
}

function init() {
  let params = new URLSearchParams(window.location.search)
  initSitesTextArea(params)
  initTermsTextArea(params)
  initSitesInputFile()
  initTermsInputFile()
}

function initSitesTextArea(params) {
  document.getElementById("sites").innerHTML = params.get("sites") || defaultSites()
}

function initTermsTextArea(params) {
  document.getElementById("terms").innerHTML = params.get("terms") || defaultTerms()
}

function initSitesInputFile() {
  let sitesInputFileElement = document.getElementById('sites-input-file')
  if (sitesInputFileElement) {
    sitesInputFileElement.addEventListener('change', function(event){ uploadFileToElementId(event.target, 'sites'); }, false);
  }
}

function initTermsInputFile() {
  let termsInputFileElement = document.getElementById('terms-input-file')
  if (termsInputFileElement) {
    termsInputFileElement.addEventListener('change', function(event){ uploadFileToElementId(event.target, 'terms'); }, false);
  }
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
  init()
  initSitesInputFile()
  initTermsInputFile()
  document.getElementById('searcher').addEventListener("submit",function(e) {
    e.preventDefault(); // before the code
    let sites = parseSitesAsText(getSitesAsText())
    let terms = parseTermsAsText(getTermsAsText())
    let query = formatSitesAsSearch(sites) + " " + formatTermsAsSearch(terms)
    window.location = "https://www.google.com/search?q=" + encodeURIComponent(query);
  });
});
