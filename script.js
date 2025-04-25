// Mock data
const mockDoctors = [
    {
        id: "1",
        name: "Dr. John Doe",
        specialties: ["General Physician"],
        experience: 10,
        fee: 500,
        consultationType: "Video Consult",
        rating: 4.5,
        reviewCount: 128,
        nextAvailable: "Today",
        location: "Manhattan, NY"
    },
    {
        id: "2",
        name: "Dr. Jane Smith",
        specialties: ["Dentist"],
        experience: 8,
        fee: 800,
        consultationType: "In Clinic",
        rating: 4.8,
        reviewCount: 256,
        nextAvailable: "Tomorrow",
        location: "Brooklyn, NY"
    }
];

// Specialties list
const specialties = [
    "General Physician", "Dentist", "Dermatologist", "Paediatrician",
    "Gynaecologist", "ENT", "Diabetologist", "Cardiologist",
    "Physiotherapist", "Endocrinologist", "Orthopaedic", "Ophthalmologist",
    "Gastroenterologist", "Pulmonologist", "Psychiatrist", "Urologist",
    "Dietitian-Nutritionist", "Psychologist", "Sexologist", "Nephrologist",
    "Neurologist", "Oncologist", "Ayurveda", "Homeopath"
];

// State management
let doctors = [];
let filterState = {
    searchQuery: '',
    consultationType: '',
    specialties: [],
    sortBy: ''
};

// DOM Elements
const loadingSpinner = document.getElementById('loadingSpinner');
const errorAlert = document.getElementById('errorAlert');
const searchInput = document.getElementById('searchInput');
const doctorsList = document.getElementById('doctorsList');
const specialtiesGroup = document.getElementById('specialtiesGroup');

// Initialize specialties checkboxes
function initializeSpecialties() {
    specialties.forEach(specialty => {
        const label = document.createElement('label');
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.value = specialty;
        checkbox.addEventListener('change', () => {
            if (checkbox.checked) {
                filterState.specialties.push(specialty);
            } else {
                filterState.specialties = filterState.specialties.filter(s => s !== specialty);
            }
            updateDoctorsList();
        });
        label.appendChild(checkbox);
        label.appendChild(document.createTextNode(specialty));
        specialtiesGroup.appendChild(label);
    });
}

// Event listeners
searchInput.addEventListener('input', (e) => {
    filterState.searchQuery = e.target.value;
    updateDoctorsList();
});

document.querySelectorAll('input[name="sortBy"]').forEach(radio => {
    radio.addEventListener('change', (e) => {
        filterState.sortBy = e.target.value;
        updateDoctorsList();
    });
});

document.querySelectorAll('input[name="consultationType"]').forEach(radio => {
    radio.addEventListener('change', (e) => {
        filterState.consultationType = e.target.value;
        updateDoctorsList();
    });
});

// Filter and sort doctors
function filterDoctors() {
    let result = [...doctors];

    if (filterState.searchQuery) {
        result = result.filter(doctor =>
            doctor.name.toLowerCase().includes(filterState.searchQuery.toLowerCase())
        );
    }

    if (filterState.consultationType) {
        result = result.filter(doctor => 
            doctor.consultationType === filterState.consultationType
        );
    }

    if (filterState.specialties.length > 0) {
        result = result.filter(doctor =>
            filterState.specialties.some(specialty => 
                doctor.specialties.includes(specialty)
            )
        );
    }

    if (filterState.sortBy === 'fees') {
        result.sort((a, b) => a.fee - b.fee);
    } else if (filterState.sortBy === 'experience') {
        result.sort((a, b) => b.experience - a.experience);
    }

    return result;
}

// Create doctor card HTML
function createDoctorCard(doctor) {
    const ratingStars = '⭐'.repeat(Math.floor(doctor.rating));
    const consultIcon = doctor.consultationType === 'Video Consult' ? 'videocam' : 'local_hospital';
    
    return `
        <div class="doctor-card">
            <div class="doctor-info">
                <div class="doctor-avatar">${doctor.name.charAt(0)}</div>
                <div class="doctor-details">
                    <div class="doctor-name">${doctor.name}</div>
                    <div class="doctor-specialties">
                        <span class="material-icons" style="font-size: 16px;">medical_services</span>
                        ${doctor.specialties.join(' • ')}
                    </div>
                    <div class="doctor-experience">
                        <span class="material-icons" style="font-size: 16px;">history</span>
                        ${doctor.experience} years experience
                    </div>
                    <div class="doctor-meta">
                        <span class="rating">
                            ${ratingStars} ${doctor.rating}
                            <span class="review-count">(${doctor.reviewCount} reviews)</span>
                        </span>
                        <span class="location">
                            <span class="material-icons" style="font-size: 16px;">location_on</span>
                            ${doctor.location}
                        </span>
                    </div>
                    <div class="doctor-consultation">
                        <span class="material-icons" style="font-size: 16px;">${consultIcon}</span>
                        ${doctor.consultationType}
                        <span class="next-available">• Next available: ${doctor.nextAvailable}</span>
                    </div>
                </div>
                <div class="doctor-actions">
                    <div class="doctor-fee">₹${doctor.fee}</div>
                    <button class="book-button">
                        <span class="material-icons" style="font-size: 16px;">event</span>
                        Book Appointment
                    </button>
                </div>
            </div>
        </div>
    `;
}

// Update doctors list in the UI
function updateDoctorsList() {
    const filteredDoctors = filterDoctors();
    doctorsList.innerHTML = filteredDoctors.map(createDoctorCard).join('');
}

// Fetch doctors data
async function fetchDoctors() {
    try {
        loadingSpinner.style.display = 'flex';
        errorAlert.style.display = 'none';

        const response = await fetch('https://srijandubey.github.io/campus-api-mock/SRM-C1-25.json');
        if (!response.ok) {
            throw new Error('Failed to fetch doctors data');
        }
        doctors = await response.json();
    } catch (err) {
        console.error('Error fetching doctors:', err);
        errorAlert.style.display = 'block';
        doctors = mockDoctors;
    } finally {
        loadingSpinner.style.display = 'none';
        updateDoctorsList();
    }
}

// Initialize the application
function init() {
    initializeSpecialties();
    fetchDoctors();
}

// Start the application
init(); 