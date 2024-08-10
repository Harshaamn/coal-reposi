// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs, doc } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDrg4FCw5K-4Dn40HG9kVHbmm90giZsmVU",
  authDomain: "coal-project-5e6db.firebaseapp.com",
  projectId: "coal-project-5e6db",
  storageBucket: "coal-project-5e6db.appspot.com",
  messagingSenderId: "726696828468",
  appId: "1:726696828468:web:4dab2f55b95a8143b2f461",
  measurementId: "G-079G9F6MDV"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const analytics = getAnalytics(app);

// Define thresholds
const TEMP_THRESHOLD = 30; // Example threshold value
const HUMIDITY_THRESHOLD = 80; // Example threshold value
const GAS_THRESHOLD = 400; // Example threshold value

async function fetchData(blockId) {
    try {
        const sensorsCollection = collection(db, "blocks", blockId, "sensors");
        const querySnapshot = await getDocs(sensorsCollection);
        
        let blockData = '';
        let hasAlert = false;

        querySnapshot.forEach((doc) => {
            const data = doc.data();
            const temp = data.temperature;
            const humidity = data.humidity;
            const gas = data.gas;

            if (temp > TEMP_THRESHOLD || humidity > HUMIDITY_THRESHOLD || gas > GAS_THRESHOLD) {
                hasAlert = true;
            }

            blockData += `
                <p>NodeMCU ${doc.id}:</p>
                <p>Temperature: ${temp}°C</p>
                <p>Humidity: ${humidity}%</p>
                <p>Gas: ${gas}</p>
                <hr>
            `;
        });

        document.getElementById(`data${blockId.charAt(blockId.length - 1)}`).innerHTML = blockData;
        const indicator = document.getElementById(`indicator${blockId.charAt(blockId.length - 1)}`);
        if (hasAlert) {
            indicator.classList.add('red');
        } else {
            indicator.classList.remove('red');
        }
    } catch (error) {
        console.error("Error fetching data:", error);
    }
}

document.querySelectorAll('.block').forEach(block => {
    block.addEventListener('click', () => {
        const blockId = block.id;
        fetchData(blockId);
    });
});
