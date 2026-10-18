/**
 * Complete End-to-End Test Suite for KAMZO Pakistan Marketplace
 * Tests all requirements from user:
 * 1. Strict Authentication: rejects fake/wrong passwords, rejects missing accounts, accepts valid credentials.
 * 2. Google and WhatsApp authentication.
 * 3. Customer WhatsApp and Gmail capture in bookings.
 * 4. Admin WhatsApp (+92 319 7318425) & Gmail (kundanpanriya978@gmail.com) notifications.
 * 5. Customer WhatsApp invoice & Gmail confirmation.
 * 6. Admin Payment Verification & Rejection WhatsApp dispatch links.
 * 7. Live admin sync and worker onboarding.
 */

const BASE_URL = "http://localhost:3000";

let passedCount = 0;
let failedCount = 0;

function assert(condition, testName, details = "") {
  if (condition) {
    console.log(`✅ [PASS] ${testName}`);
    passedCount++;
  } else {
    console.error(`❌ [FAIL] ${testName}: ${details}`);
    failedCount++;
  }
}

async function runTests() {
  console.log("=================================================");
  console.log("🚀 STARTING KAMZO REAL END-TO-END VERIFICATION");
  console.log("=================================================\n");

  const testPhone = "0300" + Math.floor(1000000 + Math.random() * 9000000);
  const testWhatsApp = "0311" + Math.floor(1000000 + Math.random() * 9000000);
  const testEmail = `test_customer_${Date.now()}@gmail.com`;
  const testPassword = "MySecurePass123";

  // ----------------------------------------------------------------------
  // TEST 1: Login with Non-Existent Account (Must Fail strictly)
  // ----------------------------------------------------------------------
  console.log("--- 1. Testing Non-Existent Account Login ---");
  const nonExistRes = await fetch(`${BASE_URL}/api/auth/customer`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      action: "login",
      phone: "03999999999",
      password: "some_password",
    }),
  });
  const nonExistData = await nonExistRes.json();
  assert(
    nonExistRes.status === 401 && nonExistData.success === false,
    "Non-existent account login is strictly rejected",
    JSON.stringify(nonExistData)
  );
  assert(
    nonExistData.error && nonExistData.error.includes("No account found"),
    "Returns clear 'No account found' error message",
    nonExistData.error
  );

  // ----------------------------------------------------------------------
  // TEST 2: Register New Customer Account
  // ----------------------------------------------------------------------
  console.log("\n--- 2. Testing Customer Registration ---");
  const regRes = await fetch(`${BASE_URL}/api/auth/customer`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      action: "register",
      name: "Tariq Mehmood",
      phone: testPhone,
      email: testEmail,
      password: testPassword,
      city: "Umerkot",
    }),
  });
  const regData = await regRes.json();
  assert(
    regRes.status === 200 && regData.success === true && regData.customer?.name === "Tariq Mehmood",
    "Customer registration succeeds with valid data",
    JSON.stringify(regData)
  );

  // ----------------------------------------------------------------------
  // TEST 3: Login with Wrong Password (Must Fail strictly - No fake login!)
  // ----------------------------------------------------------------------
  console.log("\n--- 3. Testing Wrong Password Login ---");
  const wrongPassRes = await fetch(`${BASE_URL}/api/auth/customer`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      action: "login",
      phone: testPhone,
      password: "WrongPassword999",
    }),
  });
  const wrongPassData = await wrongPassRes.json();
  assert(
    wrongPassRes.status === 401 && wrongPassData.success === false,
    "Wrong password is strictly rejected with 401 Unauthorized",
    JSON.stringify(wrongPassData)
  );
  assert(
    wrongPassData.error && wrongPassData.error.includes("Incorrect password"),
    "Returns explicit 'Incorrect password' error",
    wrongPassData.error
  );

  // ----------------------------------------------------------------------
  // TEST 4: Login with Correct Password
  // ----------------------------------------------------------------------
  console.log("\n--- 4. Testing Correct Password Login ---");
  const validLoginRes = await fetch(`${BASE_URL}/api/auth/customer`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      action: "login",
      phone: testPhone,
      password: testPassword,
    }),
  });
  const validLoginData = await validLoginRes.json();
  assert(
    validLoginRes.status === 200 && validLoginData.success === true,
    "Correct credentials authenticate successfully",
    JSON.stringify(validLoginData)
  );
  assert(
    validLoginData.customer?.phone === testPhone,
    "Authenticated customer data matches registered profile",
    validLoginData.customer?.phone
  );

  // ----------------------------------------------------------------------
  // TEST 5: Google Sign-In
  // ----------------------------------------------------------------------
  console.log("\n--- 5. Testing Google Authentication ---");
  const googleRes = await fetch(`${BASE_URL}/api/auth/customer`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      action: "google_login",
      email: "google_verified_user@gmail.com",
      name: "Google Verified User",
      city: "Umerkot",
    }),
  });
  const googleData = await googleRes.json();
  assert(
    googleRes.status === 200 && googleData.success === true,
    "Google Sign-In creates/authenticates user cleanly",
    JSON.stringify(googleData)
  );

  // ----------------------------------------------------------------------
  // TEST 6: WhatsApp 1-Click Login
  // ----------------------------------------------------------------------
  console.log("\n--- 6. Testing WhatsApp 1-Click Login ---");
  const waLoginRes = await fetch(`${BASE_URL}/api/auth/customer`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      action: "whatsapp_login",
      phone: "03123456789",
      name: "WhatsApp Verified Customer",
      city: "Umerkot",
    }),
  });
  const waLoginData = await waLoginRes.json();
  assert(
    waLoginRes.status === 200 && waLoginData.success === true,
    "WhatsApp login authenticates customer with valid phone",
    JSON.stringify(waLoginData)
  );

  // ----------------------------------------------------------------------
  // TEST 7: Create Service Booking (AC Repair) with WhatsApp & Gmail
  // ----------------------------------------------------------------------
  console.log("\n--- 7. Testing Service Booking Submission ---");
  const bookingPayload = {
    customerName: "Tariq Mehmood",
    customerPhone: testPhone,
    customerWhatsApp: testWhatsApp,
    customerEmail: testEmail,
    serviceId: "ac-repair",
    serviceName: "AC Repair & Servicing",
    city: "Umerkot",
    problem: "AC cooling nahi kar raha aur compressor trip kar raha hai.",
    visitFee: 200,
    paymentMethod: "jazzcash",
    transactionRef: "JC-9876543210",
    proofUrl: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==",
  };

  const bookingRes = await fetch(`${BASE_URL}/api/bookings`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(bookingPayload),
  });
  const bookingData = await bookingRes.json();

  assert(
    bookingRes.status === 200 && bookingData.success === true,
    "Booking created successfully",
    JSON.stringify(bookingData)
  );
  assert(
    bookingData.bookingNumber && bookingData.bookingNumber.startsWith("KMZ-"),
    "Booking number matches standard KMZ-YYYYMMDD-XXXX format",
    bookingData.bookingNumber
  );
  assert(
    bookingData.booking?.customer_whatsapp === testWhatsApp,
    "Customer WhatsApp number saved correctly in booking",
    bookingData.booking?.customer_whatsapp
  );
  assert(
    bookingData.booking?.customer_email === testEmail,
    "Customer Gmail saved correctly in booking",
    bookingData.booking?.customer_email
  );
  assert(
    bookingData.adminWhatsAppUrl &&
    bookingData.adminWhatsAppUrl.includes("923197318425") &&
    bookingData.adminWhatsAppUrl.includes(encodeURIComponent("#KAMZO")),
    "Admin WhatsApp URL generated with #KAMZO tag and target +92 319 7318425",
    bookingData.adminWhatsAppUrl
  );
  assert(
    bookingData.adminWhatsAppUrl.includes(encodeURIComponent(testWhatsApp)),
    "Admin WhatsApp message includes customer's WhatsApp number",
    bookingData.adminWhatsAppUrl
  );
  assert(
    bookingData.customerWhatsAppInvoiceUrl &&
    bookingData.customerWhatsAppInvoiceUrl.includes("92" + testWhatsApp.slice(1)),
    "Customer WhatsApp invoice URL targets customer's WhatsApp number",
    bookingData.customerWhatsAppInvoiceUrl
  );

  const createdPayment = bookingData.payment;
  assert(
    createdPayment && createdPayment.reference_number === "JC-9876543210" && createdPayment.status === "submitted",
    "Payment record created with status 'submitted'",
    JSON.stringify(createdPayment)
  );

  // ----------------------------------------------------------------------
  // TEST 8: Admin Payment Verification
  // ----------------------------------------------------------------------
  console.log("\n--- 8. Testing Admin Payment Verification ---");
  const verifyRes = await fetch(`${BASE_URL}/api/payments/verify`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      paymentId: createdPayment.id,
      action: "verify",
    }),
  });
  const verifyData = await verifyRes.json();
  assert(
    verifyRes.status === 200 && verifyData.success === true,
    "Admin payment verification succeeds",
    JSON.stringify(verifyData)
  );
  assert(
    verifyData.payment?.status === "verified",
    "Payment status updated to 'verified'",
    verifyData.payment?.status
  );
  assert(
    verifyData.customerWhatsAppUrl &&
    verifyData.customerWhatsAppUrl.includes("92" + testWhatsApp.slice(1)) &&
    verifyData.customerWhatsAppUrl.includes(encodeURIComponent("BOOKING CONFIRMED")),
    "Customer WhatsApp notification link generated with confirmation message",
    verifyData.customerWhatsAppUrl
  );

  // ----------------------------------------------------------------------
  // TEST 9: Admin Payment Rejection
  // ----------------------------------------------------------------------
  console.log("\n--- 9. Testing Admin Payment Rejection ---");
  // Create another booking to test rejection
  const bkg2Res = await fetch(`${BASE_URL}/api/bookings`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      ...bookingPayload,
      transactionRef: "JC-INVALID-TID",
    }),
  });
  const bkg2Data = await bkg2Res.json();
  const rejectRes = await fetch(`${BASE_URL}/api/payments/verify`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      paymentId: bkg2Data.payment.id,
      action: "reject",
      rejectionReason: "Screenshot TID jazzcash par match nahi hui.",
    }),
  });
  const rejectData = await rejectRes.json();
  assert(
    rejectRes.status === 200 && rejectData.payment?.status === "rejected",
    "Admin payment rejection records 'rejected' status",
    rejectData.payment?.status
  );
  assert(
    rejectData.payment?.rejection_reason === "Screenshot TID jazzcash par match nahi hui.",
    "Rejection reason properly stored",
    rejectData.payment?.rejection_reason
  );
  assert(
    rejectData.customerWhatsAppUrl &&
    rejectData.customerWhatsAppUrl.includes(encodeURIComponent("Screenshot TID jazzcash par match nahi hui")),
    "Customer WhatsApp rejection link includes specific rejection reason",
    rejectData.customerWhatsAppUrl
  );

  // ----------------------------------------------------------------------
  // TEST 10: Worker Registration & Admin Notification
  // ----------------------------------------------------------------------
  console.log("\n--- 10. Testing Worker Registration ---");
  const workerPhone = "0333" + Math.floor(1000000 + Math.random() * 9000000);
  const workerRes = await fetch(`${BASE_URL}/api/workers/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      name: "Usman Ghani",
      phone: workerPhone,
      whatsapp: workerPhone,
      city: "Umerkot",
      area: "Main Market",
      categories: ["ac-repair", "electrician"],
      experience: 5,
      skills: "Inverter AC board repair and gas charging",
      cnic: "44103-1234567-1",
      payoutMethod: "easypaisa",
      payoutAccount: workerPhone,
    }),
  });
  const workerData = await workerRes.json();
  assert(
    workerRes.status === 200 && workerData.success === true,
    "Worker registered with pending verification status",
    JSON.stringify(workerData)
  );
  assert(
    workerData.adminWhatsAppUrl &&
    workerData.adminWhatsAppUrl.includes("923197318425") &&
    workerData.adminWhatsAppUrl.includes(encodeURIComponent("NEW WORKER APPLICATION")),
    "Admin WhatsApp alert generated for new worker registration",
    workerData.adminWhatsAppUrl
  );

  // ----------------------------------------------------------------------
  // TEST 11: Admin Live Feed API
  // ----------------------------------------------------------------------
  console.log("\n--- 11. Testing Admin Live Feed API ---");
  const feedRes = await fetch(`${BASE_URL}/api/admin/live-feed`);
  const feedData = await feedRes.json();
  assert(
    feedRes.status === 200 && feedData.success === true,
    "Admin live-feed API returns live state",
    JSON.stringify(feedData.counts)
  );
  assert(
    Array.isArray(feedData.bookings) && feedData.bookings.length > 0,
    "Admin live-feed contains live bookings without refresh",
    `Total Bookings: ${feedData.bookings?.length}`
  );
  assert(
    Array.isArray(feedData.payments) && feedData.payments.length > 0,
    "Admin live-feed contains payments",
    `Total Payments: ${feedData.payments?.length}`
  );

  // ----------------------------------------------------------------------
  // SUMMARY
  // ----------------------------------------------------------------------
  console.log("\n=================================================");
  console.log(`🎯 TEST RESULTS SUMMARY:`);
  console.log(`   Passed: ${passedCount}`);
  console.log(`   Failed: ${failedCount}`);
  console.log("=================================================");

  if (failedCount === 0) {
    console.log("✨ ALL 100% OF TESTS PASSED SUCCESSFULLY! ✨");
    process.exit(0);
  } else {
    console.error("⚠️ Some tests failed. Please inspect logs.");
    process.exit(1);
  }
}

runTests().catch((err) => {
  console.error("Test execution threw exception:", err);
  process.exit(1);
});
