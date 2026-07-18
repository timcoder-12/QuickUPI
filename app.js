/* ==========================================================================
   JAVASCRIPT LOGIC
   Premium Logic with Visual Error Tracking and Real-Time Validation
   ========================================================================== */

let currentWaUrl = "";

document.addEventListener('DOMContentLoaded', () => {
    loadSettings();
    renderHistory();
    setupErrorClearers();
});

function saveSettings() {
    const upiId = document.getElementById('upiId').value;
    const businessName = document.getElementById('businessName').value;
    localStorage.setItem('quickupi_merchant_id', upiId);
    localStorage.setItem('quickupi_merchant_name', businessName);
}

function loadSettings() {
    const savedUpi = localStorage.getItem('quickupi_merchant_id');
    const savedName = localStorage.getItem('quickupi_merchant_name');
    if (savedUpi) document.getElementById('upiId').value = savedUpi;
    if (savedName) document.getElementById('businessName').value = savedName;
}

// Clears the red error highlight when a user starts typing again
function setupErrorClearers() {
    const inputs = document.querySelectorAll('input');
    inputs.forEach(input => {
        input.addEventListener('input', () => {
            input.classList.remove('error');
        });
    });
}

// Main Link Generation Function (Fortified with Visual Errors)
function generateLink() {
    // Reset all error states first
    document.querySelectorAll('input').forEach(i => i.classList.remove('error'));
    
    // 1. Gather Inputs
    const upiEl = document.getElementById('upiId');
    const bizEl = document.getElementById('businessName');
    const custEl = document.getElementById('customerName');
    const itemEl = document.getElementById('itemDesc');
    const amtEl = document.getElementById('amount');

    const upiId = upiEl.value.trim();
    const businessName = bizEl.value.trim();
    const customerName = custEl.value.trim();
    const item = itemEl.value.trim();
    const amount = parseFloat(amtEl.value.trim());

    let hasError = false;

    // 2. REAL-TIME VALIDATION & ERROR CHECKING

    // Check for empty fields
    if (!upiId) { upiEl.classList.add('error'); hasError = true; }
    if (!businessName) { bizEl.classList.add('error'); hasError = true; }
    if (!customerName) { custEl.classList.add('error'); hasError = true; }
    if (!item) { itemEl.classList.add('error'); hasError = true; }
    if (isNaN(amount) || amount <= 0) { amtEl.classList.add('error'); hasError = true; }

    if (hasError) {
        // Haptic feedback for mobile devices (if supported)
        if (navigator.vibrate) navigator.vibrate(200); 
        return; 
    }

    // Validate UPI ID Format
    const upiRegex = /^[a-zA-Z0-9.\-_]{2,256}@[a-zA-Z]{2,64}$/;
    if (!upiRegex.test(upiId)) {
        upiEl.classList.add('error');
        alert("Invalid UPI ID format. Must look like 'name@bank'.");
        return;
    }

    // Validate Amount (Anti-Fat-Finger limits)
    if (amount > 100000) {
        amtEl.classList.add('error');
        alert("Amount exceeds standard ₹1,00,000 UPI limit.");
        return;
    }

    // 3. Generate URIs
    const upiLink = "upi://pay?pa=" + encodeURIComponent(upiId) 
                  + "&pn=" + encodeURIComponent(businessName) 
                  + "&am=" + encodeURIComponent(amount) 
                  + "&cu=INR";

    const waMessage = "Hello " + customerName + "! Here is your payment link for " + item + " (₹" + amount + "). Tap here to pay instantly: \n\n" + upiLink;
    currentWaUrl = "https://wa.me/?text=" + encodeURIComponent(waMessage);

    // 4. Save to Stealth Ledger (localStorage)
    const transaction = {
        id: Date.now(),
        date: new Date().toISOString(),
        customer: customerName,
        item: item,
        amount: amount
    };
    saveToHistory(transaction);

    // 5. Update UI (Show WhatsApp, Clear standard inputs)
    document.getElementById('wa-share-btn').style.display = 'block';
    custEl.value = '';
    itemEl.value = '';
    amtEl.value = '';
    
    renderHistory();
}

function shareToWhatsApp() {
    if (currentWaUrl) {
        window.open(currentWaUrl, '_blank');
    }
}

function saveToHistory(transaction) {
    let history = JSON.parse(localStorage.getItem('quickupi_history')) || [];
    history.unshift(transaction); 
    if (history.length > 50) history.pop();
    localStorage.setItem('quickupi_history', JSON.stringify(history));
}

function renderHistory() {
    const history = JSON.parse(localStorage.getItem('quickupi_history')) || [];
    const listEl = document.getElementById('history-list');
    listEl.innerHTML = '';

    if (history.length === 0) {
        listEl.innerHTML = '<li class="empty-state" style="text-align:center; padding: 20px; color: var(--text-secondary);">No links generated yet.</li>';
        return;
    }

    history.forEach(tx => {
        const dateObj = new Date(tx.date);
        const dateStr = dateObj.toLocaleDateString('en-IN', { month: 'short', day: 'numeric' }) 
                      + ', ' + dateObj.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });

        const li = document.createElement('li');
        li.className = 'history-item';
        li.innerHTML = `
            <div class="history-details">
                <p style="font-weight: 700; font-size: 16px; margin-bottom: 2px;">${tx.customer}</p>
                <p style="font-size: 13px; color: var(--text-secondary);">${tx.item}</p>
            </div>
            <div style="text-align: right;">
                <p style="font-weight: 800; font-size: 16px; color: var(--accent-color);">₹${parseFloat(tx.amount).toLocaleString('en-IN')}</p>
                <p style="font-size: 11px; color: var(--text-secondary); margin-top: 4px;">${dateStr}</p>
            </div>
        `;
        // Use flexbox via inline styles to match the structure
        li.style.display = 'flex';
        li.style.justifyContent = 'space-between';
        li.style.alignItems = 'center';
        
        listEl.appendChild(li);
    });
}