const form =
document.getElementById("loginForm");

form.addEventListener(
"submit",

function(e){

    e.preventDefault();

    const email =
    document.getElementById("email").value;

    const password =
    document.getElementById("password").value;

    const role =
    document.getElementById("role").value;

    if(
        email === "" ||
        password === ""
    ){

        document.getElementById("message").innerHTML =
        "Semua field wajib diisi";

        return;
    }

    localStorage.setItem("role", role);

    if(role === "mahasiswa"){

        localStorage.setItem(
            "username",
            "Nur Istikomah"
        );

        localStorage.setItem(
            "prodi",
            "Pendidikan Teknologi Informasi"
        );

        localStorage.setItem(
            "info",
            "Semester 4"
        );

    }else{

        localStorage.setItem(
            "username",
            "Dr. Siti Aminah, M.Pd"
        );

        localStorage.setItem(
            "prodi",
            "Pendidikan Teknologi Informasi"
        );

        localStorage.setItem(
            "info",
            "Dosen Pengampu"
        );

    }

    window.location.href =
    "dashboard.html";

});