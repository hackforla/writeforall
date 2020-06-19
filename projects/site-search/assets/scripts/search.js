const DEFAULT_SITES = [
  "apnews.com",
];

const DEFAULT_TERMS = [
  "anchorman",
  "businessman",
  "cameraman",
  "chairman",
  "clergyman",
  "councilman",
  "committeeman",
  "congressman",
  "craftsman",
  "fireman",
  "fisherman",
  "freshman",
  "gentleman",
  "layman",
  "mailman",
  "mankind",
  "manmade",
  "manhole",
  "manpower",
  "middleman",
  "policeman",
  "postman",
  "spokesman",
  "statesman",
  "biologically male",
  "biologically female",
  "born male",
  "born female",
  "master branch",
  "master database",
  "slave database",
  "blacklist",
  "whitelist",
];

function getSites() {
  let e = document.getElementById("sites"); 
  return (e ? parseSitesAsText(e.value) : DEFAULT_SITES);
}

function getTerms() {
  let e = document.getElementById("terms");
  return (e ? parseTermsAsText(e.value) : DEFAULT_TERMS);
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
  initSitesInputText(params)
  initTermsInputText(params)
  initSitesInputFile()
  initTermsInputFile()
}

function initSitesInputText(params) {
  let e = document.getElementById("sites");
  if (e) {
    switch(e.type) {
      case "textarea":
        e.innerHTML = params.get("sites") || DEFAULT_SITES.join("\n");
        break;
      case "text":
        e.value = params.get("sites") || DEFAULT_SITES[0]; 
        break;
      default:
        console.log("initSitesInputText type:" + e.type + " not found")
    }
  }
}

function initTermsInputText(params) {
  let e = document.getElementById("terms");
  if (e) {
    switch(e.type) {
      case "textarea":
        e.innerHTML = params.get("terms") || DEFAULT_TERMS.join("\n");
        break;
      case "text":
        e.value = params.get("terms") || DEFAULT_TERMS[0];
        break;
      default:
        console.log("initTermsInputText type:" + e.type + " not found")
    }
  }
}

function initSitesInputFile() {
  let e = document.getElementById('sites-input-file')
  if (e) {
    e.addEventListener('change', function(event){ uploadFileToElementId(event.target, 'sites'); }, false);
  }
}

function initTermsInputFile() {
  let e = document.getElementById('terms-input-file')
  if (e) {
    e.addEventListener('change', function(event){ uploadFileToElementId(event.target, 'terms'); }, false);
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
    let sites = getSites()
    let terms = getTerms()
    let query = formatSitesAsSearch(sites) + " " + formatTermsAsSearch(terms)
    window.location = "https://www.google.com/search?q=" + encodeURIComponent(query);
  });
});
