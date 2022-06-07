
const optionsMenu = document.querySelector(".optionsMenu");
const options = document.querySelector(".options");
const mainWordInp = document.querySelector(".mainWordInp");
const listOptions = document.querySelectorAll(".options li");
const saveBTN = document.querySelector(".save-btn");
const imgContainer = document.querySelector(".imgsContainer");
const closeImgContainer = document.querySelector(".closeImgContainer");
const submitChoiceToChooseImg = document.querySelector(".submitChoiceToChooseImg");
const loadingText = document.querySelector(".loading");
let numberOfVocabularies = localStorage.getItem("number");
let imgChoosedUrl; 
// i use classes coz it way understandable and make my code a more clean
    //if you don't understand why i initialize this initialize function in the classes coz it gonna release intently when you declare the class 
    //you can see it in the bottom of this code
    
//this class add click events to elements and check the number of the words that saved in localStorage
class putGeniralEventToElement {
  constructor() {

    this._initialize();
  }
  _initialize() {
    this._AddTheNumberOfVocabulariesInLocalStorage();
    this.swFunction()
    saveBTN.addEventListener("click", () => {
      allOprationsVar.loadIfImgAndContinue();
    });
    optionsMenu.addEventListener("click", () => {
      optionsMenu.classList.toggle("close");
    options.classList.toggle("active");
    });

    listOptions.forEach((element, idx) => {
      element.addEventListener("click", () => {
        allOprationsVar.addTaskToListInputs(idx);
      });
    });
    closeImgContainer.addEventListener('click', () => {
      imgContainer.classList.remove('active')
    })
    submitChoiceToChooseImg.addEventListener('click', () => {
      if (!imgChoosedUrl) return alert('please choose img or cancel the opration')
      imgContainer.classList.remove('active')
    })
  }
  swFunction() {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js')
    }
  }
  
  _AddTheNumberOfVocabulariesInLocalStorage() {
    if (!numberOfVocabularies) {
      localStorage.setItem("number", "0");
    }
  }
}

class allOprations {
  constructor() {
    this._checkPic = true;
    this._checkPhonemes = true;
    this._checkMainSentence = true;
    this._numberOfAnotherSentence = 1;
    this.startEvents();
  }
  
  startEvents() {
    const putGeniralEvent = new putGeniralEventToElement();
}
  //this function receives the number of the list in the html 
  //you can see them in html or here they are 
        //<li>add a main sentence</li>
        //    <li>add a picture</li>
        //    <li>add phonetic alphabet </li>
        //    <li>add an another mean by sentence</li>
         //if the first one the function gonna add main sentence input
         //and it gonna save it in localStorage by others function they are self explained
         //and like that with the others 

