const express = require('express');
const axios = require('axios');
const app = express();

app.set('view engine', 'pug');
app.set('views', './views'); 
app.use(express.static(__dirname + '/public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const PRIVATE_APP_ACCESS = "";

// Route to render the homepage
app.get('/', async (req, res) => {
    const url = 'https://api.hubspot.com/crm/v3/objects/pets?properties=pet_art,alder,kilo';  
    const headers = {
        Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
        'Content-Type': 'application/json'
    };

    try {
        // Sending GET request to retrieve the custom object data
        const response = await axios.get(url, { headers });

        // Logging the full response data to inspect it
        console.log("API Response:", response.data);

        console.log("Full Data Item:", response.data.results[0]);
        console.log("Properties:", response.data.results[0].properties);


        const data = response.data.results; 

        if (!data || data.length === 0) {
            console.log("No data found");
            res.render('homepage', { title: 'Homepage | Custom Objects', data: [] }); // Pass empty array if no data
        } else {
            // Log the first item in the data to ensure we can access properties
            console.log("First Data Item:", data[0]);

            // Render the homepage with the retrieved data
            res.render('homepage', { title: 'Homepage | Custom Objects', data });
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Error retrieving data');
    }
});

// Route to render the form for creating or updating a custom object
app.get('/update-cobj', (req, res) => {
    res.render('updates', { title: 'Update Custom Object Form | Integrating With HubSpot I Practicum' });
});

// Route to handle the form submission (POST)
app.post('/update-cobj', async (req, res) => {
    const { pet_art, alder, kilo } = req.body; 
    
    const newRecord = {
        properties: {
            "pet_art": pet_art, 
            "alder": alder,
            "kilo": kilo
        }
    };

    const url = 'https://api.hubspot.com/crm/v3/objects/pets';
    const headers = {
        Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
        'Content-Type': 'application/json'
    };

    try {
        // Sending POST request to create the new custom object
        const response = await axios.post(url, newRecord, { headers });
        console.log('Created new record:', response.data);
        res.redirect('/'); // Redirecting to homepage after successful creation
    } catch (error) {
        console.error('Error creating record:', error); // Log any errors
        res.status(500).send('Error creating record');
    }
});

// * Localhost
app.listen(3000, () => console.log('Listening on http://localhost:3000'));
