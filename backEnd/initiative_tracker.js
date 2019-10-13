var ALL_NAMES =["", " "];
var DEFAULT_HP = 20
var MAX_LENGTH = 25;

/**
 * creates all the pregens in storage if chosen in storage
 */
function startingSetup(){
    startingPregens();
    loadSavedRolls();
    sortReminder(true);
    initCheckBoxes();
}

/**
 * stores the user preference for whether to initialize pregens
 * @param {HTMLElement} el the checkbox being toggled
 */
function saveCheckbox(el){
    localStorage.setItem($(el).attr("id"), $(el).prop("checked"));
}

/**
 * handles events associated with checking/unchecking some boxes during startup
 * @param {HTMLElement} el the checkbox element
 * @param {boolean} isChecked whether is is checked or unchecked(checked if true)
 */
function checkboxReprecussions(el, isChecked){
    switch($(el).attr("id")){
        case "nameGenBox":
            toggleNameGen(isChecked);return;
        case "showPregens":
            generalToggle(".allpregens", isChecked);return;
        case "showSavedRolls":
            generalToggle("#savedRolls", isChecked);return;
     }
}

/**
 * initializes check boxes being checked based on localstorage during startup
 */
function initCheckBoxes(){
    var allInps = $("input").get();
    for (el of allInps){
        if($(el).attr("type") == "checkbox"){
            var beChecked = boolFromStorage($(el).attr("id"));
            $(el).prop("checked", beChecked);
            checkboxReprecussions(el, beChecked);
        }
    }
}

/**
 * togges an element on or off based on selector and bool
 * if bool is null it will just make it opposite, else it will use bool
 * if true, will be shown, else will hide
 * @param {string} selector the jquery selector to find the element
 * @param {boolean} shouldShow whether element(s) should be shown or hidden
 */
function generalToggle(selector, shouldShow=null){
    if(shouldShow != null){
        $(selector).toggle(shouldShow);
        return;
    }
    $(selector).toggle();
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
    else{errorTxt("check isAhero, something went very wrong");
    console.log("check isAhero, something went very wrong");}
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
    var target = $("#"+id).get(0);
    if(target.innerHTML == text){//if error already being shown
        errorWiggle(target);
    }
    else{$(target).text(text);}
}

/**
 * sets the errorText element to ""
 */
function clearErrors(){
    $(".genError").text("");
}

/**
 * generates a random number between 1 and 20
 * @return {int} the number from 1 to 20
 */
function getRoll(){
    return Math.floor(Math.random()*20 + 1);
}

/**
 * replaces an element in the list of taken names
 * @param {string} oldName the name to be replaced
 * @param {string} newName the new name
 */
function replaceName(oldName, newName){
    var ind = ALL_NAMES.indexOf(oldName);
    ALL_NAMES[ind] = newName;
}

/**
 * determines if the total space teken by an element
 * is too big to display
 * @param {HTMLElement} el one of the children of the list element
 * @returns {boolean} true if it is too long, else false
 */
function nameTooLong(el){
    var len = $(el).val().length;
    console.log(len);
    if(len > MAX_LENGTH){
        return true;
    }
    return false;
}

/**
 * transforms a name element into an input field
 * @param {HTMLElement} el the element to be renamed
 */
function rename(el){
    var newEl = newElem("input", el.innerHTML);
    newEl.name = el.innerHTML;

    $(newEl).attr("onkeypress", "if(event.keyCode == 13){setName(this);}");
    $(newEl).attr("size", "8");

    $(el).replaceWith(newEl);
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
    return el.parentNode.nodeName=="LI";
}

/**
 * changes an input field to a span with the value
 * from the input field
 * @param {HTMLElement} elem the element being renamed
 */
function setName(elem){
    var newName = elem.value;
    var oldName = $(elem).attr("name"); //$(elem).parent().attr("id");
    var removeErrors = true;

    if(!nameIsFree(newName, oldName)){
        newName=oldName;
        errorTxt("name already taken");
        removeErrors=false;}
    
    if(nameTooLong(elem)){
        errorTxt("name is too long");
        newName = oldName;
        removeErrors=false;}
    
    if(removeErrors){clearErrors();}

    newEl = newElem("span", newName, true);
    if(isListElement(elem)){
        $(elem.parentNode).attr("id", newName);
    }
    else{
        updatePregen(elem.parentNode.id, null,newName,null);
    }
    $(newEl).attr("onclick", "rename(this)");

    elem.parentNode.replaceChild(newEl, elem);
    replaceName(oldName, newName);
}

