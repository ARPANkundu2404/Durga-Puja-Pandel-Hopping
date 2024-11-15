//showside bar
function showsidebar() {
    const Sidebar = document.getElementById("sidebar");
    Sidebar.style.display = 'flex';
}
function hidesidebar() {
    const Sidebar = document.getElementById("sidebar");
    Sidebar.style.display = 'none';   
}


//hideallpandel
function hideAllPandels() {
    const pandels = document.querySelectorAll('#nkpandel, #ckpandel, #skpandel, #kpandel');
    pandels.forEach(pandel => {
        pandel.classList.add("opacity-0", "scale-90");
        setTimeout(() => {
            pandel.classList.add('hidden');
        }, 500);
    });

    const options = document.querySelectorAll('#nkoption, #ckoption, #skoption, #koption');
    options.forEach(option => {
        option.classList.remove('hidden');
        setTimeout(() => {
            option.classList.remove("opacity-0", "scale-90");
        }, 500);
    });
}


//options
function optionsNK() {
    hideAllPandels();
    const pandelsNK = document.getElementById("nkpandel");
    const optionNK = document.getElementById("nkoption");
    
    setTimeout(() => {
        optionNK.classList.add("opacity-0", "scale-90");
        optionNK.classList.add("hidden");
        pandelsNK.classList.remove("opacity-0", "scale-90", "hidden");
    }, 500);
}

function optionsCK() {
    hideAllPandels();
    const pandelsCK = document.getElementById("ckpandel");
    const optionCK = document.getElementById("ckoption");

    
    setTimeout(() => {
        optionCK.classList.add("opacity-0", "scale-90");
        optionCK.classList.add("hidden");
        pandelsCK.classList.remove("opacity-0", "scale-90", "hidden");
    }, 500);
}

function optionsSK() {
    hideAllPandels();
    const pandelsSK = document.getElementById("skpandel");
    const optionSK = document.getElementById("skoption");

   
    setTimeout(() => {
        optionSK.classList.add("opacity-0", "scale-90");
        optionSK.classList.add("hidden");
        pandelsSK.classList.remove("opacity-0", "scale-90", "hidden");
    }, 500);
}

function optionsK() {
    hideAllPandels();
    const pandelsK = document.getElementById("kpandel");
    const optionK = document.getElementById("koption");

    
    setTimeout(() => {
        optionK.classList.add("opacity-0", "scale-90");
        optionK.classList.add("hidden");
        pandelsK.classList.remove("opacity-0", "scale-90", "hidden");
    }, 500);
}


//pandels
function pandelsNK() {
    const pandelsNK = document.getElementById("nkpandel");
    const optionNK = document.getElementById("nkoption");

    pandelsNK.classList.add("opacity-0", "scale-90");
    setTimeout(() => {
        pandelsNK.classList.add("hidden");
        optionNK.classList.remove("opacity-0", "scale-90", "hidden");
    }, 500);
}

function pandelsCK() {
    const pandelsCK = document.getElementById("ckpandel");
    const optionCK = document.getElementById("ckoption");

    pandelsCK.classList.add("opacity-0", "scale-90");
    setTimeout(() => {
        pandelsCK.classList.add("hidden");
        optionCK.classList.remove("opacity-0", "scale-90", "hidden");
    }, 500);
}

function pandelsSK() {
    const pandelsSK = document.getElementById("skpandel");
    const optionSK = document.getElementById("skoption");

    pandelsSK.classList.add("opacity-0", "scale-90");
    setTimeout(() => {
        pandelsSK.classList.add("hidden");
        optionSK.classList.remove("opacity-0", "scale-90", "hidden");
    }, 500);
}

function pandelsK() {
    const pandelsK = document.getElementById("kpandel");
    const optionK = document.getElementById("koption");

    pandelsK.classList.add("opacity-0", "scale-90");
    setTimeout(() => {
        pandelsK.classList.add("hidden");
        optionK.classList.remove("opacity-0", "scale-90", "hidden");
    }, 500);
}


