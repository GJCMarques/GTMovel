/**
 * GT Móvel - Contact Form Handler
 * Modern ES6+ Form Validation & AJAX Submission
 * Supports: EmailJS, FormSubmit, or custom endpoint
 * Author: GT Móvel
 * Year: 2026
 */

// =================================
// Configuration
// =================================

// Choose your form submission method:
// 'emailjs' or 'formsubmit' or 'custom'
const FORM_METHOD = 'emailjs';

// EmailJS Configuration (https://www.emailjs.com/)
// Get your credentials from EmailJS dashboard
const EMAILJS_CONFIG = {
    serviceID: 'YOUR_SERVICE_ID',      // Replace with your EmailJS Service ID
    templateID: 'YOUR_TEMPLATE_ID',    // Replace with your EmailJS Template ID
    publicKey: 'YOUR_PUBLIC_KEY'       // Replace with your EmailJS Public Key
};

// FormSubmit Configuration (https://formsubmit.co/)
// Just use your email address - no registration needed!
const FORMSUBMIT_EMAIL = 'info@gtmovel.pt';

// Custom API Endpoint (if you have your own backend)
const CUSTOM_ENDPOINT = '/api/contact';

// =================================
// Form Initialization
// =================================
document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('contact-form');

    if (!form) {
        console.warn('Contact form not found on this page');
        return;
    }

    // Initialize EmailJS if using that method
    if (FORM_METHOD === 'emailjs') {
        initEmailJS();
    }

    // Add form submit event listener
    form.addEventListener('submit', handleFormSubmit);

    // Real-time validation
    addRealTimeValidation(form);
});

// =================================
// EmailJS Initialization
// =================================
function initEmailJS() {
    // Check if EmailJS is loaded
    if (typeof emailjs === 'undefined') {
        console.error('EmailJS library not loaded. Please add the EmailJS SDK to your HTML.');
        console.info('Add this script tag: <script src="https://cdn.jsdelivr.net/npm/@emailjs/browser@3/dist/email.min.js"></script>');
        return;
    }

    // Initialize EmailJS with your public key
    emailjs.init(EMAILJS_CONFIG.publicKey);
    console.log('EmailJS initialized successfully');
}

// =================================
// Form Submit Handler
// =================================
async function handleFormSubmit(e) {
    e.preventDefault();

    const form = e.target;
    const submitBtn = document.getElementById('submit-btn');
    const btnText = document.getElementById('btn-text');
    const btnIcon = document.getElementById('btn-icon');

    // Validate form before submission
    if (!validateForm(form)) {
        return;
    }

    // Get form data
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());

    // Show loading state
    setLoadingState(submitBtn, btnText, btnIcon, true);

    try {
        let success = false;

        // Submit based on chosen method
        switch (FORM_METHOD) {
            case 'emailjs':
                success = await submitViaEmailJS(data);
                break;
            case 'formsubmit':
                success = await submitViaFormSubmit(formData);
                break;
            case 'custom':
                success = await submitViaCustomAPI(data);
                break;
            default:
                throw new Error('Invalid form submission method');
        }

        if (success) {
            // Show success message
            showToast('Mensagem enviada com sucesso! Entraremos em contacto em breve.', 'success');

            // Reset form
            form.reset();

            // Optional: Track conversion (Google Analytics, Facebook Pixel, etc.)
            trackConversion();
        }
    } catch (error) {
        console.error('Form submission error:', error);
        showToast('Erro ao enviar mensagem. Por favor, tente novamente ou contacte-nos diretamente.', 'error');
    } finally {
        // Reset button state
        setLoadingState(submitBtn, btnText, btnIcon, false);
    }
}

// =================================
// EmailJS Submission
// =================================
async function submitViaEmailJS(data) {
    try {
        const response = await emailjs.send(
            EMAILJS_CONFIG.serviceID,
            EMAILJS_CONFIG.templateID,
            {
                from_name: data.name,
                from_email: data.email,
                phone: data.phone || 'Não fornecido',
                subject: data.subject,
                message: data.message,
                to_name: 'GT Móvel'
            }
        );

        console.log('EmailJS response:', response);
        return response.status === 200;
    } catch (error) {
        console.error('EmailJS error:', error);
        throw error;
    }
}

