// Tuodaan tarvittavat moduulit.
const express = require('express'); // Express.js-framework web-sovellusten rakentamiseen.
const path = require('path'); // Path-moduuli tiedosto- ja hakemistopolkujen käsittelyyn.
const fs = require('fs'); // File System -moduuli tiedostojärjestelmän kanssa vuorovaikutukseen.

// Luodaan Express-sovellus.
const app = express();

// Määritellään porttinumero, jolla palvelin kuuntelee.
const PORT = 3000;

// Tarjoile staattisia tiedostoja 'public'-hakemistosta
app.use(express.static(path.join(__dirname, 'public')));

// Väliohjelmisto URL-enkoodattujen kehojen jäsentämiseen
app.use(express.urlencoded({ extended: true }));

// Väliohjelmisto JSON-kehon jäsentämiseen
app.use(express.json());

// Reitti kotisivulle
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

// Reitti vieraskirjasivulle - yksinkertaistettu vain HTML-tiedoston tarjoamiseen
app.get('/guestbook', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'guestbook.html'));
});

// API-reitti vieraskirjan merkintöjen tarjoamiseen JSON-muodossa
app.get('/api/guestbook', (req, res) => {
    fs.readFile(path.join(__dirname, 'data', 'guestbook.json'), 'utf8', (err, data) => {
        if (err) {
            return res.status(500).send('Virhe ladattaessa vieraskirjan merkintöjä.');
        }
        res.json(JSON.parse(data)); // Tarjoile merkinnät JSON-muodossa
    });
});

// Uuden viestin lomakkeen reitti
app.get('/newmessage', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'newmessage.html'));
});

// AJAX-viestilomakkeen reitti
app.get('/ajaxmessage', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'ajaxmessage.html'));
});

// Käsittele POST-pyyntö uuden viestin lähettämiseen
app.post('/newmessage', (req, res) => {
    const newEntry = req.body;
    fs.readFile(path.join(__dirname, 'data', 'guestbook.json'), 'utf8', (err, data) => {
        if (err) {
            return res.status(500).send('Virhe luettaessa vieraskirjatiedostoa.');
        }
        const entries = JSON.parse(data);
        entries.push(newEntry);
        fs.writeFile(path.join(__dirname, 'data', 'guestbook.json'), JSON.stringify(entries, null, 2), 'utf8', err => {
            if (err) {
                return res.status(500).send('Virhe kirjoitettaessa uutta merkintää vieraskirjaan.');
            }
            res.redirect('/guestbook'); // Uudelleenohjaa takaisin vieraskirjasivulle
        });
    });
});

// Käsittele AJAX POST-pyyntö uuden viestin lähettämiseen
app.post('/ajaxmessage', (req, res) => {
    const newEntry = req.body;
    fs.readFile(path.join(__dirname, 'data', 'guestbook.json'), 'utf8', (err, data) => {
        if (err) {
            return res.status(500).send('Virhe luettaessa vieraskirjatiedostoa.');
        }
        const entries = JSON.parse(data);
        entries.push(newEntry);
        fs.writeFile(path.join(__dirname, 'data', 'guestbook.json'), JSON.stringify(entries, null, 2), 'utf8', (err) => {
            if (err) {
                return res.status(500).send('Virhe kirjoitettaessa uutta merkintää vieraskirjaan.');
            }
            res.json(entries); // Palauta päivitetty lista merkinnöistä JSON-muodossa
        });
    });
});

// Käynnistä palvelin
app.listen(PORT, () => {
    console.log(`Palvelin käynnissä portissa ${PORT}`);
});
