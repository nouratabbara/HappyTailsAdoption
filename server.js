const express = require('express');
const path = require('path');
const app = express();
const fs = require('fs');
const session = require('express-session'); 
//temporarily stores important information about a current user’s session on your app/website
const PORT = process.env.PORT || 8000;

const LOGIN_FILE = path.join(__dirname, 'data', 'login.txt');
const PETS_FILE = path.join(__dirname, 'data', 'petsinfo.txt');
//get data file paths

app.use(express.urlencoded());

//Serving static files in an Express.js application means making
// files such as HTML, CSS, JavaScript, images, and other resources available to the client.
//path.join(): joins the specified path segments into one path.
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({ secret: 'your_secret_key', resave: false, saveUninitialized: true }));


//EJS template files will be located in views folder 

function includeHeaderFooter(content) {
    const header = fs.readFileSync(path.join(__dirname, 'public', 'header.html'), 'utf8');
    //fs.readFileSync method synchronously reads the entire file and returns its contents as a string.
    const footer = fs.readFileSync(path.join(__dirname, 'public', 'footer.html'), 'utf8');
    return header + content + footer; // function returns this combined string
};// wrap a given HTML content with a common header and footer. 

app.get('/findPets', (req, res) => {
    const content = fs.readFileSync(path.join(__dirname, 'public', 'findPets.html'), 'utf8');
    res.send(includeHeaderFooter(content));
});

app.get('/dogCare', (req, res) => {
    const content = fs.readFileSync(path.join(__dirname, 'public', 'dogCare.html'), 'utf8');
    res.send(includeHeaderFooter(content));
});

app.get('/catCare', (req, res) => {
    const content = fs.readFileSync(path.join(__dirname, 'public', 'catCare.html'), 'utf8');
    res.send(includeHeaderFooter(content));
});

app.get('/contactUs', (req, res) => {
    const content = fs.readFileSync(path.join(__dirname, 'public', 'contactUs.html'), 'utf8');
    res.send(includeHeaderFooter(content));
});

app.get('/privacy', (req, res) => {
    const content = fs.readFileSync(path.join(__dirname, 'public', 'privacy.html'), 'utf8');
    res.send(includeHeaderFooter(content));
});

app.get('/', (req, res) => {
    const content = fs.readFileSync(path.join(__dirname, 'public', 'home.html'), 'utf8');
    res.send(includeHeaderFooter(content));
});

app.get('/createAccount', (req, res) => {
    const content = fs.readFileSync(path.join(__dirname, 'public', 'createAccount.html'), 'utf8');
    res.send(includeHeaderFooter(content));
});

//server side verification
app.post("/createAccount", (req, res) => {
    const content = fs.readFileSync(path.join(__dirname, 'public', 'createAccount.html'), 'utf8');
    const { username, password } = req.body;

    const usernameRegex = /^[a-zA-Z0-9]+$/;
    const passwordRegex = /^(?=.*[a-zA-Z])(?=.*\d)[a-zA-Z\d]{4,}$/;

    if (!usernameRegex.test(username) || !passwordRegex.test(password)) {
        return res.send(includeHeaderFooter(content+'<div>Invalid username or password format. <a href="/createAccount">Try again</a></div>'));
    }

    fs.readFile(LOGIN_FILE, 'utf8', (err, data) => {
        if (err) {
            return res.status(500).send('Server error. Please try again later.');
        }

        const users = data.split('\n').filter(line => line.trim() !== '');
        //splits login data into array of subtrings, negating any empty lines
        const userExists = users.some(line => line.split(':')[0] === username);
        //checks each line to see if username matches given nusernmae by splitting each line by :

        if (userExists) {
            return res.send(includeHeaderFooter(content+'<div>Username already exists. <a href="/createAccount">Try again</a></div>'));
        }

        const newUser = `${username}:${password}\n`;

        fs.appendFile(LOGIN_FILE, newUser, (err) => {
            if (err) {
                return res.status(500).send('Server error. Please try again later.');
            }
            res.redirect('/login'); //change to login
        });

    });

});

