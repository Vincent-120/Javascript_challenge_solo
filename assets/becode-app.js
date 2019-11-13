/* 
// WRITE YOUR JAVASCRIPT BELOW THIS COMMENT 
Your name :     
Date :  
Contact information : 
What does this script do ? 
...
*/

// Your scripting goes here...
(() =>{
    addElement()
})();
//placement d'une balise et integration d'info
function addElement(){
    //cree un nouvel element HTML
    let newDiv = document.createElement("div");
    //cree du contenu a l'element
    let newContent = document.createTextNode('Just do it!');
    //ajoute le contenu a la div
    newDiv.appendChild(newContent);

    let currentDiv =document.getElementById('table1')
    currentDiv.parentNode.insertBefore(newDiv, currentDiv)
}
//recuperer les donner des tableau HTML

const tabb =[]
const tableau1 = document.querySelectorAll('#table1 tr');
console.log(tableau1);
for (let index = 0; index < tableau1.length; index++) {
    for (let i = 0; i < tableau1[index].querySelectorAll('td').length; i++) {
        tabb.push(tableau1[index].querySelectorAll('td')[i].textContent)
    }
}
