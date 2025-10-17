// ==UserScript==
// @name         Voidworks Solution
// @version      1.3
// @description  Display Voidworks Solution
// @author       Flutterz (special thanks to the Voidworks Solutions channel in the Discord for collecting puzzle data and Edd for compiling it)
// @match        https://www.neopets.com/games/voidworks/
// @grant        none
// ==/UserScript==

//Get puzzle ID and exit if none found aka puzzle done
let dailyId = document.documentElement.outerHTML;
dailyId = dailyId.substring(dailyId.indexOf("dailyId"));
dailyId = Number(dailyId.substring(10,14).replace(";",""));
if (isNaN(dailyId)) return;

let textPanel = document.getElementById("voidworks-desc").children[0];
textPanel.innerText = "Voidworks Solution Loaded!\nDaily Puzzle ID: "+dailyId+"\n\n";
let siteLink = document.createElement("a");
siteLink.href = "https://edd4569.github.io/VoidPlayground/?index="+dailyId;
siteLink.innerText = "Link to Solution";
textPanel.appendChild(siteLink);

//Declare stuff
const puzzleCode = ["00000000008690000058A89016A76A730000000000000000","19000000058698900BA0BFA007697A000007900000004000","000000000089086900576E6D00B9000486FA000040400000","00089863008FED0008D76A001EA000000000000000000000","19000000076C690000050500000507900007635000000073","001C9000086FE9000505050007CE6F9008F307A007E63000","000000000086C69086F976E358ED00007F6A000004000000","00000000000000000020866308E6F3001A00400000000000","00000083000008D200000555000007FA000008A000001E30","169000000050000000766663000000000000000000000000","0008C900086FA763058D000007FA000016A0000000000000","86300000790000008F900000BD58C6C97FA5507D076EA01A","000001C300000050000000500000005000000050000016A0","00089000008EE90008F66F900BA007D0050000501A000073","190000000500000007900000005000000079000000073000","0000002000898CD0007EFA50000050500869BCA00407EA00","02000000050000001F90200007E6D0000000769000000040","20000020790008A00BC9050007A76D000000040000000000","0020000008F6900007D07300007900000007690000000400","20000000500898907C6EFA500766A0730000000000000000","0008C300086A50000B66F300040050000008D000001EA000","0286C90007D057900040795000000BA000000583000007A0","0000000000000000000008C300008A500008A8A0001E6A00","01C6C90000507F900050045000B300B3007666A000000000","00008C63000057901986A0500BFC66A007EA000000000000","086C30000BCD0000057A00001A0000000000000000000000","00008C900086D7F300BCFCD00057D7A000B6A00000400000","000000001C6C9000058ED00007F6E90000B98A00007EE300","0000020000008F908C6CA579579B6D8DB6EA07EA76300000","20000020790008A00BC9050007A76D000000040000000000","00020000008F6900007D0730000790000000769000000040","20000000500898907C6EFA500766A0730000000000000000","001690000008D020000558A0000BA58300076EA000000000","0008300086950000BCFA000047E90000008A000016A00000","020086900B6CA0508A050050508E98E376D0BA000076A000","008C90001CA4790007908A00007CA0000007690000000730","286920007D0BFC900407D450000076E90000000500000004","00000000200000007690000000B690000076E90000000400","08986663057A00008E630000400000000000000000000000","00169000008CD0000057D00000B6E9000076CA0000007300","000020000008E66300050020086D00B91D8FC97D07EEA76A","020000008E690000B98F6C907FA507D004073050000001A0","86900020B6A8C6A07C6FA000050BC3001ECFA000007A0000","00001690000086D00008A050200586A0508D500076EEA000","000000001690000000769000000076300000000000000000","0000000000000000190020000508F983076EABA000000400","00001C9000890BA00057CD0008FCA500057E6D0004016A00","00000000000000001698C90000BD5500007EA76300000000","020000000790000008D00000055000001EA0000000000000","0001C6900086A05000B908D0005BCFA0007A7D0000016A00","0898C30007FED0000050769016A19050000076D000000040","0000000000089000000BD0000007E98300086EA0001A0000","008666C3005000500050005008A00050050000501E6666A0","00020000086F69008D050B90558E95507DBCDBA007A47A00","0000200008C6A0008FD000005BA00000BE90000041A00000","00000019000000052000008DB69890555055B6FA76EA76A0","001690000008A890000B95500007D54000007D0000000730","00198300008D50008CA7E690BF9020507EE6E6A000000000","001908300007950000005B690008A7CD000B6CEA00076A00","00086C908695055050BD8ED0797D7CA0058A05001EA00730","1C66690005008D000500BA00050058900766EA5000000040","000008630008CA00000550000007D000000050000001A000","86300000B66C690050050790586A86E97E98A005007A001A","1690000000BC900000555000007A50000000B690000076E3"];let solutionDrawn = 0;
let anim = document.getElementById("animation_container");