  addTaskToListInputs(inputNum) {
    switch (inputNum) {
      case 0:
        if (!this._checkMainSentence) return;
        this.makeInputFun({
          className: "addMainSentence",
          placeholder: "Enter The Main Sentence ^_^",
          type: "text",
        });
        this._checkMainSentence = false;

        break;
      case 1:
        if (!this._checkPic) return;
        this.appendImgInputAndAddPropertiesToIt({
          className: "addPic",
          type: "file",
          accept: "image/png ,image/jpg",
        });
        this._checkPic = false;
        break;
      case 2:
        if (!this._checkPhonemes) return;
        this.makeInputFun({
          className: "addPhonemeInp",
          placeholder: "Enter the phonetic alphabet or let the server put it",
          type: "text",
        });
        this._checkPhonemes = false;
        break;
      case 3:
        this.makeInputFun({
          className: `anotherSentenceInp${this._numberOfAnotherSentence}`,
          id: "anotherSentenceInp",
          placeholder: "Add An Another Sentence 🤗",
          type: "text",
        });
        this._numberOfAnotherSentence += 1;
        break;
    }
  }
 // this function "makeInputFun()" does this pattern 
 // <div class="containerOfInputAndButton">
         // <input type="text" class="receive by params" />
    //      <button class="buttonToRemoveTheInput">x</button>
  //      </div>
  makeInputFun(params) {
    const containerOfInputAndButton = document.createElement("div");
    const buttonToRemoveTheInput = document.createElement("button");
    const Input = document.createElement("input");
    containerOfInputAndButton.className = `containerOfInputAndButton ${params.className}`;
    buttonToRemoveTheInput.innerText = "x";
    //set this attribute to get the class of the container in removeInputs function
    buttonToRemoveTheInput.setAttribute("classOfInput", params.className);
    buttonToRemoveTheInput.className = 'buttonToRemoveTheInput'
    containerOfInputAndButton.append(Input, buttonToRemoveTheInput);

    Input.id = params.id;
    Input.type = params.type;
    Input.placeholder = params.placeholder;
    Input.className = params.className;
    Input.accept = params.accept;
    options.appendChild(containerOfInputAndButton);
    this.removeInputs();
  }
 // this represent the img api and the choose img from the device
  appendImgInputAndAddPropertiesToIt(params) {

    const imgInupt = document.createElement("input");
    const button1 = document.createElement("button");
    const button2 = document.createElement("button");
    const buttonToRemoveTheInput = document.createElement("button");
    buttonToRemoveTheInput.setAttribute("classOfInput", params.className);
    buttonToRemoveTheInput.className = 'buttonToRemoveTheInput'
    buttonToRemoveTheInput.innerText = 'x'

    const containerButtonsOfImgs = document.createElement("div");

    // button stuff (:

    button1.className = "api-button";
    button2.className = "localImg-button";

    button1.innerText = "Choose From Internet";
    button2.innerText = "Choose From device";
    button1.onclick = () => {
       this.mainword = document.querySelector(".mainWordInp").value;
      if (this.mainword) {
        this.api = new fetchAndDisplayImgsApi(this.mainword)
      } else {
        alert('Please Enter The Vocabulary above ')
      }
    };
    button2.onclick = () => {
      imgInupt.click();
    };

    // input stuff (:

    imgInupt.className = params.className;
    imgInupt.type = params.type;
    imgInupt.accept = params.accept;
    imgInupt.style.display = "none";

    // container buttons stuff (:

    containerButtonsOfImgs.className = `containerButtonsOfImgs       ${params.className}`;
    containerButtonsOfImgs.append(imgInupt, button1, button2,buttonToRemoveTheInput);
    const styleContainer = containerButtonsOfImgs.style;
    styleContainer.display = "flex";

    options.appendChild(containerButtonsOfImgs);
    this.removeInputs()
  }
//this function check if there is an img choosed from the device it gonna 
//make it as string and release the saveWord function 
  loadIfImgAndContinue() {
    const pic = document.querySelector("input.addPic");
    if (pic) {
      if (pic.files[0]) {
        const fileReader = new FileReader();
        fileReader.addEventListener("load", () => {
          this.saveWord(fileReader.result);
        });
        fileReader.readAsDataURL(pic.files[0]);
      } else {
        this.saveWord();
      }
    } else {
      this.saveWord();
    }
  }
  
  
  //this function collects all the informations about the world 
  //and customize it and save it by saveToLocalStorage function 
  async saveWord(imgString) {
    this.mainword = document.querySelector(".mainWordInp").value;
    let mainSentence;
    let phonemes;
    let audio;
    let textAndAudioApi;
    const phonemesClass = new phoneticsAlphabetApiManger(this.mainword)
    // i did that "if statement" coz it show err can't read properties of null value 
    if (document.querySelector("input.addMainSentence")) {
      if (document.querySelector("input.addMainSentence").value) {
      mainSentence =  document.querySelector("input.addMainSentence").value;
      }
    }
    let phonemeInp = document.querySelector("input.addPhonemeInp");
    let anotherSentenceInp = document.querySelectorAll(
      "input#anotherSentenceInp"
    );

    if (!this.mainword) return alert("please Inter the vocabulary to save");
    let anotherMeaninigSentecesArr = [];
    anotherSentenceInp.forEach((item) => {
      if (item.value) {
        anotherMeaninigSentecesArr.push(item.value);
      }
    });
//the random color in fetchfromlocalstorage.js to add border 
    const randomColor = Math.floor(Math.random() * 16777215).toString(16);
    
    const imgChoosed = imgChoosedUrl ? imgChoosedUrl :imgString ;
    if (phonemeInp) {
      if (phonemeInp.value) {
        phonemes = `/${phonemeInp.value}/`;
      } else {
        textAndAudioApi = await phonemesClass.fetchApi();
        audio = textAndAudioApi.audio;
        phonemes = textAndAudioApi.text;
        console.log(phonemes)
      }
    } else {
         textAndAudioApi = await phonemesClass.fetchApi();
        audio = textAndAudioApi.audio;
        phonemes = textAndAudioApi.text;
        console.log(phonemes)
    }
    const SaveToLocal = {
      mainworld: this.mainword,
      mainSentence: mainSentence ? mainSentence : null,
      numberOfMeaninig: anotherMeaninigSentecesArr.length,
      audio :audio,
      phoneme: phonemes,
      pic: imgChoosed,
      anotherSentenceWithNewMeaning: anotherMeaninigSentecesArr,
      randomColor: randomColor,
    };

    let numberOfVocabulariesInLocalStorage = parseInt(
      localStorage.getItem("number")
    );
    numberOfVocabulariesInLocalStorage += 1;
    this.saveToLocalStorage(SaveToLocal, numberOfVocabulariesInLocalStorage);
  }

  saveToLocalStorage(params, currentNumberOfWords) {
    localStorage.setItem(
      `word.${currentNumberOfWords}`,
      JSON.stringify(params)
    );
    localStorage.setItem("number", currentNumberOfWords.toString());
    window.location.reload();
  }
  
