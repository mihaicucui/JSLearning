//  Part I
//  1. Get the main content container
let mainContent = document.getElementById('main');
//  2. Get first post title
let firstPostTitle = document.getElementsByClassName('entry-title')[0].textContent;
//  3. Get first post content
let firstPostContent = document.getElementsByClassName('entry-content')[0].textContent;
//  4. Get all post titles
let postTitles = document.getElementsByClassName('entry-title');
//  5. Change the value for the first title
document.getElementById('gg').textContent='New Title';
//  6. Change the URL for the first title link
let firstTitle=document.getElementById('gg');
firstTitle.setAttribute('href','http://facebook.com');
//  7. Change the background color for the body
document.getElementsByTagName('body')[0].style.backgroundColor='skyblue';
//  8. Add a new class to the articles then add styles
let posts= document.getElementsByClassName('post');
for(let i=0;i<posts.length;i++)
    posts[i].classList.add('myStyle');
  //posts[i].classList.add("mystyle");
let myStyledElements=document.getElementsByClassName('myStyle');
for(let i=0;i<myStyledElements.length;i++){
    myStyledElements[i].getElementsByTagName('p')[0].style.color='green';
}
//  Part II
//  1.  Select the parent element for the first post title
    var firstPost = document.getElementsByClassName('entry-title')[0].parentElement;
//  2.  Select the first post and log the sibligns
    var siblings=[];
    var sibling=firstPost.parentNode.firstChild;

    while(sibling){
        if(sibling.nodeType===1 && sibling!==firstPost){
            siblings.push(sibling);
        }
        sibling=sibling.nextSibling;
    }
//  3.  Select the #main container and log the children

// Bonus Set the entry content with the curent date and time and update it every x (as parameter) seconds