document.addEventListener("DOMContentLoaded", function () {
    loadSavedDorkInputs();
});

const dorkLabels = {
    "site": "Site",
    "filetype": "File Type",
    "intitle": "Title",
    "inurl": "URL",
    "intext": "Text",
    "allintitle": "All Title",
    "allinurl": "All URL",
    "allintext": "All Text",
    "inanchor": "Anchor Text",
    "link": "Link",
    "related": "Related Sites",
    "before": "Before Date",
    "after": "After Date",
    "numrange": "Number Range",
    "inpostauthor": "Post Author"
};

function loadSavedDorkInputs() {
    const savedDorkTypes = JSON.parse(localStorage.getItem('selectedDorkTypes')) || [];
    const dorkLabels = {
        "site": "Site",
        "filetype": "File Type",
        "intitle": "Title",
        "inurl": "URL",
        "intext": "Text",
        "allintitle": "All Title",
        "allinurl": "All URL",
        "allintext": "All Text",
        "inanchor": "Anchor Text",
        "link": "Link",
        "related": "Related Sites",
        "before": "Before Date",
        "after": "After Date",
        "numrange": "Number Range",
        "inpostauthor": "Post Author"
    };

    savedDorkTypes.forEach(type => {
        if (dorkLabels[type]) {
            HideDorkInputField(type);
        }
    });
}

function HideDorkInputField(type) {
    const dorksContainer = document.getElementById('Dorks');
    
    if (!dorksContainer) return;

    const outputContainers = dorksContainer.querySelectorAll('.outputcontainer');
    
    const originalOrder = Array.from(outputContainers);

    outputContainers.forEach(container => {
        const inputGroup = container.querySelector('.input-group');
        
        if (!inputGroup) return;
        
        const inputElement = inputGroup.querySelector('input');
        
        if (inputElement && inputElement.id === type) {
            container.remove();
        }
    });
}

function settings() {
    Swal.fire({
        title: 'Settings',
        html: `
            <div>
                <div>
                    <button id="buttonUploadSettings" class="buttonGoogle">Upload Settings</button>
                    <button id="buttonDownloadSettings" class="buttonGenerate">Download Settings</button>
                </div>
                <button id="buttonResetDorkType" class="buttonSettings">Reset Hide Dork Type</button>
                <button id="buttonDorkType" class="buttonSettings">Hide Dork Type</button>

                <button id="buttonTarget" class="buttonSettings">Target</button>
            </div>
        `,
        showCloseButton: true,
        showCancelButton: true,
        cancelButtonText: 'Close',
        focusConfirm: false,
        confirmButtonText: 'OK'
    });

    setTimeout(() => {
        const buttonTarget = document.getElementById('buttonTarget');
        const buttonDorkType = document.getElementById('buttonDorkType');
        const buttonResetDorkType = document.getElementById('buttonResetDorkType');
        const buttonUploadSettings = document.getElementById('buttonUploadSettings');
        const buttonDownloadSettings = document.getElementById('buttonDownloadSettings');

        if (buttonTarget) {
            buttonTarget.addEventListener('click', () => {
                promptForSite();
            });
        }

        if (buttonDorkType) {
            buttonDorkType.addEventListener('click', () => {
                showDorkTypeSelection();
            });
        }

        if (buttonResetDorkType) {
            buttonResetDorkType.addEventListener('click', () => {
                ResetDorkType();
            });
        }

        if (buttonUploadSettings) {
            buttonUploadSettings.addEventListener('click', () => {
                uploadSettingsData();
            });
        }

        if (buttonDownloadSettings) {
            buttonDownloadSettings.addEventListener('click', () => {
                downloadSettingsData();
            });
        }
    }, 0);
}

function downloadSettingsData() {
    const selectedDorkTypes = JSON.parse(localStorage.getItem('selectedDorkTypes')) || [];
    const targetSites = JSON.parse(localStorage.getItem('targetSites')) || [];

    const data = {
        selectedDorkTypes: selectedDorkTypes,
        targetSites: targetSites
    };

    const jsonData = JSON.stringify(data, null, 2);

    const blob = new Blob([jsonData], { type: 'application/json' });

    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'DorkZzSettings.json';
    link.click();
}