/**
 * checks whether a object can be converted to
 * a valid integer
 * @param {any} numStr the object bring tested
 * @returns {boolean} true if it can be converted
 * into an integer
 */
function isInt(numStr){
    if(1+numStr+1 == "11"){//see below for explanation
        return false;}

    result = Number(numStr);
    if(isNaN(result)){

        return false;
    }
    else{
        return true;}
}
/*when converting "" to int it became 0,
 so when checking if it is empty string I had to
 check what 1+num+1 equals, if it is "11",
 it is a string because it is concatonated,
 if it is 2 then it is 0 because the 2 numbers are added
*/

/**
 * changes an element into a text field with a value
 * of it's old content
 * @param {HTMLElement} el the element whose init is changing
 */
function newInit(el){
    var newEl = newElem("input", el.innerHTML);
    newEl.id=el.id;
    newEl.name = el.innerHTML;

    $(newEl).attr("onkeypress", "if(event.keyCode == 13){setInit(this);}");
    $(newEl).attr("size", "2");  
    el.parentNode.replaceChild(newEl, el);
}

/**
 * changes a text field into a span with it's old value
 * as innerHTML
 * @param {HTMLElement} elem the text field being changed
 */
function setInit(elem){
    var newInit = elem.value;
    var removeErrors=true;
    if(!isInt(newInit)){
        newInit=elem.name;
        removeErrors=false;
        errorTxt("initiative must be a number");}
    
    newEl = newElem("span", newInit, true);
    $(newEl).addClass("init");
    $(newEl).attr("onclick", "newInit(this)");

    if(!isListElement(elem)){
        updatePregen(elem.parentNode.id, newInit,null,null);
    }
    //else{elem.parentNode.=newInit;}//update list item id(for sorting)
    else{$(elem).parent().attr("name", newInit);}

    elem.parentElement.replaceChild(newEl, elem);
    if(removeErrors){clearErrors();}
    sortReminder();
}

/**
 * converts an element into a text input field 
 * with an initial value of the current max hp
 * @param {HTMLElement} el the element to be converted
 */
function changeMaxHp(el){
    var maxHp = getMaxHp(el, true);

    var newEl = newElem("input", maxHp);
    newEl.id = maxHp;
    $(newEl).attr("onkeypress", "if(event.keyCode == 13){setMaxHp(this);}");
    $(newEl).attr("size", "2");
    el.parentNode.replaceChild(newEl, el);
}

/**
 * converts a max hp text input field to a span
 * @param {HTMLElement} el the element to be converted
 */
function setMaxHp(el){
    var newMax = el.value;
    newMax = evalStr(newMax, el.id, "max health must be a number");
    if(newMax <= 0){newMax=1;}

    newEl = newElem("span", "/"+newMax+" hp", true);
    $(newEl).attr("onclick", "changeMaxHp(this)");

    //var name = el.parentNode.getAttribute("name");

    if(Number(el.previousElementSibling.innerHTML)> newMax){
        el.previousElementSibling.innerHTML=newMax;
    }

    el.parentElement.replaceChild(newEl, el);
}

/**
 * changes a span into a text field with its old
 * value on the inside
 * @param {HTMLelement} el the element being changed 
 */
function changeHp(el){
    var curHp = el.innerHTML.split("/")[0];
    var newEl = newElem("input", curHp);
    newEl.name = curHp;

    $(newEl).attr("onkeypress", "if(event.keyCode == 13){setHp(this);}");
    $(newEl).attr("size", "1");
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
    var removeErrors = true;

    newHp = evalStr(newHp, elem.name, "health must be a number");

    var maxHP = getMaxHp(elem);

    if(newHp > maxHP && wasAdded){
        var hpDiff = newHp - maxHP;
        errorTxt("healed an excess of "+hpDiff+" points");
        removeErrors = false;
        newHp = maxHP;}

    if(!isListElement(elem)){
        updatePregen(elem.parentNode.id, null,null,newHp);
    }
    newEl = newElem("span", newHp, true);
    $(newEl).addClass("hp");
    $(newEl).attr("onclick", "changeHp(this)");

    if(isListElement(elem)){
        if(newHp <= 0){
            makeRedDel(elem.parentElement);}
        else{makeRedDel(elem.parentElement, true);}//gets rid of button
    }
    elem.parentElement.replaceChild(newEl, elem);
    if(removeErrors){clearErrors();}
}

