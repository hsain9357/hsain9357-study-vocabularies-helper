const optionsMenu = document.querySelector(".optionsMenu");
const options = document.querySelector(".options");
const mainWordInp = document.querySelector(".mainWordInp");
const listOptions = document.querySelectorAll(".options li");
const saveBTN = document.querySelector(".save-btn");
const imgContainer = document.querySelector(".imgsContainer");
const closeImgContainer = document.querySelector(".closeImgContainer");
const submitChoiceToChooseImg = document.querySelector(
  ".submitChoiceToChooseImg"
);
const loadingText = document.querySelector(".loading");
// this number in localStorage help to get how many items saved in localStorage
let numberOfVocabularies = localStorage.getItem("number");
// this var use when the api to add pic in to save it in localStorage
var imgChoosedUrl;
//this class handle all click events to elements and check the number of the words that saved in localStorage
class putGeniralEventToElement {
  constructor() {
    this._initialize();
  }

  _initialize() {
    this._AddTheNumberOfVocabulariesInLocalStorage();
    this.swFunction();

    saveBTN.addEventListener("click", () => {
      APP.loadIfImgAndContinue();
    });
    optionsMenu.addEventListener("click", () => {
      optionsMenu.classList.toggle("close");
      options.classList.toggle("active");
    });

    listOptions.forEach((element, idx) => {
      element.addEventListener("click", () => {
        APP.addTaskToListInputs(idx);
      });
    });
    closeImgContainer.addEventListener("click", () => {
      imgContainer.classList.remove("active");
    });
    submitChoiceToChooseImg.addEventListener("click", () => {
      if (!imgChoosedUrl)
        return alert("please choose img or cancel the opration");
      imgContainer.classList.remove("active");
    });
  }
  swFunction() {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js");
    }
  }

  _AddTheNumberOfVocabulariesInLocalStorage() {
    if (!numberOfVocabularies) {
      localStorage.setItem("number", "0");
    }
  }
}

class Demo {
  constructor() {
    this._checkPic = true;
    this._checkPhonemes = true;
    this._checkTheDefinition = true;
    this._numberOfAnotherSentence = 1;
    this._checkInputCategory = true;
    this._currentCategory = undefined;
    this.startEvents();
  }

  startEvents() {
    new putGeniralEventToElement();
  }

