
/**
 * creates saved rolls for each roll in localstorage
 */
function loadSavedRolls(){
    var rollKeys = getPregenKeys("roll");
    for(x in rollKeys){
        roll = localStorage.getItem(rollKeys[x]);
        saveDieRoll(roll, true);}
}

/**
 * gets a random int between 2 numbers
 * @param {int} min minimum value 
 * @param {int} max maximum value
 */
function get_rand(min, max){
    var rand = Math.floor(Math.random()*max + min)
    return rand
}

/**
 * finds the next + or - char
 * @param {string} str the string being analyzed
 * @returns {int} the index of the next operator
 */
function find_operator(str){
    neg = str.indexOf("-");
    pos = str.indexOf("+");

    if(pos==neg){//both are -1(cannot be found)
        return str.length;
    }
    if(pos == -1){//no pos
        return neg;}
    if(neg == -1){//no neg
        return pos;}

    if(pos < neg){//pos occurs sooner
        return pos
    }
    if(neg < pos){//neg occurs sooner
        return neg;
    }
    debug("SOMETHING WENT VERY WRONG");
}

/**
 * splits a atring into an array of strings 
 * based on location of operators
 * @param {string} raw_str the string to be itemized
 * @returns {string array} the itemized aray
 */
function split_str(raw_str){
    terms = [];
    i = 0;
    while (raw_str != "" && i < 20){
        var next_oper = find_operator(raw_str);
        if (next_oper == 0){
            next_oper = find_operator(raw_str.substr(1))+1;
        }
        terms.push(raw_str.substr(0, next_oper));
        raw_str = raw_str.substr(next_oper);
        i++;
    }
    return terms;
}

/**
 * gets all valid strings that can be evaluated
 * @param {string list} raw_list the list being analyzed, can use split_str()
 * @returns {string list} all valid die rolls
 */
function get_valid_str(raw_list){
    pattern = /([+-]?[1-9][0-9]*d[1-9][0-9]*)|([+-]?[0-9]+)/gi;
    //pattern = /[+-]?[1-9][0-9]*d[1-9][0-9]*/i
    var valid_strs = [];
    for(item in raw_list){
        results = raw_list[item].match(pattern);
        if (results == null){continue;}

        for(str in results){
            valid_strs.push(results[str]);
        }
    }
    return valid_strs;
}

/**
 * determines if a term is positive
 * @returns {boolean} true if the string is positive
 */
function is_pos(a_str){
    var has_neg = a_str.indexOf("-");
    return has_neg == -1;//if no neg sign is positive
}

/**
 * trims the sign off of a string
 * @param {string} item_str the string to trim
 * @returns the string withouth the leading sign
 */
function trim_sign(item_str){
    first_char = item_str[0];
    switch (first_char){
        case "+":
        case "-":
            return item_str.substr(1);
        default://it starts with a number
            return item_str;
    }
}

/**
 * determines whether a string is a constant or die roll
 * @param {string} item_str 
 * @returns {boolean} true if it is a constant term
 */
function is_int(item_str){
    has_d = item_str.indexOf("d");
    return has_d == -1;
}

/**
 * converts a string int and bool into a signed int
 * @param {string} str_int the string to be converted
 * @param {boolean} sign the sign of the term
 * @returns {int} signed version from params
 */
function int_add(str_int, sign){
    var num = parseInt(str_int);
    if(sign){
        return num;}
    return -num}

/**
 * checks if user has selected rolls to be showes
 * @returns {boolean} true if rolls should be shown
 */
function should_show_rolls(){
    return document.getElementById("show_rolls").checked;
}

/**
 * adds an element to the record of each roll
 * @param {string} item roll to be added to element
 */
function roll_log(item){
    var targ=document.getElementById("rolls");
    var new_val = targ.innerHTML+item+"<br>";
    targ.innerHTML = new_val;}

/**
 * clears all rolls from the document
 */
function clear_roll(){
    document.getElementById("rolls").innerHTML="";
}

/**
 * displays a roll on the document
 * @param {int} roll the rolled value 
 * @param {int} max the max possible roll
 * @param {int} int_val the integer value(if not a roll)
 * @param {boolean} is_pos true if the term is a constant
 */