function uploadSettingsData(event) {
    Swal.fire({
        title: 'Upload Dork and Target Data',
        input: 'file',
        inputAttributes: {
            'accept': '.json',
            'aria-label': 'Upload your Dork and Target data file'
        },
        showCancelButton: true,
        confirmButtonText: 'Upload',
        cancelButtonText: 'Cancel',
        preConfirm: (file) => {
            if (!file) {
                Swal.showValidationMessage('Please select a file');
                return false;
            }

            return new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.onload = (event) => {
                    try {
                        const uploadedData = JSON.parse(event.target.result);
                        if (uploadedData.selectedDorkTypes && uploadedData.targetSites) {
                            localStorage.setItem('selectedDorkTypes', JSON.stringify(uploadedData.selectedDorkTypes));
                            localStorage.setItem('targetSites', JSON.stringify(uploadedData.targetSites));

                            resolve(); 
                        } else {
                            throw new Error("Invalid JSON structure");
                        }
                    } catch (error) {
                        reject(error.message); 
                    }
                };

                reader.readAsText(file);
            });
        }
    }).then((result) => {
        if (result.isConfirmed) {
            Swal.fire('Success', 'Data uploaded successfully!', 'success').then(() => {
                location.reload();
            });
        } else if (result.dismiss === Swal.DismissReason.cancel) {
            Swal.fire('Cancelled', 'File upload was cancelled', 'info');
        }
    }).catch((error) => {
        Swal.fire('Error', error || 'Something went wrong while uploading the file', 'error');
    });
}

function showDorkTypeSelection() {
    const dorkTypes = {
        "site": "Site",
        "filetype": "File Type",
        "intitle": "Title",
        "inurl": "URL",
        "intext": "Text",
        "allintitle": "All Title",
        "allinurl": "All URL",
        "allintext": "All Text",
        "inanchor": "Anchor Text",
        "link": "Link",
        "related": "Related Sites",
        "before": "Before Date",
        "after": "After Date",
        "numrange": "Number Range",
        "inpostauthor": "Post Author"
    };

    Swal.fire({
        title: 'Select Google Dork Type',
        input: 'select',
        inputOptions: dorkTypes,
        inputPlaceholder: 'Choose a dork type',
        showCancelButton: true,
        confirmButtonText: 'Select',
        cancelButtonText: 'Cancel',
        preConfirm: (selectedDorkType) => {
            if (!selectedDorkType) {
                Swal.showValidationMessage('Please select a dork type!');
                return false;
            }
            return selectedDorkType;
        }
    }).then((result) => {
        if (result.isConfirmed) {
            HideDorkInputField(result.value);
            saveDorkType(result.value);
        }
    });
}

function saveDorkType(dorkType) {
    let savedDorkTypes = JSON.parse(localStorage.getItem('selectedDorkTypes')) || [];
    
    if (!savedDorkTypes.includes(dorkType)) {
        savedDorkTypes.push(dorkType);
        localStorage.setItem('selectedDorkTypes', JSON.stringify(savedDorkTypes));
    }
}

function ResetDorkType(dorkType) {
    localStorage.removeItem('selectedDorkTypes');

    Swal.fire('Success', 'All Hidden Dork Types have been removed.', 'success');

    location.reload()
}


let originalOrder = [];

function copyToClipboard() {
    const textToCopy = document.getElementById('output').innerText;
    if (textToCopy.length < 1) {
        alert('No output to copy !!');
        return;
    }
    navigator.clipboard.writeText(textToCopy).then(() => {
        alert(`${textToCopy} copied`);
    }).catch(err => {
        console.error('Failed to copy: ', err);
    });
}