  //this function receives the number of the item  in the html
  //you can see them in html or here they are
  //<li>Defintion</li>
  //    <li> picture</li>
  //    <li>phonetic </li>
  //    <li> sentence example</li>
  //if the first one the function gonna definition input
  //and it gonna save it in localStorage by others function they are self-explantory
  //and same with  others
  addTaskToListInputs(inputNum) {
    switch (inputNum) {
      case 0:
        if (!this._checkTheDefinition) return;
        this.makeInputFun({
          className: "addDefinition",
          placeholder: "Enter The Definition ^_^",
          type: "text",
        });
        this._checkTheDefinition = false;

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
          placeholder: "Add A Sentence 🤗",
          type: "text",
        });
        this._numberOfAnotherSentence += 1;
        break;
      case 4:
        if (!this._checkInputCategory) return;
        this.setCategory();
        this._checkInputCategory = false;
        break;
    }
  }

  // this function "makeInputFun()" does this pattern
  // <div class="containerOfInputAndButton">
  // <input type="text" class="receive by params" />
  //   <button class="buttonToRemoveTheInput">x</button>
  //   </div>
  makeInputFun(params) {
    const containerOfInputAndButton = document.createElement("div");
    const buttonToRemoveTheInput = document.createElement("button");
    const Input = document.createElement("input");
    containerOfInputAndButton.className = `containerOfInputAndButton ${params.className}`;
    buttonToRemoveTheInput.innerText = "x";
    //set this attribute to get the class of the container in removeInputs function
    buttonToRemoveTheInput.setAttribute("classOfInput", params.className);
    buttonToRemoveTheInput.className = "buttonToRemoveTheInput";
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
    buttonToRemoveTheInput.className = "buttonToRemoveTheInput";
    buttonToRemoveTheInput.innerText = "x";

    const containerButtonsOfImgs = document.createElement("div");

    // button stuff (:

    button1.className = "api-button";
    button2.className = "localImg-button";

    button1.innerText = "Choose From Internet";
    button2.innerText = "Choose From device";
    button1.onclick = () => {
      this.mainword = document.querySelector(".mainWordInp").value;
      if (this.mainword) {
        this.api = new fetchAndDisplayImgsApi(this.mainword);
      } else {
        alert("Please Enter The Vocabulary above ");
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
    containerButtonsOfImgs.append(
      imgInupt,
      button1,
      button2,
      buttonToRemoveTheInput
    );
    const styleContainer = containerButtonsOfImgs.style;
    styleContainer.display = "flex";

    options.appendChild(containerButtonsOfImgs);
    this.removeInputs();
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
    const phonemesClass = new phoneticsAlphabetApiManger(this.mainword);
    // i did that "if statement" coz it show err can't read properties of null value
    if (document.querySelector("input.addDefinition")) {
      if (document.querySelector("input.addDefinition").value) {
        mainSentence = document.querySelector("input.addDefinition").value;
      }
    }
    let phonemeInp = document.querySelector("input.addPhonemeInp");
    let anotherSentenceInp = document.querySelectorAll(
      "input#anotherSentenceInp"
    );

    if (!this.mainword) return alert("please Enter the vocabulary to save");
    let anotherMeaninigSentecesArr = [];
    anotherSentenceInp.forEach((item) => {
      if (item.value) {
        anotherMeaninigSentecesArr.push(item.value);
      }
    });
    //the random color in fetchfromlocalstorage.js to add border
    const randomColor = Math.floor(Math.random() * 16777215).toString(16);

    const imgChoosed = imgChoosedUrl ? imgChoosedUrl : imgString;
    if (phonemeInp) {
      if (phonemeInp.value) {
        phonemes = `/${phonemeInp.value}/`;
      } else {
        textAndAudioApi = await phonemesClass.fetchApi();
        audio = textAndAudioApi.audio;
        phonemes = textAndAudioApi.text;
        console.log(phonemes);
      }
    } else {
      textAndAudioApi = await phonemesClass.fetchApi();
      audio = textAndAudioApi.audio;
      phonemes = textAndAudioApi.text;
      console.log(phonemes);
    }
    const SaveToLocal = {
      mainworld: this.mainword,
      mainSentence: mainSentence ? mainSentence : null,
      numberOfMeaninig: anotherMeaninigSentecesArr.length,
      audio: audio,
      phoneme: phonemes,
      pic: imgChoosed,
      anotherSentenceWithNewMeaning: anotherMeaninigSentecesArr,
      randomColor: randomColor,
      date: new Date(),
    };

    let numberOfVocabulariesInLocalStorage = parseInt(
      localStorage.getItem("number")
    );
    numberOfVocabulariesInLocalStorage += 1;
    this.saveToLocalStorage(SaveToLocal, numberOfVocabulariesInLocalStorage);
  }

  saveToLocalStorage(params, currentNumberOfWords) {
    const allCategories = JSON.parse(localStorage.getItem("listCategories"));
    if (this._currentCategory) {
      if (allCategories) {
        if (allCategories.includes(this._currentCategory)) {
          let numberOfCurrentCategory = parseInt(
            localStorage.getItem(`numberOf.${this._currentCategory}`)
          );
          numberOfCurrentCategory++;
          localStorage.setItem(
            `${this._currentCategory}.${numberOfCurrentCategory}`,
            JSON.stringify(params)
          );

          localStorage.setItem(
            `numberOf.${this._currentCategory}`,
            numberOfCurrentCategory.toString()
          );
          window.location.reload();
        } else {
          //if current category doesn't includes with categories array in localStorage not includes i localStorage
          allCategories.push(this._currentCategory);
          localStorage.setItem("listCategories", JSON.stringify(allCategories));
          localStorage.setItem(`numberOf.${this._currentCategory}`, "1");
          localStorage.setItem(
            `${this._currentCategory}.1`,
            JSON.stringify(params)
          );

          window.location.reload();
        }
      } else {
	     //if the user select category and there is no  categories array in localStorage  
        localStorage.setItem(
          "listCategories",
		JSON.stringify([])
        );
        return   this.saveToLocalStorage(params, currentNumberOfWords); 
      }
    } else {
	    // if the user didn'nt select any category
      localStorage.setItem(
        `word.${currentNumberOfWords}`,
        JSON.stringify(params)
      );
      localStorage.setItem("number", currentNumberOfWords.toString());
      window.location.reload();
    }
  }
  //this function add events to the buttons in .options it gonna remove the container of it and the container contain the input and the button that used to remove
  removeInputs() {
    const buttonsToRemoveInputs = document.querySelectorAll(
      ".options button.buttonToRemoveTheInput"
    );

    if (!buttonsToRemoveInputs) return;
    buttonsToRemoveInputs.forEach((item) => {
      item.addEventListener("click", () => {
        let classOfInput = item.getAttribute("classOfInput");
        const containerDiv = document.querySelector(
          `.options div.${classOfInput}`
        );

        switch (classOfInput) {
          case "addDefinition":
            this._checkTheDefinition = true;
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

  setCategory() {
    const containerCategories = document.createElement("div");
    const listCategoriesContainer = document.createElement("ul");
    listCategoriesContainer.className = "listCategoriesContainer";
    const listCategoriesInLocalStorage = JSON.parse(
      localStorage.getItem("listCategories")
    );
    if (listCategoriesInLocalStorage) {
      listCategoriesInLocalStorage.forEach((item) => {
        const list = document.createElement("li");
        list.innerText = item;
        list.setAttribute("category", item);

        listCategoriesContainer.appendChild(list);
        return list;
      });
      containerCategories.appendChild(listCategoriesContainer);
    }
    const inputCategory = document.createElement("input");
    inputCategory.className = "inputCategory";
    inputCategory.placeholder = "Enter category";
    containerCategories.appendChild(inputCategory);
    options.appendChild(containerCategories);
    this.choosedCategory();
  }
  choosedCategory() {
    const lists = document.querySelectorAll(
      ".options .listCategoriesContainer li"
    );
    const inputCategory = document.querySelector(
      ".options input.inputCategory"
    );
    let prevList;
    lists.forEach((list) => {
      list.addEventListener("click", () => {
        list.classList.toggle("choosed");
        if (prevList) {
          prevList.classList.remove("choosed");
          prevList = list;
          prevList.classList.add("choosed");
          this._currentCategory = prevList.innerText;
        } else {
          prevList = list;
          prevList.classList.add("choosed");
          this._currentCategory = prevList.innerText;
        }
      });
    });

    inputCategory.addEventListener("input", (e) => {
      console.log("changed");
      if (e.target.value) {
        if (prevList) {
          prevList.classList.remove("choosed");
          prevList = undefined;
        }
        this._currentCategory = e.target.value;
      }
    });
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
      imgContainer.classList.add("active");
      loadingText.classList.add("active");
      const url = `https://api.pexels.com/v1/search?query=${vocabularyiesToSearch}`;
      const response = await axios({
        url: url,
        method: "get",
        headers: {
          Authorization:
            "563492ad6f91700001000001e97445ec4b5f4768ab2599849cbda7e0",
        },
      });

      if (response.data.total_results == 0) {
        imgContainer.classList.remove("active");

        alert(
          "please check the main vocabulary you should write it correctly and in English ): or you can choose your own pic localy from the device "
        );
        return;
      } else {
        loadingText.classList.remove("active");
        this.appendImgsOnScreen(response.data.photos);
      }
    } catch (e) {
      imgContainer.classList.remove("active");
      alert(
        "there are errors maybe you're not connected with internet or errors from the server please try add from your gallery imgs 😓"
      );
    }
  }
  //append all imgs in the .imgsContainer div
  appendImgsOnScreen(params) {
    const imgs = document.querySelectorAll(".imgsContainer img");
    if (imgs) {
      imgs.forEach((elment) => {
        elment.remove();
      });
    }

    params.forEach((objInfo, idx) => {
      const img = document.createElement("img");
      img.className = `img${idx}`;
      img.src = objInfo.src.large;
      imgContainer.appendChild(img);
    });

    this.catchImgChoosed();
  }

  catchImgChoosed() {
    const imgs = document.querySelectorAll(".imgsContainer img");
    let clickedPreviously;
    imgs.forEach((element) => {
      element.addEventListener("click", () => {
        if (clickedPreviously) {
          clickedPreviously.classList.remove("choosed");
          clickedPreviously = element;
          clickedPreviously.classList.add("choosed");
          imgChoosedUrl = element.src;
        } else {
          clickedPreviously = element;
          clickedPreviously.classList.add("choosed");
          imgChoosedUrl = element.src;
        }
      });
    });
  }

  //this function receives value and convert it to customized value for search in the api
  // for example input = 'hello world' the function return 'hello%20world'

  customizeValueOfMainVocabularyInput() {
    let theCostimizeWords = "";
    let arrayOfWord = this.mainword.split(" ");
    const finalIndex = arrayOfWord.length - 1;
    arrayOfWord.forEach((currentWord, idx) => {
      if (currentWord) {
        if (finalIndex !== idx) {
          theCostimizeWords += currentWord + "%20";
        } else {
          theCostimizeWords += currentWord;
        }
      }
    });
    return theCostimizeWords;
  }
}

class phoneticsAlphabetApiManger {
  constructor(wordToGetphonetics) {
    this.wordToGetphonetics = wordToGetphonetics;
    this.phonetics = { text: null, audio: null };
  }

  async fetchApi() {
    try {
      const url = `https://api.dictionaryapi.dev/api/v2/entries/en/${this.wordToGetphonetics}`;
      const response = await axios({
        url: url,
        method: "get",
      });

      response.data[0].phonetics.forEach((item) => {
        //choose the item when have audio and text
        if ("text" in item && "audio" in item) {
          if (item.text && item.audio) {
            this.phonetics = {
              text: item.text,
              audio: item.audio,
            };
            return;
          }
        }
      });
      return this.phonetics;
    } catch (error) {
      return this.phonetics;
    }
  }
}

let APP = new Demo();
