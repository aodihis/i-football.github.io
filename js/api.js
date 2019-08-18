const base_url = "https://api.football-data.org/";
const token = "c369e5a39d564aac836caf0acd828545";

var dbPromise = idb.open("favorites", 1, function (upgradeDb) {
    if (!upgradeDb.objectStoreNames.contains("favoriteClub")) {
        upgradeDb.createObjectStore("favoriteClub", { keyPath: "clubID" });
    }
});

function addFavoriteTeam(ID, name, image) {
    dbPromise.then(function (db) {
        var tx = db.transaction('favoriteClub', 'readwrite');
        var store = tx.objectStore('favoriteClub');
        var item = {
            clubID: ID,
            clubName: name,
            icon: image
        };
        store.put(item); //menambahkan key "buku"
        return tx.complete;
    }).then(function () {
        console.log('Data berhasil disimpan.');
        M.toast({ html: 'Added to favorite.' });
        let favButton = `<a style="color:black;"  class="waves-effect waves-light btn" onclick="deleteFavoriteTeam(${ID},'${name}','${image}')">
        <i class="material-icons right">grade</i>unfavorite</a>`;
        document.getElementById("fav-button").innerHTML = favButton;

    }).catch(function () {
        console.log('Data gagal disimpan.');
        M.toast({ html: 'Failed add to favorite.' });
    })

}

function deleteFavoriteTeam(ID, name, image) {
    dbPromise.then(function (db) {
        var tx = db.transaction('favoriteClub', 'readwrite');
        var store = tx.objectStore('favoriteClub');
        store.delete(ID);
        return tx.complete;
    }).then(function () {
        console.log('Item deleted');
        M.toast({ html: 'Success remove from favorite' });
        let favButton = `<a class="waves-effect waves-light btn" onclick="addFavoriteTeam(${ID},'${name}','${image}')">
        <i class="material-icons right">grade</i>favorite</a>`;
        document.getElementById("fav-button").innerHTML = favButton;

    }).catch(function () {
        M.toast({ html: 'Failed removed from favorite' });
    });



}






function status(response) {
    if (response.status != 200) {
        return Promise.reject(new Error(response.statusText));
    }
    else {
        return Promise.resolve(response);
    }
}

function json(response) {
    return Promise.resolve(response.json());
}

function error(error) {
    // Parameter error berasal dari Promise.reject()
    console.log("Error : " + error);
}

function getmaindata() {
    //perlu di jalankan di background agar tidak memperlambat 
    //perlu di kasih jeda waktu, agar tidak melebihi batasan akses dalam satu waktu.
    fetchAPI(base_url + "v2/competitions/" + "2002" + "/standings");
    fetchAPI(base_url + "v2/competitions/" + "2003" + "/standings");
    fetchAPI(base_url + "v2/competitions/" + "2014" + "/standings");
    fetchAPI(base_url + "v2/competitions/" + "2015" + "/standings");

    fetchAPI(base_url + "v2/competitions/" + "2002" + "/teams");
    fetchAPI(base_url + "v2/competitions/" + "2003" + "/teams");
    fetchAPI(base_url + "v2/competitions/" + "2014" + "/teams");
    fetchAPI(base_url + "v2/competitions/" + "2015" + "/teams");
}