function GenerateDorks() {
    const outputDiv = document.getElementById('output');

    const after = document.getElementById('after').value;
    const allintext = document.getElementById('allintext').value;
    const allintitle = document.getElementById('allintitle').value;
    const allinurl = document.getElementById('allinurl').value;
    const before = document.getElementById('before').value;
    const cache = document.getElementById('cache').value;
    const filetype = document.getElementById('filetype').value;
    const inanchor = document.getElementById('inanchor').value;
    const inpostauthor = document.getElementById('inpostauthor').value;
    const intext = document.getElementById('intext').value;
    const intitle = document.getElementById('intitle').value;
    const inurl = document.getElementById('inurl').value;
    const link = document.getElementById('link').value;
    const numrange = document.getElementById('numrange').value;
    const related = document.getElementById('related').value;
    const site = document.getElementById('site').value;

    if (after && !isValidInput("after", after)) { alert(`Invalid input for after: ${after}`); return; }
    if (allintext && !isValidInput("allintext", allintext)) { alert(`Invalid input for allintext: ${allintext}`); return; }
    if (allintitle && !isValidInput("allintitle", allintitle)) { alert(`Invalid input for allintitle: ${allintitle}`); return; }
    if (allinurl && !isValidInput("allinurl", allinurl)) { alert(`Invalid input for allinurl: ${allinurl}`); return; }
    if (before && !isValidInput("before", before)) { alert(`Invalid input for before: ${before}`); return; }
    if (cache && !isValidInput("cache", cache)) { alert(`Invalid input for cache: ${cache}`); return; }
    if (filetype && !isValidInput("filetype", filetype)) { alert(`Invalid input for filetype: ${filetype}`); return; }
    if (inanchor && !isValidInput("inanchor", inanchor)) { alert(`Invalid input for inanchor: ${inanchor}`); return; }
    if (inpostauthor && !isValidInput("inpostauthor", inpostauthor)) { alert(`Invalid input for inpostauthor: ${inpostauthor}`); return; }
    if (intext && !isValidInput("intext", intext)) { alert(`Invalid input for intext: ${intext}`); return; }
    if (intitle && !isValidInput("intitle", intitle)) { alert(`Invalid input for intitle: ${intitle}`); return; }
    if (link && !isValidInput("link", link)) { alert(`Invalid input for link: ${link}`); return; }
    if (numrange && !isValidInput("numrange", numrange)) { alert(`Invalid input for numrange: ${numrange}`); return; }
    if (related && !isValidInput("related", related)) { alert(`Invalid input for related: ${related}`); return; }
    if (site && !isValidInput("site", site)) { alert(`Invalid input for site: ${site}`); return; }

    let query = '';

    function formatMultiValue(input) {
        if (input) {
            input = input.replace(/\^/g, ' & ').replace(/,/g, ' | ');
            const value = `(${input})`;
            return value;
        }
        return input;
    }

    if (after) query += ` after:${formatMultiValue(after)}`;
    if (allintext) query += ` allintext:${formatMultiValue(allintext)}`;
    if (allintitle) query += ` allintitle:${formatMultiValue(allintitle)}`;
    if (allinurl) query += ` allinurl:${formatMultiValue(allinurl)}`;
    if (before) query += ` before:${formatMultiValue(before)}`;
    if (cache) query += ` cache:${formatMultiValue(cache)}`;
    if (filetype) query += ` filetype:${formatMultiValue(filetype)}`;
    if (inanchor) query += ` inanchor:${formatMultiValue(inanchor)}`;
    if (inpostauthor) query += ` inpostauthor:${formatMultiValue(inpostauthor)}`;
    if (intext) query += ` intext:${formatMultiValue(intext)}`;
    if (intitle) query += ` intitle:${formatMultiValue(intitle)}`;
    if (inurl) query += ` inurl:${formatMultiValue(inurl)}`;
    if (link) query += ` link:${formatMultiValue(link)}`;
    if (numrange) query += ` numrange:${formatMultiValue(numrange)}`;
    if (related) query += ` related:${formatMultiValue(related)}`;
    if (site) query += ` site:${formatMultiValue(site)}`;

    outputDiv.textContent = query.trim();
    return query.trim();
}



function Googleit() {
    const dorksCommand = GenerateDorks();

    if (dorksCommand.trim()) {
        const searchURL = `https://www.google.com/search?q=${encodeURIComponent(dorksCommand.trim())}`;
        window.open(searchURL, '_blank');
    } else {
        alert("Please enter a valid search query.");
    }
}

function reset() {

    const dorksContainer = document.getElementById('Dorks');
    
    if (!dorksContainer) return;
    const outputContainers = dorksContainer.querySelectorAll('.outputcontainer');
    
    originalOrder = Array.from(outputContainers);

    outputContainers.forEach(container => {
        const inputGroup = container.querySelector('.input-group');
        const inputElement = inputGroup.querySelector('input');
        
        if (inputElement) {
            inputElement.value = '';
            if (inputElement.id == "searchBar") {filterDorks();}
        }
    });
}

function filterDorks() {
    let filter = document.getElementById('searchBar').value.toLowerCase();

    let dorksContainer = document.getElementById('Dorks');
    let dorks = dorksContainer.getElementsByClassName('outputcontainer');

    for (let i = 1; i < dorks.length; i++) {
        let label = dorks[i].getElementsByTagName('label')[0];
        if (label) {
            let textValue = label.textContent || label.innerText;
            if (textValue.toLowerCase().indexOf(filter) > -1) {
                dorks[i].style.display = "";
            } else {
                dorks[i].style.display = "none";
            }
        }
    }
}