/**
 * determins the max hp of a list element,
 * it checks either the next element or the one passed
 * to find the max hp string
 * @param {HTMLElement} el the element or one next to max hp
 * @param {boolean} isMaxElem (optional)whether the element passed
 * is the one containing max hp, false by default
 */
function getMaxHp(el, isMaxElem=false){
    var rawStr;
    if(isMaxElem){rawStr=el.innerHTML;}

    else{rawStr = el.nextElementSibling.innerHTML;}
 
    var max = rawStr.substr(1, rawStr.length-4);
    return max;
}

/**
 * tries to evalute a string as an equation to get an int
 * if that fails it retuns a backup value and sends 
 * an error message to the document if one is given
 * @param {any} val the item to be evaluated
 * @param {int} backup the value to be returned if it fails
 * @param {string} errorMsg (optional) the message if things go wrong
 * @returns {int} the evaluated version of val, or backup 
 * if comverting didnt work.
 */
function evalStr(val, backup, errorMsg=null){
    try{
        var result = Math.round(eval(val));
        if(isInt(result)){
            return result;
    }}
    catch(err){
        if(errorMsg != null){
            errorTxt(errorMsg);}
        return backup;}
}

/**
 * filters a list so that only elements of the
 * specified type are returned
 * @param {HTMLElement array} list the given list
 * @param {string} type the type of element to keep, should be in all caps
 * @returns {HTMLElement Array} the list containing 
 * all list elements from 'list' of type 'type'
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
 * gets the integer value of the id attribute
 * @param {HTMLElement} el
 */
function elNum(el){
    return parseInt($(el).attr("name"));
}

function insertionSort(arr, n){
    for(i=1; i<n; i++){
        var savedEl = arr[i];
        var val = elNum(savedEl);
        var j = i-1
        while(j>=0 && elNum(arr[j]) < val){
            arr[j+1]= arr[j];
            j--;
        }
        arr[j+1] = savedEl;
    }
    return arr;
}

function replaceChildren(childArr){
    var parent = $("#mainlist").get(0);
    $(parent).empty();
    for (child of childArr){
        parent.append(child);
    }
}


/**
 * moves the highlighted style to the next creature
 * or back to the start if it is at the end
 */
function rotate(){
    var childs = $("#mainlist").find("li").get();
    if(childs.length==0){return;}

    var theStyler = getCurrCr();
    if(theStyler == null){
        createStyle();
        return;
    }
    $(theStyler).removeClass("currInit");

    var newInd = childs.indexOf(theStyler) + 1;
    if (newInd >= childs.length){
        newInd = 0;
        incrementRound();}

    $(childs[newInd]).addClass("currInit");
    clearErrors();
}

/**
 * adds currInit class the the first element in the main list
 * the class makes it larger and red
 */
function createStyle(){
    $("#mainlist").find("li").first().addClass("currInit");
}

/**
 * moves the highlighted effect to the first child of the
 * htmlElement with id "mainlist"
 */
function moveStyleTop(){
    var theStyler = getCurrCr();

    if(theStyler != null){
        $(theStyler).removeClass("currInit");}

    if(theStyler==null){
        createStyle();return;}

    if($("#mainlist").find("li").get().length > 0){
        $("#mainlist").find("li").first().attr("class", "currInit");
    }
}

/**
 * sorts the list of creatures under element with
 * ID "mainlist" in terms of their
 * ID with highest at the top
 */
function sortList(){
    var trimmedList = $("#mainlist").find("li").get();
    //bubbleSort(trimmedList);
    var sortedList = insertionSort(trimmedList, trimmedList.length);
    replaceChildren(sortedList);
    moveStyleTop();sortReminder(true);
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
    return $("#mainlist").find("li").get().length;
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
        errorTxt("Too many creatures");
        return true;
    }
    return false;
}

/**
 * adds effect to 'reorder' button to remind user to sort the initiative again
 */
function sortReminder(removeStyle=false){
    var name = "empha";
    var el = $("#reorder").get(0);
    if(removeStyle){
        el.classList.remove(name);
    }
    else{el.classList.add(name);}
}

