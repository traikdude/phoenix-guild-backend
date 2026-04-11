/**
 * @fileoverview Backend for the Phoenix Guild Assessment
 * Follows Professional Code Enhancement Protocol for robustness, security & maintainability.
 */

const CONFIG = {
  SHEET_NAME: "Submissions",
  LOCK_TIMEOUT_MS: 10000
};

/**
 * GET Endpoint: Serves the Web App UI.
 * @param {Object} e - Event object
 * @returns {HtmlOutput} The assessment HTML page
 */
function doGet(e) {
  return HtmlService.createHtmlOutputFromFile('Index')
    .setTitle('Empyreal Seeker Assessment — Phoenix Guild')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL)
    .addMetaTag('viewport', 'width=device-width, initial-scale=1');
}

/**
 * RPC Endpoint: Called asynchronously by the frontend via google.script.run
 * @param {Object} formData - Form payload from the frontend UI
 * @returns {Object} JSON response indicating success
 */
function processApplication(formData) {
  try {
    // 1. Input Sanitization & Validation
    if (!formData.preferredName || formData.preferredName.trim() === "") {
      throw new Error("Preferred name is required.");
    }
    
    // 2. Data Enhancement
    // Add server-side timestamp to prevent client-side spoofing
    formData.timestamp = new Date().toISOString();
    
    // 3. Persist Data
    _writeToSheet(formData);
    
    return { success: true };
    
  } catch (error) {
    // 4. Error Handling & Logging
    console.error("❌ Application Processing Error:", error);
    // Throw error string to surface it in the google.script.run.withFailureHandler
    throw new Error(error.message || "An unexpected error occurred processing your submission.");
  }
}

/**
 * Legacy POST Endpoint (Maintained for backward compatibility or headless REST hooks)
 * @param {Object} e - Event object containing POST data
 */
function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    _writeToSheet(data);
    return ContentService.createTextOutput(JSON.stringify({ result: "success" }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    console.error("❌ doPost Error:", error);
    return ContentService.createTextOutput(JSON.stringify({ result: "error", message: error.message }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * PRIVATE CORE: Writes data safely to the active spreadsheet.
 * Implements Google Apps Script LockService to prevent race conditions during concurrent submissions.
 * @private
 * @param {Object} data - Processed payload
 */
function _writeToSheet(data) {
  const lock = LockService.getScriptLock();
  
  // Attempt to acquire lock for Thread Safety
  if (!lock.tryLock(CONFIG.LOCK_TIMEOUT_MS)) {
    throw new Error("The templar scribes are busy. Please try submitting again in a few moments.");
  }
  
  try {
    const doc = SpreadsheetApp.getActiveSpreadsheet();
    if (!doc) throw new Error("No active spreadsheet found. Ensure the script is bound to a Sheet.");
    
    let sheet = doc.getSheetByName(CONFIG.SHEET_NAME);
    
    // Auto-initialize Sheet if it doesn't exist
    if (!sheet) {
      sheet = doc.insertSheet(CONFIG.SHEET_NAME);
    }
    
    const headers = [
      "Timestamp", 
      "Preferred Name", 
      "Age", 
      "City & State", 
      "Guild Interest", 
      "Arcane Experience", 
      "Favorite Animal", 
      "Least Favorite Animal"
    ];
    
    // Initialize Headers if sheet is empty
    if (sheet.getLastRow() === 0) {
      sheet.appendRow(headers);
      const headerRange = sheet.getRange(1, 1, 1, headers.length);
      headerRange.setFontWeight("bold");
      headerRange.setBackground("#333333");
      headerRange.setFontColor("#ffffff");
      sheet.setFrozenRows(1);
    }
    
    // Map object properties explicitly to ensure column safety
    const rowData = [
      data.timestamp || new Date().toISOString(),
      data.preferredName,
      data.age || "-",
      data.cityState || "-",
      data.guildInterest || "-",
      data.arcaneExperience || "-",
      data.favAnimal || "-",
      data.leastFavAnimal || "-"
    ];
    
    sheet.appendRow(rowData);
    
  } finally {
    // Release lock instantly after operation
    lock.releaseLock();
  }
}
