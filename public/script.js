document.getElementById('search-icon').addEventListener('click', function() {
            var searchInput = document.getElementById('search-input');
            var searchText = document.getElementById('search-text');
            if (searchInput.classList.contains('hidden')) {
                searchInput.classList.remove('hidden');
                searchText.classList.add('hidden');
                searchInput.focus();
            } else {
                searchInput.classList.add('hidden');
                searchText.classList.remove('hidden');
            }
});


async function fetchPatients() {
    try {
        const response = await fetch('/api/patients');
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        populatePatientList(data);
        populateJessicaInfo(data);
        populateLabResults(data);
        populateDiagnosticList(data);
        populateDiagnosisHistory(data);


    } catch (error) {
        console.error('Error fetching patients:', error);
    }
}

function populatePatientList(patients) {
    const patientList = document.getElementById('patient-list');
    patientList.innerHTML = '';

    if (!Array.isArray(patients)) {
        console.error('Expected an array of patients');
        return;
    }

    patients.forEach(patient => {
        const listItem = document.createElement('li');
        listItem.classList.add('patient');
        
        if (patient.name === 'Jessica Taylor') {
            listItem.classList.add('active-patient');
        }

        const patientDetails = document.createElement('div');
        patientDetails.classList.add('patient-details');

        const img = document.createElement('img');
        img.src = patient.profile_picture || './img/default-profile.png';
        img.alt = `${patient.name}`;

        const infoDiv = document.createElement('div');

        const nameP = document.createElement('p');
        nameP.textContent = patient.name;

        const detailsP = document.createElement('p');
        detailsP.textContent = `${patient.gender}, ${patient.age}`;

        infoDiv.appendChild(nameP);
        infoDiv.appendChild(detailsP);

        patientDetails.appendChild(img);
        patientDetails.appendChild(infoDiv);

        listItem.appendChild(patientDetails);
        listItem.innerHTML += '<i class="fas fa-ellipsis-h"></i>';

        patientList.appendChild(listItem);
    });
}

function populateJessicaInfo(patients) {
    const jessica = patients.find(patient => patient.name === 'Jessica Taylor');

    if (jessica) {
        const imgElement = document.querySelector('.patient-img-text img');
        const nameElement = document.querySelector('.patient-img-text h3');
        const dobElement = document.querySelector('.more-info:nth-child(2) .detailed-info p:nth-child(2)');
        const genderElement = document.querySelector('.more-info:nth-child(3) .detailed-info p:nth-child(2)');
        const contactInfoElement = document.querySelector('.more-info:nth-child(4) .detailed-info p:nth-child(2)');
        const emergencyContactElement = document.querySelector('.more-info:nth-child(5) .detailed-info p:nth-child(2)');
        const insuranceProviderElement = document.querySelector('.more-info:nth-child(6) .detailed-info p:nth-child(2)');

        if (imgElement) imgElement.src = jessica.profile_picture || './img/default-profile.png';
        if (nameElement) nameElement.textContent = jessica.name;
        if (dobElement) dobElement.textContent = new Date(jessica.date_of_birth).toLocaleDateString();
        if (genderElement) genderElement.textContent = jessica.gender;
        if (contactInfoElement) contactInfoElement.textContent = jessica.phone_number;
        if (emergencyContactElement) emergencyContactElement.textContent = jessica.emergency_contact;
        if (insuranceProviderElement) insuranceProviderElement.textContent = jessica.insurance_type;
    } else {
        console.error('Jessica Taylor not found in the patient list');
    }
}

function populateLabResults(patients) {
    const jessica = patients.find(patient => patient.name === 'Jessica Taylor');

    if (jessica && jessica.lab_results && Array.isArray(jessica.lab_results)) {
        const labResultsContainer = document.querySelector('.lab-results');

        jessica.lab_results.forEach(result => {
            const labInfo = document.createElement('div');
            labInfo.classList.add('lab-info');

            const testName = document.createElement('p');
            testName.textContent = result;

            const downloadIcon = document.createElement('object');
            downloadIcon.data = './img/download.svg';
            downloadIcon.type = '';

            labInfo.appendChild(testName);
            labInfo.appendChild(downloadIcon);

            labResultsContainer.appendChild(labInfo);
        });
    } else {
        console.error('Lab results for Jessica Taylor not found');
    }
}

