var ALL_NAMES =["", " "];
var DEFAULT_HP = 20
var MAX_LENGTH = 30;
var maxHpDict = {};

startingSetup();

/**
 * creates all the pregens in storage if chosen in storage
 */
function startingSetup(){
   startingPregens();

    var ini = localStorage.getItem("initializing") == "true"
    document.getElementById("initialize").checked=ini;
    
    loadSavedRolls();
}

/**
 * creates new element of a given value
 * @param {string} type the type of element to be created
 * @param {string} value the thing to be in
 * @param {boolean} setInner (optional)if true
 * inserts value as innerhtml
 * @returns {element} the element with value given
 */
function newElem(type, value, setInner=false){
    var newEl = document.createElement(type);
    if(setInner){
        newEl.innerHTML=value;}
    else{
        newEl.value = value;}
    return newEl;
}

/**
 * creates new attribute with an initial value
 * @param {str} type the type of attribute, must be all caps
 * @param {string} value the value assigned to the attribute
 * @returns {HTMLobject} the attribute
 */
function newAtt(type, value){
    var att=document.createAttribute(type);
    att.value=value;
    return att;
}

/**
 * determines wheter  values correspond to a hero
 * or villain
 * @param {int} init 
 * @param {int} hp 
 * @return {boolean} true if corresponds to a hero
 */
function isAHero(init, hp){
    if(init=="" || !isInt(init)){init=null;}
    if(hp=="" || !isInt(hp)){hp=null;}

    if(init == null && hp == null){//if has no hp or init
        return false;}
    if(init!=null && hp==null){//if has init and not hp
        return true;}
    if(init!=null && hp!=null){//if has init and hp
        return false;}
    if(init==null && hp!=null){//if no init but has hp
        return false;}
    else{errorTxt("check isAhero, something went very wrong");}
}

/**
 * makes an error message vibrate back and forth
 * should only be called internally
 * @param {HTMLElement} elem the element to be wiggled
 */
function errorWiggle(elem){
    var curr = 0;
    var ide = setInterval(frame, 5);
    var duration=60;
    var counter=0;
    var maxCount=10;
    var goLeft=false;

    function frame() {
        if (curr == duration) {
          clearInterval(ide);} 
        else {
            curr++; 
            counter++;
            if(counter>=maxCount){
                counter=0;
                goLeft = !goLeft}
            if(goLeft){
                elem.style.left = -counter+"px"; }
            else{
                elem.style.left = counter + "px";}
}}}

/**
 * sets error text to be given string
 * if error text is already there with the same
 * message it will make it wiggle
 * if second argunemt is given it will use that as 
 * id of target element
 * @param {string} text the error message content
 * @param {string} id alternative element
 */
function errorTxt(text, id="error"){
    var target = document.getElementById(id);
    if(target.innerHTML == text){//if error already being shown
        errorWiggle(target);
    }
    target.innerHTML = text;
}

/**
 * sets the error text to ""
 */
function clearErrors(){
    document.getElementById("error").innerHTML="";
    document.getElementById("rollError").innerHTML="";
}

/**
 * gets a random number between 1 and 20
 * @return {int} the number from 1 to 20
 */
function getRoll(){
    var rand = Math.floor(Math.random()*20 + 1);
    return rand;
}

/**
 * replaces an element in the list of taken names
 * @param {string} oldName the name to be replaced
 * @param {string} newName the new name
 */
function replaceName(oldName, newName){
    var ind = ALL_NAMES.indexOf(oldName);
    ALL_NAMES[ind] = newName;
    if(Object.keys(maxHpDict).indexOf(oldName) > -1){
        var tempHp = maxHpDict[oldName];
        delete maxHpDict[oldName];
        maxHpDict[newName] = tempHp;
    }
}

/**
 * transforms a name element into an input field
 * #note that the element breing renamed has the
 * id "being changed"
 * @param {HTMLElement} el the element to be renamed
 */
function rename(el){

    var newEl = newElem("input", el.innerHTML);
    newEl.name = el.innerHTML;

    var att=newAtt("onkeypress", "if(event.keyCode == 13){setName(this);}");
    newEl.setAttributeNode(att);
    newEl.setAttributeNode(newAtt("size", "8"));

    el.parentElement.replaceChild(newEl, el);
}

/**
 * determines whether a name is in the list of all
 * @param {string} newName the new name to check
 * @param {string} oldName the old name, if given
 * @returns {boolean} true if name is unique or
 * same as old name
 */
