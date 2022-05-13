let videoElmts = document.getElementsByClassName("tiktokDiv");

let reloadButtons = document.getElementsByClassName("reload");
let heartButtons = document.querySelectorAll("div.heart");
for (let i=0; i<2; i++) {
  let reload = reloadButtons[i]; 
  reload.addEventListener("click",function() { reloadVideo(videoElmts[i]) });
  heartButtons[i].classList.add("unloved");
} // for loop

// filed heart fas 
// holo heart far

let PrefData = {
  "better":"",
  "worse":""
};




for (let i = 0; i < 2; i++){
 resetHearts(); heartButtons[i].addEventListener("click", function(){
    // replace the heart to filled 
    // remove unloved
    //resetHearts(); 
    if (heartButtons[i].classList.contains("unloved")){
  resetHearts();      heartButtons[i].classList.remove("unloved");
  heartButtons[i].innerHTML='<i class = "fas fa-heart"></i>';
      //console.log("better:",returnedTwoVideoes[i].rowIdNum);
      PrefData.better = returnedTwoVideoes[i].rowIdNum;
      if (i==1){
        //console.log("worse:",returnedTwoVideoes[0].rowIdNum);
        PrefData.worse = returnedTwoVideoes[0].rowIdNum;
      } else{
        PrefData.worse = returnedTwoVideoes[1].rowIdNum;
        //console.log("worse:",returnedTwoVideoes[1].rowIdNum);
      }


      // console.log("PrefData:\n");
      // console.log(PrefData);
      
    }
    else{
      resetHearts();  
      
    }    
    
  });
}



function resetHearts(){
  for (let i=0; i<2; i++) {
  heartButtons[i].classList.add("unloved");
  heartButtons[i].innerHTML='<i class = "far fa-heart"></i>';
} 

}

let returnedTwoVideoes = [];


// This get request returns two json objects from the database, then pass their urls to the video tag 
sendGetRequest("/getTwoVideos")
  .then (function(response){
     //let result = response;
      returnedTwoVideoes = response;
      for (let i=0; i<2; i++) {
        addVideo(response[i].url,videoElmts[i]);
      
    }
    // load the videos after the names are pasted in! 
    loadTheVideos();
    
  })
  .catch(function(err){
      console.log("Receive response failed ",err);
    });



let testPrefData = {
  "better":6,
  "worse":8
};

//sendPostRequest("/insertPref",testPrefData);