/**
 * adds a hero to the list with given initiative and name
 * @param {int} init the initiative of the hero
 * @param {string} name the name of the hero
 */
function addHero(init=-1, name=null){
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

    var insideTxt = '<span class="init" onclick="newInit(this)">'+init+'</span>'
    +'<span class="name" onclick="rename(this)">'+heroName+'</span>'
    +'<button class="del"'+hiddenStr+'onclick="removeCreature(this)" >del</button>'

    var el = newElem('li', insideTxt, true);
    $(el).attr("name", init);
    $(el).attr("id", heroName);

    $("#mainlist").prepend(el);
    
    moveStyleTop();clearErrors();sortReminder()
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
    if(!isInt(hp)){
        hp = DEFAULT_HP}
    
    if((init+enNom+hp).length > MAX_LENGTH){
        errorTxt("name is too long");return null;
    }
        ALL_NAMES.push(enNom);
    var el = newElem('li', enNom, true);
    el.id=enNom;
    $(el).attr("name", init);

    var delShowing = !document.getElementById("genocide").hidden;
    var hiddenStr = "";
    if(!delShowing){hiddenStr=' hidden="true" ';}

    var insideTxt = '<span onclick="newInit(this)" class="init">'+init+'</span>'+
    '<span onclick="rename(this)" class="name">'+enNom+'</span>'+
    '<span onclick="changeHp(this)" class="hp">'+hp+'</span>'+
    '<span onclick="changeMaxHp(this)">/'+hp+" hp"+'</span>'+
    '<button onclick="removeCreature(this)" class="del"'+hiddenStr+'">del</button>';

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
    if(init==null || !isInt(init)){init=get_rand(1,20);}
    if(hp==null){hp=DEFAULT_HP;}

    var el = getNewEnemy(init, name, hp);
    if(el==null){return;}
    $("#mainlist").prepend(el);
    moveStyleTop();/*clearErrors();*/sortReminder();
}

/**
 * @returns {HTMLElement} the creature currently highlighted
 */
function getCurrCr(){
    return $(".currInit").get(0);
}

/**
 * deletes a creature from the main list
 * @param {HTMLelement} cr the creature to be deleted
 */
function removeCreature(cr){
    //put button by each one and if you press it they dead
    var el = cr.parentNode.parentNode;//document.getElementById(id);
    var isCurrTurn = cr.parentNode == getCurrCr();
    temp=el.name;
    el.removeChild(cr.parentNode);
    ALL_NAMES.splice(ALL_NAMES.indexOf(temp), 1 );
    if(isCurrTurn){moveStyleTop();}
}

/**
 * double chaecks if you want to then deletes
 * all creatures in the main list
 */
function killEveryone(){
    if(!confirm("KILL THEM, KILL THEM ALL!")){
        toggleDelete();
        return;
    }
    alert("you monster...");
    $("#mainlist").empty();
    toggleDelete();
}

/**
 * changes whether the user can see the delete buttons
 * for each creature and genocide button
 */
function toggleDelete(){
    var delButts = $(".del").get();
    var doReveal = !delButts[0].hidden;
  
    for(x in delButts){
        if(delButts[x].id!="closetodeath"){
            delButts[x].hidden= doReveal;}
    }
}

/**
 * clears all inputs where user enters creature data
 */
function clearNewCr(){
    if(!$("#clearInputs").prop("checked")){
        return;}
    $("#inputBoxes input").val("");
}

/**
 * creates a new creature and adds it to the main list
 * based on text fields
 */
function constructCr(){
    var crName= $("#newName").val();
    var init= $("#newInit").val();
    var hp= $("#newHp").val();
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
    var butt = $(parent).find("button").get(0);
    butt.hidden=false;
    butt.id="closetodeath";
    if(undo){
        butt.id="";
        butt.hidden=true;
    }
}

/**
 * determines whether or not reseting the round will change anything
 * returns true if nothing will change or false if something will change
 * @param {int} curRound the current round
 */
function futileReset(curRound){
    if(curRound>1){
        return false;
    }
    return $("#mainlist").children().get(0).className == "currInit";
}

/**
 * increments the counter that keeps track of
 * which round it is, or changes it back to 1
 * @param {boolean} resetRound if true round set to 1
 */
