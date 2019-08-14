const templates = {
  articleLink: Handlebars.compile(document.querySelector('#template-article-link').innerHTML),
  articleTagLink: Handlebars.compile(document.querySelector('#template-tag-link').innerHTML),
  authorsLink: Handlebars.compile(document.querySelector('#template-author-link').innerHTML),
  tagCloudLink: Handlebars.compile(document.querySelector('#template-tag-cloud-link').innerHTML),
  authorCloudLink: Handlebars.compile(document.querySelector('#template-author-cloud-link').innerHTML),
};




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
  optArticleTagsSelector = '.post-tags .list',
  optTagsListSelector = '.tags.list',
  optCloudClassCount = 3,
  optCloudClassPrefix = 'tag-size';
  
function generateTitleLinks(customSelector = ''){

  const titleList = document.querySelector(optTitleListSelector);
  titleList.innerHTML = '';
    
  const articles = document.querySelectorAll(optArticleSelector + customSelector);
  let html = '';
  for(let article of articles){
    const articleId = article.getAttribute('id');
    const articleTitle = article.querySelector(optTitleSelector).innerHTML;
    const linkHTMLData = {id: articleId, title: articleTitle};
    const linkHTML = templates.articleLink(linkHTMLData);
    html += linkHTML;
  }
   
  titleList.insertAdjacentHTML('beforeend', html);
  const links = document.querySelectorAll('.titles a');
  for(let link of links){
    link.addEventListener('click', titleClickHandler);
  }  
}

generateTitleLinks();

function calculateTagsParams(tags) {
  const tagNumbers = [];
  for (let tag in tags) {
    const tagNumber = tags[tag];
    tagNumbers.push(tagNumber);
  }

  return {
    min: Math.min(...tagNumbers),
    max: Math.max(...tagNumbers)
  };
}

function calculateTagClass(count, params) {
  console.log('count', count, 'params', params);
  const average = (params['min'] + params['max']) / 2;
  if (count == params['min']) {
    return '1';
  }
  if ( count == params['max']) {
    return '3';
  }
  if ( count == average) {
    return '2';
  }
}

function generateTags() {
  let allTags = {};
  const articles = document.querySelectorAll('.post');
  for(let article of articles){
    const titleList = article.querySelector(optArticleTagsSelector);
    let html = '';
    const articleTags = article.getAttribute('data-tags');
    const articleTagsArray = articleTags.split(' ');
    for(let tag of articleTagsArray){
      const linkHTMLData = {tag: tag};
      const linkHTML = templates.articleTagLink(linkHTMLData);
      html += linkHTML;
      if(!allTags.hasOwnProperty(tag)){
        /* [NEW] add generated code to allTags array */
        allTags[tag] = 1;
      } else {
        allTags[tag]++;
      }
    }
    titleList.insertAdjacentHTML('afterbegin', html);
  }
  /* [NEW] find list of tags in right column */
  const tagList = document.querySelector('.tags');
  const tagsParams = calculateTagsParams(allTags);
  //let allTagsHTML = '';//
  const allTagsData = {tags: []};

  for(let tag in allTags){
    // const tagLinkHTML = '<li>' + calculateTagClass(allTags[tag], tagsParams) + '</li>';
    
    //const tagLinkHTML = '<li><a class="tag-size-' + calculateTagClass(allTags[tag], tagsParams) + '" href="#tag-' + tag + '">' + tag  + '</a> (' + allTags[tag] + ') </li>';//
  
    allTagsData.tags.push({
      tag: tag,
      count: allTags[tag],
      className: calculateTagClass(allTags[tag], tagsParams)
    });
   
    tagList.innerHTML = templates.tagCloudLink(allTagsData);
    console.log('allTagsData', allTagsData);

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
  let allAuthors = {};
  const articles = document.querySelectorAll('.post');
  for(let article of articles){
    const articleAuthor = article.getAttribute('data-author');
    const linkHTMLData = {articleAuthor: articleAuthor}
    const linkHTML = templates.authorsLink(linkHTMLData);

    
    const postAuthor = article.querySelector('.post-author');
    postAuthor.insertAdjacentHTML('afterbegin' , linkHTML);

    if(!allAuthors.hasOwnProperty(articleAuthor)) {
      allAuthors[articleAuthor] = 1;
    } else {
      allAuthors[articleAuthor]++;
    }
  }

  const authorList = document.querySelector('.authors');
  const authorsParams = calculateAuthorsParams(allAuthors);
  const allAuthorsData = {authors: []};
  for(let author in allAuthors) {
    const authorLinkHTML = '<li><a class="author-size-' + calculateAuthorClass(allAuthors[author], authorsParams) + '" href="#tag-' + author + '">' + author  + '</a> (' + allAuthors[author] + ') </li>';
    allAuthorsData.authors.push({
      className: calculateAuthorClass(allAuthors[author], authorsParams),
      author: author,
      count: allAuthors[author],
    });
    authorList.innerHTML = templates.authorCloudLink(allAuthorsData);
  }
}

generateAuthors();

function calculateAuthorsParams(authors) {
  const authorNumbers = [];
  for (let author in authors) {
    const authorNumber = authors[author];
    authorNumbers.push(authorNumber);
  }

  return {
    min: Math.min(...authorNumbers),
    max: Math.max(...authorNumbers)
  };
}


function calculateAuthorClass(count, params) {
  if (count == params['min']) {
    return '1';
  }
  if ( count == params['max']) {
    return '2';
  }
}



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