function nameIsFree(newName, oldName=null){
    if(newName == oldName && oldName!=null){
        return true;}

    if(ALL_NAMES.indexOf(newName) >= 0){
        return false;
    }
    else{
        return true;}
}

/**
 * checks whether n elements parent is a list object
 * @param {HTMLobject} el the element to be checked
 * @returns {boolean} true if its parent is a list element
 */
function isListElement(el){
    var parent = el.parentNode;
    return parent.nodeName=="LI";
}

/**
 * changes an input field to a span with the value
 * from the input field
 * @param {HTMLElement} elem the element being renamed
 */
function setName(elem){
    var newName = elem.value;
    var oldName = elem.name;
    //if name is taken
    if(!nameIsFree(newName, oldName)){
        newName=oldName;
        errorTxt("name already taken");}
    else{
        replaceName(oldName, newName);}

    newEl = newElem("span", newName, true);
    newEl.id=newName;
    if(isListElement(elem)){
        elem.parentNode.setAttribute("name",newName);
        document.getElementById("initiative"+oldName).id = "initiative"+newName;
        newEl.setAttributeNode(newAtt("class", "name"));
    }
    else{
        updatePregen(elem.parentNode.id, null,newName,null);
    }
    newEl.setAttributeNode(newAtt("onclick", "rename(this)"));

    elem.parentNode.replaceChild(newEl, elem);
    clearErrors();
}

/**
 * checks whether a string is a valid integer
 * @param {string} numStr the string bring tested
 * @returns {boolean} true if it can be converted
 * into aninteger
 */
function isInt(numStr){
    result = Number(numStr);
    if(numStr==""){
        return false;}
    if(isNaN(result)){
        return false}
    else{
        return true;}
}

/**
 * changes an element into a text field with a value
 * of it's old content
 * @param {HTMLElement} el the element whose init is changing
 */
function newInit(el){
    var newEl = newElem("input", el.innerHTML);
    newEl.id=el.id;
    newEl.name = el.innerHTML;

    var att=newAtt("onkeypress", "if(event.keyCode == 13){setInit(this);}");
    newEl.setAttributeNode(att);
    newEl.setAttributeNode(newAtt("size", "2"));
    el.parentNode.replaceChild(newEl, el);
}

/**
 * changes a text field into a span with it's old value
 * as innerHTML
 * @param {HTMLElement} elem the text field being changed
 */
function setInit(elem){
    var newInit = elem.value;
    if(!isInt(newInit)){
        newInit=elem.name;
        errorTxt("initiative must be a number");}
    
    newEl = newElem("span", newInit, true);
    newEl.id=elem.id;
    newEl.setAttributeNode(newAtt("class", "init"));
    newEl.setAttributeNode(newAtt("onclick", "newInit(this)"));

    if(!isListElement(elem)){
        updatePregen(elem.parentNode.id, newInit,null,null);
    }
    elem.parentElement.replaceChild(newEl, elem);
    clearErrors();
}

/**
 * changes a span into a text field with its old
 * value on the inside
 * @param {HTMLelement} el the element being changed 
 */
function changeHp(el){
    var newEl = newElem("input", el.innerHTML);
    newEl.name = el.innerHTML;
    newEl.id = el.id;

    var att=newAtt("onkeypress", "if(event.keyCode == 13){setHp(this);}");
    newEl.setAttributeNode(att);
    newEl.setAttributeNode(newAtt("size", "1"));
    el.parentNode.replaceChild(newEl, el);
}

/**
 * changes an input field to a span with it's old value
 * note that it will evaluate any expressions 
 * in the given argument
 * @param {HTMLElement} elem the element being converted 
 */
function setHp(elem){
    var newHp = elem.value;
    var wasAdded = newHp.indexOf("+") > -1;
    var plzCleanErrors = false;
    try{
        if(isInt(eval(newHp))){
            newHp = eval(newHp);}}
    catch(err){
        newHp = elem.name;}

    if(!isInt(newHp)){
        newHp=elem.name;
        errorTxt("health must be a number");}
    
    var crName = elem.id.substr(2);
    if(newHp > maxHpDict[crName] && wasAdded){
        var hpDiff = newHp - maxHpDict[crName];
        errorTxt("healed an excess of "+hpDiff+" points");
        plzCleanErrors = true;
        newHp = maxHpDict[crName];
    }
    else{maxHpDict[crName] = newHp;}

    if(!isListElement(elem)){
        updatePregen(elem.parentNode.id, null,null,newHp);
    }
    newEl = newElem("span", parseInt(newHp), true);
    newEl.id=elem.id;
    newEl.setAttributeNode(newAtt("class", "hp"));
    newEl.setAttributeNode(newAtt("onclick", "changeHp(this)"));

    if(isListElement(elem)){
        if(newHp <= 0){
            makeRedDel(elem.parentElement);}
        else{makeRedDel(elem.parentElement, true);}//gets rid of button
    }
    elem.parentElement.replaceChild(newEl, elem);
    if(!plzCleanErrors){
        clearErrors();}
}

