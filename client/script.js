const promptTextarea = document.getElementById('prompt-id');
const generateButton = document.getElementById('generated');
const answerParagraph = document.querySelector('.containervg .answer');
const reset=document.getElementById('reset');

let loadInterval;

function displayIndicator() {
  const outputParagraph = answerParagraph;
  outputParagraph.textContent = 'Tutor is thinking';
  loadInterval=setInterval(()=>{
    outputParagraph.textContent+='.';

    if(outputParagraph.textContent==='Tutor is thinking....')
    {
      outputParagraph.textContent='Tutor is thinking';
    }
  },300);
}

function displayOutputText(text) {
  answerParagraph.textContent = text;
 // document.documentElement.scrollTop = document.documentElement.scrollHeight;
}
function showmessage(message) {
  const alertElement = document.getElementById('alert');
  const messageElement = document.getElementById('alert-message');
  messageElement.textContent = message;

  // Show the alert
  alertElement.classList.add('show');
  // Remove the message after 10 seconds
  setTimeout(() => {
    alertElement.classList.remove('show');
  }, 3000);
}

generateButton.addEventListener('click', async (event) => {
  event.preventDefault(); // Prevent the form from submitting
  answerParagraph.textContent='';
  const prompt = promptTextarea.value;
  if(prompt.trim()==='')
  {
    showmessage('Please Enter The Question');
    // for commented reset button
    //abortController = new AbortController();
    //abortController.abort();
  }
  else{
  displayIndicator();
  
  
  try {

    //abortController = new AbortController();
    //const signal = abortController.signal;

    const response = await fetch('http://localhost:5000/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ prompt }),
      //signal:signal,
    });

    if (!response.ok) {
      throw new Error('Request failed');
    }

    const data = await response.json();
    //console.log(data);
    const generatedText = data.bot;
    console.log(generatedText);
    // Set the generated text as the content of the answer paragraph
    setTimeout(() => {
      displayOutputText(generatedText); // Call this when the response is received
    }, 20);
    clearInterval(loadInterval);

  } catch (error) {
    console.error('Error:', error);
  }
}}
);

/*reset.addEventListener('click', function(){
  document.getElementById('prompt-id').value='';
  answerParagraph.textContent='';
  if(abortController)
  {
      abortController.abort();
      abortController = null;
  }
  clearInterval(loadInterval);

  
});*/
reset.addEventListener('click',()=>{
location.reload();
})

document.addEventListener('DOMContentLoaded', () => {
  const copyButton = document.getElementById('copy-btn');
  const outputParagraph = answerParagraph;

  copyButton.addEventListener('click', () => {
    const range = document.createRange();
    range.selectNode(outputParagraph);
    window.getSelection().addRange(range);

    try {
      const successful = document.execCommand('copy');
      const message = successful ? 'Copied to clipboard' : 'Unable to copy';
      console.log(message);
    } catch (error) {
      console.log('Error copying to clipboard:', error);
    }

    window.getSelection().removeAllRanges();
  });
});

document.addEventListener('DOMContentLoaded', () => {
  const saveButton = document.getElementById('save-btn');
  const showButton = document.getElementById('show-btn');
  const savedQuestions = document.getElementById('saved-questions');
  const deleteButton=document.getElementById('delete-btn');
  const promptInput = promptTextarea;
  const answers = answerParagraph;
  
  deleteButton.style.display = 'none';
  let ishown=false;

  saveButton.addEventListener('click', () => {
    const prompt = promptInput.value.trim();
    const answer=answers.textContent;
    //console.log(answer);
    //console.log(answers);
    if (prompt !== '' && answer!=='') {
      const question = { prompt, answer };

      // Retrieve existing saved questions from local storage or cookies
      const existingQuestions = JSON.parse(localStorage.getItem('questions')) || [];

      // Add the new question to the existing ones
      existingQuestions.push(question);

      // Save the updated list of questions to local storage or cookies
      localStorage.setItem('questions', JSON.stringify(existingQuestions));

      // Clear the input field
      //promptInput.value = '';
      //answers.textContent='';
      if(ishown)
        {displayQuestions(existingQuestions);}
      showmessage('Question and Answer saved successfully!');
    } else {
      showmessage('There is no Question and Answer to save');
    }
  });
  // ishown for one tie click will show the cotent and oen more time will wrap up the content
  
  showButton.addEventListener('click', () => {
    if(!ishown)
    {
      savedQuestions.style.display='block';
    const existingQuestions = JSON.parse(localStorage.getItem('questions')) || [];

    // Clear any previous content in the saved questions list
    savedQuestions.innerHTML = '';
    if (existingQuestions.length === 0) {
      showmessage('There are no saved answers');
      return;
    }
    else{
      displayQuestions(existingQuestions);
      // Create the table element
      }
    ishown=true;
  }
  else{
    savedQuestions.style.display = 'none';
    deleteButton.style.display='none'
    ishown = false;
  }
  });

  function displayQuestions(questions) {
    // Clear any previous content in the saved questions table
    savedQuestions.innerHTML = '';

    // Create the table element
    const table = document.createElement('table');

    // Create the table header row
    const headerRow = document.createElement('tr');
    const questionHeader = document.createElement('th');
    questionHeader.textContent = 'Question';
    const answerHeader = document.createElement('th');
    answerHeader.textContent = 'Answer';
    headerRow.appendChild(questionHeader);
    headerRow.appendChild(answerHeader);
    table.appendChild(headerRow);
    for (let i = questions.length - 1; i >= 0; i--) {
      const question = questions[i];

      // Create a table row for each question
      const row = document.createElement('tr');

      // Create table cells for the question and answer
      const questionCell = document.createElement('td');
      questionCell.textContent = question.prompt;
      const answerCell = document.createElement('td');
      const preElement=document.createElement('pre');
      preElement.textContent=question.answer;
      answerCell.appendChild(preElement);
      

      // Append the cells to the row
      row.appendChild(questionCell);
      row.appendChild(answerCell);

      // Append the row to the table
      table.appendChild(row);
    }

    // Append the table to the saved questions element
    savedQuestions.appendChild(table);
    deleteButton.style.display='block'
  }

  

deleteButton.addEventListener('click',()=>{
    localStorage.removeItem('questions');

    // Clear the saved chats list in the UI
    savedQuestions.innerHTML = '';
    deleteButton.style.display='none';
    showmessage('All saved answers has been deleted.');
  
});

});