function incrementRound(resetRound=false){
    //var el=document.getElementById("round");
    //var curRound = parseInt(el.innerHTML);
    var el = $("#round").get(0);
    var curRound = parseInt($(el).text());
    if(resetRound){
        if(futileReset(curRound)){
            errorTxt("round already reset");}
        moveStyleTop();
        $(el).html(1);}
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
    var shouldMakeButts = boolFromStorage("initialize");
    for(x in allKeys){
        var key = allKeys[x];
        createPregenButton(key);

        if(shouldMakeButts){
           addFromPregen(null, key);
        }
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
function addFromPregen(elem, key=-1){
    if (key == -1){
        var key = elem.parentNode.id;
    }

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

    var init = $("#newInit").val();
    var name = $("#newName").val();
    var hp = $("#newHp").val();
    if(pregenIsRedundant(name)){
        errorTxt("name is taken");
        return;}
    
    if(init+name+hp > MAX_LENGTH){
        errorTxt("name is too long");return;}
    
    clearErrors();

    var info = init+";"+name+";"+hp;
    var key = getNewKey();
    localStorage.setItem(key, info);

    createPregenButton(key);
        
    $("#showPregens").get(0).checked=true;
    togglePregens(true);
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
    var mamaNode = $("#pregens").get(0);
    if(isHero){
        var innerStr = '<span onclick = "newInit(this)">'+init+'</span>'
        +' <span id="" onclick=rename(this)>'+name+'</span>'+
        '<button onclick="addFromPregen(this)">'+'create</button>'+
        '<button onclick="removePregen(this)">destroy</button>'
        var newEl = newElem("div", innerStr, true);
    }
    else{
        var innerStr = '<span onclick = "newInit(this)">'+init+'</span>'
        +'<span id="" onclick=rename(this)>'+name+'</span>'+
        '<span onclick = "changeHp(this)"> '+hp+'</span>'+
        '<button onclick="addFromPregen(this)">'+'create</button>'+
        '<button onclick="removePregen(this)">destroy</button>'
        var newEl = newElem("div", innerStr, true);
    }
    newEl.id=key;
    $(mamaNode).prepend(newEl);
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
    $("#"+key).remove();
}

/**
 * changes visibility of pregens
 * @param {int or bool} manualSet if blank/-1 will toggle pregen, if bool will
 * show pregens if true, otherwise false
 */
function togglePregens(manualSet=null){
    generalToggle(".allpregens", manualSet)
}

/**
 * determines based on local storage if pregens should
 * be initialized, it is true by default
 * @returns {boolean} true if pregens should be made
 */
function boolFromStorage(key){
    var item = localStorage.getItem(key);
    switch(item){
        case null:
        case "true":
            return true;//true by default
        case "false":
            return false;
        default:
            console.log("ERROR, something went wrong when accessing"+
            " local storage, try clearing it to fix problem");
    }
}

/**
 * hides name generator it it is hidden and vice versa
 */
function toggleNameGen(shouldShow=null){
    generalToggle("#hideNameGen", shouldShow);
}

/**
 * just a fun easter egg
 * @param {HTMLElement} el 
 */
function rickRoll(el){
    var changeTo = "";
    var link = 'https://www.youtube.com/watch?v=CYqq9Ovz_9c';
    switch(el.innerHTML){
        case "secrets":
            changeTo = "made you look";
            break;
        case "made you look":
            changeTo = "really, again?";
            break;
        case "really, again?":
            changeTo = "while you are here...";
            break;
        case "while you are here...":
            changeTo = "I can go all day";
            break;
        case "I can go all day":
            changeTo = ".";
            link="https://www.youtube.com/watch?v=WuzBpuiXnu4";
            break;
        case ".":
            changeTo = "..";
            lnk= "https://www.youtube.com/watch?v=6-1Ue0FFrHY";
            break;
        case "..":
            changeTo = "...";
            link="https://www.youtube.com/watch?v=qiHXxrCB5yk";
            break;
        case "...":
            changeTo = "you win";
            link="https://www.youtube.com/watch?v=6F74mBRjwTc";
            break;
        default:
            changeTo="you win";
            link = "https://www.youtube.com/watch?v=k9iYm9PEAHg";
    }
    window.open(link, '_blank');
    el.innerHTML=changeTo;
}

startingSetup();