/**
 * used for sending text to an element on the page
 * only for debugging
 * @param {any} msg the mesage to be added
 */
function debug(msg){
    var target = document.getElementById("debug");
    var content=target.innerHTML+msg+"<br>";
    target.innerHTML = content;
}

/**
 * 
 * @param {HTMLElement array} list the given list
 * @param {string} type the type of element to keep
 */
function filterList(list, type){
    var properList=[];
    for(x in list){
        if (list[x].nodeName == type){
           properList.push(list[x]);}
    }
    return properList;
}

/**
 * TESTING METHOD
 * displays an array
 * @param {array} arr the array to show
 */
function showList(arr){
    for(x in arr){
        debug(arr[x].id);
    }
}

/**
 * switches the position of 2 adjacent elements
 * NOTE: they must be adjacent for consitent results
 * @param {HTMLElement} obj1 
 * @param {HTMLElement} obj2 
 * @param {HTMLElement Array} arr the array of all elements
 */
function swapElements(obj1, obj2, arr=null) {
    var bothsParent=obj1.parentNode;
    bothsParent.insertBefore(obj2, obj1);

    if(arr==null){return;}
    var obj1Ind = arr.indexOf(obj1);
    var obj2Ind = arr.indexOf(obj2);
    [arr[obj1Ind], arr[obj2Ind]] = [arr[obj2Ind], arr[obj1Ind]];
    return arr;}

/**
 * sorts an array of html elements where each element
 * has a number as its id, this is what they are sorted by
 * note it is sorted so that higher values are higher on the page
 * @param {HTMLElement Array} arr 
 */
function bubbleSort(arr){
    var n = arr.length;
    for(x=0; x<n*2; x++){
        for(y=0; y<n-1; y++){
            if(parseInt(arr[y].id) < parseInt(arr[y+1].id)){
                arr=swapElements(arr[y], arr[y+1], arr);
            }
}}}

/**
 * moves the highlighted style to the next creature
 * or back to the start if it is at the end
 */
function rotate(){
    var parent=document.getElementById("mainlist");
    var childs = filterList(parent.childNodes, "LI");
    if(childs.length==0){return;}

    var theStyler = document.getElementsByClassName("currInit")[0];
    if(theStyler == null){
        createStyle();
        return;
    }
    theStyler.removeAttribute("class");

    var prevInd = childs.indexOf(theStyler);
    var newInd = prevInd + 1;
    if (newInd >= childs.length){
    newInd = 0;
    incrementRound();}

    childs[newInd].setAttributeNode(newAtt("class", "currInit")); 
}

/**
 * moves the class which causes an element to be
 * bolded to the first child of the element with id "mainlist"
 */
function createStyle(){
    var parent=document.getElementById("mainlist");
    theStyler=parent.childNodes[0];

    var att = newAtt("class", "currInit");
    theStyler.setAttributeNode(att);
}

/**
 * moves the highlighted effect to the first child of the
 * htmlElement with id "mainlist"
 */
function moveStyleTop(){

    var parent=document.getElementById("mainlist");
    var childs = filterList(parent.childNodes, "LI");
    if(childs.length==0){return;}

    var theStyler = document.getElementsByClassName("currInit")[0];
    if(theStyler != null){
        theStyler.removeAttribute("class");}

    if(theStyler==null){
        createStyle();return;}

    childs[0].setAttributeNode(newAtt("class", "currInit"));
}

/**
 * sorts the list of creatures under element with
 * ID "mainlist" in terms of their
 * ID with highest at the top
 */
function sortList(){
    var list=document.getElementById("mainlist");
    var rawList = list.childNodes;
    var trimmedList = filterList(rawList, "LI");
    bubbleSort(trimmedList);
    moveStyleTop();
}

/**
 * gets a valid name for a creature
 * @param {boolean} isHero changes what default name is 
 * @param {string} base optional param for what string
 * @returns {string} a valid name for a creature
 * they start with
 * adds a number onto the end of the base string until
 * there are no other creatures with the same name
 */
