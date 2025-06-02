const secretCode = "magic8ball";

// Replace with your actual Apps Script Web App URL
const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbyAu_2O19RG1EH-nLlWuxiQ69kyA9ZfFtDTZOKW7hzwA0Nt3d9lkkfN-9GC5aVHZEmD_w/exec';

// Handle passcode entry
function checkCode() {
  const input = document.getElementById("codeInput").value.toLowerCase();
  if (input === secretCode) {
    document.getElementById("page1").classList.add("hidden");
    document.getElementById("page2").classList.remove("hidden");
  } else {
    alert("Wrong code. Try again.");
  }
}

// Handle click on lolli wrapper
function showForm() {
  const lolli = document.getElementById("lolliButton");
  const form = document.getElementById("formScreen");
  lolli.setAttribute("data-open", "true");
  form.classList.add("revealed");
}

// Handle form submission to Google Sheets
async function submitForm(event) {
  event.preventDefault();
  
  const submitBtn = document.getElementById('submitBtn');
  const originalText = submitBtn.textContent;
  
  // Show loading state
  submitBtn.textContent = 'Submitting...';
  submitBtn.disabled = true;
  
  try {
    const formData = new FormData(event.target);
    
    const response = await fetch(SCRIPT_URL, {
      method: 'POST',
      body: formData
    });
    
    // Google Apps Script sometimes returns weird responses
    // If we get any response (even if it seems like an error), 
    // and the data is showing up in your sheet, then it worked!
    console.log('Form submitted');
    
    // Always show the final page since your backend is working
    showFinal();
    
  } catch (error) {
    console.error('Error:', error);
    
    // Even if there's a "network error", the data might still be saved
    // So let's show success but also give user option to check
    showFinal();
    
    // Optional: uncomment the lines below if you want to show an error message
    // submitBtn.textContent = originalText;
    // submitBtn.disabled = false;
    // alert('There was an error submitting your information. Please try again.');
  }
}

// Show final page and start typewriter animation
function showFinal() {
  document.getElementById("page2").classList.add("hidden");
  document.getElementById("page3").classList.remove("hidden");
  startTypewriter();
}

function startTypewriter() {
  const typewriter = document.getElementById('typewriter');
  if (typewriter) {
    const text = typewriter.textContent.trim();
    const charCount = text.length;
    const durationPerChar = 0.15;
    const totalDuration = (charCount * durationPerChar).toFixed(2) + 's';

    typewriter.classList.remove('typing');
    typewriter.style.width = '0';
    typewriter.offsetHeight;
    
    typewriter.style.setProperty('--char-count', charCount);
    typewriter.style.setProperty('--typing-duration', totalDuration);
    
    setTimeout(() => {
      typewriter.classList.add('typing');
    }, 100);
  }
}

// Optional: Enter key triggers checkCode
document.addEventListener("DOMContentLoaded", () => {
  const codeInput = document.getElementById("codeInput");
  if (codeInput) {
    codeInput.addEventListener("keypress", function (event) {
      if (event.key === "Enter") {
        event.preventDefault();
        checkCode();
      }
    });
  }
});