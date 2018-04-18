const baseUrl = "https://newsapi.org";

function getSources() {
  let sources = document.querySelector("#sources");
  let endpoint = encodeURI(baseUrl+"/v2/sources");

  return HTTP("GET", endpoint).then(function(res) {
    var result = res.sources;
    console.log(result)
    for(var i = 0; i < result.length; i++) {
      var opt = document.createElement('option');
      opt.innerHTML = result[i].name;
      opt.value = result[i].id;
      sources.appendChild(opt);
    }

    return sources;
  }, function(err) {
    console.log(err);
  });
}

function populateCountries() {
  let selectedCountry = document.querySelector("#countries");

  return countries.forEach(country => {
    var opt = document.createElement('option');
    opt.innerHTML = country.country;
    opt.value = country.code;
    (country.selected) ? opt.selected = country.selected : null;
    selectedCountry.appendChild(opt);
  });
}

function displayHeadlines(result) {
  for(var i = 0; i < result.length; i++) {
    var headline = document.createElement('div');
    var headlineImg = new Image(200, 150) //document.createElement('img')
    var headline_content = document.createElement('div')
    var headline_title = document.createElement('h1')
    var headline_desc = document.createElement('div')
    var headline_desc_child = document.createElement('small')
    var headline_actions = document.createElement('div')
    var favAction = document.createElement('small')
    var actionIcon = document.createElement('i');
    headline.setAttribute('class', 'news-feed');
    headline_content.setAttribute('class', 'feed-content')
    headlineImg.setAttribute('class', 'headline-img');  
    headlineImg.alt = "Headline image"
    headlineImg.id = "headline-img"+i
    headlineImg.src = result[i].urlToImage;
    headline_content.appendChild(headlineImg);
    

    headline_title.setAttribute('class', 'feed-title')
    headline_title.innerHTML = "<a href='"+result[i].url+"' target='_blank'>"+result[i].title+"</a>"
    headline_content.appendChild(headline_title);

    headline_desc_child.innerHTML = result[i].description + " <span class='source'>["+ result[i].source.name + "]</span>";
    headline_desc.appendChild(headline_desc_child)
    headline_content.appendChild(headline_desc)
    
    headline_actions.setAttribute('class', 'feed-actions')
    favAction.setAttribute('class', 'fav')
    actionIcon.setAttribute('class', 'mdi mdi-heart')    
    favAction.innerHTML = '<span>Favourite</span>'
    favAction.insertBefore(actionIcon, favAction.childNodes[0])
    headline_actions.appendChild(favAction)
    headline_content.appendChild(headline_actions)

    headline.appendChild(headline_content)
    headlines.appendChild(headline)
  
  }
}

function fetchTopHeadlines() {
  let headlines = document.querySelector("#headlines");
  let selectedCountry = document.getElementById('countries').value;
  let endpoint = encodeURI(baseUrl+"/v2/top-headlines?country="+selectedCountry);

    return HTTP("GET", endpoint).then(async function(res) {
      var result = res.articles;
      
      displayHeadlines(result);

      return result;
    }, function(err) {
      console.log(err);
    });
}

function fetchFromSource() {
  let selectedSource = document.getElementById("sources").value;
  let endpoint = encodeURI(baseUrl+"/v2/top-headlines?sources="+selectedSource);

    return HTTP("GET", endpoint).then(async function(res) {
      var result = res.articles;
      
      displayHeadlines(result);

      return result;
    }, function(err) {
      console.log(err);
    });
}

document.querySelector("#countries").addEventListener("change", function() {
  var allHeadlines = document.getElementById("headlines");
  var i = 0
  while(allHeadlines.hasChildNodes())
  {
    allHeadlines.removeChild(allHeadlines.childNodes[0]);
    if(allHeadlines.hasChildNodes()) {i++}
  }
  return fetchTopHeadlines();
  //return window.location.reload();
})


document.querySelector("#sources").addEventListener("change", function() {
  var allHeadlines = document.getElementById("headlines");
  var i = 0
  while(allHeadlines.hasChildNodes())
  {
    allHeadlines.removeChild(allHeadlines.childNodes[0]);
    if(allHeadlines.hasChildNodes()) {i++}
  }
  return fetchFromSource();
})