function downloadDorkZzWithSite() {
    const savedTargets = getSavedTargetSites();

    if (savedTargets.length > 0) {
        Swal.fire({
            title: 'Select a saved site or enter a new one',
            html: `
                <select id="savedSites" class="swal2-input">
                    <option value="" selected>Select a saved site</option>
                    ${savedTargets.map(site => `<option value="${site}">${site}</option>`).join('')}
                </select>
                <input type="text" id="newSite" class="swal2-input" placeholder="Enter new website URL">
            `,
            showCancelButton: true,
            confirmButtonText: 'Next',
            preConfirm: () => {
                const selectedSite = document.getElementById('savedSites').value;
                const newSite = document.getElementById('newSite').value;

                if (!selectedSite && !newSite) {
                    Swal.showValidationMessage('Please select or enter a website URL!');
                    return false;
                }

                return selectedSite || newSite;
            }
        }).then((result) => {
            if (result.isConfirmed) {
                const site = result.value;
                saveTargetSite(site); 
                downloadDorkZzWithFormat(site);
            }
        });
    } else {
        Swal.fire({
            title: 'Enter a website',
            input: 'text',
            inputLabel: 'Website URL',
            inputPlaceholder: 'Enter the website (e.g., example.com)',
            showCancelButton: true,
            confirmButtonText: 'Next',
            preConfirm: (site) => {
                if (!site) {
                    Swal.showValidationMessage('Please enter a website!');
                } else {
                    saveTargetSite(site);
                    return site;
                }
            }
        }).then((result) => {
            if (result.isConfirmed) {
                const site = result.value;
                downloadDorkZzWithFormat(site);
            }
        });
    }
}

