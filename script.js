const inputSlider = document.querySelector("[data-lengthSlider]");
const lengthDisplay = document.querySelector("[data-lengthNumber]");
const passwordDisplay = document.querySelector("[data-passwordDisplay]");
const copyBtn = document.querySelector("[data-copy]");
const copyMsg = document.querySelector("[data-copyMsg]");
const uppercaseCheck = document.querySelector("#uppercase");
const lowercaseCheck = document.querySelector("#lowercase");
const numbersCheck = document.querySelector("#numbers");
const symbolsCheck = document.querySelector("#symbols");
const indicators = document.querySelector("[data-indicator]");
const generateBtn = document.querySelector(".generate-button");
const allCheckBox = document.querySelectorAll("input[type=checkbox]");
const symbols = '~`!@#$%^&*()_+€,./\|":{}[]<>_';

let password = "";
let passwordLength = 10;
let checkCount = 0;
// set strength circle color to grey
setIndicator("#ccc");

handleSlider();

// set password length
function handleSlider(){
    inputSlider.value = passwordLength;
    lengthDisplay.innerHTML = passwordLength;
    const min = inputSlider.min;
    const max = inputSlider.max;
    inputSlider.style.backgroundSize = ((passwordLength - min )*100/(max-min)) + "% 100%"
}

function setIndicator(color){
    indicators.style.backgroundColor = color;
  indicators.style.boxShadow = `0px 0px 12px 1px ${color}`;
}

function getRandomInteger(min,max){
    return Math.floor(Math.random() * (max - min)) + min;
}

function generatedRandomNumber(){
    return getRandomInteger(0,9)
}

function generateLowerCase(){
    return String.fromCharCode(getRandomInteger(97,123));
}

function generateUpperCase(){
    return String.fromCharCode(getRandomInteger(65,91));
}

function generateSymbol(){
    const randomNumber = getRandomInteger(0, symbols.length);
    return symbols.charAt(randomNumber);
}

function calculateStrength(){
    let hasUpper = false;
    let hasLower = false;
    let hasNumber = false;
    let hasSymbol = false;
    if(uppercaseCheck.checked) hasUpper = true;
    if(lowercaseCheck.checked) hasLower = true;
    if(numbersCheck.checked) hasNumber = true;
    if(symbolsCheck.checked) hasSymbol = true;

    if(hasUpper && hasLower && (hasNumber || hasSymbol) && passwordLength >=8) {
        setIndicator("#0f0")
    }
    else if (
        (hasLower || hasUpper) &&
        (hasNumber || hasSymbol) &&
        passwordLength >=6
    ) {
        setIndicator("#ff0");
    }
    else {
        setIndicator("#f00");
    }
}

async function copyContent(){
    try {
    await navigator.clipboard.writeText(passwordDisplay.value);
    copyMsg.innerHTML = "copied"
    }
    catch (e) {
        copyMsg.innerHTML = "Failed"
    }

    copyMsg.classList.add("active");

    setTimeout(() => {
        copyMsg.remove("active")
    },2000);
}

function shufflePassword(array){
    //Fisher Yates Method
    for(let i = array.length -1; i > 0; i--){
        const j = Math.floor(Math.random() * (i + 1));
        const temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    let str = "";
    array.forEach((el) => (str += el));
    return str;
}

function handleCheckBoxChange(){
    checkCount = 0;
    allCheckBox.forEach((checkbox) => {
        if(checkbox.checked) checkCount++;
    });

    // corner case
    if(passwordLength < checkCount) {
        passwordLength = checkCount;
        handleSlider();
    }
}

allCheckBox.forEach((checkbox) => {
    checkbox.addEventListener("change", handleCheckBoxChange);
})

inputSlider.addEventListener("input", (e) => {
    passwordLength = e.target.value;
    handleSlider();
})

copyBtn.addEventListener("click", (e) => {
    if(passwordDisplay.value)
        copyContent();
})

generateBtn.addEventListener("click", (e) => {
    // none of thge checkbox is checked
    if(checkCount<=0) return;

    if(passwordLength < checkCount) {
        passwordLength = checkCount;
        handleSlider();
    }

    // remove the old password
    password = "";

    let funcArr = [];

    if(uppercaseCheck.checked) 
        funcArr.push(generateUpperCase);

    if(lowercaseCheck.checked) 
        funcArr.push(generateLowerCase);

    if(numbersCheck.checked)  
        funcArr.push(generatedRandomNumber);

    if(symbolsCheck.checked) 
        funcArr.push(generateSymbol);

    // compulsory addition of characters
    for(let i = 0; i< funcArr.length; i++) {
        password += funcArr[i]();
    } 
    // generate random charactors
        for(let i=0;i<passwordLength-funcArr.length; i++) {
            let randomIndex = getRandomInteger(0, funcArr.length);
            password += funcArr[randomIndex]();
        }

    // shuffle the password array
    password = shufflePassword(Array.from(password));

    // show in UI
    passwordDisplay.value = password;

    // calculate the strength of the password
    calculateStrength();
})