// =================================
// FormSubmit Submission
// =================================
async function submitViaFormSubmit(formData) {
    try {
        const response = await fetch(`https://formsubmit.co/ajax/${FORMSUBMIT_EMAIL}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(Object.fromEntries(formData))
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        console.log('FormSubmit response:', result);
        return result.success === 'true' || response.ok;
    } catch (error) {
        console.error('FormSubmit error:', error);
        throw error;
    }
}

// =================================
// Custom API Submission
// =================================
async function submitViaCustomAPI(data) {
    try {
        const response = await fetch(CUSTOM_ENDPOINT, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        console.log('Custom API response:', result);
        return result.success || response.ok;
    } catch (error) {
        console.error('Custom API error:', error);
        throw error;
    }
}

// =================================
// Form Validation
// =================================
function validateForm(form) {
    let isValid = true;
    const fields = ['name', 'email', 'subject', 'message'];

    fields.forEach(fieldName => {
        const field = form.elements[fieldName];
        if (!validateField(field)) {
            isValid = false;
        }
    });

    return isValid;
}

function validateField(field) {
    const value = field.value.trim();
    let errorMessage = '';

    // Check if required field is empty
    if (field.hasAttribute('required') && !value) {
        errorMessage = 'Este campo é obrigatório';
    }
    // Validate email format
    else if (field.type === 'email' && value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            errorMessage = 'Por favor, insira um email válido';
        }
    }
    // Validate name length
    else if (field.name === 'name' && value.length < 2) {
        errorMessage = 'Nome deve ter pelo menos 2 caracteres';
    }
    // Validate message length
    else if (field.name === 'message' && value.length < 10) {
        errorMessage = 'Mensagem deve ter pelo menos 10 caracteres';
    }

    if (errorMessage) {
        showFieldError(field, errorMessage);
        return false;
    } else {
        clearFieldError(field);
        return true;
    }
}

// =================================
// Real-Time Validation
// =================================
function addRealTimeValidation(form) {
    const fields = form.querySelectorAll('input[required], select[required], textarea[required]');

    fields.forEach(field => {
        // Validate on blur
        field.addEventListener('blur', () => {
            if (field.value.trim()) {
                validateField(field);
            }
        });

        // Clear error on input
        field.addEventListener('input', () => {
            if (field.classList.contains('error')) {
                clearFieldError(field);
            }
        });
    });
}

// =================================
// Error Display
// =================================
function showFieldError(field, message) {
    // Add error class
    field.classList.add('error');
    field.style.borderColor = '#EF4444';

    // Remove existing error message if any
    const existingError = field.parentElement.querySelector('.error-message');
    if (existingError) {
        existingError.remove();
    }

    // Create and insert error message
    const errorElement = document.createElement('p');
    errorElement.className = 'error-message text-sm text-red-500 mt-1';
    errorElement.textContent = message;
    field.parentElement.appendChild(errorElement);
}

function clearFieldError(field) {
    field.classList.remove('error');
    field.style.borderColor = '';

    const errorMessage = field.parentElement.querySelector('.error-message');
    if (errorMessage) {
        errorMessage.remove();
    }
}

// =================================
// Loading State
// =================================
function setLoadingState(btn, textEl, iconEl, isLoading) {
    if (isLoading) {
        btn.disabled = true;
        btn.style.opacity = '0.7';
        textEl.textContent = 'A enviar...';

        // Replace icon with spinner
        iconEl.innerHTML = '<div class="spinner"></div>';
    } else {
        btn.disabled = false;
        btn.style.opacity = '1';
        textEl.textContent = 'Enviar Mensagem';

        // Restore original icon
        iconEl.innerHTML = `
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
        `;
    }
}

// =================================
// Conversion Tracking (Optional)
// =================================
function trackConversion() {
    // Google Analytics 4
    if (typeof gtag !== 'undefined') {
        gtag('event', 'form_submission', {
            event_category: 'Contact',
            event_label: 'Contact Form',
            value: 1
        });
    }

    // Facebook Pixel
    if (typeof fbq !== 'undefined') {
        fbq('track', 'Contact');
    }

    // Custom tracking
    console.log('Form submission tracked');
}

// =================================
// Phone Number Formatting (Portuguese)
// =================================
const phoneInput = document.getElementById('phone');
if (phoneInput) {
    phoneInput.addEventListener('input', (e) => {
        let value = e.target.value.replace(/\D/g, ''); // Remove non-digits

        // Format: +351 XXX XXX XXX
        if (value.startsWith('351')) {
            value = value.slice(3);
        }
        if (value.length > 0) {
            if (value.length <= 3) {
                // No formatting needed for 3 digits or less
            } else if (value.length <= 6) {
                value = `${value.slice(0, 3)} ${value.slice(3)}`;
            } else {
                value = `${value.slice(0, 3)} ${value.slice(3, 6)} ${value.slice(6, 9)}`;
            }
        }

        e.target.value = value ? `+351 ${value}` : '';
    });
}

// =================================
// Anti-Spam Honeypot (Optional)
// =================================
// Add this hidden field to your HTML form to catch bots:
// <input type="text" name="_honeypot" style="display:none">
//
// Then add this validation in handleFormSubmit:
// if (formData.get('_honeypot')) {
//     console.warn('Spam detected');
//     return;
// }

// =================================
// Export functions for testing
// =================================
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        validateField,
        validateForm,
        showToast
    };
}