function downloadDorkZzWithFormat(site) {

    const googleDorks = {
        "XSS Vulnerabilities": 'inurl:"search.php?q=" OR inurl:"?id=" OR inurl:"view.php?id=" OR inurl:"page.php?id=" intext:"<script>"',
        "SQL Injection Vulnerabilities": 'inurl:".php?id=" OR inurl:"/index.php?id=" OR inurl:"?page_id=" intext:"You have an error in your SQL syntax"',
        "File Upload Pages": 'inurl:"upload.php" OR inurl:"file_upload.php" OR intext:"upload file" OR inurl:"submit-file"',
        '"Index of" Listings': 'intitle:"index of" "parent directory" OR inurl:"/uploads" OR inurl:"/backup" OR inurl:"/files"',
        "Admin Pages (Login Panels)": 'inurl:admin OR inurl:login OR intitle:"admin login"',
        "Exposed Configuration Files": 'inurl:"config.php" OR inurl:"wp-config.php" OR intext:"DB_PASSWORD"',
        "Publicly Available Sensitive Files": 'filetype:sql OR filetype:log OR filetype:conf OR filetype:bak OR filetype:old OR filetype:inc "password"',
        "Vulnerable Webcams": 'inurl:"view/index.shtml" OR inurl:"view/view.shtml" OR intext:"Network Camera"',
        "PHP Info Pages": 'inurl:"phpinfo.php" OR inurl:"info.php"',
        "Login Portals with Common CMS": 'inurl:"wp-login.php" OR inurl:"administrator/index.php" OR inurl:"user/login"',
        "File Inclusion Vulnerabilities": 'inurl:"page=" OR inurl:"file=" OR inurl:"document=" intext:"include"',
        "Open FTP Servers": 'intitle:"index of" inurl:ftp://',
        "Pages Containing Login Portals": 'inurl:login OR inurl:signin OR intitle:"login page"',
        "Sensitive Directories": 'inurl:/admin OR inurl:/administrator OR inurl:/cpanel OR inurl:/webadmin OR inurl:/portal OR inurl:/userportal',
        "PHP Error Messages": 'intext:"Warning: mysql_connect()" OR intext:"Warning: pg_connect()" OR intext:"Fatal error"',
        "Exposed Documents": 'filetype:pdf OR filetype:doc OR filetype:xls OR filetype:txt OR filetype:xlsx OR filetype:docx',
        "WordPress Sensitive Info": 'inurl:wp-config.php OR intext:"DB_PASSWORD" OR intext:"DB_HOST"',
        "Exposed CCTV/Webcams": 'inurl:"/view/view.shtml" OR inurl:"/view/index.shtml" OR inurl:"/liveview.cgi"',
        "Directory Listings without Index Pages": 'intitle:"index of /" OR intitle:"index of" "last modified" OR intitle:"index of" "parent directory"',
        "Public Backup Files": 'inurl:"backup" OR inurl:"/bak/" OR inurl:"/backup.zip" OR inurl:"/backup.tar"',
        "Open MongoDB Instances": 'inurl:"/db/_all_docs" intext:"_id" intext:"_rev"',
        "Exposed Apache Server Info": 'intitle:"Apache Status" "Server Version" OR "Apache Server Information"',
        "Vulnerable .git Folders": 'inurl:".git"',
        "Default Credentials Pages": 'intext:"default password" OR intext:"default username" OR inurl:"defaultcredentials"',
        "Exposed SSL Certificates": 'filetype:crt OR filetype:pem OR filetype:key OR filetype:csr OR intext:"-----BEGIN CERTIFICATE-----"',
        "Public SVN Repositories": 'inurl:"/.svn/" OR inurl:"/svn/" OR inurl:"/.svn/entries"',
        "Open Database Ports": 'inurl:3306 OR inurl:1433 OR inurl:5432 OR inurl:1521',
        "Exposed PHP Errors": 'intext:"PHP Parse error" OR intext:"PHP Warning" OR intext:"PHP Fatal error"',
        "Public .env Files": 'inurl:".env" "DB_PASSWORD" "DB_USERNAME"',
        "Exposed Emails": 'intext:"@gmail.com" OR intext:"@yahoo.com" OR intext:"@hotmail.com"',
        "Public Jenkins Servers": 'intitle:"Dashboard [Jenkins]"',
        "Exposed GitLab Repositories": 'intitle:"GitLab" inurl:"/explore/projects"',
        "Exposed Config.json Files": 'inurl:"config.json" intext:"DB_PASSWORD"',
        "Public Docker Registries": 'inurl:"/v2/_catalog" OR inurl:"/v2/_layer"',
        "Public Grafana Dashboards": 'inurl:"/dashboard/db" intitle:"Grafana"',
        "Exposed MySQL Databases": 'intext:"port:3306" intext:"root@localhost"',
        "Exposed RDP Ports": 'inurl:3389 OR intext:"Remote Desktop Protocol"',
        "Public Webmin Instances": 'inurl:"/session_login.cgi" intitle:"Webmin"',
        "Exposed CouchDB Instances": 'intext:"Welcome to CouchDB" OR inurl:"/_utils"',
        "Publicly Accessible Kibana": 'inurl:"/app/kibana"',
        "Exposed Wordpress Uploads": 'inurl:"/wp-content/uploads/"',
        "Public AWS S3 Buckets": 'inurl:"s3.amazonaws.com" OR inurl:"/s3/"',
        "Public Jenkins Build Info": 'inurl:"/job/" intitle:"Jenkins" inurl:"/lastBuild/"',
        "Exposed Drupal Installations": 'inurl:"/user/register" intitle:"Register" intext:"Powered by Drupal"',
        "Exposed Magento Admin": 'inurl:"/admin/" intitle:"Magento Admin"',
        "Publicly Accessible Elasticsearch": 'intext:"cluster_name" intext:"nodes" inurl:"9200"',
        "Exposed Microsoft Azure Storage": 'inurl:".blob.core.windows.net"',
        "Public VNC Servers": 'inurl:5800 OR inurl:5900 "VNC Authentication"',
        "Open Telnet Ports": 'inurl:23 "Telnet" -intitle:"closed"',
        "Public Jupyter Notebooks": 'inurl:"/lab/workspaces" intitle:"JupyterLab"',
        "Exposed FTP Files": 'inurl:"ftp://" intitle:"index of"',
        "Exposed Backup Files": 'inurl:"backup" filetype:zip OR filetype:tar OR filetype:gz',
        "Exposed Bitcoin Wallets": 'inurl:"wallet.dat" OR inurl:"bitcoin" filetype:dat',
        "Public Microsoft SharePoint": 'inurl:"/_layouts/15/viewlsts.aspx"',
        "Public PayPal Buttons": 'inurl:"paypal.com/cgi-bin/webscr"'
    };

    Swal.fire({
        title: 'Choose Download Format',
        input: 'select',
        inputOptions: {
            'txt': 'Download as .txt',
            'json': 'Download as .json'
        },
        inputPlaceholder: 'Select file format',
        showCancelButton: true,
        confirmButtonText: 'Download',
        preConfirm: (format) => {
            if (!format) {
                Swal.showValidationMessage('Please select a format!');
            } else {
                return format;
            }
        }
    }).then((formatResult) => {
        if (formatResult.isConfirmed) {
            const format = formatResult.value;
            const dorksWithSite = Object.keys(googleDorks).map(dorkName => {
                return `site:${site} ${googleDorks[dorkName]}`;
            });

            if (format === 'txt') {
                const textContent = dorksWithSite.join('\n');
                const blob = new Blob([textContent], { type: 'text/plain' });
                const link = document.createElement('a');
                link.href = URL.createObjectURL(blob);
                link.download = `${site}_google_dorks.txt`;
                link.click();
            } else if (format === 'json') {
                const jsonContent = JSON.stringify(dorksWithSite, null, 2);
                const blob = new Blob([jsonContent], { type: 'application/json' });
                const link = document.createElement('a');
                link.href = URL.createObjectURL(blob);
                link.download = `${site}_google_dorks.json`;
                link.click();
            }
        }
    });
}