function display_roll(roll, max, int_val=null, is_pos=null){
    if(int_val != null){
        if(is_pos){roll_log("adding "+int_val);}
        else{roll_log("subtracting "+int_val);}
    }
    else{
        if(roll != max){
            roll_log("you rolled a "+roll+" out of "+max);}
        else{
            roll_log("you got the max value of "+max);}
}}

/**
 * evaluates a string die roll
 * @param {string} term the string being evaluated
 * @param {boolean} sign true if term is positive
 * @returns {int} the evaluated result
 */
function multi_roll(term, sign){
    var split_term = term.split("d");
    var num_dice = parseInt(split_term[0]);
    var die_type = parseInt(split_term[1]);
    var total = 0;
    var show_roll = should_show_rolls();
    
    for(i=0; i<num_dice; i++){
        var roll = get_rand(1,die_type);
        total += roll;
        if (show_roll){
            display_roll(roll, die_type);}
    }
    return int_add(total, sign);
}

/**
 * displays the total roll
 * @param {int} total the final value
 * @param {int} min the minimum value
 * @param {int} avg the average value
 * @param {int} max the highest possible value
 */
function display_result(total, min=null, avg=null, max=null){
    var output = document.getElementById("output");
    output.innerHTML = "your total roll was: <b>" + total+"</b>";
}

/**
 * finds if user has selected for stats to be shown
 * @returns {boolean} true if stats should be shown
 */
function should_show_stats(){
    return document.getElementById("show_stats").checked
}

/**
 * finds minimum value of a multi die roll
 * @param {int} amount number of dice
 * @param {int} type value of each die
 * @param {boolean} sign true if the term is positive
 * @returns {int} the minimum value
 */
function xdx_min(amount, type, sign){
    if(sign){
        return amount;}
    else{
        return -amount*type;}
}

/**
 * finds maximum value of a multi die roll
 * @param {int} amount number of dice
 * @param {int} type value of each die
 * @param {boolean} sign true if the term is positive
 * @returns {int} the maximum value
 */
function xdx_max(amount, type, sign){
    if(sign){
        return amount*type;}
    else{
        return -amount;}}

/**
 * generates stats for a roll and adds to the document
 * @param {string array} valid_terms the terms to be evaluated
 */
function add_stats(valid_terms){
    var min=0;
    var max=0;
    for(x in valid_terms){
        var curr_item=valid_terms[x];
        var item_is_pos = is_pos(curr_item);
        var exe_term=trim_sign(curr_item);
        if(is_int(exe_term)){
            var signed_int = int_add(exe_term, item_is_pos);
            min += signed_int;
            max += signed_int;
            continue
        }
        var amount_type = exe_term.split("d");
        var amt = parseInt(amount_type[0]);
        var type = parseInt(amount_type[1]);
        min += xdx_min(amt, type, item_is_pos);
        max += xdx_max(amt, type, item_is_pos);

    }
    display_stats(valid_terms, min, max);
}

/**
 * merges a list of strings into a single string
 * @param {string array} list_of_strs the list to be merged
 * @returns {string} the concatonated string
 */
function merge(list_of_strs){
    var total_str = ""
    for(x in list_of_strs){
        total_str += list_of_strs[x];}
    return total_str;}

/**
 * changes the stats heading on the document
 * @param {string} terms what the header will be changed to  
 */
function set_stats_head(terms){
    head_str = "Stats for: "+merge(terms);
    document.getElementById("stat_head").innerHTML=head_str;
}

/**
 * clears all stats on the document
 */
function clear_stats(){
    document.getElementById("stats").innerHTML="";
    document.getElementById("stat_head").innerHTML="";
}

/**
 * sends statistics to the document
 * @param {string} terms the overall roll
 * @param {int} min the minimum value 
 * @param {int} max the maximum value
 */
function display_stats(terms, min, max){
    stat_output = document.getElementById("stats");
    set_stats_head(terms);
    min_str = "minimum roll: "+min+"<br>";
    max_str="maximum roll: "+max+"<br>";
    avg_str="average roll: "+(max+min)/2+"<br>";
    stat_output.innerHTML = min_str+max_str+avg_str;
}

/**
 * evaluates all terms in an array
 * @param {string array} valid_items the list of items
 * being evaluated
 * @returns {int} total result from evaluating the expression
 */
