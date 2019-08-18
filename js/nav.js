document.addEventListener("DOMContentLoaded", function(){
    let elem = document.querySelectorAll(".sidenav");
    M.Sidenav.init(elem);
    loadNav(".topnav");
    loadNav(".sidenav");

    function loadNav(nav){
        var xhttp =  new XMLHttpRequest();
        xhttp.onreadystatechange = function(){
            if (this.readyState == 4) {
                if (this.status != 200) return;

                document.querySelectorAll(nav).forEach(function(elm){
                    elm.innerHTML = xhttp.responseText;
                });

                if (nav == ".sidenav"){
                    var _collapsnav = document.querySelectorAll('.collapsible');
                    M.Collapsible.init(_collapsnav);
                }

                if (nav == ".topnav"){
                    var _dropdownnav = document.querySelectorAll('.dropdown-trigger');
                    var instances = M.Dropdown.init(_dropdownnav,{
                        coverTrigger : false,
                        constrainWidth : false
                    });
                }



                

                document.querySelectorAll(nav).forEach(function(elm){
                    elm.addEventListener("click", function(event){

                        // memuat halaman yang dipanggil
                        page = event.target.getAttribute("href").substr(1);
                        loadPage(page);
                        //di balik, agar tidak menutuk ketika menekan collapse header.
                        //Tutup Sidenav
                        var sidenav = document.querySelector(".sidenav");
                        M.Sidenav.getInstance(sidenav).close();



                    });
                });

            }
        };
        if (nav == ".topnav") {
            xhttp.open("GET", "topnav.html", true);
            xhttp.send();
        }
        else {
            xhttp.open("GET", "sidenav.html", true);
            xhttp.send();
        }

    }

    //load content
    let page = window.location.hash.substr(1);
    if (page == "" || page == "#") page = "klasemen";
    loadPage(page);

    function loadPage(page){
        document.getElementById("extend-nav").innerHTML = "";
        page = page.split("/");
        xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function(){
            if (this.readyState == 4){
                var content = document.querySelector("#body-content");

                if (page[0] == "klasemen"){
                    if (page.length == 1) 
                    {
                        getStandings("bundesliga");
                    }
                        
                    else {
                        getStandings(page[1]);
                    }
                }
                else if (page[0]=="teams"){
                    getallTeams();
                }
                else if (page[0]=="favorites"){
                    getFavorites();
                }


                if (this.status == 200){
                    content.innerHTML = xhttp.responseText;
                }
                else if (this.status == 404){
                    content.innerHTML = "<p>Halaman tidak ditemukan.</p>";
                }
                else {
                    content.innerHTML = "<p>Ups.. halaman tidak dapat diakses.</p>";
                }

            }
        };

        xhttp.open("GET", "pages/" + page[0] + ".html", true);
        xhttp.send();

   

    }



});