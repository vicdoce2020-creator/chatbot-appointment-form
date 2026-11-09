const form = document.getElementById("appointmentForm");
const submitButton = document.getElementById("submitButton");
const formMessage = document.getElementById("formMessage");
const dateInput = document.getElementById("date");

// Replace this with your n8n Production Webhook URL later.
const WEBHOOK_URL = "YOUR_N8N_WEBHOOK_URL";

const today = new Date();
const localToday = [
    today.getFullYear(),
    String(today.getMonth() + 1).padStart(2, "0"),
    String(today.getDate()).padStart(2, "0")
].join("-");

dateInput.min = localToday;

form.addEventListener("submit", async function (event) {
    event.preventDefault();

    formMessage.textContent = "";

    if (!form.reportValidity()) {
        return;
    }

    if (WEBHOOK_URL === "YOUR_N8N_WEBHOOK_URL") {
        formMessage.textContent =
            "Form is ready. n8n Webhook is not yet connected.";
        return;
    }

    const formData = new FormData(form);

    const appointmentData = {
        customer_name: formData.get("name").trim(),
        email: formData.get("email").trim(),
        phone: formData.get("phone").trim(),
        preferred_date: formData.get("preferred_date"),
        preferred_time: formData.get("preferred_time"),
        submitted_at: new Date().toISOString()
    };

    submitButton.disabled = true;
    submitButton.textContent = "Submitting...";

    try {
        const response = await fetch(WEBHOOK_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(appointmentData)
        });

        if (!response.ok) {
            throw new Error("Submission failed.");
        }

        form.reset();
        dateInput.min = localToday;

        formMessage.textContent =
            "Thank you! Your appointment request has been submitted successfully.";

    } catch (error) {
        formMessage.textContent =
            "Unable to submit your appointment. Please try again.";
    } finally {
        submitButton.disabled = false;
        submitButton.textContent = "Submit Appointment";
    }
});