app.post( "/findPets", (req, res) => {
    const content = fs.readFileSync(path.join(__dirname, 'public', 'findPets.html'), 'utf8');
    const { pet, breed, age, gender, goodWith } = req.body;

    fs.readFile(PETS_FILE, 'utf8', (err, data) => {
        if (err) {
            res.status(500).send('Error reading pets information file.');
            return;
        }
    
        const lines = data.split('\n').filter(line => line.trim() !== '');
        //splits login data into array of subtrings, negating any empty lines
        const results = lines.filter(line => { ///get data by seprating lines and filtering for data provided from request
            parts = line.split(":");
            if (parts.length < 10)
                return false;
            
            const petType = parts[2];
            const petBreed = parts[3];
            const petAge = parts[4];
            const petGender = parts[5];
            const goodWithCats = parts[6] === 'true'; //will return true if parts[6] = true, otherwise it will return false 
            const goodWithDogs = parts[7] === 'true';
            const goodWithChildren = parts[8] === 'true';


            //checks if each part matches the corresponding form field
            return (pet === '' || petType === pet) &&  //'': any  type because it signifies that the user did not specify a type in the form
            (breed === '' || petBreed.toLowerCase().includes(breed.toLowerCase())) &&
            (age === '' || petAge === age) &&
            (gender === '' || petGender === gender) &&
            (goodWith === undefined || goodWith.every(gw => { //every method: checks each element in goodWith
                if (gw === 'cats') return goodWithCats; //sets to true if equal
                if (gw === 'dogs') return goodWithDogs; 
                if (gw === 'children') return goodWithChildren;
                return false;
            }));
           
        });

        //formats results
        if (results.length > 0) {
            const formattedResults = results.map(r => {
                const parts = r.split(':');
                const petType = parts[2];
                const petBreed = parts[3];
                const petAge = parts[4];
                const goodWithCats = parts[6] === 'true';
                const goodWithDogs = parts[7] === 'true';
                const goodWithChildren = parts[8] === 'true';

                const goodWithList = [];
                if (goodWithCats) goodWithList.push('Cats'); //if goodWithCats is true, push cats to list
                if (goodWithDogs) goodWithList.push('Dogs');
                if (goodWithChildren) goodWithList.push('Children');

                const goodWithString = goodWithList.length > 0 ? goodWithList.join(', ') : 'None'; //display goodwith with commas 
                return `${petType.charAt(0).toUpperCase() + petType.slice(1)}, ${petAge} years, ${petBreed.charAt(0).toUpperCase() + petBreed.slice(1)}, Good With: ${goodWithString}`;
                //sets the first letter of pet type and breed to uppercase
            }).join('</li><li>');

            res.send(includeHeaderFooter(content+`<h4>Matching Pets</h4><ul><li>${formattedResults}</li></ul>`));
        } else {
            res.send(includeHeaderFooter(content+'<h4>No matching pets found.</h4>'));
        }

    });

});

app.get('/login', (req, res) => {
    const content = fs.readFileSync(path.join(__dirname, 'public', 'login.html'), 'utf8');
    res.send(includeHeaderFooter(content));
});

app.post('/login', (req, res) => {
    const content = fs.readFileSync(path.join(__dirname, 'public', 'login.html'), 'utf8');
    const { username, password } = req.body;

    const usernameRegex = /^[a-zA-Z0-9]+$/;
    const passwordRegex = /^(?=.*[a-zA-Z])(?=.*\d)[a-zA-Z\d]{4,}$/;

    if (!usernameRegex.test(username) || !passwordRegex.test(password)) {
        return res.send(includeHeaderFooter(content+'<div>Invalid username or password format. <a href="/login">Try again</a></div>'));
    }

    fs.readFile(LOGIN_FILE, 'utf8', (err, data) => {
        if (err) {
            return res.status(500).send('Server error. Please try again later.');
        }

        const users = data.split('\n').filter(line => line.trim() !== '');
        //splits login data into array of subtrings, negating any empty lines
        const userExists = users.some(line => line.split(':')[0] === username);
        //checks each line to see if username matches given nusernmae by splitting each line by :

         if (userExists) {
            req.session.username = username; //custom session property
            req.session.loggedIn = true;
            res.redirect('/giveAwayPet');
        } else {
            res.send(includeHeaderFooter(content+'<div>Username does not exist. <a href="/login">Try again</a></div>'));
        }
       
    });

});

app.get('/giveAwayPet', (req, res) => {
    const content = fs.readFileSync(path.join(__dirname, 'public', 'giveAwayPet.html'), 'utf8');
    if (!req.session.loggedIn) {//represent current request's session object 
        res.redirect('/login');
    }else{
    res.send(includeHeaderFooter(content));
    }
});


//fix logout, make it so it only shows up when logged in 
app.get('/logout', (req, res) => {
    const content = fs.readFileSync(path.join(__dirname, 'public', 'login.html'), 'utf8');
    if(req.session.loggedIn){
        req.session.destroy((err) => {
            if (err) {
                return res.status(500).send('Error logging out.');
            }
            res.send(includeHeaderFooter(content+'You have been logged out successfully. Login Again'));
        });
    } else{
        res.send(includeHeaderFooter(content+'No user is currently logged in.'));
    }
});

app.post('/giveAwayPet', (req, res) => {
    const content = fs.readFileSync(path.join(__dirname, 'public', 'giveAwayPet.html'), 'utf8');
    const { pet, breed, age, gender, goodWith, name, email} = req.body;

    const goodWithCats = goodWith.includes('cats'); //if it includes cats, will make goodWithCats true
    const goodWithDogs = goodWith.includes('dogs');
    const goodWithChildren = goodWith.includes('children');

    fs.readFile(PETS_FILE, 'utf8', (err, data) => {
        if (err) {
            return res.status(500).send('Error reading pets information file.');
            
        }

        const lines = data.trim().split('\n');
        const newId = lines.length + 1;
        const newPet = `${newId}:${req.session.username}:${pet}:${breed}:${age}:${gender}:${goodWithCats}:${goodWithDogs}:${goodWithChildren}:${name}:${email}\n`;

        fs.appendFile(PETS_FILE, newPet, (err) => {
            if (err) {
                return res.status(500).send('Error saving pet information.');
            }

            res.send(includeHeaderFooter(content+'Pet added successfully.'));
        });
    });

});



app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
//tells app to start listening for visitors on a specific address and port, much like how Node listens for connections

