document.addEventListener("DOMContentLoaded", function() {
    document.getElementById("submit-btn").addEventListener("click", submitTest);


function generateCTest(text, compoundWordsInfo) {
    // // This is a simplified version of your Python logic
    // let words = text.split(' ');
    // let ctest = words.map((word, index) => {
    //     if (index % 2 === 0) return word;
    //     else return word.substring(0, word.length / 2) + '_'.repeat(word.length - word.length / 2);
    // });
    // return ctest.join(' ');
    let words = text.split(' ');
    let ctest = [];

    for (let i = 0; i < words.length; i++) {
        let word = words[i];

        if (word.length > 1 && (i + 1) % 2 === 0) {
            // Check if the current word is a compound word with provided information
            let compoundWordInfo = compoundWordsInfo.find(([cw]) => word.includes(cw));

            if (compoundWordInfo) {
                let [compoundWord, secondPart] = compoundWordInfo;
                let midpoint = Math.floor(secondPart.length / 2);
                let maskedWord = compoundWord.replace(secondPart, secondPart.slice(0, midpoint) + '_'.repeat(secondPart.length - midpoint));
                ctest.push(maskedWord);
            } else {
                // Create gaps for non-compound words
                let midpoint = Math.floor(word.length / 2);
                let maskedWord = word.slice(0, midpoint) + '_'.repeat(word.length - midpoint);
                ctest.push(maskedWord);
            }
        } else {
            ctest.push(word);
        }
    }

    return ctest.join(' ');
}

function submitTest() {
    let userText = document.getElementById("ctest-textarea").value;
    let originalText = "Die Veränderungen des digitalen Zeitalters sind inzwischen vollständig in der Welt des Konsums angekommen. Die meisten Firmen, die in der realen Welt Geschäfte oder Niederlassungen unterhalten, bieten ihren Kunden ihre Dienste alternativ auch über eine virtuelle Geschäftspräsenz an und können so beide Marktsegmente für den Verkauf ihrer Produkte nutzen. In manchen Branchen liegen das Internetgeschäft und der daraus generierte Umsatz sogar schon so weit vor den Geschäften in Städten, dass teilweise bereits Läden geschlossen werden können bzw. aufgrund von abnehmenden Verkaufszahlen sogar müssen. Interessant wird in Zukunft sein, wie die Veränderung der Konsumlandschaft das Bild der Innenstädte in Deutschland beeinflussen wird."; // Replace with the actual text
    let score = calculateScore(userText, originalText,generatedText);
    document.getElementById("score").innerText =  score ;
}


function calculateScore(userText, originalText,ctestText) {
    
    let filledText = userText;
    let gaps = ctestText.split(' ').filter(word => word.includes('_'));
    let originalWords = originalText.split(' ');
    let mismatchCount = 0;
    const minLength = Math.min(filledText.length, originalText.length);
    const filledWords = filledText.split(' ');

   // Compare each word
   for (let i = 0; i < minLength; i++) {
    if (filledWords[i] !== originalWords[i]) {
        mismatchCount++;
      //  console.log(` wordA: ${filledWords[i]}, wordB: ${originalWords[i]} + ${mismatchCount}` );
    }
}

// Count the remaining words in the longer string as mismatches
        mismatchCount += Math.abs(filledWords.length - originalWords.length);

    mismatchCount += Math.abs(filledText.length - userText.length);

    
    let mistakesList = document.getElementById("mistakes-list");
    mistakesList.innerHTML = ''; // Clear previous mistakes

    let mistakes = originalWords.map((original, index) => ({ original, filled: filledText.split(' ')[index] })).filter(pair => pair.original !== pair.filled);
    
    if (mistakes.length > 0) {
        mistakes.forEach(pair => {
            let listItem = document.createElement("li");
            listItem.innerText = `Expected: ${pair.original}, Got: ${pair.filled}`;
            mistakesList.appendChild(listItem);
        });
    } else {
        let listItem = document.createElement("li");
        listItem.innerText = "No mistakes. Well done!";
        mistakesList.appendChild(listItem);
    }

    // let mistakes = originalWords.map((original, index) => ({ original, filled: filledText.split(' ')[index] })).filter(pair => pair.original !== pair.filled);
    
    // if (mistakes.length > 0) {
    //     console.log("\nMistakes:");
    //     mistakes.forEach(pair => {
    //         console.log(`Expected: ${pair.original}, Got: ${pair.filled}`);
    //     });
    // } else {
    //     console.log("\nNo mistakes. Well done!");
    // }

    let totalWordCount = gaps.length;
    let score = (mismatchCount / totalWordCount) * 100 || 100;
    console.log(`\nYour Score: ${score.toFixed(2)}% (${totalWordCount-mismatchCount}/${totalWordCount} correct)`);
    let sc =`\nYour Score: ${score.toFixed(2)}% (${mismatchCount}/${totalWordCount} correct)`;

   
      return sc;


    // This is a placeholder function, you'll need to implement actual logic
 //   return 0; // Returns 0 for now
}

// Example of using the C-Test generation function
let exampleText = "Die Veränderungen des digitalen Zeitalters sind inzwischen vollständig in der Welt des Konsums angekommen. Die meisten Firmen, die in der realen Welt Geschäfte oder Niederlassungen unterhalten, bieten ihren Kunden ihre Dienste alternativ auch über eine virtuelle Geschäftspräsenz an und können so beide Marktsegmente für den Verkauf ihrer Produkte nutzen. In manchen Branchen liegen das Internetgeschäft und der daraus generierte Umsatz sogar schon so weit vor den Geschäften in Städten, dass teilweise bereits Läden geschlossen werden können bzw. aufgrund von abnehmenden Verkaufszahlen sogar müssen. Interessant wird in Zukunft sein, wie die Veränderung der Konsumlandschaft das Bild der Innenstädte in Deutschland beeinflussen wird.";
let compoundWordsInfo =[
    ["Geschäftspräsenz", "Präsenz"],
    ["Marktsegmente", "segmente"],
    ["Internetgeschäft", "geschäft"],
    ["Verkaufszahlen", "zahlen"],
    ["Konsumlandschaft", "landschaft"],
    ["Innenstädte", "städte"],
];

let generatedText =generateCTest(exampleText, compoundWordsInfo);
console.log(generatedText);
document.getElementById("ctest-textarea").innerText = generatedText;

});