function fetchAPI(urltoFetch) {
    fetch(urltoFetch, {
        headers: {
            "X-Auth-Token": token
        }
    })
        .then(status)
        .then(json)
        .then(function (data) {
        })
        .catch(error)
}
function displayDataStandings(data) {
    document.getElementById("tournament").innerHTML = data.competition.name;
    var standingshtml = "";
    data.standings[0].table.forEach(function (std) {

        var teamlogo = "";
        if (std.team.crestUrl != null) {
            teamlogo = std.team.crestUrl.replace(/^http:\/\//i, 'https://');
            teamlogo = `<img style="width:30px; height: 30px; font-size:5px;"src="${teamlogo}" alt="logo" />`

        }

        standingshtml += `<tr>
                            <td>${std.position}</td>
                            <td>
                                ${teamlogo}
                            </td>
                            <td>
                                ${std.team.name}</td>
                            <td>${std.playedGames}</td>
                            <td>${std.won}</td>
                            <td>${std.draw}</td>
                            <td>${std.lost}</td>
                            <td>${std.goalsFor}</td>
                            <td>${std.goalsAgainst}</td>
                            <td>${std.goalDifference}</td>
                            <td>${std.points}</td>
                            </tr>`;


    });

    document.getElementById("table-klasemen").innerHTML = standingshtml;
}
function getStandings(league) {
    let leagueID = "";
    switch (league) {
        case "bundesliga":
            leagueID = "2002";
            break;
        case "eredivisie":
            leagueID = "2003";
            break;
        case "primeradivision":
            leagueID = "2014";
            break;
        case "ligue1":
            leagueID = "2015";
            break;
        default:
            alert(league);
            // window.location.href="index.html";
            return;
    }
    let htmldata = '';

    if ('caches' in window) {
        caches.match(base_url + "v2/competitions/" + leagueID + "/standings").then(function (response) {
            if (response) {
                response.json().then(function (data) {
                    displayDataStandings(data);
                })
            }

        });
    }


    fetch(base_url + "v2/competitions/" + leagueID + "/standings",
        {
            headers: {
                "X-Auth-Token": token
            }
        })
        .then(status)
        .then(json)
        .then(function (data) {
            displayDataStandings(data);

        })
        .catch(error);


}

function getallTeams() {
    let nav = `<ul class="tabs tabs-transparent">
                <li id="bundesligateam" class="tab"><a>Bundesliga</a></li>
                <li id="eredivisieteam" class="tab"><a>Eredivisie</a></li>
                <li id="primeradivisionteam" class="tab"><a>Primera Division</a></li>
                <li id="league1team" class="tab"><a>League 1</a></li>`;

    document.getElementById("extend-nav").innerHTML = nav;

    getTeams("2002", "Bundasliga");
    document.getElementById("bundesligateam").addEventListener("click", function () {
        document.getElementById("teamname").innerHTML = "";
        document.getElementById("team").innerHTML = "";
        getTeams("2002", "Bundasliga");
    });
    document.getElementById("eredivisieteam").addEventListener("click", function () {
        document.getElementById("teamname").innerHTML = "";
        document.getElementById("team").innerHTML = "";
        getTeams("2003", "Eredivisie");
    });
    document.getElementById("primeradivisionteam").addEventListener("click", function () {
        document.getElementById("teamname").innerHTML = "";
        document.getElementById("team").innerHTML = "";
        getTeams("2014", "Primera Division");
    });
    document.getElementById("league1team").addEventListener("click", function () {
        document.getElementById("teamname").innerHTML = "";
        document.getElementById("team").innerHTML = "";
        getTeams("2015", "League 1");
    });

}


function getTeams(teamID, name) {


    if ('caches' in window) {
        caches.match(base_url + `v2/competitions/${teamID}/teams`).then(function (response) {
            if (response) {
                response.json().then(function (data) {
                    displayTeams(data, name);
                })
            }
        })
    }


    fetch(`${base_url}v2/competitions/${teamID}/teams`, {
        headers: {
            "X-Auth-Token": token
        }
    })
        .then(status)
        .then(json)
        .then(function (data) {
            displayTeams(data, name);

        })
        .catch(error)

}



function displayTeams(data, name) {
    let teams = "";
    data.teams.forEach(function (team) {
        teams +=
            `<a href="./pages/team.html?id=${team.id}" class="collection-item"><span><img style="width:32px; height: 32px; vertical-align:middle;" src="${team.crestUrl}" alt="" ></span> <span style="padding-left:7px;">${team.name}</span></a>`;
        // `<li class="collection-item"> <span><img style="width:32px; height: 32px; vertical-align:middle;" src="${team.crestUrl}" alt="" ></span> <span style="padding-left:7px;">${team.name}</span><a href="./team.html?id=${team.id}" class="secondary-content"><i class="material-icons">send</i></a></li>`;
    })
    document.getElementById("teamname").innerHTML = name;
    document.getElementById("team").innerHTML = teams;


}

function isclubfavorite(ID, name, crestUrl) {
    let favButton = '';
    dbPromise.then(function (db) {
        var tx = db.transaction('favoriteClub', 'readonly');
        var store = tx.objectStore('favoriteClub');
        return store.get(ID);
    }).then(function (val) {
        console.log(val);
        if (val == undefined) {
            favButton = `<a class="waves-effect waves-light btn" onclick="addFavoriteTeam(${ID},'${name}','${crestUrl}')"><i class="material-icons right">grade</i>favorite</a>`;
        }
        else {
            favButton = `<a style="color:black;"  class="waves-effect waves-light btn"         onclick="deleteFavoriteTeam(${ID},'${name}','${crestUrl}')"> <i class="material-icons right">grade</i>Unfavorite</a>`;
        }

        document.getElementById("fav-button").innerHTML = favButton;
    })

}


function displayTeamInfo(data) {
    let headerTeam = `<img width=75 height=75 src=${data.crestUrl} alt="team Crest" />
                        <h6>${data.name}</h6>`;
    // style="color:black;"
    document.getElementById("team-header").innerHTML = headerTeam;

    isclubfavorite(data.id, data.name, data.crestUrl);

    let TeamInfo = `<tr><td>Short Name</td> 
                    <td>${data.shortName}</td>
                    </tr><tr><td>Address</td><td>${data.address}</td></tr>
                    <tr><td>Phone</td><td>${data.phone}</td></tr>
                    <tr><td>Website</td><td>${data.website}</td></tr>
                    <tr><td>eMail</td><td>${data.email}</td></tr>
                    <tr><td>Founded</td><td>${data.founded}</td></tr>
                    <tr><td>Venue</td><td>${data.venue}</td></tr>`;
    document.getElementById("teamInfo").innerHTML = TeamInfo;

}
function getTeamInfo() {
    // Ambil nilai query parameter (?id=)
    let urlParams = new URLSearchParams(window.location.search);
    let idParam = urlParams.get("id");

    if ('caches' in window) {
        caches.match(`${base_url}/v2/teams/${idParam}`).then(function (response) {
            if (response) {
                response.json().then(function (data) {
                    displayTeamInfo(data);

                })
            }

        })
    }


    fetch(`${base_url}/v2/teams/${idParam}`, {
        headers: {
            "X-Auth-Token": token
        }
    })
        .then(status)
        .then(json)
        .then(function (data) {
            displayTeamInfo(data);

        })
        .catch(error)

}


function getFavorites() {
    dbPromise.then(function (db) {
        var tx = db.transaction('favoriteClub', 'readonly');
        var store = tx.objectStore('favoriteClub');
        return store.getAll();
    }).then(function (items) {
        if (items.length == 0) {
            document.getElementById("favoritesClub").innerHTML = '<p>No Favorites yet.</p>'
        }
        else {
            let clubs = '';
            items.forEach(function (item) {
                clubs += `<div id="${item.clubID}"class="row valign-wrapper">
                            <div class="col s6 offset-s3 valign">
                            <div class="card center blue-grey darken-1">
                                <div class="card-image">
                                <img style="padding-top:1em;" width = "100" height="100" src="${item.icon}">\
                                </div>
                                <div class="card-content">
                                <h5>${item.clubName}</h5>
                                </div>
                                <div class="divider"></div>
                                <div class="card-action">
                                <a onClick="deleteTeamfav(${item.clubID})">Remove from Favorite</a>
                                </div>
                            </div>
                            </div>
                        </div>`;

            })
            document.getElementById("favoritesClub").innerHTML = clubs;
        }
    });

}


function deleteTeamfav(ID) {
    dbPromise.then(function (db) {
        var tx = db.transaction('favoriteClub', 'readwrite');
        var store = tx.objectStore('favoriteClub');
        store.delete(ID);
        return tx.complete;
    }).then(function () {
        console.log('Item deleted');
        M.toast({ html: 'Success remove from favorite' });
        document.getElementById(ID).innerHTML = '';

    }).catch(function () {
        M.toast({ html: 'Failed removed from favorite' });
    });
}