function generateGoogleZzDorkQuery() {
    const savedTargets = getSavedTargetSites();

    if (savedTargets.length > 0) {
        Swal.fire({
            title: 'Select a saved site or enter a new one',
            html: `
                <select id="savedSites" class="swal2-input">
                    <option value="" selected>Select a saved site</option>
                    ${savedTargets.map(site => `<option value="${site}">${site}</option>`).join('')}
                </select>
                <input type="text" id="newSite" class="swal2-input" placeholder="Enter new website URL">
            `,
            showCancelButton: true,
            confirmButtonText: 'Next',
            preConfirm: () => {
                const selectedSite = document.getElementById('savedSites').value;
                const newSite = document.getElementById('newSite').value;

                if (!selectedSite && !newSite) {
                    Swal.showValidationMessage('Please select or enter a website URL!');
                    return false;
                }

                return selectedSite || newSite;
            }
        }).then((result) => {
            if (result.isConfirmed) {
                const site = result.value;
                saveTargetSite(site); 
                promptForDorkSelection(site);
            }
        });
    } else {
        Swal.fire({
            title: 'Enter a website',
            input: 'text',
            inputLabel: 'Website URL',
            inputPlaceholder: 'Enter the website (e.g., example.com)',
            showCancelButton: true,
            confirmButtonText: 'Next',
            preConfirm: (site) => {
                if (!site) {
                    Swal.showValidationMessage('Please enter a website!');
                } else {
                    saveTargetSite(site);
                    return site;
                }
            }
        }).then((result) => {
            if (result.isConfirmed) {
                const site = result.value;
                promptForDorkSelection(site);
            }
        });
    }
}

