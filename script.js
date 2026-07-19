document.addEventListener("DOMContentLoaded",function(){
    const searchButton=document.getElementById("search-btn");
    const usernameInput = document.getElementById("user-input");
    const statsContainer = document.querySelector(".stats-container");
    const easyProgressCircle = document.querySelector(".easy-progress");
    const mediumProgressCircle = document.querySelector(".medium-progress");
    const hardProgressCircle = document.querySelector(".hard-progress");
    const easyLabel = document.getElementById("easy-label");
    const mediumLabel = document.getElementById("medium-label");
    const hardLabel = document.getElementById("hard-label");
    const cardStatsContainer = document.querySelector(".stats-card");

    function validateUsername(username){
        if(username.trim() === ""){
            alert("username should not be empty");
            return false;
        }
        const regex = /^[a-zA-Z0-9_]{3,16}$/;
        const isMatching=regex.test(username);
        if(!isMatching){
            alert("invalid username")
        }
        return isMatching;
    }
    async function fetchUserDetails(username){
        const url=`https://leetcode-api-faisalshohag.vercel.app/${username}`
        try{
            searchButton.textContent="Searching..";
            searchButton.disabled=true;
            const response=await fetch(url);
            if(!response.ok){
                throw new Error("unable to fetch the user details");
            }
            const data=await response.json();
            console.log("logging data:",data);

            displayUserData(data);
        }
        catch(error){
            statsContainer.innerHTML=`<p>${error.message}</p>`;

        }
        finally{
            searchButton.textContent="Search";
            searchButton.disabled=false;

        }
    }
    function updateProgress(solved,total,label,circle){
        const progressDegree=(solved/total)*100;
        statsContainer.style.display=`block`;
        circle.style.setProperty("--progress-degree",`${progressDegree}%`);
        label.textContent=`${solved}/${total}`;

    }

    function displayUserData(data){
        const totalQues=data.totalQuestions;
        const totalEasyQues=data.totalEasy;
        const totalMediumQues=data.totalMedium;
        const totalHardQues=data.totalHard;
        const solvedTotalQues=data.matchedUserStats.acSubmissionNum[0].count;
        const solvedTotalEasyQues=data.matchedUserStats.acSubmissionNum[1].count;
        const solvedTotalMediumQues=data.matchedUserStats.acSubmissionNum[2].count;
        const solvedTotalHardQues=data.matchedUserStats.acSubmissionNum[3].count;

        updateProgress(solvedTotalEasyQues,totalEasyQues,easyLabel,easyProgressCircle);
        updateProgress(solvedTotalMediumQues,totalMediumQues,mediumLabel,mediumProgressCircle);

        updateProgress(solvedTotalHardQues,totalHardQues,hardLabel,hardProgressCircle);

        const cardData=[
        {
            label:"Overall Submissions",value:data.totalSubmissions[0].submissions
        },
        {
            label:"Overall Easy Submissions",value:data.totalSubmissions[1].submissions
        },
        {
            label:"Overall Medium Submissions",value:data.totalSubmissions[2].submissions
        },
        {
            label:"Overall Hard Submissions",value:data.totalSubmissions[3].submissions
        }
    ];

    cardStatsContainer.innerHTML=cardData.map(
        data =>{return `<div class="card">
            <h4>${data.label}</h4>
            <p>${data.value}</p>
            </div>
            `
        }
    ).join('');

    }

   



    searchButton.addEventListener('click',function(){
        const username=usernameInput.value;
        console.log("logging username:",username);
        if(validateUsername(username)){
            fetchUserDetails(username);
        }
    })

})