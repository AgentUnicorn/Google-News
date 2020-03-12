
// async function callAPI(){}
let newsArea = document.getElementById('newsArea');
let searchBtn = document.getElementById('searchBtn');
let inputSearch = document.getElementById('inputSearch');
let sourceArea = document.getElementById('sourceArea');
let categoryDropdown = document.getElementById('categoryDropdown')
let categories = ['All', 'Business', 'Entertainment', 'General', 'Health', 'Science','Sports', 'Technology'];
let searchItem
let newsList = []


inputSearch.addEventListener("keydown", function(e) {
    if (e.keyCode === 13) {
      addSearch(value);
    }
  });

let callAPI = async(inputSearch) => {
    let apiKey = '2f242f39120d4a52a5bdbd62340c9fa6'
    let url =`https://newsapi.org/v2/everything?q=${inputSearch}&page=${pageLoad}&apiKey=${apiKey}`

    let data = await fetch(url);
    let result = await data.json();

    newsList = result.articles;

    console.log("data",data)
    console.log("jason", result);

    searchBySource();

    render(newsList);
}

let render=(array)=>{      
    let htmlForNews = array.map((item)=>{         
        return  `<div class="card mb-3" id="news">
        <div class="row no-gutters">
          <div class="col-md-4">
            <img src="${item.urlToImage}" class="card-img" alt="...">
          </div>
          <div class="col-md-8">
            <div class="card-body">
              <h5 class="card-title">${item.title}</h5>
              <p class="card-text">${item.description}</p>
              <p class="card-text"><small class="text-muted">${item.publishedAt}</small></p>
              <p class="card-text"><small class="text-muted">${item.source.name}</small></p>
            </div>
          </div>
        </div>
    </div> `          
    }).join('')      

    // sortName(newsList);
    
    document.getElementById('newsArea').innerHTML= htmlForNews  
}

let addSearch = (value) => {
    searchItem = inputSearch.value;
    console.log("Hello",searchItem)
    callAPI(searchItem);
    render();
    document.getElementById('inputSearch').value = '';
}
pageLoad = 1;
callAPI("Google");

// Load more news function

let loadMore = async () => {
    pageLoad++;
    let apiKey = '2f242f39120d4a52a5bdbd62340c9fa6'
    let url =`https://newsapi.org/v2/everything?q=${searchItem}&page=${pageLoad}&apiKey=${apiKey}`

    let data = await fetch(url);
    let result = await data.json();
      
    newsList = newsList.concat(result.articles);
    
    render(newsList);
}

// Sort by Categories

let fetchNews = async (category) => {
    let apiKey = '2f242f39120d4a52a5bdbd62340c9fa6'
    let url = `https://newsapi.org/v2/top-headlines?q=${searchItem}&category=${category}&apiKey=${apiKey}`

    let data = await fetch(url);
    let result = await data.json();

    newsList = result.articles;

    render(newsList);
}

let generateCate = (categories) => {
    let html = categories.map((cat) => {
      return `<button onclick="sortCate('${cat}')" ${cat == 'All' && 'active'} class="dropdown-item" type="button">
      ${cat}
      </button>`;
    }).join('');
    document.getElementById("categoryDropdown").innerHTML = html;  
}

let sortCate = (cat) => {
  fetchNews(cat.toLowerCase());
}

generateCate(categories);

let searchByCategory = async () => {
  let category = document.getElementById("category").value;
  let url = `http://newsapi.org/v2/top-headlines?category=${category}&apiKey=${apiKey}`;
  let data = await fetch(url);
  let result = await data.json();

  newsList = result.articles;
  render(newsList);
};

let searchBySource = () => {
  let sourceNames = newsList.map((item) => item.source.name);

  let sourceObject = sourceNames.reduce((total, name) => {
    console.log("total:", total);
    if (name in total) {
      total[name]++;
    } else {
      total[name] = 1;
    }
    return total;
  }, {});

  let sourceArray = Object.keys(sourceObject);

  let htmlForSource = sourceArray.map((item) =>
      `<input onchange='sourceClicked("${item}")' type="checkbox" id="${item}"/> ${item} (${sourceObject[item]})`
  );

  document.getElementById("sourceArea").innerHTML = htmlForSource;
};

let sourceClicked = (index) => {
  if (document.getElementById(index).checked == true) {
    let filterNews = newsList.filter((item) => item.source.name === index)
    render(filterNews);
  } else {
    render(newsList);
  }
}