function promptForDorkSelection(site) {

    const googleDorks = {
        "XSS Vulnerabilities": 'inurl:"search.php?q=" OR inurl:"?id=" OR inurl:"view.php?id=" OR inurl:"page.php?id=" intext:"<script>"',
        "SQL Injection Vulnerabilities": 'inurl:".php?id=" OR inurl:"/index.php?id=" OR inurl:"?page_id=" intext:"You have an error in your SQL syntax"',
        "File Upload Pages": 'inurl:"upload.php" OR inurl:"file_upload.php" OR intext:"upload file" OR inurl:"submit-file"',
        '"Index of" Listings': 'intitle:"index of" "parent directory" OR inurl:"/uploads" OR inurl:"/backup" OR inurl:"/files"',
        "Admin Pages (Login Panels)": 'inurl:admin OR inurl:login OR intitle:"admin login"',
        "Exposed Configuration Files": 'inurl:"config.php" OR inurl:"wp-config.php" OR intext:"DB_PASSWORD"',
        "Publicly Available Sensitive Files": 'filetype:sql OR filetype:log OR filetype:conf OR filetype:bak OR filetype:old OR filetype:inc "password"',
        "Vulnerable Webcams": 'inurl:"view/index.shtml" OR inurl:"view/view.shtml" OR intext:"Network Camera"',
        "PHP Info Pages": 'inurl:"phpinfo.php" OR inurl:"info.php"',
        "Login Portals with Common CMS": 'inurl:"wp-login.php" OR inurl:"administrator/index.php" OR inurl:"user/login"',
        "File Inclusion Vulnerabilities": 'inurl:"page=" OR inurl:"file=" OR inurl:"document=" intext:"include"',
        "Open FTP Servers": 'intitle:"index of" inurl:ftp://',
        "Pages Containing Login Portals": 'inurl:login OR inurl:signin OR intitle:"login page"',
        "Sensitive Directories": 'inurl:/admin OR inurl:/administrator OR inurl:/cpanel OR inurl:/webadmin OR inurl:/portal OR inurl:/userportal',
        "PHP Error Messages": 'intext:"Warning: mysql_connect()" OR intext:"Warning: pg_connect()" OR intext:"Fatal error"',
        "Exposed Documents": 'filetype:pdf OR filetype:doc OR filetype:xls OR filetype:txt OR filetype:xlsx OR filetype:docx',
        "WordPress Sensitive Info": 'inurl:wp-config.php OR intext:"DB_PASSWORD" OR intext:"DB_HOST"',
        "Exposed CCTV/Webcams": 'inurl:"/view/view.shtml" OR inurl:"/view/index.shtml" OR inurl:"/liveview.cgi"',
        "Directory Listings without Index Pages": 'intitle:"index of /" OR intitle:"index of" "last modified" OR intitle:"index of" "parent directory"',
        "Public Backup Files": 'inurl:"backup" OR inurl:"/bak/" OR inurl:"/backup.zip" OR inurl:"/backup.tar"',
        "Open MongoDB Instances": 'inurl:"/db/_all_docs" intext:"_id" intext:"_rev"',
        "Exposed Apache Server Info": 'intitle:"Apache Status" "Server Version" OR "Apache Server Information"',
        "Vulnerable .git Folders": 'inurl:".git"',
        "Default Credentials Pages": 'intext:"default password" OR intext:"default username" OR inurl:"defaultcredentials"',
        "Exposed SSL Certificates": 'filetype:crt OR filetype:pem OR filetype:key OR filetype:csr OR intext:"-----BEGIN CERTIFICATE-----"',
        "Public SVN Repositories": 'inurl:"/.svn/" OR inurl:"/svn/" OR inurl:"/.svn/entries"',
        "Open Database Ports": 'inurl:3306 OR inurl:1433 OR inurl:5432 OR inurl:1521',
        "Exposed PHP Errors": 'intext:"PHP Parse error" OR intext:"PHP Warning" OR intext:"PHP Fatal error"',
        "Public .env Files": 'inurl:".env" "DB_PASSWORD" "DB_USERNAME"',
        "Exposed Emails": 'intext:"@gmail.com" OR intext:"@yahoo.com" OR intext:"@hotmail.com"',
        "Public Jenkins Servers": 'intitle:"Dashboard [Jenkins]"',
        "Exposed GitLab Repositories": 'intitle:"GitLab" inurl:"/explore/projects"',
        "Exposed Config.json Files": 'inurl:"config.json" intext:"DB_PASSWORD"',
        "Public Docker Registries": 'inurl:"/v2/_catalog" OR inurl:"/v2/_layer"',
        "Public Grafana Dashboards": 'inurl:"/dashboard/db" intitle:"Grafana"',
        "Exposed MySQL Databases": 'intext:"port:3306" intext:"root@localhost"',
        "Exposed RDP Ports": 'inurl:3389 OR intext:"Remote Desktop Protocol"',
        "Public Webmin Instances": 'inurl:"/session_login.cgi" intitle:"Webmin"',
        "Exposed CouchDB Instances": 'intext:"Welcome to CouchDB" OR inurl:"/_utils"',
        "Publicly Accessible Kibana": 'inurl:"/app/kibana"',
        "Exposed Wordpress Uploads": 'inurl:"/wp-content/uploads/"',
        "Public AWS S3 Buckets": 'inurl:"s3.amazonaws.com" OR inurl:"/s3/"',
        "Public Jenkins Build Info": 'inurl:"/job/" intitle:"Jenkins" inurl:"/lastBuild/"',
        "Exposed Drupal Installations": 'inurl:"/user/register" intitle:"Register" intext:"Powered by Drupal"',
        "Exposed Magento Admin": 'inurl:"/admin/" intitle:"Magento Admin"',
        "Publicly Accessible Elasticsearch": 'intext:"cluster_name" intext:"nodes" inurl:"9200"',
        "Exposed Microsoft Azure Storage": 'inurl:".blob.core.windows.net"',
        "Public VNC Servers": 'inurl:5800 OR inurl:5900 "VNC Authentication"',
        "Open Telnet Ports": 'inurl:23 "Telnet" -intitle:"closed"',
        "Public Jupyter Notebooks": 'inurl:"/lab/workspaces" intitle:"JupyterLab"',
        "Exposed FTP Files": 'inurl:"ftp://" intitle:"index of"',
        "Exposed Backup Files": 'inurl:"backup" filetype:zip OR filetype:tar OR filetype:gz',
        "Exposed Bitcoin Wallets": 'inurl:"wallet.dat" OR inurl:"bitcoin" filetype:dat',
        "Public Microsoft SharePoint": 'inurl:"/_layouts/15/viewlsts.aspx"',
        "Public PayPal Buttons": 'inurl:"paypal.com/cgi-bin/webscr"'
    };

    const dorkNames = Object.keys(googleDorks);

    Swal.fire({
        title: 'Select a Google Dork template',
        input: 'select',
        inputOptions: dorkNames.reduce((obj, key) => ({ ...obj, [key]: key }), {}),
        inputPlaceholder: 'Select a Dork template',
        showCancelButton: true,
        confirmButtonText: 'Generate Dork Query',
        preConfirm: (selectedDork) => {
            if (!selectedDork) {
                Swal.showValidationMessage('Please select a template!');
            } else {
                const selectedDorkName = selectedDork;
                const dorkTemplate = googleDorks[selectedDorkName];
                return { dorkTemplate, selectedDorkName };
            }
        }
    }).then((dorkResult) => {
        if (dorkResult.isConfirmed) {
            const { dorkTemplate, selectedDorkName } = dorkResult.value;
            const query = `site:${site} ${dorkTemplate}`;

            Swal.fire({
                title: `Generated Google Dork Query: ${selectedDorkName}`,
                html: `<textarea id="dorkQuery" style="width:100%; height:100px;">${query}</textarea>`,
                showCancelButton: true,
                showDenyButton: true,
                confirmButtonText: 'Copy to Clipboard',
                denyButtonText: 'Google it',
                preConfirm: () => {
                    const textarea = document.getElementById('dorkQuery');
                    textarea.select();
                    document.execCommand('copy');
                },
                preDeny: () => {
                    const googleSearchUrl = `https://www.google.com/search?q=${encodeURIComponent(query)}`;
                    window.open(googleSearchUrl, '_blank');
                }
            });
        }
    });
}

