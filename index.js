function runApp(){
    document.getElementById("notice").style.zIndex = "1"
    document.getElementById("notice").style.opacity = "100%"

    post = document.getElementById("post").value

    /*
    1: 일반 정보 시작
    2: 일반 정보 끝

    11: 중요 정보 시작
    12: 중요 정보 끝

    21: 위험 정보 시작
    22: 위험 정보 끝
    */
   let markTag = {
    // 일반 정보
    // #ffa0a0
    1: "<span style=\"color: #8f8f8f\">",
    2: "</span>",

    // 중요 정보
    11: "<span style=\"color: #ffa0a0\">",
    12: "</span>",

    // 위험 정보
    21: "<span style=\"color: #ff1414\">",
    22: "</span>",
   }
    // 정보 찾기

    // 일반 정보
    email = findByExpression(post, /[\w\.=-]+@[\w\.-]+\.[\w]{2,3}/g, 1, 2)

    // 중요 정보
    password = overlapDelete(findByExpression(post, /(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}/g, 11, 12), email)
    phoneNumber = findByExpression(post, /01([0|1|6|7|8|9])-?([0-9]{3,4})-?([0-9]{4})/g, 11, 12)

    // 위험 정보
    nationalIDnumber = findByExpression(post, /\d{2}([0]\d|[1][0-2])([0][1-9]|[1-2]\d|[3][0-1])[-]*[1-4]\d{6}/g, 21, 22)
    adressIP = findByExpression(post, /\d{1,3}[.]\d{1,3}[.]\d{1,3}[.]\d{1,3}/g, 21, 22)

    information = [...email, ...password, ...phoneNumber, ...nationalIDnumber, ...adressIP]

    information.sort(function (a1, a2) {
        a1[0] = parseInt(a1[0]);
        a2[0] = parseInt(a2[0]);
    
        return (a1[0]<a2[0]) ? -1 : ((a1[0]>a2[0]) ? 1 : 0);
    })

    // 태그 처리
    post = [...post]
    let i
    for(i=information.length-1; i>=0; i--) {
        console.log(i)
        post.splice(information[i][0], 0, markTag[information[i][1]])
    }

    post = post.join('')
    
    post = post.replaceAll(/(\n|\r\n)/g, "<br>");
    document.getElementById("errorNotice").innerHTML = post
}

function backPostInput(){
    document.getElementById("notice").style.opacity = "0%"
    setTimeout(() => document.getElementById("notice").style.zIndex = "-1", 200)
}

function findAllString(stringToFind, matchStrings, markNum1, markNum2) {
    let matchNum = 0
    let returns = []
    let i
    let j

    // console.log(matchStrings)
    for(i=0; i<matchStrings.length; i++, markNum1, markNum2) {
        for(j=0; j<stringToFind.length; j++) {
            if(matchStrings[i][matchNum] == stringToFind[j]){
                matchNum++
            }else {
                matchNum = 0
            }

            if(matchStrings[i].length == matchNum){
                returns.push([j-matchNum+1, markNum1], [j+1, markNum2])
            }
        }
    }

    return returns
}

function findByExpression(stringToFind, expression, markNum1, markNum2) {
    findStrings = stringToFind.match(expression)
    
    if(findStrings == null){
        return []
    } else{
        return findAllString(stringToFind, [...(new Set(findStrings))], markNum1, markNum2)
    }
}

function overlapDelete(mainArgument, standardArgument) {
    let i = 0
    let j = 0
    let addThisArgument = true
    let correctArgument = []

    for(i=0; i<mainArgument.length; i++) {
        addThisArgument = true
        for(j=0; j<standardArgument.length; j++) {
            if(mainArgument[i][0] == standardArgument[j][0]) {      //시작점 기준으로 비교
                addThisArgument = false
                break
            }
        }

        if(addThisArgument) {
            correctArgument.push(mainArgument[i])
        }
    }

    return correctArgument
}