function getValidName(isHero, base=null){
    if(base==null || base=="" || isInt(base)){
        base = "enemy";
        if(isHero){base = "hero";}
    }
    var suffix=1;
    var totName=base;
    while(!nameIsFree(totName)){
        totName=base+suffix;
        suffix+=1;
    }
    return totName;
}

/**
 * counts the number of creatures in the main list
 * @returns {int} the number of creatures in the list
 */
function countCreatures(){
    var mama = document.getElementById("mainlist");
    var allCreatures = filterList(mama.childNodes, "LI");
    return allCreatures.length;
}

/**
 * determines if there are too many creatures in 
 * the list
 * @returns {boolean} true if there are too 
 * many creatures in the list
 */
function tooManyCr(){
    var maxCreatures = 25;
    if(countCreatures() > maxCreatures){
        errorTxt("Too many creatures")
        return true;
    }
    return false;
}

/**
 * adds a hero to the list with given initiative and name
 * @param {int} init the initiative of the hero
 * @param {string} name the name of the hero
 */
function addHero(init=0, name=null){
    if(tooManyCr()){return;}
    if(name == null || !nameIsFree(name)){
        heroName=getValidName(true, name);}
    else{heroName=name;}
        ALL_NAMES.push(heroName);

    if((name+init).length > MAX_LENGTH){
        errorTxt("name is too long");return;
    }

    var delShowing = !document.getElementById("genocide").hidden;
    var hiddenStr = ""
    if(!delShowing){hiddenStr=' hidden="true" ';}
    var insideTxt = '<span id="initiative'+heroName+
    '" class="init" onclick="newInit(this)">'+init+
    '</span><span id="'+heroName+
    '" onclick="rename(this)" class="name">'+heroName+
    '</span><button onclick="removeCreature(this)" class="del"'
    +hiddenStr+'>del</button>'

    var el = newElem('li', insideTxt, true);
    el.setAttributeNode(newAtt("name", heroName));
    el.id=init;

    var listParent = document.getElementById("mainlist");
    listParent.insertBefore(el, listParent.childNodes[0]);
    moveStyleTop();
    clearErrors();
}

/**
 * creates an HTMLelement for a new enemy with the
 * given parameters
 * @param {int} init the initiative of the enemy
 * @param {name} enNom the name of the enemy
 * @param {int} hp how much health they have
 * @returns {HTMLelement} a new enemy element or
 * null if the enemy to be created is too large`
 */
function getNewEnemy(init, enNom, hp){
    if(enNom==null || !nameIsFree(enNom)){
        enNom=getValidName(false, enNom);}
    /*if(!isInt(init)){
        init = getRoll();}*/
    if(!isInt(hp)){
        hp = DEFAULT_HP}
    
    if((init+enNom+hp).length > MAX_LENGTH){
        errorTxt("name is too long");return null;
    }
        ALL_NAMES.push(enNom);
    var el = newElem('li', enNom, true);
    el.id=init;
    el.setAttributeNode(newAtt("name", enNom));
    var delShowing = !document.getElementById("genocide").hidden;
    var hiddenStr = ""
    if(!delShowing){hiddenStr=' hidden="true" ';}
    maxHpDict[enNom]=hp;

    var insideTxt = '<span id="initiative'+enNom+
    '" onclick="newInit(this)" class="init">'+init+'</span><span id="'
    +enNom+'" onclick="rename(this)" class="name">'
    +enNom+'</span><span id="hp'+enNom+
    '" onclick="changeHp(this)" class="hp">'+hp+
    '</span><span>hp</span><button onclick="removeCreature(this)" class="del"'
    +hiddenStr+'">del</button>';

    el.innerHTML = insideTxt;
    return el;
}

/**
 * adds a new enemy to the list with the given params
 * @param {int} init the initiative of the enemy
 * @param {string} name the name of the enemy
 * @param {int} hp how much health the enemy has
 */
function addEnemy(init=null, name=null, hp=null){
    if(tooManyCr()){return;}
    if(init==null || !isInt(init)){init=getRoll();}
    if(hp==null){hp=DEFAULT_HP;}

    var el = getNewEnemy(init, name, hp);
    if(el==null){return;}
    var listParent = document.getElementById("mainlist");
    listParent.insertBefore(el, listParent.childNodes[0]);
    moveStyleTop();
    clearErrors();
}