//pandel details
const pandelDetailsData = {
    Bagbazar :{
        name: "Baghbazar Palli Puja O Pradarshani",
        zone: "North Kolkata",
        code: "IFD-DP-000049",
        address: "16, Lakshmi Dutta Lane, Baghbazar, Kolkata" 
    },
    Ahiritola :{
        name: "Ahiritola Jubak Brinda Durga Puja",
        zone: "North Kolkata",
        code: "IFD-DP-000046",
        address: "82, Ahiritola Street, Kolkata " 
    },
    Kumartuli :{
        name: "Kumartuli Sarbojanin Durgotsab",
        zone: "North Kolkata",
        code: "IFD-DP-000078",
        address: "1A, Durga Charan Banerjee Street, Kolkata " 
    },
    Telenga :{
        name: "Telengabagan Sarbojanin Durgotsab",
        zone: "North Kolkata",
        code: "IFD-DP-000096",
        address: "65 Adhar Chandra Das Lane, Kolkata" 
    },
    Nalin :{
        name: "Nalin Sarkar Street Sarbojanin Durgotsab",
        zone: "North Kolkata",
        code: "IFD-DP-000083",
        address: "175A, Aurobinda Sarani, Kolkata " 
    },
    Dumdum :{
        name: "Dum Dum Park Sarbojanin Durga Puja",
        zone: "North Kolkata",
        code: "IFD-DP-000063",
        address: "Dum Dum Park, Kolkata, West Bengal " 
    },
    Sreebhumi :{
        name: "Sreebhumi Sporting Club Durga Puja",
        zone: "North Kolkata",
        code: "	IFD-DP-000093",
        address: "Sree Bhumi Sporting Club, Canal Street, Sreebhumi " 
    },
    Hatibagan :{
        name: "Hatibagan Nabinpally Sarbojanin Durgotsav",
        zone: "North Kolkata",
        code: "IFD-DP-000071",
        address: "11/1D, Ganendra Mitra Lane, Kolkata " 
    },
    Jagat :{
        name: "Jagat Mukherjee Park Durga Puja",
        zone: "North Kolkata",
        code: "IFD-DP-000072",
        address: "10A, Dr. Bipin Behari Street, Kolkata " 
    },
    Saltlake :{
        name: "FD block, Saltlake",
        zone: "North Kolkata",
        code: "#",
        address: "HCH7+XWH, FE Block, Sector 3, Bidhannagar, Kolkata," 
    },
    14 :{
        name: "14 Pally Udayan Sangha",
        zone: "Central Kolkata",
        code: "IFD-DP-000297",
        address: "1A Haralal Das Street, Entally, Kolkata" 
    },
    37 :{
        name: "37 Pally Sarbojanin Durgotsab",
        zone: "Central Kolkata",
        code: "IFD-DP-000006",
        address: "10, Dr. Kartick Bose Street, Kolkata " 
    },
    47 :{
        name: "47 Pally Jubak Brinda Durga Puja",
        zone: "Central Kolkata",
        code: "IFD-DP-000007",
        address: "90, C R Avenue Road, Kolkata" 
    },
    centralCalcutta :{
        name: "Central Calcutta Youth Association",
        zone: "Central Kolkata",
        code: "IFD-DP-000031",
        address: "37/A, Gokul Boral Street, Kolkata" 
    },
    collegeSquare :{
        name: "College Square Sarbojanin Durgotsav",
        zone: "Central Kolkata",
        code: "IFD-DP-000032",
        address: "53, College Street, Kolkata" 
    },
    Matribhumi :{
        name: "Entally Matribhumi Durga Puja",
        zone: "Central Kolkata",
        code: "IFD-DP-000283",
        address: "5A 6, Uria Para Lane, Entally, Kolkata" 
    },
    Entally :{
        name: "Entally Sarbojanin Sri Sri Durga Puja",
        zone: "Central Kolkata",
        code: "IFD-DP-000033",
        address: "13, Gope Lane, Kolkata " 
    },
    kanaiDhar :{
        name: "Kanai Dhar Lane Adhibasi Brinda",
        zone: "Central Kolkata",
        code: "IFD-DP-000030",
        address: "25/8A, Kanai Dhar Lane, Kolkata" 
    },
    machuaBazar :{
        name: "Machua Bazar Sarbajanik Durga Puja Samity",
        zone: "Central Kolkata",
        code: "IFD-DP-000329",
        address: "1A, Madan Mohan Burman Street" 
    },
    mdAli :{
        name: "Md. Ali Park Durga Puja",
        zone: "Central Kolkata",
        code: "IFD-DP-000035",
        address: "41/A, Tara Chand Dutta Street, Kolkata" 
    },
    Pallir :{
        name: "Pallir Yubak Brinda Durga Puja",
        zone: "Central Kolkata",
        code: "IFD-DP-000037",
        address: "4F, Sitaram Ghosh Street, Kolkata" 
    },
    Santosh :{
        name: "Santosh Mitra Square Durga Puja",
        zone: "Central Kolkata",
        code: "	IFD-DP-000038",
        address: "10A, Santosh Mitra Square, Kolkata " 
    },
    Wellington :{
        name: "Wellington Nagarik Kalyan Samity Durga Puja",
        zone: "Central Kolkata",
        code: "IFD-DP-000036",
        address: "118, Princep Street, Kolkata " 
    },
    Badamtala :{
        name: "Badamtala Ashar Sangha Durga Puja",
        zone: "South Kolkata",
        code: "IFD-DP-000110",
        address: "5B, Nepal Bhattacharjee Street, Kolkata" 
    },
    66 :{
        name: "66 Pally Sarbojanin Durgotsab Committee",
        zone: "South Kolkata",
        code: "IFD-DP-000102",
        address: "14A, Nepal Bhattacharjee Street, Kolkata " 
    },
    Chetla :{
        name: "Chetla Agrani Club Durga Puja",
        zone: "South Kolkata",
        code: "IFD-DP-000129",
        address: "4, Pearymohan Ray Road, Chetla, Kolkata " 
    },
    Suruchi :{
        name: "New Alipore Suruchi Sangha Durga Puja",
        zone: "South Kolkata",
        code: "IFD-DP-000200",
        address: "500 & 505, Block - 'M' New Alipore, Kolkata " 
    },
    Mudiali :{
        name: "Mudiali Club Sarbojanin Durga Puja",
        zone: "South Kolkata",
        code: "IFD-DP-000160",
        address: "3 Rajani Sen Road Kolkata " 
    },
    Deshopriya :{
        name: "Deshapriya Park Durga Puja",
        zone: "South Kolkata",
        code: "IFD-DP-000136",
        address: "5B, Motilal Nehru Road, Kolkata " 
    },
    Tridhara :{
        name: "Tridhara Sammilani Durga Puja",
        zone: "South Kolkata",
        code: "IFD-DP-000201",
        address: "1, Aswini Dutta Road, Kolkata " 
    },
    Bullygaunge :{
        name: "Ballygunge Cultural Association Durga Puja",
        zone: "South Kolkata",
        code: "IFD-DP-000113",
        address: "57, Jatin Das Road" 
    },
    Hindustanp :{
        name: "Hindusthan Park Sarbojanin Durgotsab Committee",
        zone: "South Kolkata",
        code: "",
        address: "51/1, Gol Park, Dhakuria, Hindustan Park, Gariahat, Kolkata" 
    },
    Hindustanc :{
        name: "Hindustan Club",
        zone: "South Kolkata",
        code: "",
        address: "17A, Dhirendranath Ghosh Rd, Lake Place, Bhowanipore, Kolkata" 
    },
    Shinghi :{
        name: "Singhi Park Sarbojanin Durga Puja",
        zone: "South Kolkata",
        code: "IFD-DP-000195",
        address: "5, Ramani Chatterjee Road, Kolkata " 
    },
    Ekdalia :{
        name: "Ekdalia Evergreen Club Durga Puja",
        zone: "South Kolkata",
        code: "IFD-DP-000137",
        address: "Gariahat Road, Kolkata " 
    },
    Jodhpur :{
        name: "Jodhpur Park Durga Puja",
        zone: "South Kolkata",
        code: "",
        address: "1/D, Jodhpur Park, Kolkata" 
    },
    Maddox :{
        name: "Maddox Square Durga Puja",
        zone: "South Kolkata",
        code: "",
        address: "Earle St and, Pankaj Mullick Sarani, Garcha, Ballygunge" 
    },   
}


function showPandelDetails(pandelId) {
    const details = pandelDetailsData[pandelId];

    if (details) {
        var pandelDetails = document.getElementById("pandeldetails");
        pandelDetails.innerHTML = `
        <h1>${details.name}</h1>
        <h2>Zone : ${details.zone}</h2>
        <p>Puja Code : ${details.code}</p>
        <p>Address : ${details.address}</p>`;

        pandelDetails.classList.remove("hidden");
        pandelDetails.classList.add("flex");
        pandelDetails.scrollIntoView({behavior : "smooth", block : "start" });
    } else {
        pandelDetails.innerHTML = `<h1>Opps Sorry to show your requested data.</h1>`    
    }    
}


function hidePandelDetails() {
    const pandelDetails = document.getElementById("pandeldetails");
    const option = document.getElementById("option");
    pandelDetails.classList.add("hidden");
    pandelDetails.classList.remove("flex");
    option.scrollIntoView({behavior : "smooth", block : "start"});
}