function saveTargetSite(target) {
    let savedTargets = JSON.parse(localStorage.getItem('targetSites')) || [];
    if (!savedTargets.includes(target)) {
        savedTargets.push(target);
        localStorage.setItem('targetSites', JSON.stringify(savedTargets));
    }
}

function getSavedTargetSites() {
    return JSON.parse(localStorage.getItem('targetSites')) || [];
}

function promptForSite() {
    const savedTargets = getSavedTargetSites();

    if (savedTargets.length > 0) {
        Swal.fire({
            title: 'Select a saved site or enter a new one',
            html: `
                <select id="savedSites" class="swal2-input">
                    <option value="" selected>Select a saved site</option>
                    ${savedTargets.map(site => `<option value="${site}">${site}</option>`).join('')}
                </select>
                <input type="text" id="newSite" class="swal2-input" placeholder="Enter new website URL">
            `,
            showCancelButton: true,
            confirmButtonText: 'Next',
            preConfirm: () => {
                const selectedSite = document.getElementById('savedSites').value;
                const newSite = document.getElementById('newSite').value;

                if (!selectedSite && !newSite) {
                    Swal.showValidationMessage('Please select or enter a website URL!');
                    return false;
                }

                return selectedSite || newSite;
            }
        }).then((result) => {
            if (result.isConfirmed) {
                const site = result.value;
                saveTargetSite(site); 
                promptForDorkSelection(site);  
            }
        });
    } else {
        Swal.fire({
            title: 'Enter a website',
            input: 'text',
            inputLabel: 'Website URL',
            inputPlaceholder: 'Enter the website (e.g., example.com)',
            showCancelButton: true,
            confirmButtonText: 'Next',
            preConfirm: (site) => {
                if (!site) {
                    Swal.showValidationMessage('Please enter a website!');
                } else {
                    saveTargetSite(site); 
                    return site;
                }
            }
        }).then((result) => {
            if (result.isConfirmed) {
                const site = result.value;
                promptForDorkSelection(site); 
            }
        });
    }
}


function isValidInput(type, input) {
    switch (type) {
        case "filetype":
            return /^[a-zA-Z0-9]+$/.test(input);

        case "intitle":
        case "allintitle":
        case "intext":
        case "link":
        case "inurl":
        case "allinurl":
        case "allintext":
        case "inanchor":
        case "inpostauthor":
        case "related":
            return input.trim() !== "";

        case "site":
            return isValidDomainOrURL(input);

        case "numrange":
            return /^\d+\-\d+$/.test(input);

        case "before":
        case "after":
            return isValidDate(input);

        case "cache":
            return isValidURL(input) || isValidDomainOrURL(input);

        default:
            return false;
    }
}

function isValidURL(url) {
    try {
        new URL(url);
        return true;
    } catch (_) {
        return false;
    }
}

function isValidDomainOrURL(input) {
    const domainPattern = /^(?!:\/\/)([a-zA-Z0-9-_]+(\.[a-zA-Z0-9-_]+)+.*)$/;
    return domainPattern.test(input) || isValidURL(input);
}

function isValidDate(dateString) {
    const regex = /^\d{4}-\d{2}-\d{2}$/;
    if (!regex.test(dateString)) return false;

    const date = new Date(dateString);
    return date instanceof Date && !isNaN(date);
}