function populateDiagnosticList(patients) {
    const jessica = patients.find(patient => patient.name === 'Jessica Taylor');

    if (jessica && jessica.diagnostic_list && Array.isArray(jessica.diagnostic_list)) {
        const diagnosticListBody = document.querySelector('.diagnostic-list tbody');

        jessica.diagnostic_list.forEach(diagnosis => {
            const row = document.createElement('tr');

            const problemCell = document.createElement('td');
            problemCell.textContent = diagnosis.name;

            const descriptionCell = document.createElement('td');
            descriptionCell.textContent = diagnosis.description;

            const statusCell = document.createElement('td');
            statusCell.textContent = diagnosis.status;

            row.appendChild(problemCell);
            row.appendChild(descriptionCell);
            row.appendChild(statusCell);

            diagnosticListBody.appendChild(row);
        });
    } else {
        console.error('Diagnostic list for Jessica Taylor not found');
    }
}

function populateDiagnosisHistory(patients) {
    const jessica = patients.find(patient => patient.name === 'Jessica Taylor');

    if (jessica && jessica.diagnosis_history && Array.isArray(jessica.diagnosis_history)) {
        const container = document.getElementById('container');
        container.innerHTML = '<h5 style="margin-top:7px;">Blood Pressure</h5><canvas id="bloodPressureChart"></canvas>'; 
        const ctx = document.getElementById('bloodPressureChart').getContext('2d');

        const chartData = jessica.diagnosis_history.map(entry => ({
            x: `${entry.month} ${entry.year}`,
            y: entry.blood_pressure.systolic.value
        }));



        

            const bloodPressureChart = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: ['Oct 2023', 'Nov 2023', 'Dec 2023', 'Jan 2024', 'Feb 2024', 'Mar 2024'],
                    datasets: [{
                        label: 'Systolic',
                        data: [120, 130, 125, 140, 135, 160],
                        borderColor: '#ff6384',
                        backgroundColor: 'rgba(255, 99, 132, 0.2)',
                        fill: true,
                    }, {
                        label: 'Diastolic',
                        data: [80, 85, 82, 90, 88, 78],
                        borderColor: '#36a2eb',
                        backgroundColor: 'rgba(54, 162, 235, 0.2)',
                        fill: true,
                    }]
                },
                options: {
                    responsive: true,
                    scales: {
                        y: {
                            beginAtZero: true
                        }
                    }
                }
            });
        ctx.canvas.parentNode.style.backgroundColor = '#F4F0FE';
        
        const systolicIcon = new Image();
        systolicIcon.src = 'systolic_icon.png'; 
        const diastolicIcon = new Image();
        diastolicIcon.src = 'diastolic_icon.png'; 

        
        chartData.forEach(data => {
            const x = data.x;
            const ySystolic = data.y;
            const yDiastolic = data.z;

            
            ctx.drawImage(systolicIcon, x + 10, ySystolic - 10, 20, 20); 

            
            ctx.drawImage(diastolicIcon, x + 10, yDiastolic - 10, 20, 20); 
        });


        
        const latestEntry = jessica.diagnosis_history[jessica.diagnosis_history.length - 1];

        
        const healthStats = document.querySelector('.health-stats');
        healthStats.innerHTML = '';

        
        const statsToDisplay = ['respiratory_rate', 'temperature','heart_rate',];

        
        statsToDisplay.forEach(stat => {
            const value = latestEntry[stat].value;
            const level = latestEntry[stat].levels;

            
            const statDiv = document.createElement('div');
            statDiv.classList.add('stat');

            
            if (stat === 'respiratory_rate') {
                statDiv.style.backgroundColor = '#E0F3FA';
            }

            
            const iconObject = document.createElement('object');
            iconObject.classList.add('health-svg');
            iconObject.data = `./img/${stat}.svg`;
            iconObject.type = '';

            
            const labelP = document.createElement('p');
            labelP.textContent = stat.replace(/_/g, ' ').replace(/\b\w/g, char => char.toUpperCase());

            
            const valueP = document.createElement('p');
            valueP.classList.add('rate-no');
            valueP.textContent = `${value}${stat === 'temperature' ? '°F' : ' bpm'}`;

            
            const levelP = document.createElement('p');
            levelP.textContent = level;

            
            statDiv.appendChild(iconObject);
            statDiv.appendChild(labelP);
            statDiv.appendChild(valueP);
            statDiv.appendChild(levelP);

            
            healthStats.appendChild(statDiv);
        });
    } else {
        console.error('Diagnosis history for Jessica Taylor not found');
    }
}


fetchPatients();
