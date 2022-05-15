let videoElmts = document.getElementsByClassName("tiktokDiv");

let reloadButtons = document.getElementsByClassName("reload");
let heartButtons = document.querySelectorAll("div.heart");
for (let i = 0; i < 2; i++) {
  let reload = reloadButtons[i];
  reload.addEventListener("click", function() { reloadVideo(videoElmts[i]) });
  heartButtons[i].classList.add("unloved");
} // for loop

// filed heart fas 
// holo heart far

let PrefData = {
  "better": "",
  "worse": ""
};

// Disable the next button by default
let nextButtonID = document.getElementById("nextButton");
nextButtonID.disabled = true;

let iconClass = document.getElementsByClassName("icon");

for (let i = 0; i < 2; i++) {
  resetHearts(); heartButtons[i].addEventListener("click", function() {
      resetHearts();
      heartButtons[i].classList.remove("unloved");
      iconClass[i].classList.remove("far");
      iconClass[i].classList.add("fas");
      PrefData.better = returnedTwoVideoes[i].rowIdNum;
      // diable the next button 
      nextButtonID.removeAttribute("disabled");
      nextButtonID.classList.remove("disabledButton");
      nextButtonID.classList.add("enabledButton");

      if (i == 1) {
        PrefData.worse = returnedTwoVideoes[0].rowIdNum;
      } else {
        PrefData.worse = returnedTwoVideoes[1].rowIdNum;
      }

  });
}

function resetHearts() {
  for (let i = 0; i < 2; i++) {
    heartButtons[i].classList.add("unloved");
    iconClass[i].classList.add("far");
  }
}

let returnedTwoVideoes = [];

// This get request returns two json objects from the database, then pass their urls to the video tag 
sendGetRequest("/getTwoVideos")
  .then(function(response) {

    if (response == 'pick winner') {
      // pick the winner first, possibly asyn function
      window.location = "winner.html";
    }

    //let result = response;
    returnedTwoVideoes = response;
    for (let i = 0; i < 2; i++) {
      addVideo(response[i].url, videoElmts[i]);

    }
    // load the videos after the names are pasted in! 
    loadTheVideos();

  })
  .catch(function(err) {
    console.log("Receive response failed ", err);
  });


// Next button 

// by default, next button is disable  set .disable in js 
// once user click on the heart, next button enable
// sends the prefData to PrefTable

let nextButton = document.getElementById("nextButton");

nextButton.addEventListener("click", function() {
  try {
    sendPostRequest("/insertPref", PrefData)
      .then(function(response) {
        if (response == "pick winner") {
          window.location = "winner.html";
        } else {
          window.location.reload();
        }
      })
      .catch(function(err) {
        console.log("Receive response failed ", err);
      });
  }
  catch (error) {
    console.log("Next error ", error)
  }

});