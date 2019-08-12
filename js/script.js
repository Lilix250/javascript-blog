const titleClickHandler = function(event){
  event.preventDefault();
  const clickedElement = this;

  const activeLinks = document.querySelectorAll('.titles a.active');
  for(let activeLink of activeLinks){
    activeLink.classList.remove('active');
  }

  clickedElement.classList.add('active');
    
  const activeArticles = document.querySelectorAll('.posts .post');
  for (let activeArticle of activeArticles){
    activeArticle.classList.remove('active');
  }
    
  const href = clickedElement.getAttribute('href');
  const selecterArticle = document.querySelector(href);
  selecterArticle.classList.add('active');
};


const optArticleSelector = '.post',
  optTitleSelector = '.post-title',
  optTitleListSelector = '.titles',
  optArticleTagsSelector = '.post-tags .list';
  
function generateTitleLinks(customSelector = ''){

  const titleList = document.querySelector(optTitleListSelector);
  titleList.innerHTML = '';
    
  const articles = document.querySelectorAll(optArticleSelector + customSelector);
  let html = '';
  for(let article of articles){
    const articleId = article.getAttribute('id');
    const articleTitle = article.querySelector(optTitleSelector).innerHTML;
    const linkHTML = '<li><a href="#' + articleId  + '"><span>' + articleTitle + '</span></a></li>';
    html += linkHTML;
  }
   
  titleList.insertAdjacentHTML('beforeend', html);
  const links = document.querySelectorAll('.titles a');
  for(let link of links){
    link.addEventListener('click', titleClickHandler);
  }  
}

generateTitleLinks();


function generateTags() {
  const articles = document.querySelectorAll('.post');
  for(let article of articles){
    const titleList = article.querySelector(optArticleTagsSelector);
    let html = '';
    const articleTags = article.getAttribute('data-tags');
    const articleTagsArray = articleTags.split(' ');
    for(let tag of articleTagsArray){
      const linkHTML = '<li><a href="#' + 'tag-' + tag + '">' + tag + '</a></li>';
      html += linkHTML;
    }
    titleList.insertAdjacentHTML('afterbegin', html);
  }
}
generateTags();

function tagClickHandler(event){
  event.preventDefault();
  const clickedElement = this;
  const href = clickedElement.getAttribute('href');
  const tag = href.replace('#tag-', '');
  const activeTagLinks = document.querySelectorAll('a.active[href^="#tag-"]');
  for(let activeTagLink of activeTagLinks){
    activeTagLink.classList.remove('active');
  }
  const tags = document.querySelectorAll('[href="' + href + '"]');
  for(let tag of tags){
    tag.classList.add('active');
  }

  generateTitleLinks('[data-tags~="' + tag + '"]');
}
  
function addClickListenersToTags(){
  const links = document.querySelectorAll('.post-tags .list a');
  for(let link of links){
    link.addEventListener('click', tagClickHandler);   
  }
}
  
addClickListenersToTags();


function generateAuthors() {
  const articles = document.querySelectorAll('.post');
  for(let article of articles){
    const articleAuthor = article.getAttribute('data-author');
    const linkHTML = '<a href="#author-' + articleAuthor +'">by '+ articleAuthor +'</a>';
    const postAuthor = article.querySelector('.post-author');
    postAuthor.insertAdjacentHTML('afterbegin' , linkHTML);
  }
}

generateAuthors();

const authorClickHandler = function(event) {
  event.preventDefault();
  const clickedElement = this;   
  const href = clickedElement.getAttribute('href');
  const author = href.replace('#author-', '');
  const activeAuthorLinks = document.querySelectorAll('a.active[href^="#author-"]');
  for(let activeAuthorLink of activeAuthorLinks){
    activeAuthorLink.classList.remove('active');
  }
  const authors = document.querySelectorAll('[href="' + href + '"]');
  for(let author of authors){
    author.classList.add('active');
  }
  generateTitleLinks('[data-author="' + author + '"]');

};

function addClickListenersToAuthors() {
  const links = document.querySelectorAll('.post-author a');
  for(let link of links){
    link.addEventListener('click', authorClickHandler);
  }
}

addClickListenersToAuthors();