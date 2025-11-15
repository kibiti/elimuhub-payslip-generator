document.addEventListener('DOMContentLoaded', function() {
    // Set default dates
    const today = new Date();
    const friday = new Date(today);
    friday.setDate(today.getDate() + (5 - today.getDay() + 7) % 7);
    
    document.getElementById('weekEnding').valueAsDate = friday;
    document.getElementById('paymentDate').valueAsDate = friday;
    
    // Generate payslip button
    document.getElementById('generateBtn').addEventListener('click', generatePayslip);
    
    // Reset form button
    document.getElementById('resetBtn').addEventListener('click', resetForm);
    
    // Print button
    document.getElementById('printBtn').addEventListener('click', function() {
        window.print();
    });
    
    // New payslip button
    document.getElementById('newPayslipBtn').addEventListener('click', resetForm);
    
    // Auto-save form data to localStorage
    const formInputs = document.querySelectorAll('#payslipForm input, #payslipForm select');
    formInputs.forEach(input => {
        input.addEventListener('input', saveFormData);
    });
    
    // Load saved form data if available
    loadFormData();
    
    function generatePayslip() {
        // Get form values
        const weekEnding = document.getElementById('weekEnding').value;
        const tutorName = document.getElementById('tutorName').value;
        const studentLocation = document.getElementById('studentLocation').value;
        const subjects = document.getElementById('subjects').value;
        const sessionsCompleted = document.getElementById('sessionsCompleted').value;
        const hoursCompleted = document.getElementById('hoursCompleted').value;
        const ratePerHour = parseFloat(document.getElementById('ratePerHour').value) || 0;
        const transportAdvance1 = parseFloat(document.getElementById('transportAdvance1').value) || 0;
        const transportAdvance2 = parseFloat(document.getElementById('transportAdvance2').value) || 0;
        const securityDeposit = parseFloat(document.getElementById('securityDeposit').value) || 0;
        const penalties = parseFloat(document.getElementById('penalties').value) || 0;
        const otherAdjustments = parseFloat(document.getElementById('otherAdjustments').value) || 0;
        const otherAdjustmentsNotes = document.getElementById('otherAdjustmentsNotes').value;
        const paymentStatus = document.getElementById('paymentStatus').value;
        const paymentMethod = document.getElementById('paymentMethod').value;
        const paymentDate = document.getElementById('paymentDate').value;
        const transactionRef = document.getElementById('transactionRef').value;
        
        // Validate required fields
        if (!tutorName || !studentLocation || !subjects || !sessionsCompleted || !hoursCompleted || !ratePerHour) {
            alert('Please fill in all required fields before generating the payslip.');
            return;
        }
        
        // Calculate values
        const grossEarnings = ratePerHour * hoursCompleted;
        const totalDeductions = transportAdvance1 + transportAdvance2 + securityDeposit + penalties + otherAdjustments;
        const netPay = grossEarnings - totalDeductions;
        
        // Format date
        const formatDate = (dateString) => {
            const date = new Date(dateString);
            return date.toLocaleDateString('en-GB');
        };
        
        // Format currency
        const formatCurrency = (amount) => {
            return new Intl.NumberFormat('en-KE', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            }).format(amount);
        };
        
        // Update preview
        document.getElementById('previewWeekEnding').textContent = formatDate(weekEnding);
        document.getElementById('previewTutorName').textContent = tutorName;
        document.getElementById('previewStudentLocation').textContent = studentLocation;
        document.getElementById('previewSubjects').textContent = subjects;
        document.getElementById('previewSessions').textContent = sessionsCompleted;
        document.getElementById('previewHours').textContent = hoursCompleted;
        document.getElementById('previewRate').textContent = formatCurrency(ratePerHour);
        document.getElementById('previewTotalHours').textContent = hoursCompleted;
        document.getElementById('previewGrossEarnings').textContent = formatCurrency(grossEarnings);
        document.getElementById('previewTransport1').textContent = formatCurrency(transportAdvance1);
        document.getElementById('previewTransport2').textContent = formatCurrency(transportAdvance2);
        document.getElementById('previewSecurity').textContent = formatCurrency(securityDeposit);
        document.getElementById('previewPenalties').textContent = formatCurrency(penalties);
        document.getElementById('previewOther').textContent = formatCurrency(otherAdjustments);
        document.getElementById('previewOtherNotes').textContent = otherAdjustmentsNotes || '____';
        document.getElementById('previewTotalDeductions').textContent = formatCurrency(totalDeductions);
        document.getElementById('previewGross').textContent = formatCurrency(grossEarnings);
        document.getElementById('previewDeductions').textContent = formatCurrency(totalDeductions);
        document.getElementById('previewNetPay').textContent = formatCurrency(netPay);
        document.getElementById('previewPaymentStatus').textContent = paymentStatus;
        document.getElementById('previewPaymentMethod').textContent = paymentMethod;
        document.getElementById('previewPaymentDate').textContent = `Friday ${formatDate(paymentDate)}`;
        document.getElementById('previewTransactionRef').textContent = transactionRef || '____________________';
        document.getElementById('previewSignatureDate').textContent = formatDate(new Date());
        
        // Show success message
        alert('Payslip generated successfully! You can now print or save as PDF.');
        
        // Scroll to preview
        document.getElementById('payslipPreview').scrollIntoView({ behavior: 'smooth' });
    }
    
    function resetForm() {
        document.getElementById('payslipForm').reset();
        
        // Reset dates to default
        const today = new Date();
        const friday = new Date(today);
        friday.setDate(today.getDate() + (5 - today.getDay() + 7) % 7);
        
        document.getElementById('weekEnding').valueAsDate = friday;
        document.getElementById('paymentDate').valueAsDate = friday;
        
        // Reset preview
        const previewElements = document.querySelectorAll('#payslipPreview span');
        previewElements.forEach(el => {
            if (el.id !== 'previewSignatureDate') {
                el.textContent = el.id.includes('WeekEnding') || el.id.includes('PaymentDate') ? 
                    '____ / ____ / 2025' : 
                    (el.id.includes('PaymentStatus') ? 'Pending' : 
                    (el.id.includes('PaymentMethod') ? 'Airtel Money' : '____________________'));
            }
        });
        
        // Reset amounts
        document.querySelectorAll('#payslipPreview .amount').forEach(el => {
            el.textContent = '____';
        });
        
        document.getElementById('previewOtherNotes').textContent = '____';
        
        // Clear localStorage
        localStorage.removeItem('elimuhubPayslipFormData');
    }
    
    function saveFormData() {
        const formData = {};
        const formInputs = document.querySelectorAll('#payslipForm input, #payslipForm select');
        
        formInputs.forEach(input => {
            formData[input.id] = input.value;
        });
        
        localStorage.setItem('elimuhubPayslipFormData', JSON.stringify(formData));
    }
    
    function loadFormData() {
        const savedData = localStorage.getItem('elimuhubPayslipFormData');
        
        if (savedData) {
            const formData = JSON.parse(savedData);
            const formInputs = document.querySelectorAll('#payslipForm input, #payslipForm select');
            
            formInputs.forEach(input => {
                if (formData[input.id] !== undefined) {
                    input.value = formData[input.id];
                }
            });
        }
    }
});