//Create animation
document.head.appendChild(document.createElement("style")).innerHTML =`
        @keyframes colorShift {
          0%   {background-color:red;}
          50%  {background-color:yellow;}
          100% {background-color:red;}
        }
        `;

//Create button used in case the loading detector fails because this page is a nightmare
let backupButton = document.createElement("button");
backupButton.classList="button-default__2020 button-yellow__2020";
backupButton.innerText = "Solution didn't load?";
backupButton.style = "z-index: 10000; position:absolute; width: 160px; top: 300px; left: 700px;";
backupButton.style.display = "none";
backupButton.addEventListener("click", function(){
    drawSolution(0,true);
});
anim.after(backupButton);

//Define mutationObserver to watch for popup getting closed
const targetNode = document.getElementById("voidworks_mainmenu");
const config = { attributes: true, childList: true, subtree: true };
const callback = (mutationList, observer) => {
    for (const mutation of mutationList) {
        drawSolution(7000,false);
    }
};
//Create mutationObeserver instance and start observing
const observer = new MutationObserver(callback);
observer.observe(targetNode, config);


function drawSolution(delay,override){
    solutionDrawn++;
    //On the very first mutation observed, schedule the backup button to appear in case solution is not shown
    if ((solutionDrawn==1)&&(!override)){
        setTimeout(() => {
            backupButton.style.display = "";
        }, 15000);
    }
    //Draw only on the 9th mutation observed with a 7 second delay
    if ((solutionDrawn!=9)&&(!override)) return;
    solutionDrawn = 10;
    setTimeout(() => {
        if (solutionDrawn < 9999){ //Extra check to make sure solution hasn't already been fully displayed via the button
            for (let i = 0; i < 48; i++){
                createJunction(puzzleCode[dailyId][i],i);
            }
            solutionDrawn = 9999;
            backupButton.remove();
        }
    }, delay);
}

function createJunction(ind,i){
    if (ind == 0) return;
    //Create the element if it's not 0
    let junc = document.createElement('div');
    junc.classList = "solutionJunction";
    junc.style = "z-index: 10000; position:absolute; width: 10%; height: 12.5%; background-color: red; pointer-events: none; opacity:0.65; animation-name: colorShift; animation-duration: 12s; animation-iteration-count: infinite;";
    //Calculate position
    let x = i%8;
    let y = Math.floor(i/8);
    junc.style.top = (15.4 + (y*12.5))+"%";
    junc.style.left = (10 * (x+1))+"%";
    //Add element to page
    anim.appendChild(junc);
    //Define geometry
    switch (ind){
        case "1":
            junc.style.clipPath = "polygon(48% 48%,101% 48%,101% 54%,48% 54%)";
            return;
        case "2":
            junc.style.clipPath = "polygon(48% 48%,48% 101%,54% 101%,54% 48%)";
            return;
        case "3":
            junc.style.clipPath = "polygon(0% 48%,48% 48%,48% 54%,0% 54%)";
            return;
        case "4":
            junc.style.clipPath = "polygon(48% 0%,48% 48%,54% 48%,54% 0%)";
            return;
        case "5":
            junc.style.clipPath = "polygon(48% 0%,48% 101%,54% 101%,54% 0%)";
            return;
        case "6":
            junc.style.clipPath = "polygon(0% 48%,101% 48%,101% 54%,0% 54%)";
            return;
        case "7":
            junc.style.clipPath = "polygon(48% 0%,48% 54%,101% 54%,101% 48%,54% 48%,54% 0%)";
            return;
        case "8":
            junc.style.clipPath = "polygon(48% 101%,48% 48%,101% 48%,101% 54%,54% 54%,54% 101%)";
            return;
        case "9":
            junc.style.clipPath = "polygon(0% 48%,54% 48%,54% 101%,48% 101%,48% 54%,0% 54%)";
            return;
        case "A":
            junc.style.clipPath = "polygon(0% 54%,54% 54%,54% 0%,48% 0%,48% 48%,0% 48%)";
            return;
        case "B":
            junc.style.clipPath = "polygon(48% 0%,48% 101%,54% 101%,54% 54%,101% 54%,101% 48%,54% 48%,54% 0%)";
            return;
        case "C":
            junc.style.clipPath = "polygon(0% 48%,101% 48%,101% 54%,54% 54%,54% 101%,48% 101%,48% 54%,0% 54%)";
            return;
        case "D":
            junc.style.clipPath = "polygon(54% 0%,54% 101%,48% 101%,48% 54%,0% 54%,0% 48%,48% 48%,48% 0%)";
            return;
        case "E":
            junc.style.clipPath = "polygon(0% 54%,101% 54%,101% 48%,54% 48%,54% 0%,48% 0%,48% 48%,0% 48%)";
            return;
        case "F":
            junc.style.clipPath = "polygon(0% 54%,48% 54%, 48% 101%, 54% 101%, 54% 54%, 101% 54%,101% 48%,54% 48%,54% 0%,48% 0%,48% 48%,0% 48%)";
            return;
    }
}