  //this function add events to the buttons in .options it gonna remove the container of it and the container contain the input and the button that used to remove
  removeInputs() {
    const buttonsToRemoveInputs = document.querySelectorAll(
      ".options button.buttonToRemoveTheInput"
    );
    
    if (!buttonsToRemoveInputs) return;
    buttonsToRemoveInputs.forEach((item, idx) => {
      item.addEventListener("click", () => {
        let classOfInput = item.getAttribute("classOfInput");
        const containerDiv = document.querySelector(
          `.options div.${classOfInput}`
        );

        switch (classOfInput) {
          case "addMainSentence":
            this._checkMainSentence = true;
            break;
          case "addPic":
            this._checkPic = true;
            break;
          case "addPhonemeInp":
            this._checkPhonemes = true;
            break;
        }

        containerDiv.remove();
      });
    });
    return;
  }
}

//api for img 
class fetchAndDisplayImgsApi {
  constructor(wordToSearch) {
    this.mainword = wordToSearch;
    this._initialize();
  }
  _initialize() {
    this.fetchApi();
  }

  async fetchApi() {
    const vocabularyiesToSearch = this.customizeValueOfMainVocabularyInput();
    
    // const url = `https://www.pexels.com/en-us/api/v3/sponsored-media/photos/${vocabularyiesToSearch}?number=6`;
      // "Content-Type": "application/json",
        // "secret-key": "H2jk9uKnhRmL6WPwh89zBezWvr"
        
        try {
          imgContainer.classList.add('active')
          loadingText.classList.add("active");
    const url = `https://api.pexels.com/v1/search?query=${vocabularyiesToSearch}`;
    const response = await axios({
      url: url,
      method:'get',
      headers: {
        'Authorization': '563492ad6f91700001000001e97445ec4b5f4768ab2599849cbda7e0'

      }
    });
    
    
    if (response.data.total_results == 0) {
      imgContainer.classList.remove('active')

     alert('please check the main vocabulary you should write it correctly and in English ): or you can choose your own pic localy from the device ')
      return 
    } else {
      loadingText.classList.remove("active");
      this.appendImgsOnScreen(response.data.photos);
    }
        } catch (e) {
          imgContainer.classList.remove('active')
          alert("there are errors maybe you're not connected with internet or errors from the server please try add from your gallery imgs 😓")
        } 
  }
  //append all imgs in the .imgsContainer div
  appendImgsOnScreen(params) {
    const imgs = document.querySelectorAll(".imgsContainer img");
    if (imgs) {
      imgs.forEach(elment => {
        elment.remove()
      })
    }
    
    
    params.forEach((objInfo,idx) => {
      const img = document.createElement('img')
      img.className = `img${idx}`
      img.src = objInfo.src.large;
      imgContainer.appendChild(img)
    })
    
  this.catchImgChoosed();
  }
  
  
  catchImgChoosed(){
    const imgs = document.querySelectorAll('.imgsContainer img')
    let clickedPreviously;
    imgs.forEach(element => {
      element.addEventListener('click', () => {
        if (clickedPreviously) {
          clickedPreviously.classList.remove('choosed');
          clickedPreviously = element;
          clickedPreviously.classList.add('choosed');
          imgChoosedUrl = element.src
        } else {
          clickedPreviously = element;
          clickedPreviously.classList.add("choosed");
          imgChoosedUrl = element.src;
        }
      })
    })
  }
  
  //this function receives value and convert it to customized value for search in the ali 
  // for example input = 'hello world' the function return 'hello%20world'
  
  customizeValueOfMainVocabularyInput() {
    let theCostimizeWords = ''
    let arrayOfWord = this.mainword.split(' ')
    const finalIndex = arrayOfWord.length - 1;
    arrayOfWord.forEach((currentWord,idx) => {
      if (currentWord) {
        if (finalIndex !== idx) {
          theCostimizeWords+= currentWord + '%20'
        } else {
          theCostimizeWords += currentWord;
        }
      }

    })
    return theCostimizeWords
  }
}


  
class phoneticsAlphabetApiManger{
  constructor(wordToGetphonetics) {
    this.wordToGetphonetics = wordToGetphonetics
    this.phonetics = {text:null,audio:null};
  }

  async fetchApi() {
    try {
      
    const url = `https://api.dictionaryapi.dev/api/v2/entries/en/${this.wordToGetphonetics}`;
    const response = await axios({
      url: url,
      method:'get',
    });
    
    response.data[0].phonetics.forEach(item => {
      //choose the item when have audio and text
      if ('text' in item && 'audio' in item) {
        if (item.text && item.audio) {
          this.phonetics = {
            text: item.text,
            audio: item.audio,
          };
          return 
        }
       }
    })
      return this.phonetics;

    } catch (error) {
      return this.phonetics      
    }
    
  }
    
}
const allOprationsVar = new allOprations();