function eval_terms(valid_items){
    var total = 0;
    var show_rolls = should_show_rolls();
    if(should_show_stats()){
        add_stats(valid_items);
    }
    for (x in valid_items){
        var term_is_pos = is_pos(valid_items[x]);
        var exe_term = trim_sign(valid_items[x]);
        if (show_rolls && !is_int(exe_term)){
            roll_log("<b>evaluating "+valid_items[x]+"</b>");
        }
        if(is_int(exe_term)){
            signed_term = int_add(exe_term, term_is_pos);
            total += signed_term;
            if(show_rolls){
                display_roll(null,null,exe_term, term_is_pos);
            }
        }
        else{//is an xdx term
            total += multi_roll(exe_term, term_is_pos);
        }
    }
    return total;}

/**
 * takes value from either the main input or given element
 * evaluates it and displays the value on the document
 * @param {HTMLelement} thisEl (optional) element it takes 
 * string to process from
 */
function process_result(thisEl=null){
    clear_roll();
    clear_stats();
    if(thisEl != null){
        var raw_str = thisEl.innerHTML;
    }
    else{
        var raw_str = document.getElementById("input").value;
    }
    if (raw_str == ""){return;}

    var raw_items = split_str(raw_str);
    var valid_terms = get_valid_str(raw_items);
    if(valid_terms.length == 0){
        errorTxt("invalid roll", "rollError");
        return;}
    var total = eval_terms(valid_terms);

    display_result(total);
    clearErrors();}

/**
 * removes an element from the document
 * @param {HTMLelement} el the element to be removed
 */
function deleteParent(el){
    var parent = el.parentNode;

    if(parent.getAttribute("class")=="pastRolls"){
        var roll = parent.childNodes[0].innerHTML;
        deleteStoredRoll(roll);
    }
    parent.parentNode.removeChild(parent);
}

/**
 * determines if a roll is already present in browser
 * local storage
 * @param {string} roll the roll to be checked
 * @returns {boolean} whether roll is in the local storage
 */
function rollIsTaken(roll){
    var allChilds = document.getElementsByClassName("pastRolls");
    if(allChilds.length == 0){
        return false;}

    for(x in allChilds){
        if(!isInt(x)){return false;}//no more children to see
        
        var childRoll = allChilds[x].childNodes[0].innerHTML;
        if(childRoll == roll){
            return true;}
}}

/**
 * adds an element to the document that allows
 * you to redo the current roll whenever you want
 */
function saveDieRoll(roll=null, startingLoad=false){
    //save die roll on sidebar
    if(roll == null){
        var el = document.getElementById("input");
        var roll = el.value;}

    if(rollIsTaken(roll)){
        errorTxt("die has already been added", "rollError");
        return;}
    roll = merge(get_valid_str(split_str(roll)));
    if(roll == ""){
        errorTxt("invalid roll", "rollError");
        return;}

    var innerTxt = '<button onclick="process_result(this)">'+roll
    +'</button><button onclick="deleteParent(this)">del</button>';

    var rollElem = newElem("div", innerTxt, true);
    rollElem.setAttributeNode(newAtt("class", "pastRolls"));

    var rollMama = document.getElementById("savedRolls");
    rollMama.insertBefore(rollElem, rollMama.childNodes[0]);

    if(!startingLoad){
        storeRoll(roll);}
}

/**
 * stores a valid roll in local storage
 * #note the keys have naming scheme roll, roll1, etc
 * @param {string} roll the roll to be stored
 */
function storeRoll(roll){
    var key = getNewKey("roll");
    localStorage.setItem(key, roll);
}

/**
 * removes a roll from the browser localstorage
 * @param {string} roll the roll to be removed
 */
function deleteStoredRoll(roll){
    var rollKeys = getPregenKeys("roll");
    for(x in rollKeys){
        var cont = localStorage.getItem(rollKeys[x]);
        if(cont == roll){
            localStorage.removeItem(rollKeys[x]);
            return;
        }
    }
}

/**
 * toggles whether or not the user can see the saved rolls
 * @param {HTMLelement} childEl the saved roll holder element
 */
function toggleSavedRolls(childEl){
    document.getElementById("savedRolls").hidden=!childEl.checked;
}