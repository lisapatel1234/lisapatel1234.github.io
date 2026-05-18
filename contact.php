<?php
/**
 * LPS contact form handler.
 * Validates input, sends an email to the inbox, returns JSON for the fetch()
 * call in assets/js/contact.js. Falls back to a redirect if JS is off.
 */

header('Content-Type: application/json; charset=utf-8');

// --- Inbox ---------------------------------------------------------------
$to        = 'lpsservices1llc@gmail.com';
$subjectHd = 'New consult request from LPS site';

// --- Only POST -----------------------------------------------------------
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method not allowed']);
    exit;
}

// --- Honeypot ------------------------------------------------------------
// If the hidden `botcheck` checkbox is filled, silently pretend we succeeded.
if (!empty($_POST['botcheck'])) {
    echo json_encode(['success' => true]);
    exit;
}

// --- Collect inputs ------------------------------------------------------
$name          = trim($_POST['name']          ?? '');
$email         = trim($_POST['email']         ?? '');
$phone         = trim($_POST['phone']         ?? '');
$business      = trim($_POST['business']      ?? '');
$business_type = trim($_POST['business_type'] ?? '');
$message       = trim($_POST['message']       ?? '');

// --- Validate ------------------------------------------------------------
$errors = [];
if ($name === '') {
    $errors[] = 'Please enter your name.';
}
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    $errors[] = 'Please enter a valid email.';
}
if (strlen($message) < 10) {
    $errors[] = 'Please tell us a bit more (10+ characters).';
}
// Crude length caps to block obvious abuse
foreach (['name' => 200, 'business' => 200, 'business_type' => 200, 'phone' => 50, 'message' => 5000] as $k => $max) {
    if (strlen($$k) > $max) {
        $errors[] = 'One of your fields is too long.';
        break;
    }
}

if ($errors) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => implode(' ', $errors)]);
    exit;
}

// --- Build email body ----------------------------------------------------
$lines = [];
$lines[] = 'New consult request from the LPS website.';
$lines[] = '';
$lines[] = 'Name:     ' . $name;
$lines[] = 'Email:    ' . $email;
if ($phone !== '')         $lines[] = 'Phone:    ' . $phone;
if ($business !== '')      $lines[] = 'Business: ' . $business;
if ($business_type !== '') $lines[] = 'Type:     ' . $business_type;
$lines[] = '';
$lines[] = 'Message:';
$lines[] = $message;
$body = implode("\r\n", $lines);

// --- Headers -------------------------------------------------------------
// From must be a domain the server actually hosts, or Gmail will junk it.
// Reply-To is the submitter so "Reply" in Gmail goes to the right person.
$host = $_SERVER['HTTP_HOST'] ?? 'localhost';
$host = preg_replace('/^www\./i', '', $host);
$fromAddress = 'no-reply@' . $host;

// Sanitize header-injectable fields (strip CR/LF)
$safeName  = preg_replace('/[\r\n]+/', ' ', $name);
$safeEmail = preg_replace('/[\r\n]+/', '', $email);

$headers = [
    'From: LPS Website <' . $fromAddress . '>',
    'Reply-To: ' . $safeName . ' <' . $safeEmail . '>',
    'X-Mailer: PHP/' . phpversion(),
    'Content-Type: text/plain; charset=UTF-8',
    'MIME-Version: 1.0',
];

// Encode subject for non-ASCII safety
$subject = '=?UTF-8?B?' . base64_encode($subjectHd) . '?=';

// --- Send ----------------------------------------------------------------
$sent = @mail($to, $subject, $body, implode("\r\n", $headers));

if ($sent) {
    echo json_encode(['success' => true]);
} else {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Sorry — our mail server is unavailable. Please email us directly at lpsservices1llc@gmail.com.',
    ]);
}
