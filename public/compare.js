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

for (let i = 0; i < 2; i++){
 resetHearts(); heartButtons[i].addEventListener("click", function(){
    // replace the heart to filled 
    // remove unloved
    //resetHearts(); 
    if (heartButtons[i].classList.contains("unloved")){
resetHearts();      heartButtons[i].classList.remove("unloved");

    }
    else{
   heartButtons[i].classList.add("unloved");
    }    

  });
}

function resetHearts(){
  for (let i=0; i<2; i++) {
  heartButtons[i].classList.add("unloved");
} 

}




// This get request returns two json objects from the database, then pass their urls to the video tag 
sendGetRequest("/getTwoVideos")
  .then (function(response){
     //let result = response;
         for (let i=0; i<2; i++) {
      addVideo(response[i].url,videoElmts[i]);
    }
    // load the videos after the names are pasted in! 
    loadTheVideos();
    
  })
  .catch(function(err){
      console.log("Receive response failed ",err);
    });