/**
 * deletes a creature from the main list
 * @param {HTMLelement} cr the creature to be deleted
 */
function removeCreature(cr){
    //put button by each one and if you press it they dead
    var el = cr.parentNode.parentNode;//document.getElementById(id);
    var isCurrTurn = cr.parentNode == document.getElementsByClassName("currInit")[0];
    temp=el.name;
    el.removeChild(cr.parentNode);
    ALL_NAMES.splice(ALL_NAMES.indexOf(temp), 1 );
    if(isCurrTurn){moveStyleTop();}
}

/**
 * dounle chaecks if you want to then deletes
 * all creatures in the main list
 */
function killEveryone(){
    if(!confirm("KILL THEM, KILL THEM ALL!")){
        toggleDelete();
        return;
    }
    alert("you monster...");
    maxHpDict = {};
    var allMother = document.getElementById("mainlist");
    var allChildren = filterList(allMother.childNodes, "LI");
    for(x in allChildren){
        removeCreature(allChildren[x].childNodes[0]);}
    toggleDelete();
}

/**
 * changes whether the user can see the delete buttons
 * for each creature and genocide button
 */
function toggleDelete(){
    var delButts = document.getElementsByClassName("del");
    var doReveal = false;
    if(delButts[0].hidden==true){doReveal=true;}
  
    for(x in delButts){
        if(delButts[x].id!="closetodeath"){
            delButts[x].hidden= !doReveal;}
    }
}

/**
 * clears all inputs where user enters creature data
 */
function clearNewCr(){
    if(!document.getElementById("clearInputs").checked){
        return;}
    document.getElementById("newHp").value="";
    document.getElementById("newName").value="";
    document.getElementById("newInit").value="";
}

/**
 * creates a new creature and adds it to the main list
 * based on text fields
 */
function constructCr(){
    var crName=document.getElementById("newName").value;
    var init=document.getElementById("newInit").value;
    var hp=document.getElementById("newHp").value;
    if(!isInt(init)){init=null;}
    if(!isInt(hp)){hp=null;}

    var isHero=isAHero(init, hp)

    crName = getValidName(isHero, crName)

    if(isHero){
        addHero(init, crName);
    }
    else{
        addEnemy(init, crName, hp);}
    clearNewCr();
}

/**
 * makes the button to delete an enemy creature
 * red if they are low on health
 */
function makeRedDel(parent, undo=false){
    var butt=filterList(parent.childNodes, "BUTTON")[0];
    butt.hidden=false;
    butt.id="closetodeath";
    if(undo){
        butt.id="";
        butt.hidden=true;
    }
}

/**
 * increments the counter that keeps track of
 * which round it is, or changes it back to 1
 * @param {boolean} resetRound if true round set to 1
 */
function incrementRound(resetRound=false){
    var el=document.getElementById("round");
    var curRound = parseInt(el.innerHTML);
    if(resetRound){
        moveStyleTop();
        if(el.innerHTML==1){
            errorTxt("round already reset");}
        el.innerHTML = 1;}
    else{
        el.innerHTML = curRound+1;
        clearErrors();}
}

/**
 * creates creatues and adds them to main list 
 * based on creatues saved in browser storage
 */
function startingPregens(){
    var allKeys = getPregenKeys();
    for(x in allKeys){
        var key = allKeys[x];
        createPregenButton(key);
        var el = document.getElementById(key);
        if(initializeChars()){
            addFromPregen(el.childNodes[0]);}
    }
}

/**
 * creates a new key with which to store data
 * for a saved creature using a given string or
 * "pregen" by default
 * @param {string} base (optional) the base string to make the key out of
 * @returns {string} the new key
 */
function getNewKey(base="pregen"){
    var num = 0;
    var tot = base+num;
    while(localStorage.getItem(tot) != null){
        num++;
        tot = base+num;}
    return tot;
}

/**
 * creates a key using 'pregen' or one you give
 * @param {string} base (optional) the substitute base
 * @returns all keys stored in the local storage
 */
function getPregenKeys(base="pregen"){
    var allKeys=[];
    for (var key in localStorage){
        if(key.indexOf(base)!=-1){
            allKeys.push(key);
        }
    }
    return allKeys;
}


/**
 * adds a creature from a pregen to the main list
 * @param {HTMLelement} elem the element to be added
 */
function addFromPregen(elem){
    var key = elem.parentNode.id;

    var contents = localStorage.getItem(key).split(";");
    var init = contents[0];
    var name = contents[1];
    var hp = contents[2];
    if(isAHero(init, hp)){
        addHero(init, name);}
    else{
        addEnemy(init, name, hp);}
}

/**
 * determines whether a pregen is already created
 * @param {string} name name to check
 * @returns {boolean} true if name is already a pregen
 */
function pregenIsRedundant(name){
    var allPregens = getPregenKeys();
    var preName="";
    for(x in allPregens){
        preName=localStorage.getItem(allPregens[x]).split(";")[1];
        if(preName == name){
            return true;
        }}
    return false;
}

/**
 * creates a pregen from data fields and saves it 
 * in the browser local storage with a naming scheme
 * pregen1, pregen2, etc
 * the value is in the form <initiative>;<name>;<health>
 * such as 12;xanathar;34
 * note that not all 3 spaces neet to be filled
 * ie. ;worchestershire; is aalso valid
 */
function savePregen(){

    var init = document.getElementById("newInit").value;
    var name = document.getElementById("newName").value;
    var hp = document.getElementById("newHp").value;
    if(pregenIsRedundant(name)){
        errorTxt("name is taken");
        return;}
    if((init+name+hp).length > MAX_LENGTH){
        errorTxt("name is too long");return;}
    
    clearErrors();

    var info = init+";"+name+";"+hp;
    var key = getNewKey();
    localStorage.setItem(key, info);

    createPregenButton(key);

    document.getElementById("showPregens").checked=true;
    togglePregens(document.getElementById("showPregens"));
}

/**
 * creates an element on the document to allow creation 
 * from pregens
 * @param {string} key pregen to make element for
 */
function createPregenButton(key){
    var contents = localStorage.getItem(key).split(";");
    var init = contents[0];
    var name = contents[1];
    var hp = contents[2];
    var isHero = isAHero(init, hp);
    var mamaNode = document.getElementById("pregens");
    if(isHero){
        var innerStr = '<span onclick = "newInit(this)">'
        +init+'</span>'+" <span id='' onclick=rename(this)>"
        +name+'</span></span><button onclick="addFromPregen(this)">'+
        'create</button><button onclick="removePregen(this)">destroy</button>'
        var newEl = newElem("div", innerStr, true);
    }
    else{
        var innerStr = '<span onclick = "newInit(this)">'
        +init+"</span> <span id='' onclick=rename(this)>"
        +name+'</span><span onclick = "changeHp(this)"> '+hp+
        '</span><button onclick="addFromPregen(this)">'+
        'create</button><button onclick="removePregen(this)">destroy</button>'
        var newEl = newElem("div", innerStr, true);
    }
    newEl.id=key;
    mamaNode.insertBefore(newEl, mamaNode.childNodes[0]);
}

/**
 * note set ones you dont know to null and it will 
 * pull from stored version for those fields
 * @param {string} key the key for that stored value
 * @param {any} init the new initiative 
 * @param {string} name the new name
 * @param {any} hp the new hp
 */
function updatePregen(key, init, name, hp){
    var old = localStorage.getItem(key).split(";");
    if(init==null){init=old[0];}
    if(name==null){name=old[1];}
    if(hp==null){hp=old[2];}
    var val = init+";"+name+";"+hp;
    localStorage.setItem(key, val);
}

/**
 * removes a pregen element from the document
 * @param {HTMLelement} node pregen to be removed
 */
function removePregen(node){
    var key = node.parentNode.id;
    localStorage.removeItem(key);
    var oneToDie = document.getElementById(key);
    if(oneToDie != null){
        oneToDie.parentNode.removeChild(oneToDie);}
}

/**
 * checks if the checkbox passed in is checked
 * and making pregens visible if it is,
 * otherwise they are hidden
 * @param {HTMLelement} checkBox the box to check
 */
function togglePregens(checkBox){
    el = document.getElementsByClassName("allpregens")[0];
    if(checkBox.checked){
        el.hidden=false;}
    else{
        el.hidden=true;}
}

function toggleInitialize(el){
    if(el.checked){
        localStorage.setItem("initializing", true);}
    else{
        localStorage.setItem("initializing", false);}
}

/**
 * determines based on local storage if each pregen should
 * be initialized, it is true by default
 * @returns {boolean} true if pregens should be made
 */
function initializeChars(){
    var shouldMake = localStorage.getItem("initializing");
    switch(shouldMake){
        case null:
        case "true":
            return true;//true by default
        case "false":
            return false;
        default:
            debug("ERROR, something went wrong when accessing"+
            " local storage, try clearing it to fix problem");
    }
}